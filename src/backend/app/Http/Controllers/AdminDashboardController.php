<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class AdminDashboardController extends Controller
{
    private const CONSULTATION_FEE = 50; // € per completed appointment

    private static array $frenchMonths = [
        1 => 'Jan', 2 => 'Fév', 3 => 'Mar', 4 => 'Avr',
        5 => 'Mai', 6 => 'Juin', 7 => 'Juil', 8 => 'Aoû',
        9 => 'Sep', 10 => 'Oct', 11 => 'Nov', 12 => 'Déc',
    ];

    /**
     * Get admin dashboard stats.
     */
    public function stats()
    {
        $this->authorizeAdmin(request());

        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth();

        // Total patients
        $totalPatients = User::where('role', 'patient')->count();
        $lastMonthPatients = User::where('role', 'patient')
            ->where('created_at', '<', $startOfMonth)
            ->count();
        $patientGrowth = $lastMonthPatients > 0
            ? round((($totalPatients - $lastMonthPatients) / $lastMonthPatients) * 100, 1)
            : 0;

        // Today's appointments
        $todayAppointments = Appointment::whereDate('date', $today)->count();
        $yesterdayAppointments = Appointment::whereDate('date', Carbon::yesterday())->count();
        $appointmentGrowth = $yesterdayAppointments > 0
            ? round((($todayAppointments - $yesterdayAppointments) / $yesterdayAppointments) * 100, 1)
            : 0;

        // Active doctors (linked to user accounts)
        $activeDoctors = Doctor::whereNotNull('user_id')->count();
        $newDoctorsThisMonth = Doctor::whereNotNull('user_id')
            ->where('updated_at', '>=', $startOfMonth)
            ->count();

        // Revenue (this month, based on completed appointments × fee)
        $completedThisMonth = Appointment::where('status', 'completed')
            ->whereBetween('date', [$startOfMonth, $today])
            ->count();
        $revenue = $completedThisMonth * self::CONSULTATION_FEE;

        $completedLastMonth = Appointment::where('status', 'completed')
            ->whereBetween('date', [$lastMonth->copy()->startOfMonth(), $lastMonth->copy()->endOfMonth()])
            ->count();
        $lastMonthRevenue = $completedLastMonth * self::CONSULTATION_FEE;
        $revenueGrowth = $lastMonthRevenue > 0
            ? round((($revenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1)
            : 0;

        // Format revenue display
        $revenueDisplay = $revenue >= 1000
            ? number_format($revenue / 1000, 1, ',', '') . 'k €'
            : number_format($revenue, 0, ',', ' ') . ' €';

        return response()->json([
            'total_patients' => number_format($totalPatients, 0, '', ' '),
            'patient_growth' => ($patientGrowth >= 0 ? '+' : '') . $patientGrowth . '%',
            'today_appointments' => $todayAppointments,
            'appointment_growth' => ($appointmentGrowth >= 0 ? '+' : '') . $appointmentGrowth . '%',
            'active_doctors' => $activeDoctors,
            'new_doctors' => '+' . $newDoctorsThisMonth,
            'revenue' => $revenueDisplay,
            'revenue_growth' => ($revenueGrowth >= 0 ? '+' : '') . $revenueGrowth . '%',
        ]);
    }

    /**
     * Get appointments analytics (last 6 months).
     */
    public function appointmentsAnalytics()
    {
        $this->authorizeAdmin(request());

        $data = [];

        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $start = $date->copy()->startOfMonth();
            $end = $date->copy()->endOfMonth();

            $count = Appointment::whereBetween('date', [$start, $end])->count();

            $data[] = [
                'month' => self::$frenchMonths[$date->month],
                'appointments' => $count,
            ];
        }

        return response()->json($data);
    }

    /**
     * Get revenue analytics (last 6 months).
     */
    public function revenueAnalytics()
    {
        $this->authorizeAdmin(request());

        $data = [];

        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $start = $date->copy()->startOfMonth();
            $end = $date->copy()->endOfMonth();

            $completedCount = Appointment::where('status', 'completed')
                ->whereBetween('date', [$start, $end])
                ->count();

            $data[] = [
                'month' => self::$frenchMonths[$date->month],
                'revenue' => $completedCount * self::CONSULTATION_FEE,
            ];
        }

        return response()->json($data);
    }

    /**
     * Get top doctors ranked by patient count.
     */
    public function topDoctors()
    {
        $this->authorizeAdmin(request());

        $doctors = Doctor::select('doctors.*')
            ->selectSub(function ($query) {
                $query->from('appointments')
                    ->selectRaw('COUNT(DISTINCT patient_id)')
                    ->whereColumn('appointments.doctor_id', 'doctors.id');
            }, 'patients_count')
            ->orderByDesc('patients_count')
            ->limit(10)
            ->get()
            ->map(function ($doctor) {
                return [
                    'id' => $doctor->id,
                    'name' => $doctor->name,
                    'specialty' => $doctor->specialty,
                    'patients' => (int) $doctor->patients_count,
                    'rating' => $doctor->rating,
                    'status' => $doctor->user_id ? 'Actif' : 'Inactif',
                ];
            });

        return response()->json($doctors);
    }

    /**
     * Get recent admin activity feed (derived from recent events).
     */
    public function activity()
    {
        $this->authorizeAdmin(request());

        $activities = collect();

        // Recent patient registrations
        $recentPatients = User::where('role', 'patient')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(function ($user) {
                return [
                    'action' => 'Nouveau patient inscrit',
                    'user' => $user->name,
                    'time' => $this->timeAgo($user->created_at),
                    'sort_date' => $user->created_at,
                ];
            });
        $activities = $activities->merge($recentPatients);

        // Recent appointments
        $recentAppointments = Appointment::with(['patient:id,name', 'doctor:id,name'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(function ($appointment) {
                return [
                    'action' => 'Rendez-vous programmé',
                    'user' => ($appointment->patient->name ?? 'Patient') . ' → ' . ($appointment->doctor->name ?? 'Médecin'),
                    'time' => $this->timeAgo($appointment->created_at),
                    'sort_date' => $appointment->created_at,
                ];
            });
        $activities = $activities->merge($recentAppointments);

        // Recent doctor account creations
        $recentDoctors = User::where('role', 'doctor')
            ->orderByDesc('created_at')
            ->limit(3)
            ->get()
            ->map(function ($user) {
                return [
                    'action' => 'Nouveau médecin ajouté',
                    'user' => $user->name,
                    'time' => $this->timeAgo($user->created_at),
                    'sort_date' => $user->created_at,
                ];
            });
        $activities = $activities->merge($recentDoctors);

        // Recent completed appointments (as "payments")
        $recentCompleted = Appointment::with('patient:id,name')
            ->where('status', 'completed')
            ->orderByDesc('updated_at')
            ->limit(3)
            ->get()
            ->map(function ($appointment) {
                return [
                    'action' => 'Paiement reçu',
                    'user' => $appointment->patient->name ?? 'Patient',
                    'time' => $this->timeAgo($appointment->updated_at),
                    'sort_date' => $appointment->updated_at,
                ];
            });
        $activities = $activities->merge($recentCompleted);

        // Sort by date and take top 10
        $sorted = $activities->sortByDesc('sort_date')
            ->take(10)
            ->map(function ($item) {
                unset($item['sort_date']);
                return $item;
            })
            ->values();

        return response()->json($sorted);
    }

    /**
     * List appointments (admin view) with search and date-range filters.
     *
     * Query params:
     * - q: searches patient + doctor names
     * - timing: upcoming|ended|all (default all)
     * - range: day|week|month|all (default all)
     * - date: YYYY-MM-DD anchor date for range filters (default today)
     */
    public function appointments(Request $request)
    {
        $this->authorizeAdmin($request);

        $q = trim((string) $request->query('q', ''));
        $timing = (string) $request->query('timing', 'all');
        $range = (string) $request->query('range', 'all');
        $anchor = (string) $request->query('date', Carbon::today()->toDateString());

        $anchorDate = Carbon::parse($anchor);
        $now = Carbon::now();

        $query = Appointment::query()
            ->with([
                'patient:id,name',
                'doctor:id,name,specialty,rating',
            ]);

        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->whereHas('patient', function ($p) use ($q) {
                    $p->where('name', 'like', '%' . $q . '%');
                })->orWhereHas('doctor', function ($d) use ($q) {
                    $d->where('name', 'like', '%' . $q . '%');
                });
            });
        }

        if ($range !== 'all') {
            if ($range === 'day') {
                $start = $anchorDate->copy()->startOfDay();
                $end = $anchorDate->copy()->endOfDay();
            } elseif ($range === 'week') {
                $start = $anchorDate->copy()->startOfWeek();
                $end = $anchorDate->copy()->endOfWeek();
            } elseif ($range === 'month') {
                $start = $anchorDate->copy()->startOfMonth();
                $end = $anchorDate->copy()->endOfMonth();
            } else {
                $start = null;
                $end = null;
            }

            if ($start && $end) {
                $query->whereBetween('date', [$start->toDateString(), $end->toDateString()]);
            }
        }

        $appointments = $query
            ->orderBy('date')
            ->orderBy('time')
            ->limit(500)
            ->get()
            ->map(function (Appointment $appointment) use ($now) {
                $scheduledAt = null;
                try {
                    $scheduledAt = Carbon::parse($appointment->date->toDateString() . ' ' . ($appointment->time ?: '00:00:00'));
                } catch (\Throwable $e) {
                    $scheduledAt = Carbon::parse($appointment->date->toDateString());
                }

                $isEnded = in_array($appointment->status, ['completed', 'cancelled'], true) || $scheduledAt->isPast();

                return [
                    'id' => $appointment->id,
                    'date' => $appointment->date?->toDateString(),
                    'time' => $appointment->time,
                    'status' => $appointment->status,
                    'timing' => $isEnded ? 'ended' : 'upcoming',
                    'type' => $appointment->type,
                    'reason' => $appointment->reason,
                    'patient' => $appointment->patient?->name ?? 'Patient',
                    'doctor' => $appointment->doctor?->name ?? 'Médecin',
                    'doctor_specialty' => $appointment->doctor?->specialty ?? '',
                    'doctor_rating' => $appointment->doctor?->rating,
                    'scheduled_at' => $scheduledAt->toIso8601String(),
                ];
            })
            ->values();

        if ($timing !== 'all') {
            $appointments = $appointments->filter(fn ($a) => $a['timing'] === $timing)->values();
        }

        return response()->json($appointments);
    }

    /**
     * List all patients (admin view).
     *
     * Query params:
     * - q: searches name + email
     */
    public function patients(Request $request)
    {
        $this->authorizeAdmin($request);

        $q = trim((string) $request->query('q', ''));

        $select = ['id', 'name', 'email', 'birth_date', 'created_at', 'role'];
        if (Schema::hasColumn('users', 'is_active')) {
            $select[] = 'is_active';
        }
        if (Schema::hasColumn('users', 'blood_type')) {
            $select[] = 'blood_type';
        }

        $query = User::query()
            ->where('role', 'patient')
            ->select($select)
            ->orderBy('name');

        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'like', '%' . $q . '%')
                    ->orWhere('email', 'like', '%' . $q . '%');
            });
        }

        return response()->json(
            $query->limit(1000)->get()->map(function (User $u) {
                $payload = [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'birth_date' => $u->birth_date?->toDateString(),
                    'created_at' => optional($u->created_at)->toDateString(),
                    'role' => $u->role,
                    'is_active' => Schema::hasColumn('users', 'is_active') ? (bool) $u->is_active : true,
                ];

                if (Schema::hasColumn('users', 'blood_type')) {
                    $payload['blood_type'] = $u->blood_type;
                } else {
                    $payload['blood_type'] = null;
                }

                return [
                    ...$payload,
                ];
            })->values()
        );
    }

    /**
     * List all doctors (admin view).
     *
     * Query params:
     * - q: searches name
     * - min_rating: float
     */
    public function doctors(Request $request)
    {
        $this->authorizeAdmin($request);

        $q = trim((string) $request->query('q', ''));
        $minRating = $request->query('min_rating', null);

        $select = [
            'doctors.id',
            'doctors.name',
            'doctors.specialty',
            'doctors.rating',
            'doctors.reviews',
            'doctors.experience',
            'doctors.user_id',
        ];
        if (Schema::hasColumn('users', 'is_active')) {
            $select[] = 'users.is_active as is_active';
        } else {
            // MySQL schema might not be migrated yet; keep API stable.
            $select[] = \Illuminate\Support\Facades\DB::raw('NULL as is_active');
        }

        $query = Doctor::query()
            ->leftJoin('users', 'users.id', '=', 'doctors.user_id')
            ->select($select)
            ->orderByDesc('rating')
            ->orderBy('name');

        if ($q !== '') {
            $query->where('name', 'like', '%' . $q . '%');
        }

        if ($minRating !== null && is_numeric($minRating)) {
            $query->where('rating', '>=', (float) $minRating);
        }

        return response()->json(
            $query->limit(1000)->get()->map(function ($d) {
                return [
                    'id' => $d->id,
                    'name' => $d->name,
                    'specialty' => $d->specialty,
                    'rating' => $d->rating,
                    'reviews' => $d->reviews,
                    'experience' => $d->experience,
                    'user_id' => $d->user_id,
                    'is_active' => $d->user_id ? (bool) $d->is_active : null,
                    'status' => $d->user_id ? ((bool) $d->is_active ? 'Actif' : 'Désactivé') : 'Inactif',
                ];
            })->values()
        );
    }

    public function storePatient(Request $request)
    {
        $this->authorizeAdmin($request);

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'birth_date' => ['nullable', 'date'],
        ];

        // If the migration hasn't run yet, don't validate/accept this field to avoid 500s.
        if (Schema::hasColumn('users', 'blood_type')) {
            $rules['blood_type'] = ['nullable', Rule::in(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])];
        }

        $data = $request->validate($rules);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'patient',
            'birth_date' => $data['birth_date'] ?? null,
            'blood_type' => Schema::hasColumn('users', 'blood_type') ? ($data['blood_type'] ?? null) : null,
        ]);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'birth_date' => $user->birth_date,
            'blood_type' => $user->blood_type,
        ], Response::HTTP_CREATED);
    }

    public function storeDoctor(Request $request)
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'specialty' => ['required', 'string', 'max:255'],
            'experience' => ['required', 'string', 'max:255'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'is_featured' => ['nullable', 'boolean'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'doctor',
        ]);

        $doctor = Doctor::create([
            'user_id' => $user->id,
            'name' => $data['name'],
            'specialty' => $data['specialty'],
            'experience' => $data['experience'],
            'rating' => $data['rating'] ?? 4.5,
            'is_featured' => (bool) ($data['is_featured'] ?? false),
        ]);

        return response()->json([
            'id' => $doctor->id,
            'name' => $doctor->name,
            'specialty' => $doctor->specialty,
            'rating' => $doctor->rating,
            'status' => 'Actif',
        ], Response::HTTP_CREATED);
    }

    public function storeAppointment(Request $request)
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'patient_id' => ['required', 'integer', Rule::exists('users', 'id')->where(fn ($q) => $q->where('role', 'patient'))],
            'doctor_id' => ['required', 'integer', 'exists:doctors,id'],
            'date' => ['required', 'date'],
            'time' => ['required', 'string', 'regex:/^\\d{2}:\\d{2}$/'],
            'status' => ['nullable', Rule::in(['upcoming', 'completed', 'cancelled', 'in-progress'])],
            'type' => ['nullable', Rule::in(['in-person', 'video'])],
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        $appointment = Appointment::create([
            'patient_id' => $data['patient_id'],
            'doctor_id' => $data['doctor_id'],
            'date' => Carbon::parse($data['date'])->toDateString(),
            'time' => $data['time'],
            'status' => $data['status'] ?? 'upcoming',
            'type' => $data['type'] ?? 'in-person',
            'reason' => $data['reason'] ?? null,
        ]);

        return response()->json([
            'id' => $appointment->id,
        ], Response::HTTP_CREATED);
    }

    public function updateUser(Request $request, User $user)
    {
        $this->authorizeAdmin($request);

        $rules = [
            'role' => ['nullable', Rule::in(['patient', 'doctor', 'admin'])],
        ];
        if (Schema::hasColumn('users', 'is_active')) {
            $rules['is_active'] = ['nullable', 'boolean'];
        }

        $data = $request->validate($rules);

        $oldRole = $user->role;

        if (array_key_exists('role', $data) && $data['role'] !== null) {
            $user->role = $data['role'];

            if ($data['role'] === 'doctor') {
                // Ensure a doctor profile exists and is linked to this user.
                $doctor = Doctor::where('user_id', $user->id)->first();
                if (!$doctor) {
                    Doctor::create([
                        'user_id' => $user->id,
                        'name' => $user->name,
                        'specialty' => 'Médecin généraliste',
                        'experience' => '1 an',
                        'rating' => 4.5,
                        'is_featured' => false,
                    ]);
                }
            } elseif ($oldRole === 'doctor') {
                // Detach doctor profile, keep the row for admin listing/history.
                Doctor::where('user_id', $user->id)->update(['user_id' => null]);
            }
        }

        if (Schema::hasColumn('users', 'is_active')) {
            if (array_key_exists('is_active', $data) && $data['is_active'] !== null) {
                $user->is_active = (bool) $data['is_active'];
            }
        }

        $user->save();

        return response()->json([
            'id' => $user->id,
            'role' => $user->role,
            'is_active' => (bool) $user->is_active,
        ]);
    }

    public function deleteUser(Request $request, User $user)
    {
        $this->authorizeAdmin($request);

        if ($user->role === 'doctor') {
            Doctor::where('user_id', $user->id)->update(['user_id' => null]);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé.']);
    }

    /**
     * Format a date as a human-readable "time ago" string in French.
     */
    private function timeAgo(Carbon $date): string
    {
        $diff = $date->diffForHumans(now(), [
            'syntax' => Carbon::DIFF_RELATIVE_TO_NOW,
            'locale' => 'fr',
        ]);

        return ucfirst($diff);
    }

    private function authorizeAdmin(Request $request): void
    {
        $user = $request->user();
        if (!$user || $user->role !== 'admin') {
            abort(Response::HTTP_FORBIDDEN, 'Admin access required.');
        }
    }
}

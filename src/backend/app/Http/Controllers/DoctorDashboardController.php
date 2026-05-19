<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class DoctorDashboardController extends Controller
{
    /**
     * Find the Doctor record linked to the authenticated user.
     */
    private function getDoctorForUser(Request $request): ?Doctor
    {
        return Doctor::where('user_id', $request->user()->id)->first();
    }

    private function doctorOrFail(Request $request): Doctor
    {
        $user = $request->user();
        if (!$user || $user->role !== 'doctor') {
            abort(Response::HTTP_FORBIDDEN, 'Doctor access required.');
        }

        $doctor = $this->getDoctorForUser($request);
        if (!$doctor) {
            abort(Response::HTTP_NOT_FOUND, 'Profil médecin introuvable');
        }

        return $doctor;
    }

    /**
     * Get doctor dashboard stats.
     */
    public function stats(Request $request)
    {
        $doctor = $this->doctorOrFail($request);

        $today = Carbon::today();
        $startOfWeek = Carbon::now()->startOfWeek();
        $yesterday = Carbon::yesterday();

        // Today's appointments
        $todayCount = Appointment::where('doctor_id', $doctor->id)
            ->whereDate('date', $today)
            ->count();

        // Yesterday's appointments (for comparison)
        $yesterdayCount = Appointment::where('doctor_id', $doctor->id)
            ->whereDate('date', $yesterday)
            ->count();

        $todayDiff = $todayCount - $yesterdayCount;
        $todayChange = $todayDiff >= 0 ? "+{$todayDiff} par rapport à hier" : "{$todayDiff} par rapport à hier";

        // Total unique patients
        $totalPatients = Appointment::where('doctor_id', $doctor->id)
            ->distinct('patient_id')
            ->count('patient_id');

        // New patients this week
        $newPatientsThisWeek = Appointment::where('doctor_id', $doctor->id)
            ->where('created_at', '>=', $startOfWeek)
            ->distinct('patient_id')
            ->count('patient_id');

        // Rating from doctor record
        $rating = $doctor->rating;
        $ratingLabel = $rating >= 4.5 ? '⭐ Excellent' : ($rating >= 4.0 ? '⭐ Très bien' : '⭐ Bien');

        // Hours this week (30 min per appointment)
        $weekAppointments = Appointment::where('doctor_id', $doctor->id)
            ->whereBetween('date', [$startOfWeek, Carbon::now()->endOfWeek()])
            ->count();
        $hoursThisWeek = round($weekAppointments * 0.5);
        $maxHours = 40;
        $hoursRemaining = max(0, $maxHours - $hoursThisWeek);

        return response()->json([
            'today_appointments' => $todayCount,
            'today_change' => $todayChange,
            'total_patients' => $totalPatients,
            'new_patients_week' => "+{$newPatientsThisWeek} cette semaine",
            'rating' => $rating,
            'rating_label' => $ratingLabel,
            'hours_this_week' => $hoursThisWeek,
            'hours_remaining' => "{$hoursRemaining} heures restantes",
        ]);
    }

    /**
     * Get today's appointments for the doctor.
     */
    public function todayAppointments(Request $request)
    {
        $doctor = $this->doctorOrFail($request);

        $today = Carbon::today();

        $appointments = Appointment::with('patient:id,name,birth_date')
            ->where('doctor_id', $doctor->id)
            ->whereDate('date', $today)
            ->orderBy('time')
            ->get()
            ->map(function ($appointment) {
                $age = null;
                if ($appointment->patient->birth_date) {
                    $age = Carbon::parse($appointment->patient->birth_date)->age;
                }

                return [
                    'id' => $appointment->id,
                    'patient' => $appointment->patient->name,
                    'age' => $age,
                    'time' => $appointment->time,
                    'type' => $appointment->type,
                    'reason' => $appointment->reason ?? 'Consultation',
                    'status' => $appointment->status,
                ];
            });

        return response()->json($appointments);
    }

    /**
     * Get recent patients for the doctor.
     */
    public function recentPatients(Request $request)
    {
        $doctor = $this->doctorOrFail($request);

        // Get unique patients from recent completed appointments
        $recentAppointments = Appointment::with('patient:id,name')
            ->where('doctor_id', $doctor->id)
            ->where('status', 'completed')
            ->orderByDesc('date')
            ->get()
            ->unique('patient_id')
            ->take(5)
            ->map(function ($appointment) {
                return [
                    'id' => $appointment->patient->id,
                    'name' => $appointment->patient->name,
                    'last_visit' => $this->timeAgo($appointment->date),
                    'condition' => $appointment->reason ?? 'Consultation générale',
                ];
            })
            ->values();

        return response()->json($recentAppointments);
    }

    /**
     * Get monthly summary for the doctor.
     */
    public function monthlySummary(Request $request)
    {
        $doctor = $this->doctorOrFail($request);

        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        // Patients seen this month (unique patients with completed appointments)
        $patientsSeen = Appointment::where('doctor_id', $doctor->id)
            ->where('status', 'completed')
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->distinct('patient_id')
            ->count('patient_id');

        // Average wait time (computed from appointment density)
        $totalAppointments = Appointment::where('doctor_id', $doctor->id)
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->count();
        // Estimate: more appointments = slightly longer wait
        $avgWaitTime = $totalAppointments > 0
            ? min(20, max(5, round(($totalAppointments / max(Carbon::now()->day, 1)) * 1.5)))
            : 0;

        // Satisfaction rate based on rating and completed ratio
        $completedThisMonth = Appointment::where('doctor_id', $doctor->id)
            ->where('status', 'completed')
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->count();
        $cancelledThisMonth = Appointment::where('doctor_id', $doctor->id)
            ->where('status', 'cancelled')
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->count();

        $totalMonthly = $completedThisMonth + $cancelledThisMonth;
        $satisfaction = $totalMonthly > 0
            ? round(($completedThisMonth / $totalMonthly) * 100)
            : 100;

        return response()->json([
            'patients_seen' => $patientsSeen,
            'avg_wait_time' => $avgWaitTime,
            'satisfaction' => $satisfaction,
        ]);
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

    /**
     * List doctor appointments with basic filters.
     *
     * Query params:
     * - scope: today|upcoming|past|all (default today)
     */
    public function appointments(Request $request)
    {
        $doctor = $this->doctorOrFail($request);

        $request->validate([
            'scope' => ['nullable', Rule::in(['today', 'upcoming', 'past', 'all'])],
        ]);
        $scope = (string) $request->query('scope', 'today');

        $query = Appointment::query()
            ->with('patient:id,name,birth_date')
            ->where('doctor_id', $doctor->id);

        if ($scope === 'today') {
            $query->whereDate('date', Carbon::today());
        } elseif ($scope === 'upcoming') {
            $query->where(function ($q) {
                $q->whereDate('date', '>', Carbon::today())
                    ->orWhere(function ($q2) {
                        $q2->whereDate('date', Carbon::today())->where('status', 'upcoming');
                    });
            });
            $query->whereIn('status', ['upcoming', 'in-progress']);
        } elseif ($scope === 'past') {
            $query->whereIn('status', ['completed', 'cancelled']);
        }

        $items = $query
            ->orderByDesc('date')
            ->orderByDesc('time')
            ->limit(500)
            ->get()
            ->map(function (Appointment $appointment) {
                $age = null;
                if ($appointment->patient?->birth_date) {
                    $age = Carbon::parse($appointment->patient->birth_date)->age;
                }

                return [
                    'id' => $appointment->id,
                    'date' => $appointment->date?->format('Y-m-d'),
                    'time' => $appointment->time,
                    'status' => $appointment->status,
                    'type' => $appointment->type,
                    'reason' => $appointment->reason,
                    'patient' => [
                        'id' => $appointment->patient?->id,
                        'name' => $appointment->patient?->name,
                        'age' => $age,
                    ],
                ];
            })
            ->values();

        return response()->json($items);
    }

    /**
     * Update appointment status (doctor-managed).
     */
    public function updateAppointmentStatus(Request $request, Appointment $appointment)
    {
        $doctor = $this->doctorOrFail($request);

        if ((int) $appointment->doctor_id !== (int) $doctor->id) {
            abort(Response::HTTP_FORBIDDEN, 'Not your appointment.');
        }

        $data = $request->validate([
            'status' => ['required', Rule::in(['in-progress', 'completed', 'cancelled'])],
        ]);

        $status = (string) $data['status'];

        // Keep transitions sane.
        if ($appointment->status === 'cancelled' || $appointment->status === 'completed') {
            return response()->json([
                'message' => 'Ce rendez-vous est déjà terminé.',
            ], Response::HTTP_CONFLICT);
        }

        if ($status === 'completed' && $appointment->status !== 'in-progress') {
            return response()->json([
                'message' => 'Passez d’abord le rendez-vous en cours.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $appointment->status = $status;
        $appointment->save();

        return response()->json([
            'id' => $appointment->id,
            'status' => $appointment->status,
        ]);
    }

    /**
     * List all unique patients the doctor has seen (completed appointments).
     */
    public function patients(Request $request)
    {
        $doctor = $this->doctorOrFail($request);

        $q = trim((string) $request->query('q', ''));

        $base = Appointment::query()
            ->where('doctor_id', $doctor->id)
            ->where('status', 'completed');

        $patientIds = (clone $base)->distinct()->pluck('patient_id')->all();
        if (empty($patientIds)) {
            return response()->json([]);
        }

        $users = User::query()
            ->whereIn('id', $patientIds)
            ->when($q !== '', fn ($query) => $query->where('name', 'like', '%' . $q . '%'))
            ->get(['id', 'name', 'birth_date']);

        $lastVisits = (clone $base)
            ->selectRaw('patient_id, MAX(date) as last_visit')
            ->groupBy('patient_id')
            ->pluck('last_visit', 'patient_id');

        $counts = (clone $base)
            ->selectRaw('patient_id, COUNT(*) as visits')
            ->groupBy('patient_id')
            ->pluck('visits', 'patient_id');

        $payload = $users->map(function (User $u) use ($lastVisits, $counts) {
            $age = null;
            if ($u->birth_date) {
                $age = Carbon::parse($u->birth_date)->age;
            }

            $last = $lastVisits[$u->id] ?? null;
            $lastLabel = null;
            try {
                if ($last) {
                    $lastLabel = $this->timeAgo(Carbon::parse($last));
                }
            } catch (\Throwable $e) {
                $lastLabel = null;
            }

            return [
                'id' => $u->id,
                'name' => $u->name,
                'age' => $age,
                'visits' => (int) ($counts[$u->id] ?? 0),
                'last_visit' => $lastLabel,
            ];
        })->values();

        return response()->json($payload);
    }
}

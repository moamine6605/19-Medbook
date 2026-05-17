<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
}

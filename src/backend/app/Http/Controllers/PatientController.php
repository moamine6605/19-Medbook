<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Prescription;
use App\Models\PatientActivity;
use Carbon\Carbon;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    /**
     * Get patient dashboard stats.
     */
    public function stats(Request $request)
    {
        $user = $request->user();

        $upcomingAppointments = Appointment::where('patient_id', $user->id)
            ->where('status', 'upcoming')
            ->count();

        $completedVisits = Appointment::where('patient_id', $user->id)
            ->where('status', 'completed')
            ->count();

        $activePrescriptions = Prescription::where('patient_id', $user->id)
            ->where('status', 'active')
            ->count();

        // Health score based on completed visits and active prescriptions
        $totalAppointments = $upcomingAppointments + $completedVisits;
        $healthScore = $totalAppointments > 0
            ? min(100, round(($completedVisits / max($totalAppointments, 1)) * 100))
            : 0;

        return response()->json([
            'upcoming_appointments' => $upcomingAppointments,
            'completed_visits' => $completedVisits,
            'health_score' => $healthScore,
            'active_prescriptions' => $activePrescriptions,
        ]);
    }

    /**
     * Get patient's upcoming appointments with doctor info.
     */
    public function appointments(Request $request)
    {
        $user = $request->user();

        $appointments = Appointment::with('doctor:id,name,specialty')
            ->where('patient_id', $user->id)
            ->where('status', 'upcoming')
            ->orderBy('date')
            ->orderBy('time')
            ->get()
            ->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'doctor' => $appointment->doctor->name,
                    'specialty' => $appointment->doctor->specialty,
                    'date' => $appointment->date->format('Y-m-d'),
                    'time' => $appointment->time,
                    'status' => $appointment->status,
                    'type' => $appointment->type,
                ];
            });

        return response()->json($appointments);
    }

    /**
     * Get patient's recent activity.
     */
    public function activity(Request $request)
    {
        $user = $request->user();

        $activities = PatientActivity::where('patient_id', $user->id)
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'action' => $activity->action,
                    'description' => $activity->description,
                    'type' => $activity->type,
                    'time' => $this->timeAgo($activity->created_at),
                ];
            });

        return response()->json($activities);
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

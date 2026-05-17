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
     * Store a new appointment.
     */
    public function store(Request $request)
    {
        $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'date' => 'required|date_format:Y-m-d',
            'time' => 'required',
            'type' => 'nullable|in:in-person,video',
            'reason' => 'nullable|string',
        ]);

        $user = $request->user();
        $doctor = \App\Models\Doctor::findOrFail($request->doctor_id);

        $appointment = Appointment::create([
            'patient_id' => $user->id,
            'doctor_id' => $request->doctor_id,
            'date' => $request->date,
            'time' => $request->time,
            'status' => 'upcoming',
            'type' => $request->type ?? 'in-person',
            'reason' => $request->reason ?? 'Consultation',
        ]);

        PatientActivity::create([
            'patient_id' => $user->id,
            'action' => 'Rendez-vous pris',
            'description' => 'Avec le Dr. ' . $doctor->name . ' (' . $doctor->specialty . ')',
            'type' => 'appointment',
        ]);

        return response()->json([
            'message' => 'Rendez-vous créé avec succès',
            'appointment' => [
                'id' => $appointment->id,
                'doctor' => $doctor->name,
                'specialty' => $doctor->specialty,
                'date' => $appointment->date->format('Y-m-d'),
                'time' => $appointment->time,
                'status' => $appointment->status,
                'type' => $appointment->type,
            ]
        ], 201);
    }

    /**
     * Update an appointment.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'date' => 'required|date_format:Y-m-d',
            'time' => 'required',
            'type' => 'nullable|in:in-person,video',
        ]);

        $user = $request->user();
        $appointment = Appointment::where('patient_id', $user->id)->findOrFail($id);

        $appointment->date = $request->date;
        $appointment->time = $request->time;
        if ($request->has('type')) {
            $appointment->type = $request->type;
        }
        $appointment->save();

        $doctor = $appointment->doctor;

        PatientActivity::create([
            'patient_id' => $user->id,
            'action' => 'Rendez-vous reporté',
            'description' => 'Avec le Dr. ' . $doctor->name . ' au ' . Carbon::parse($request->date)->format('d/m/Y') . ' à ' . $request->time,
            'type' => 'appointment',
        ]);

        return response()->json([
            'message' => 'Rendez-vous modifié avec succès',
            'appointment' => [
                'id' => $appointment->id,
                'doctor' => $doctor->name,
                'specialty' => $doctor->specialty,
                'date' => $appointment->date->format('Y-m-d'),
                'time' => $appointment->time,
                'status' => $appointment->status,
                'type' => $appointment->type,
            ]
        ]);
    }

    /**
     * Delete/Cancel an appointment.
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $appointment = Appointment::where('patient_id', $user->id)->findOrFail($id);

        $doctor = $appointment->doctor;
        $appointment->delete();

        PatientActivity::create([
            'patient_id' => $user->id,
            'action' => 'Rendez-vous annulé',
            'description' => 'Avec le Dr. ' . $doctor->name,
            'type' => 'appointment',
        ]);

        return response()->json([
            'message' => 'Rendez-vous supprimé avec succès',
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
}

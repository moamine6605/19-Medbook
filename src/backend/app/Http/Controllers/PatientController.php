<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Prescription;
use App\Models\PatientActivity;
use App\Mail\AppointmentConfirmation;
use App\Support\SlotPolicy;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Schema;
use Symfony\Component\HttpFoundation\Response;

class PatientController extends Controller
{
    /**
     * Get patient dashboard stats.
     */
    public function stats(Request $request)
    {
        $user = $this->patientOrFail($request);

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
            // No payment feature yet; keep stable API field for the UI.
            'bills_to_pay' => 0,
        ]);
    }

    /**
     * Get patient's upcoming appointments with doctor info.
     */
    public function appointments(Request $request)
    {
        $user = $this->patientOrFail($request);

        $request->validate([
            'scope' => ['nullable', 'in:upcoming,past,all'],
        ]);

        $scope = $request->query('scope', 'upcoming');

        $query = Appointment::with('doctor:id,name,specialty')
            ->where('patient_id', $user->id);

        if ($scope === 'upcoming') {
            $query->where('status', 'upcoming');
        } elseif ($scope === 'past') {
            $query->whereIn('status', ['completed', 'cancelled']);
        }

        $appointments = $query
            ->orderByDesc('date')
            ->orderByDesc('time')
            ->get()
            ->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'doctor_id' => $appointment->doctor_id,
                    'doctor' => $appointment->doctor->name,
                    'specialty' => $appointment->doctor->specialty,
                    'date' => $appointment->date->format('Y-m-d'),
                    'time' => $appointment->time,
                    'status' => $appointment->status,
                    'type' => $appointment->type,
                    'reason' => $appointment->reason,
                ];
            });

        return response()->json($appointments);
    }

    /**
     * Get patient's recent activity.
     */
    public function activity(Request $request)
    {
        $user = $this->patientOrFail($request);

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
     * Get patient profile fields (editable subset).
     */
    public function profile(Request $request)
    {
        $user = $this->patientOrFail($request);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'birth_date' => $user->birth_date?->format('Y-m-d'),
            'blood_type' => Schema::hasColumn('users', 'blood_type') ? $user->blood_type : null,
            'address' => Schema::hasColumn('users', 'address') ? $user->address : null,
            'created_at' => $user->created_at?->toIso8601String(),
        ]);
    }

    /**
     * Update patient profile fields (editable subset).
     */
    public function updateProfile(Request $request)
    {
        $user = $this->patientOrFail($request);

        $rules = [
            'name' => ['required', 'string', 'max:255'],
        ];
        if (Schema::hasColumn('users', 'birth_date')) {
            $rules['birth_date'] = ['nullable', 'date_format:Y-m-d'];
        }
        if (Schema::hasColumn('users', 'blood_type')) {
            $rules['blood_type'] = ['nullable', 'in:A+,A-,B+,B-,AB+,AB-,O+,O-'];
        }
        if (Schema::hasColumn('users', 'address')) {
            $rules['address'] = ['nullable', 'string', 'max:255'];
        }

        $data = $request->validate($rules);

        $user->name = $data['name'];
        if (array_key_exists('birth_date', $data)) {
            $user->birth_date = $data['birth_date'] ?: null;
        }
        if (array_key_exists('blood_type', $data)) {
            $user->blood_type = $data['blood_type'] ?: null;
        }
        if (array_key_exists('address', $data)) {
            $user->address = $data['address'] ?: null;
        }
        $user->save();

        return response()->json([
            'message' => 'Profil mis à jour.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'birth_date' => $user->birth_date?->format('Y-m-d'),
                'blood_type' => Schema::hasColumn('users', 'blood_type') ? $user->blood_type : null,
                'address' => Schema::hasColumn('users', 'address') ? $user->address : null,
            ],
        ]);
    }

    /**
     * Store a new appointment.
     */
    public function store(Request $request)
    {
        $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'date' => 'required|date_format:Y-m-d',
            'time' => ['required', 'string', 'regex:/^\\d{2}:\\d{2}$/'],
            'type' => 'nullable|in:in-person,video',
            'reason' => 'nullable|string',
        ]);

        $user = $this->patientOrFail($request);
        $doctor = \App\Models\Doctor::findOrFail($request->doctor_id);

        if ($doctor->status !== 'actif' || $doctor->archivedRecord()->exists()) {
            return response()->json([
                'message' => 'Médecin indisponible.',
            ], Response::HTTP_CONFLICT);
        }

        $allowedTimes = SlotPolicy::allowedTimesForDoctorDate($doctor->id, $request->date);
        if (!in_array($request->time, $allowedTimes, true)) {
            return response()->json([
                'message' => 'Créneau invalide.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Anti-chevauchement: no double-booking for the same doctor/date/time.
        $conflict = Appointment::where('doctor_id', $doctor->id)
            ->whereDate('date', $request->date)
            ->where('time', $request->time)
            ->whereIn('status', SlotPolicy::BLOCKING_STATUSES)
            ->exists();
        if ($conflict) {
            return response()->json([
                'message' => 'Ce créneau est déjà réservé.',
            ], Response::HTTP_CONFLICT);
        }

        try {
            $appointment = Appointment::create([
                'patient_id' => $user->id,
                'doctor_id' => $request->doctor_id,
                'date' => $request->date,
                'time' => $request->time,
                'status' => 'upcoming',
                'type' => $request->type ?? 'in-person',
                'reason' => $request->reason ?? 'Consultation',
            ]);
        } catch (QueryException $e) {
            // If a DB-level uniqueness constraint is in place, surface a clean 409 to the SPA.
            if ((string) $e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Ce créneau est déjà réservé.',
                ], Response::HTTP_CONFLICT);
            }
            throw $e;
        }

        PatientActivity::create([
            'patient_id' => $user->id,
            'action' => 'Rendez-vous pris',
            'description' => 'Avec le Dr. ' . $doctor->name . ' (' . $doctor->specialty . ')',
            'type' => 'appointment',
        ]);

        // Email notification (MAIL_MAILER=log by default locally).
        try {
            Mail::to($user->email)->send(new AppointmentConfirmation($appointment));
        } catch (\Throwable $e) {
            // Don't fail the booking if mail fails in local environments.
        }

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
            'time' => ['required', 'string', 'regex:/^\\d{2}:\\d{2}$/'],
            'type' => 'nullable|in:in-person,video',
        ]);

        $user = $this->patientOrFail($request);
        $appointment = Appointment::where('patient_id', $user->id)->findOrFail($id);

        $doctorId = $appointment->doctor_id;
        $doctor = $appointment->doctor;
        if ($doctor && ($doctor->status !== 'actif' || $doctor->archivedRecord()->exists())) {
            return response()->json([
                'message' => 'Médecin indisponible.',
            ], Response::HTTP_CONFLICT);
        }

        $allowedTimes = SlotPolicy::allowedTimesForDoctorDate($doctorId, $request->date);
        if (!in_array($request->time, $allowedTimes, true)) {
            return response()->json([
                'message' => 'Créneau invalide.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $conflict = Appointment::where('doctor_id', $doctorId)
            ->whereDate('date', $request->date)
            ->where('time', $request->time)
            ->whereIn('status', SlotPolicy::BLOCKING_STATUSES)
            ->where('id', '!=', $appointment->id)
            ->exists();
        if ($conflict) {
            return response()->json([
                'message' => 'Ce créneau est déjà réservé.',
            ], Response::HTTP_CONFLICT);
        }

        try {
            $appointment->date = $request->date;
            $appointment->time = $request->time;
            if ($request->has('type')) {
                $appointment->type = $request->type;
            }
            $appointment->save();
        } catch (QueryException $e) {
            if ((string) $e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Ce créneau est déjà réservé.',
                ], Response::HTTP_CONFLICT);
            }
            throw $e;
        }

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
        $user = $this->patientOrFail($request);
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

    private function patientOrFail(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->role !== 'patient') {
            abort(Response::HTTP_FORBIDDEN, 'Patient access required.');
        }

        return $user;
    }
}

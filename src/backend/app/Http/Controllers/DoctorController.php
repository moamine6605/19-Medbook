<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\User;
use App\Support\SlotPolicy;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    private static array $specialtyIcons = [
        'Cardiologue' => '❤️',
        'Neurologue' => '🧠',
        'Pédiatre' => '👶',
        'Dermatologue' => '✨',
        'Orthopédiste' => '🦴',
        'Médecin généraliste' => '🏥',
        'Ophtalmologue' => '👁️',
        'ORL' => '👂',
        'Gynécologue' => '🩺',
        'Urologue' => '🔬',
        'Pneumologue' => '🫁',
        'Gastro-entérologue' => '🏥',
        'Rhumatologue' => '💪',
        'Endocrinologue' => '⚕️',
        'Psychiatre' => '🧩',
        'Chirurgien' => '🔪',
        'Radiologue' => '📡',
        'Anesthésiste' => '💉',
        'Oncologue' => '🎗️',
        'Néphrologue' => '🫘',
    ];

    /**
     * Get featured doctors for the landing page.
     */
    public function featured()
    {
        $doctors = Doctor::where('is_featured', true)
            ->where('status', 'actif')
            ->whereDoesntHave('archivedRecord')
            ->orderByDesc('rating')
            ->limit(6)
            ->get();

        return response()->json($doctors);
    }

    /**
     * Get public stats for the landing page.
     */
    public function publicStats()
    {
        $doctorCount = Doctor::where('status', 'actif')
            ->whereDoesntHave('archivedRecord')
            ->count();
        $patientCount = User::where('role', 'patient')->count();

        // Calculate average rating across all doctors
        $averageRating = Doctor::where('status', 'actif')
            ->whereDoesntHave('archivedRecord')
            ->avg('rating');

        return response()->json([
            'doctors_count' => $doctorCount,
            'patients_count' => $patientCount,
            'average_rating' => round($averageRating, 1),
        ]);
    }

    /**
     * Get all specialties with doctor counts for the booking page.
     */
    public function specialties()
    {
        $specialties = Doctor::select('specialty')
            ->where('status', 'actif')
            ->whereDoesntHave('archivedRecord')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('specialty')
            ->orderByDesc('count')
            ->get()
            ->map(function ($row) {
                return [
                    'id' => strtolower(str_replace([' ', '-', 'é', 'è'], ['_', '_', 'e', 'e'], $row->specialty)),
                    'name' => $row->specialty,
                    'icon' => self::$specialtyIcons[$row->specialty] ?? '🏥',
                    'count' => $row->count,
                ];
            });

        return response()->json($specialties);
    }

    /**
     * Get doctors filtered by specialty for the booking page.
     */
    public function bySpecialty(Request $request)
    {
        $specialty = $request->query('specialty');

        $query = Doctor::where('status', 'actif')
            ->whereDoesntHave('archivedRecord')
            ->orderByDesc('rating');

        if ($specialty) {
            $query->where('specialty', $specialty);
        }

        $doctors = $query->limit(20)->get()->map(function ($doctor) {
            $today = Carbon::today()->toDateString();
            $allowedTimes = SlotPolicy::allowedTimesForDoctorDate($doctor->id, $today);
            $totalSlotsToday = count($allowedTimes);
            $bookedToday = Appointment::where('doctor_id', $doctor->id)
                ->whereDate('date', $today)
                ->whereIn('status', SlotPolicy::BLOCKING_STATUSES)
                ->count();
            $freeToday = max(0, $totalSlotsToday - $bookedToday);

            $availability = $freeToday > 0
                ? "Disponible aujourd'hui"
                : ($totalSlotsToday > 0 ? 'Complet aujourd\'hui' : 'Sur rendez-vous');

            return [
                'id' => $doctor->id,
                'name' => $doctor->name,
                'specialty' => $doctor->specialty,
                'rating' => $doctor->rating,
                'reviews' => $doctor->reviews,
                'experience' => $doctor->experience,
                'phone' => $doctor->phone,
                'address' => $doctor->address,
                'bio' => $doctor->bio,
                'availability' => $availability,
            ];
        });

        return response()->json($doctors);
    }
}

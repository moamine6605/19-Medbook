<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\User;

class DoctorController extends Controller
{
    /**
     * Get featured doctors for the landing page.
     */
    public function featured()
    {
        $doctors = Doctor::where('is_featured', true)
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
        $doctorCount = Doctor::count();
        $patientCount = User::where('role', 'patient')->count();

        // Calculate average rating across all doctors
        $averageRating = Doctor::avg('rating');

        return response()->json([
            'doctors_count' => $doctorCount,
            'patients_count' => $patientCount,
            'average_rating' => round($averageRating, 1),
        ]);
    }
}

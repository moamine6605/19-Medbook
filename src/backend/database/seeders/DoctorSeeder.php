<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DoctorSeeder extends Seeder
{
    /**
     * Seed the doctors table with 1000 doctors (3 featured + 997 regular).
     */
    public function run(): void
    {
        // 3 featured doctors (displayed on landing page)
        Doctor::create([
            'name' => 'Dr. Sarah Johnson',
            'specialty' => 'Cardiologue',
            'rating' => 4.9,
            'reviews' => 234,
            'experience' => '15 ans',
            'is_featured' => true,
        ]);

        Doctor::create([
            'name' => 'Dr. Michael Chen',
            'specialty' => 'Neurologue',
            'rating' => 4.8,
            'reviews' => 189,
            'experience' => '12 ans',
            'is_featured' => true,
        ]);

        Doctor::create([
            'name' => 'Dr. Emily Williams',
            'specialty' => 'Pédiatre',
            'rating' => 5.0,
            'reviews' => 312,
            'experience' => '10 ans',
            'is_featured' => true,
        ]);

        // 997 additional doctors to reach 1000 total
        Doctor::factory()->count(997)->create();
    }
}

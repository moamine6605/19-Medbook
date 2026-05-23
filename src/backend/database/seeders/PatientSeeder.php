<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PatientSeeder extends Seeder
{
    /**
     * Seed 1000 patient users.
     */
    public function run(): void
    {
        // Stable demo account used by the frontend demo credentials.
        User::firstOrCreate(
            ['email' => 'patient@demo.com'],
            [
                'name' => 'Patient Demo',
                'password' => Hash::make('demo123'),
                'role' => 'patient',
            ]
        );

        User::factory()->count(1000)->create(['role' => 'patient']);
    }
}

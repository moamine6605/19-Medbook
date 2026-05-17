<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed 1000 doctors
        $this->call(DoctorSeeder::class);

        // Seed 1000 patient users
        $this->call(PatientSeeder::class);

        // Seed appointments, prescriptions, and activities for patients
        $this->call(PatientDataSeeder::class);

        // Seed doctor user accounts and today's appointments
        $this->call(DoctorDataSeeder::class);
    }
}

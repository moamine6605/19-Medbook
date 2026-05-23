<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\DoctorSlot;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Lightweight seeder intended for Docker dev.
 *
 * Creates stable demo credentials and a small dataset so the app boots quickly.
 */
class DockerDevSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedDemoUsers();
        $this->seedDoctors();
        $this->seedDoctorUsers();
        $this->seedSlots();
        $this->seedSampleAppointment();
    }

    private function seedDemoUsers(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@demo.com'],
            [
                'name' => 'Administrateur Medbook',
                'password' => Hash::make('demo123'),
                'role' => 'admin',
            ]
        );

        User::firstOrCreate(
            ['email' => 'patient@demo.com'],
            [
                'name' => 'Patient Demo',
                'password' => Hash::make('demo123'),
                'role' => 'patient',
            ]
        );
    }

    private function seedDoctors(): void
    {
        // Featured doctors expected by the UI.
        Doctor::firstOrCreate(
            ['name' => 'Dr. Sarah Johnson'],
            [
                'specialty' => 'Cardiologue',
                'rating' => 4.9,
                'reviews' => 234,
                'experience' => '15 ans',
                'is_featured' => true,
            ]
        );

        Doctor::firstOrCreate(
            ['name' => 'Dr. Michael Chen'],
            [
                'specialty' => 'Neurologue',
                'rating' => 4.8,
                'reviews' => 189,
                'experience' => '12 ans',
                'is_featured' => true,
            ]
        );

        Doctor::firstOrCreate(
            ['name' => 'Dr. Emily Williams'],
            [
                'specialty' => 'Pédiatre',
                'rating' => 5.0,
                'reviews' => 312,
                'experience' => '10 ans',
                'is_featured' => true,
            ]
        );

        // Add a small number of extra doctors for browsing/filters.
        if (Doctor::count() < 25) {
            Doctor::factory()->count(25 - Doctor::count())->create();
        }
    }

    private function seedDoctorUsers(): void
    {
        $demoAccounts = [
            'Dr. Sarah Johnson' => 'doctor@demo.com',
            'Dr. Michael Chen' => 'doctor2@demo.com',
            'Dr. Emily Williams' => 'doctor3@demo.com',
        ];

        foreach ($demoAccounts as $doctorName => $email) {
            $doctor = Doctor::where('name', $doctorName)->first();
            if (! $doctor) {
                continue;
            }

            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $doctor->name,
                    'password' => Hash::make('demo123'),
                    'role' => 'doctor',
                ]
            );

            if (! $doctor->user_id) {
                $doctor->update(['user_id' => $user->id]);
            }
        }
    }

    private function seedSlots(): void
    {
        $times = [
            '08:00', '08:30',
            '09:00', '09:30', '10:00', '10:30',
            '11:00', '11:30', '14:00', '14:30',
            '15:00', '15:30', '16:00', '16:30',
            '17:00',
        ];

        $start = Carbon::today();
        $days = 14;

        $doctors = Doctor::where('is_featured', true)->get();
        foreach ($doctors as $doctor) {
            for ($i = 0; $i < $days; $i++) {
                $date = $start->copy()->addDays($i)->toDateString();
                foreach ($times as $time) {
                    DoctorSlot::firstOrCreate([
                        'doctor_id' => $doctor->id,
                        'date' => $date,
                        'time' => $time,
                    ]);
                }
            }
        }
    }

    private function seedSampleAppointment(): void
    {
        $patient = User::where('email', 'patient@demo.com')->first();
        $doctor = Doctor::where('name', 'Dr. Sarah Johnson')->first();
        if (! $patient || ! $doctor) {
            return;
        }

        Appointment::firstOrCreate(
            [
                'patient_id' => $patient->id,
                'doctor_id' => $doctor->id,
                'date' => Carbon::today()->toDateString(),
                'time' => '10:00',
            ],
            [
                'status' => 'upcoming',
                'type' => 'in-person',
                'reason' => 'Consultation de suivi',
            ]
        );
    }
}

<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DoctorDataSeeder extends Seeder
{
    private static array $reasons = [
        'Bilan de santé régulier',
        'Consultation de suivi',
        'Évaluation de la santé cardiaque',
        'Renouvellement d\'ordonnance',
        'Douleurs chroniques',
        'Contrôle post-opératoire',
        'Premiers symptômes',
        'Examen annuel',
        'Résultats d\'analyses',
        'Consultation urgente',
        'Vaccination',
        'Problème dermatologique',
        'Bilan neurologique',
        'Contrôle tension artérielle',
        'Suivi diabète',
    ];

    /**
     * Seed doctor user accounts and link them to doctor records,
     * then create today's appointments with reasons and birth_dates for patients.
     */
    public function run(): void
    {
        $this->createDoctorUserAccounts();
        $this->addBirthDatesToPatients();
        $this->addReasonsToExistingAppointments();
        $this->createTodayAppointments();
    }

    /**
     * Create user accounts for every doctor and link them.
     */
    private function createDoctorUserAccounts(): void
    {
        $demoAccounts = [
            'Dr. Sarah Johnson' => 'doctor@demo.com',
            'Dr. Michael Chen' => 'doctor2@demo.com',
            'Dr. Emily Williams' => 'doctor3@demo.com',
        ];

        Doctor::orderBy('id')->chunkById(100, function ($doctors) use ($demoAccounts) {
            foreach ($doctors as $doctor) {
                if ($doctor->user_id) {
                    continue;
                }

                $email = $demoAccounts[$doctor->name] ?? 'doctor' . $doctor->id . '@medbook.local';

                $user = User::firstOrCreate(
                    ['email' => $email],
                    [
                        'name' => $doctor->name,
                        'password' => Hash::make('demo123'),
                        'role' => 'doctor',
                    ]
                );

                $user->forceFill([
                    'name' => $doctor->name,
                    'role' => 'doctor',
                ])->save();

                $doctor->update(['user_id' => $user->id]);
            }
        });
    }

    /**
     * Add random birth dates to patients that don't have one.
     */
    private function addBirthDatesToPatients(): void
    {
        $patients = User::where('role', 'patient')->whereNull('birth_date')->get();

        foreach ($patients as $patient) {
            $patient->update([
                'birth_date' => fake()->dateTimeBetween('-80 years', '-18 years')->format('Y-m-d'),
            ]);
        }
    }

    /**
     * Add reasons to existing appointments that don't have one.
     */
    private function addReasonsToExistingAppointments(): void
    {
        Appointment::whereNull('reason')->chunkById(200, function ($appointments) {
            foreach ($appointments as $appointment) {
                $appointment->update([
                    'reason' => self::$reasons[array_rand(self::$reasons)],
                ]);
            }
        });
    }

    /**
     * Create today's appointments for linked doctors.
     */
    private function createTodayAppointments(): void
    {
        $linkedDoctors = Doctor::whereNotNull('user_id')->get();
        $patients = User::where('role', 'patient')->inRandomOrder()->limit(200)->get();
        $today = Carbon::today();
        $timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];
        $statuses = ['completed', 'completed', 'in-progress', 'upcoming', 'upcoming', 'upcoming'];

        foreach ($linkedDoctors as $doctor) {
            // 4-10 appointments today per doctor
            $appointmentCount = rand(4, 10);
            $usedSlots = [];
            $usedPatients = [];

            for ($i = 0; $i < $appointmentCount; $i++) {
                // Pick a unique time slot
                $availableSlots = array_diff($timeSlots, $usedSlots);
                if (empty($availableSlots)) break;
                $slot = $availableSlots[array_rand($availableSlots)];
                $usedSlots[] = $slot;

                // Pick a unique patient
                $patient = $patients->whereNotIn('id', $usedPatients)->random();
                $usedPatients[] = $patient->id;

                // Determine status based on time slot
                $slotHour = (int) explode(':', $slot)[0];
                $currentHour = Carbon::now()->hour;
                if ($slotHour < $currentHour - 1) {
                    $status = 'completed';
                } elseif ($slotHour <= $currentHour) {
                    $status = 'in-progress';
                } else {
                    $status = 'upcoming';
                }

                Appointment::create([
                    'patient_id' => $patient->id,
                    'doctor_id' => $doctor->id,
                    'date' => $today->format('Y-m-d'),
                    'time' => $slot,
                    'status' => $status,
                    'type' => rand(0, 3) > 0 ? 'in-person' : 'video',
                    'reason' => self::$reasons[array_rand(self::$reasons)],
                ]);
            }
        }
    }
}

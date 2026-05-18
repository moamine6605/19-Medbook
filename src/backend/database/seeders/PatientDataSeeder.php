<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\PatientActivity;
use App\Models\Prescription;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class PatientDataSeeder extends Seeder
{
    /**
     * Seed appointments, prescriptions, and activities for all patient users.
     */
    public function run(): void
    {
        $patients = User::where('role', 'patient')->get();
        $doctors = Doctor::all();

        if ($doctors->isEmpty()) {
            $this->command->warn('No doctors found. Run DoctorSeeder first.');
            return;
        }

        $medications = [
            ['medication' => 'Amoxicilline', 'dosage' => '500mg, 3x/jour'],
            ['medication' => 'Ibuprofène', 'dosage' => '400mg, 2x/jour'],
            ['medication' => 'Paracétamol', 'dosage' => '1g, 3x/jour'],
            ['medication' => 'Oméprazole', 'dosage' => '20mg, 1x/jour'],
            ['medication' => 'Métformine', 'dosage' => '850mg, 2x/jour'],
            ['medication' => 'Amlodipine', 'dosage' => '5mg, 1x/jour'],
            ['medication' => 'Simvastatine', 'dosage' => '20mg, 1x/soir'],
            ['medication' => 'Lévothyroxine', 'dosage' => '50µg, 1x/matin'],
        ];

        $activityTemplates = [
            ['action' => 'Rendez-vous pris', 'type' => 'appointment'],
            ['action' => 'Résultats de laboratoire', 'type' => 'results'],
            ['action' => 'Ordonnance renouvelée', 'type' => 'prescription'],
            ['action' => 'Dossier médical consulté', 'type' => 'other'],
            ['action' => 'Rendez-vous annulé', 'type' => 'appointment'],
            ['action' => 'Nouveau document ajouté', 'type' => 'other'],
        ];

        $now = Carbon::now();

        foreach ($patients as $patient) {
            $patientDoctors = $doctors->random(min(5, $doctors->count()));

            // --- Upcoming appointments (2-4 per patient) ---
            $upcomingCount = rand(2, 4);
            for ($i = 0; $i < $upcomingCount; $i++) {
                $doctor = $patientDoctors->random();
                $date = $now->copy()->addDays(rand(1, 30));
                $hours = [9, 10, 11, 14, 15, 16];
                $minutes = ['00', '30'];

                for ($tries = 0; $tries < 10; $tries++) {
                    $time = $hours[array_rand($hours)] . ':' . $minutes[array_rand($minutes)];
                    $dateStr = $date->format('Y-m-d');
                    $exists = Appointment::where('doctor_id', $doctor->id)
                        ->whereDate('date', $dateStr)
                        ->where('time', $time)
                        ->exists();
                    if ($exists) continue;

                    Appointment::create([
                        'patient_id' => $patient->id,
                        'doctor_id' => $doctor->id,
                        'date' => $dateStr,
                        'time' => $time,
                        'status' => 'upcoming',
                        'type' => rand(0, 1) ? 'in-person' : 'video',
                    ]);
                    break;
                }
            }

            // --- Completed appointments (3-8 per patient) ---
            $completedCount = rand(3, 8);
            for ($i = 0; $i < $completedCount; $i++) {
                $doctor = $patientDoctors->random();
                $date = $now->copy()->subDays(rand(7, 180));
                $hours = [9, 10, 11, 14, 15, 16];
                $minutes = ['00', '30'];

                for ($tries = 0; $tries < 10; $tries++) {
                    $time = $hours[array_rand($hours)] . ':' . $minutes[array_rand($minutes)];
                    $dateStr = $date->format('Y-m-d');
                    $exists = Appointment::where('doctor_id', $doctor->id)
                        ->whereDate('date', $dateStr)
                        ->where('time', $time)
                        ->exists();
                    if ($exists) continue;

                    Appointment::create([
                        'patient_id' => $patient->id,
                        'doctor_id' => $doctor->id,
                        'date' => $dateStr,
                        'time' => $time,
                        'status' => 'completed',
                        'type' => rand(0, 1) ? 'in-person' : 'video',
                    ]);
                    break;
                }
            }

            // --- Active prescriptions (1-3 per patient) ---
            $prescriptionCount = rand(1, 3);
            $usedMeds = [];
            for ($i = 0; $i < $prescriptionCount; $i++) {
                $med = $medications[array_rand($medications)];
                if (in_array($med['medication'], $usedMeds)) continue;
                $usedMeds[] = $med['medication'];

                Prescription::create([
                    'patient_id' => $patient->id,
                    'doctor_id' => $patientDoctors->random()->id,
                    'medication' => $med['medication'],
                    'dosage' => $med['dosage'],
                    'status' => 'active',
                ]);
            }

            // --- Completed/expired prescriptions (1-2 per patient) ---
            $oldPrescriptionCount = rand(1, 2);
            for ($i = 0; $i < $oldPrescriptionCount; $i++) {
                $med = $medications[array_rand($medications)];

                Prescription::create([
                    'patient_id' => $patient->id,
                    'doctor_id' => $patientDoctors->random()->id,
                    'medication' => $med['medication'],
                    'dosage' => $med['dosage'],
                    'status' => rand(0, 1) ? 'completed' : 'expired',
                ]);
            }

            // --- Recent activities (3-6 per patient) ---
            $activityCount = rand(3, 6);
            for ($i = 0; $i < $activityCount; $i++) {
                $template = $activityTemplates[array_rand($activityTemplates)];
                $doctor = $patientDoctors->random();

                $descriptions = [
                    'appointment' => $doctor->name . ' - ' . $doctor->specialty,
                    'results' => 'Résultats du test sanguin prêts',
                    'prescription' => $doctor->name . ' - ' . $medications[array_rand($medications)]['medication'],
                    'other' => 'Mise à jour du dossier médical',
                ];

                PatientActivity::create([
                    'patient_id' => $patient->id,
                    'action' => $template['action'],
                    'description' => $descriptions[$template['type']],
                    'type' => $template['type'],
                    'created_at' => $now->copy()->subMinutes(rand(5, 10080)), // 5 min to 7 days ago
                    'updated_at' => $now,
                ]);
            }
        }
    }
}

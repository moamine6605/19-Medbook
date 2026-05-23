<?php

namespace Database\Factories;

use App\Models\Doctor;
use App\Models\Prescription;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Prescription>
 */
class PrescriptionFactory extends Factory
{
    protected $model = Prescription::class;

    public function definition(): array
    {
        $patient = User::factory()->create(['role' => 'patient']);
        $doctorUser = User::factory()->create(['role' => 'doctor']);
        $doctor = Doctor::factory()->create(['user_id' => $doctorUser->id]);

        return [
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'medication' => fake()->randomElement(['Ibuprofen', 'Amoxicillin', 'Paracetamol', 'Metformin']),
            'dosage' => fake()->optional()->randomElement(['1x/day', '2x/day', '500mg', '10mg']),
            'status' => fake()->randomElement(['active', 'completed', 'expired']),
        ];
    }
}


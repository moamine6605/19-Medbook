<?php

namespace Database\Factories;

use App\Models\PatientActivity;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PatientActivity>
 */
class PatientActivityFactory extends Factory
{
    protected $model = PatientActivity::class;

    public function definition(): array
    {
        $patient = User::factory()->create(['role' => 'patient']);

        return [
            'patient_id' => $patient->id,
            'action' => fake()->randomElement(['appointment_created', 'appointment_cancelled', 'profile_updated']),
            'description' => fake()->sentence(8),
            'type' => fake()->randomElement(['appointment', 'results', 'prescription', 'other']),
        ];
    }
}


<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Appointment>
 */
class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    public function definition(): array
    {
        $patient = User::factory()->create(['role' => 'patient']);
        $doctorUser = User::factory()->create(['role' => 'doctor']);
        $doctor = Doctor::factory()->create(['user_id' => $doctorUser->id]);

        return [
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'date' => fake()->dateTimeBetween('now', '+30 days')->format('Y-m-d'),
            'time' => fake()->randomElement(['09:00', '09:30', '10:00', '10:30', '11:00']),
            'status' => 'upcoming',
            'type' => 'in-person',
            'reason' => fake()->optional()->sentence(6),
        ];
    }
}


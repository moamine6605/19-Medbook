<?php

namespace Database\Factories;

use App\Models\Doctor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Doctor>
 */
class DoctorFactory extends Factory
{
    protected $model = Doctor::class;

    private static array $specialties = [
        'Cardiologue',
        'Neurologue',
        'Pédiatre',
        'Dermatologue',
        'Orthopédiste',
        'Ophtalmologue',
        'ORL',
        'Gynécologue',
        'Urologue',
        'Pneumologue',
        'Gastro-entérologue',
        'Rhumatologue',
        'Endocrinologue',
        'Psychiatre',
        'Chirurgien',
        'Médecin généraliste',
        'Radiologue',
        'Anesthésiste',
        'Oncologue',
        'Néphrologue',
    ];

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        $experienceYears = fake()->numberBetween(2, 30);

        return [
            'name' => 'Dr. ' . fake()->firstName() . ' ' . fake()->lastName(),
            'specialty' => fake()->randomElement(self::$specialties),
            'rating' => fake()->randomFloat(1, 3.5, 5.0),
            'reviews' => fake()->numberBetween(10, 500),
            'experience' => $experienceYears . ' ans',
            'is_featured' => false,
        ];
    }

    /**
     * Mark the doctor as featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
            'rating' => fake()->randomFloat(1, 4.5, 5.0),
            'reviews' => fake()->numberBetween(150, 500),
        ]);
    }
}

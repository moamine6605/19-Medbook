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
        User::factory()->count(1000)->create([
            'role' => 'patient',
        ]);
    }
}

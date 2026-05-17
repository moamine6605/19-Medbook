<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Create admin user accounts.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@demo.com'],
            [
                'name' => 'Administrateur Medbook',
                'password' => Hash::make('demo123'),
                'role' => 'admin',
            ]
        );
    }
}

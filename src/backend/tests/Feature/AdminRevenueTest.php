<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminRevenueTest extends TestCase
{
    use RefreshDatabase;

    public function test_completed_appointments_add_200_euros_to_admin_revenue(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-05-23 10:00:00'));

        $admin = User::factory()->create(['role' => 'admin']);
        $patient = User::factory()->create(['role' => 'patient']);
        $doctorUser = User::factory()->create(['role' => 'doctor']);
        $doctor = Doctor::factory()->create(['user_id' => $doctorUser->id]);

        Appointment::factory()->count(2)->sequence(
            ['time' => '09:00'],
            ['time' => '09:30'],
        )->create([
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'date' => '2026-05-20',
            'status' => 'completed',
        ]);

        Appointment::factory()->create([
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'date' => '2026-05-21',
            'time' => '10:00',
            'status' => 'upcoming',
        ]);

        $this->actingAs($admin)
            ->getJson('/api/admin/stats')
            ->assertOk()
            ->assertJsonPath('revenue', '400 €');

        Carbon::setTestNow();
    }

    public function test_revenue_analytics_uses_200_euros_per_completed_appointment(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-05-23 10:00:00'));

        $admin = User::factory()->create(['role' => 'admin']);
        $patient = User::factory()->create(['role' => 'patient']);
        $doctorUser = User::factory()->create(['role' => 'doctor']);
        $doctor = Doctor::factory()->create(['user_id' => $doctorUser->id]);

        Appointment::factory()->count(3)->sequence(
            ['time' => '09:00'],
            ['time' => '09:30'],
            ['time' => '10:00'],
        )->create([
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'date' => '2026-05-10',
            'status' => 'completed',
        ]);

        $response = $this->actingAs($admin)
            ->getJson('/api/admin/analytics/revenue')
            ->assertOk();

        $this->assertSame(600, collect($response->json())->firstWhere('month', 'Mai')['revenue']);

        Carbon::setTestNow();
    }
}

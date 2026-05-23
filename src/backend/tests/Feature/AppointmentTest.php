<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Doctor;
use App\Models\Appointment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AppointmentTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test appointment can be created
     */
    public function test_appointment_can_be_created()
    {
        $patient = User::factory()->create(['role' => 'patient']);
        $doctor_user = User::factory()->create(['role' => 'doctor']);
        $doctor = Doctor::factory()->create(['user_id' => $doctor_user->id]);

        $appointment = Appointment::create([
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'date' => '2026-05-25',
            'time' => '10:00',
            'status' => 'upcoming',
            'type' => 'in-person',
            'reason' => 'Regular checkup',
        ]);

        $this->assertDatabaseHas('appointments', [
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'status' => 'upcoming',
        ]);
    }

    /**
     * Test appointment belongs to patient
     */
    public function test_appointment_belongs_to_patient()
    {
        $patient = User::factory()->create(['role' => 'patient']);
        $doctor_user = User::factory()->create(['role' => 'doctor']);
        $doctor = Doctor::factory()->create(['user_id' => $doctor_user->id]);

        $appointment = Appointment::factory()->create([
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
        ]);

        $this->assertTrue($appointment->patient()->exists());
        $this->assertEquals($patient->id, $appointment->patient->id);
    }

    /**
     * Test appointment belongs to doctor
     */
    public function test_appointment_belongs_to_doctor()
    {
        $patient = User::factory()->create(['role' => 'patient']);
        $doctor_user = User::factory()->create(['role' => 'doctor']);
        $doctor = Doctor::factory()->create(['user_id' => $doctor_user->id]);

        $appointment = Appointment::factory()->create([
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
        ]);

        $this->assertTrue($appointment->doctor()->exists());
        $this->assertEquals($doctor->id, $appointment->doctor->id);
    }

    /**
     * Test appointment date casting
     */
    public function test_appointment_date_is_cast_correctly()
    {
        $appointment = Appointment::factory()->create([
            'date' => '2026-05-25',
        ]);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $appointment->date);
        $this->assertEquals('2026-05-25', $appointment->date->format('Y-m-d'));
    }

    /**
     * Test appointment statuses
     */
    public function test_appointment_can_have_different_statuses()
    {
        $statuses = ['upcoming', 'in-progress', 'completed', 'cancelled'];

        foreach ($statuses as $status) {
            $appointment = Appointment::factory()->create(['status' => $status]);
            $this->assertEquals($status, $appointment->status);
        }
    }

    /**
     * Test appointment types
     */
    public function test_appointment_can_have_different_types()
    {
        $types = ['in-person', 'video'];

        foreach ($types as $type) {
            $appointment = Appointment::factory()->create(['type' => $type]);
            $this->assertEquals($type, $appointment->type);
        }
    }

    /**
     * Test appointment with reason
     */
    public function test_appointment_can_have_reason()
    {
        $appointment = Appointment::factory()->create([
            'reason' => 'Back pain and headaches',
        ]);

        $this->assertEquals('Back pain and headaches', $appointment->reason);
    }
}

<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Appointment;
use App\Models\Prescription;
use App\Models\PatientActivity;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class UserModelTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * Test user creation
     */
    public function test_user_can_be_created()
    {
        $user = User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'role' => 'patient',
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
            'role' => 'patient',
        ]);
    }

    /**
     * Test user relationships
     */
    public function test_user_has_many_appointments()
    {
        $user = User::factory()->create();
        $appointments = Appointment::factory()->count(3)->create(['patient_id' => $user->id]);

        $this->assertTrue($user->appointments->count() === 3);
        $this->assertTrue($user->appointments->first()->patient_id === $user->id);
    }

    /**
     * Test user has prescriptions
     */
    public function test_user_has_many_prescriptions()
    {
        $user = User::factory()->create();
        $prescriptions = Prescription::factory()->count(2)->create(['patient_id' => $user->id]);

        $this->assertTrue($user->prescriptions->count() === 2);
    }

    /**
     * Test user has activities
     */
    public function test_user_has_many_activities()
    {
        $user = User::factory()->create();
        $activities = PatientActivity::factory()->count(5)->create(['patient_id' => $user->id]);

        $this->assertTrue($user->activities->count() === 5);
    }

    /**
     * Test password is hashed
     */
    public function test_user_password_is_hashed()
    {
        $user = User::factory()->create([
            'password' => 'plaintext-password',
        ]);

        $this->assertNotEquals('plaintext-password', $user->password);
    }

    /**
     * Test user attributes
     */
    public function test_user_has_required_attributes()
    {
        $user = User::factory()->create([
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'blood_type' => 'O+',
        ]);

        $this->assertEquals('Jane Doe', $user->name);
        $this->assertEquals('jane@example.com', $user->email);
        $this->assertEquals('O+', $user->blood_type);
    }
}

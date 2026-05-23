<?php

namespace Tests\Unit;

use App\Models\Doctor;
use App\Models\User;
use App\Models\Appointment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DoctorModelTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test doctor creation
     */
    public function test_doctor_can_be_created()
    {
        $user = User::factory()->create(['role' => 'doctor']);
        
        $doctor = Doctor::factory()->create([
            'name' => 'Dr. Smith',
            'specialty' => 'Cardiology',
            'user_id' => $user->id,
        ]);

        $this->assertDatabaseHas('doctors', [
            'name' => 'Dr. Smith',
            'specialty' => 'Cardiology',
            'user_id' => $user->id,
        ]);
    }

    /**
     * Test doctor belongs to user
     */
    public function test_doctor_belongs_to_user()
    {
        $user = User::factory()->create(['role' => 'doctor']);
        $doctor = Doctor::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($doctor->user()->exists());
        $this->assertEquals($user->id, $doctor->user->id);
    }

    /**
     * Test doctor has many appointments
     */
    public function test_doctor_has_many_appointments()
    {
        $user = User::factory()->create(['role' => 'doctor']);
        $doctor = Doctor::factory()->create(['user_id' => $user->id]);
        
        Appointment::factory()->count(4)->create(['doctor_id' => $doctor->id]);

        $this->assertEquals(4, $doctor->appointments->count());
    }

    /**
     * Test doctor attributes with casting
     */
    public function test_doctor_attributes_are_cast_correctly()
    {
        $doctor = Doctor::factory()->create([
            'rating' => 4.5,
            'reviews' => 42,
            'is_featured' => true,
        ]);

        $this->assertIsFloat($doctor->rating);
        $this->assertIsInt($doctor->reviews);
        $this->assertIsBool($doctor->is_featured);
        $this->assertEquals(4.5, $doctor->rating);
    }

    /**
     * Test doctor fillable attributes
     */
    public function test_doctor_fillable_attributes()
    {
        $attributes = [
            'name' => 'Dr. Johnson',
            'specialty' => 'Neurology',
            'rating' => 4.8,
            'reviews' => 56,
            'experience' => 10,
            'phone' => '1234567890',
            'address' => '123 Medical St',
            'bio' => 'Experienced neurologist',
            'is_featured' => false,
        ];

        $doctor = Doctor::factory()->create($attributes);

        foreach ($attributes as $key => $value) {
            $this->assertEquals($value, $doctor->$key);
        }
    }

    /**
     * Test doctor status field
     */
    public function test_doctor_can_have_status()
    {
        $doctor = Doctor::factory()->create(['status' => 'actif']);

        $this->assertEquals('actif', $doctor->status);
    }
}

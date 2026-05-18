<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\DoctorSlot;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DoctorSlotSeeder extends Seeder
{
    public function run(): void
    {
        $times = [
            '08:00', '08:30',
            '09:00', '09:30', '10:00', '10:30',
            '11:00', '11:30', '14:00', '14:30',
            '15:00', '15:30', '16:00', '16:30',
            '17:00',
        ];

        $start = Carbon::today();
        $days = 14;

        // Keep this seed light: only doctors that have a linked user account (i.e. can log in),
        // plus the featured ones. This avoids creating hundreds of thousands of rows locally.
        $query = Doctor::query()
            ->where(function ($q) {
                $q->whereNotNull('user_id')->orWhere('is_featured', true);
            })
            ->limit(50);

        $query->chunk(50, function ($doctors) use ($times, $start, $days) {
            foreach ($doctors as $doctor) {
                for ($i = 0; $i < $days; $i++) {
                    $date = $start->copy()->addDays($i)->toDateString();
                    foreach ($times as $time) {
                        DoctorSlot::firstOrCreate([
                            'doctor_id' => $doctor->id,
                            'date' => $date,
                            'time' => $time,
                        ]);
                    }
                }
            }
        });
    }
}

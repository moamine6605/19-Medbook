<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\DoctorSlot;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DoctorAvailabilityController extends Controller
{
    /**
     * Availability for a specific doctor and date.
     * Returns slot list with booked/available flags so the frontend can disable booked slots.
     */
    public function forDoctor(Doctor $doctor, Request $request)
    {
        $request->validate([
            'date' => ['required', 'date_format:Y-m-d'],
        ]);

        $date = Carbon::parse($request->query('date'))->toDateString();

        $slots = DoctorSlot::where('doctor_id', $doctor->id)
            ->whereDate('date', $date)
            ->orderBy('time')
            ->get();

        $bookedTimes = Appointment::where('doctor_id', $doctor->id)
            ->whereDate('date', $date)
            ->pluck('time')
            ->all();

        $booked = array_fill_keys($bookedTimes, true);

        return response()->json(
            $slots->map(fn (DoctorSlot $slot) => [
                'time' => $slot->time,
                'booked' => (bool) ($booked[$slot->time] ?? false),
                'available' => !($booked[$slot->time] ?? false),
            ])->values()
        );
    }
}


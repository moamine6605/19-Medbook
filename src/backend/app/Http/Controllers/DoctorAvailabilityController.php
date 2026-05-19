<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DoctorAvailabilityController extends Controller
{
    private const BLOCKING_STATUSES = ['upcoming', 'in-progress'];

    private const DEFAULT_TIMES = [
        '08:00', '08:30',
        '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30',
        '14:00', '14:30',
        '15:00', '15:30',
        '16:00', '16:30',
        '17:00',
    ];

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

        $bookedTimes = Appointment::where('doctor_id', $doctor->id)
            ->whereDate('date', $date)
            ->whereIn('status', self::BLOCKING_STATUSES)
            ->pluck('time')
            ->all();

        $booked = array_fill_keys($bookedTimes, true);

        return response()->json(
            collect(self::DEFAULT_TIMES)->map(fn (string $time) => [
                'time' => $time,
                'booked' => (bool) ($booked[$time] ?? false),
                'available' => !($booked[$time] ?? false),
            ])->values()
        );
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Support\SlotPolicy;

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

        if ($doctor->status !== 'actif' || $doctor->archivedRecord()->exists()) {
            return response()->json([
                'message' => 'Médecin indisponible.',
            ], Response::HTTP_NOT_FOUND);
        }

        $date = Carbon::parse($request->query('date'))->toDateString();

        $allowedTimes = SlotPolicy::allowedTimesForDoctorDate($doctor->id, $date);

        $bookedTimes = Appointment::where('doctor_id', $doctor->id)
            ->whereDate('date', $date)
            ->whereIn('status', SlotPolicy::BLOCKING_STATUSES)
            ->pluck('time')
            ->all();

        $booked = array_fill_keys($bookedTimes, true);

        return response()->json(
            collect($allowedTimes)->map(fn (string $time) => [
                'time' => $time,
                'booked' => (bool) ($booked[$time] ?? false),
                'available' => !($booked[$time] ?? false),
            ])->values()
        );
    }
}

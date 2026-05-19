<?php

namespace App\Support;

use App\Models\DoctorSlot;
use Illuminate\Support\Facades\Schema;

final class SlotPolicy
{
    /**
     * Business rule: a slot blocks booking as long as the appointment is not finished/cancelled.
     */
    public const BLOCKING_STATUSES = ['upcoming', 'in-progress'];

    /**
     * Default cabinet schedule if the doctor has not configured custom slots for the date.
     */
    public const DEFAULT_TIMES = [
        '08:00', '08:30',
        '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30',
        '14:00', '14:30',
        '15:00', '15:30',
        '16:00', '16:30',
        '17:00',
    ];

    /**
     * Returns the list of *allowed* times for a given doctor and date.
     *
     * Rule:
     * - If the doctor configured slots for that date (doctor_slots rows exist), only those are allowed.
     * - Otherwise, fall back to DEFAULT_TIMES.
     */
    public static function allowedTimesForDoctorDate(int $doctorId, string $date): array
    {
        if (Schema::hasTable('doctor_slots')) {
            $times = DoctorSlot::where('doctor_id', $doctorId)
                ->whereDate('date', $date)
                ->orderBy('time')
                ->pluck('time')
                ->all();

            if (count($times) > 0) {
                return $times;
            }
        }

        return self::DEFAULT_TIMES;
    }
}


<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\DoctorSlot;
use App\Support\SlotPolicy;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class DoctorSelfController extends Controller
{
    public function profile(Request $request)
    {
        $doctor = $this->doctorFor($request);

        return response()->json([
            'id' => $doctor->id,
            'name' => $doctor->name,
            'specialty' => $doctor->specialty,
            'experience' => $doctor->experience,
            'phone' => Schema::hasColumn('doctors', 'phone') ? $doctor->phone : null,
            'address' => Schema::hasColumn('doctors', 'address') ? $doctor->address : null,
            'bio' => Schema::hasColumn('doctors', 'bio') ? $doctor->bio : null,
            'rating' => $doctor->rating,
            'reviews' => $doctor->reviews,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $doctor = $this->doctorFor($request);

        $rules = [
            'specialty' => ['nullable', 'string', 'max:255'],
            'experience' => ['nullable', 'string', 'max:255'],
        ];

        // These columns may not exist if migrations haven't been run in the current DB.
        if (Schema::hasColumn('doctors', 'phone')) {
            $rules['phone'] = ['nullable', 'string', 'max:30'];
        }
        if (Schema::hasColumn('doctors', 'address')) {
            $rules['address'] = ['nullable', 'string', 'max:255'];
        }
        if (Schema::hasColumn('doctors', 'bio')) {
            $rules['bio'] = ['nullable', 'string', 'max:2000'];
        }

        $data = $request->validate($rules);

        $doctor->fill(array_filter($data, fn ($v) => $v !== null));
        $doctor->save();

        return response()->json(['message' => 'Profil mis à jour.']);
    }

    public function slots(Request $request)
    {
        $doctor = $this->doctorFor($request);

        if (!Schema::hasTable('doctor_slots')) {
            return response()->json([], Response::HTTP_OK);
        }

        $request->validate([
            'date' => ['nullable', 'date_format:Y-m-d'],
        ]);

        $query = DoctorSlot::where('doctor_id', $doctor->id)->orderBy('date')->orderBy('time');
        if ($request->filled('date')) {
            $query->whereDate('date', $request->query('date'));
        }

        return response()->json(
            $query->get()->map(fn (DoctorSlot $slot) => [
                'id' => $slot->id,
                'date' => $slot->date->format('Y-m-d'),
                'time' => $slot->time,
            ])
        );
    }

    public function addSlot(Request $request)
    {
        $doctor = $this->doctorFor($request);

        if (!Schema::hasTable('doctor_slots')) {
            abort(Response::HTTP_SERVICE_UNAVAILABLE, 'Slots table missing. Run migrations.');
        }

        $data = $request->validate([
            'date' => ['required', 'date_format:Y-m-d'],
            'time' => ['required', 'string', 'regex:/^\\d{2}:\\d{2}$/'],
        ]);

        $date = Carbon::parse($data['date'])->toDateString();
        $time = $data['time'];

        $slot = DoctorSlot::firstOrCreate([
            'doctor_id' => $doctor->id,
            'date' => $date,
            'time' => $time,
        ]);

        return response()->json([
            'id' => $slot->id,
            'date' => $slot->date->format('Y-m-d'),
            'time' => $slot->time,
        ], Response::HTTP_CREATED);
    }

    public function deleteSlot(Request $request, DoctorSlot $slot)
    {
        $doctor = $this->doctorFor($request);

        if (!Schema::hasTable('doctor_slots')) {
            abort(Response::HTTP_SERVICE_UNAVAILABLE, 'Slots table missing. Run migrations.');
        }

        if ($slot->doctor_id !== $doctor->id) {
            abort(Response::HTTP_FORBIDDEN, 'Not your slot.');
        }

        // Don’t allow deleting a slot that is already booked.
        $booked = Appointment::where('doctor_id', $doctor->id)
            ->whereDate('date', $slot->date)
            ->where('time', $slot->time)
            ->whereIn('status', SlotPolicy::BLOCKING_STATUSES)
            ->exists();

        if ($booked) {
            return response()->json([
                'message' => 'Créneau déjà réservé.',
            ], Response::HTTP_CONFLICT);
        }

        $slot->delete();

        return response()->json(['message' => 'Créneau supprimé.']);
    }

    private function doctorFor(Request $request): Doctor
    {
        $user = $request->user();
        if (!$user || $user->role !== 'doctor') {
            abort(Response::HTTP_FORBIDDEN, 'Doctor access required.');
        }

        $doctor = Doctor::where('user_id', $user->id)->firstOrFail();
        if ($doctor->status === 'desactive') {
            abort(Response::HTTP_FORBIDDEN, 'Compte médecin désactivé.');
        }

        return $doctor;
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\DoctorSlot;
use Carbon\Carbon;
use Illuminate\Http\Request;
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
            'phone' => $doctor->phone,
            'address' => $doctor->address,
            'bio' => $doctor->bio,
            'rating' => $doctor->rating,
            'reviews' => $doctor->reviews,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $doctor = $this->doctorFor($request);

        $data = $request->validate([
            'specialty' => ['nullable', 'string', 'max:255'],
            'experience' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:2000'],
        ]);

        $doctor->fill(array_filter($data, fn ($v) => $v !== null));
        $doctor->save();

        return response()->json(['message' => 'Profil mis à jour.']);
    }

    public function slots(Request $request)
    {
        $doctor = $this->doctorFor($request);

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

        if ($slot->doctor_id !== $doctor->id) {
            abort(Response::HTTP_FORBIDDEN, 'Not your slot.');
        }

        // Don’t allow deleting a slot that is already booked.
        $booked = Appointment::where('doctor_id', $doctor->id)
            ->whereDate('date', $slot->date)
            ->where('time', $slot->time)
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

        return Doctor::where('user_id', $user->id)->firstOrFail();
    }
}


<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Appointment $appointment)
    {
        $this->appointment->loadMissing('doctor:id,name,specialty', 'patient:id,name,email');
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Confirmation de rendez-vous - Medbook'
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.appointment_confirmation',
            with: [
                'appointment' => $this->appointment,
                'doctor' => $this->appointment->doctor,
                'patient' => $this->appointment->patient,
            ],
        );
    }
}


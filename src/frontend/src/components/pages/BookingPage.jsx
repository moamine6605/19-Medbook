import { useState } from 'react';
import { Search, ChevronLeft, Check } from 'lucide-react';
import '../../styles/pages/BookingPage.css';
import {Card, CardContent, CardHeader, CardTitle} from "../ui/card.jsx";
import {Avatar} from "../ui/avatar.jsx";
import {Button} from "../ui/button.jsx";

export function BookingPage({ onBookingComplete }) {
    const [step, setStep] = useState(1);
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const specialties = [
        { id: 'cardiology', name: 'Cardiologie', icon: '❤️', count: 45 },
        { id: 'neurology', name: 'Neurologie', icon: '🧠', count: 32 },
        { id: 'pediatrics', name: 'Pédiatrie', icon: '👶', count: 28 },
        { id: 'dermatology', name: 'Dermatologie', icon: '✨', count: 38 },
        { id: 'orthopedics', name: 'Orthopédie', icon: '🦴', count: 41 },
        { id: 'general', name: 'Médecine générale', icon: '🏥', count: 52 }
    ];

    const doctors = [
        {
            id: '1',
            name: 'Dr. Sarah Johnson',
            specialty: 'Cardiologue',
            rating: 4.9,
            reviews: 234,
            experience: '15 ans',
            availability: 'Disponible aujourd\'hui'
        },
        {
            id: '2',
            name: 'Dr. Michael Chen',
            specialty: 'Cardiologue',
            rating: 4.8,
            reviews: 189,
            experience: '12 ans',
            availability: 'Disponible demain'
        },
        {
            id: '3',
            name: 'Dr. Emily Williams',
            specialty: 'Cardiologue',
            rating: 5.0,
            reviews: 312,
            experience: '10 ans',
            availability: 'Disponible aujourd\'hui'
        }
    ];

    const generateCalendarDays = () => {
        const days = [];
        const today = new Date();
        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dayStr = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][date.getDay()];
            days.push({
                date: date.toISOString().split('T')[0],
                day: dayStr,
                dayNum: date.getDate()
            });
        }
        return days;
    };

    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30'
    ];

    const handleNext = () => {
        if (step < 4) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleComplete = () => {
        onBookingComplete?.();
    };

    return (
        <div className="booking-container">
            <div className="booking-content">
                {/* Progress Steps */}
                <div className="booking-progress">
                    <div className="booking-steps">
                        {[1, 2, 3, 4].map((num) => (
                            <div key={num} className="booking-step">
                                <div className={`booking-step-circle ${step >= num ? 'active' : 'inactive'}`}>
                                    {step > num ? <Check size={20} /> : num}
                                </div>
                                {num < 4 && (
                                    <div className={`booking-step-line ${step > num ? 'active' : 'inactive'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="booking-step-label-container">
            <span className="booking-step-label">
              {step === 1 && 'Spécialité'}
                {step === 2 && 'Médecin'}
                {step === 3 && 'Date & Heure'}
                {step === 4 && 'Confirmer'}
            </span>
                    </div>
                </div>

                {/* Step 1: Select Specialty */}
                {step === 1 && (
                    <div>
                        <Card className="booking-card">
                            <CardHeader>
                                <CardTitle className="booking-title">Sélectionnez une spécialité</CardTitle>
                                <p className="booking-subtitle">Choisissez le type de médecin dont vous avez besoin</p>
                            </CardHeader>
                            <CardContent>
                                <div className="booking-grid-3">
                                    {specialties.map((specialty) => (
                                        <button
                                            key={specialty.id}
                                            onClick={() => {
                                                setSelectedSpecialty(specialty.id);
                                                handleNext();
                                            }}
                                            className={`booking-specialty-btn ${selectedSpecialty === specialty.id ? 'selected' : ''}`}
                                        >
                                            <div className="booking-specialty-icon">{specialty.icon}</div>
                                            <h3 className="booking-specialty-name">{specialty.name}</h3>
                                            <p className="booking-specialty-count">{specialty.count} médecins disponibles</p>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Step 2: Choose Doctor */}
                {step === 2 && (
                    <div>
                        <Card className="booking-card">
                            <CardHeader>
                                <CardTitle className="booking-title">Choisissez votre médecin</CardTitle>
                                <p className="booking-subtitle">Sélectionnez parmi nos meilleurs spécialistes</p>
                                <div className="booking-search-wrapper">
                                    <Search className="booking-search-icon" size={20} />
                                    <Input placeholder="Rechercher un médecin..." className="booking-search-input" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="booking-doctor-list">
                                    {doctors.map((doctor) => (
                                        <div
                                            key={doctor.id}
                                            onClick={() => {
                                                setSelectedDoctor(doctor.id);
                                                handleNext();
                                            }}
                                            className={`booking-doctor-card ${selectedDoctor === doctor.id ? 'selected' : ''}`}
                                        >
                                            <Avatar name={doctor.name} size="lg" />
                                            <div className="booking-doctor-info">
                                                <h3 className="booking-doctor-name">{doctor.name}</h3>
                                                <p className="booking-doctor-specialty">{doctor.specialty}</p>
                                                <div className="booking-doctor-stats">
                          <span className="booking-doctor-rating">
                            ⭐ {doctor.rating} ({doctor.reviews} avis)
                          </span>
                                                    <span className="text-muted">{doctor.experience} d'expérience</span>
                                                </div>
                                            </div>
                                            <Badge variant="success">{doctor.availability}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Step 3: Select Date & Time */}
                {step === 3 && (
                    <div>
                        <Card className="booking-card">
                            <CardHeader>
                                <CardTitle className="booking-title">Choisissez la date et l'heure</CardTitle>
                                <p className="booking-subtitle">Choisissez votre créneau préféré</p>
                            </CardHeader>
                            <CardContent>
                                <div className="booking-calendar-section">
                                    <h4 className="booking-section-title">Sélectionnez la date</h4>
                                    <div className="booking-calendar-scroll">
                                        {generateCalendarDays().map((day) => (
                                            <button
                                                key={day.date}
                                                onClick={() => setSelectedDate(day.date)}
                                                className={`booking-date-btn ${selectedDate === day.date ? 'selected' : ''}`}
                                            >
                                                <div className="booking-date-day">{day.day}</div>
                                                <div className="booking-date-num">{day.dayNum}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {selectedDate && (
                                    <div>
                                        <h4 className="booking-section-title">Sélectionnez l'heure</h4>
                                        <div className="booking-grid-3">
                                            {timeSlots.map((time) => (
                                                <button
                                                    key={time}
                                                    onClick={() => {
                                                        setSelectedTime(time);
                                                        handleNext();
                                                    }}
                                                    className={`booking-time-btn ${selectedTime === time ? 'selected' : ''}`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Step 4: Confirmation */}
                {step === 4 && (
                    <div>
                        <Card className="booking-card">
                            <CardHeader>
                                <CardTitle className="booking-title">Confirmez votre rendez-vous</CardTitle>
                                <p className="booking-subtitle">Veuillez vérifier les détails de votre réservation</p>
                            </CardHeader>
                            <CardContent>
                                <div className="booking-confirmation-container">
                                    <div className="booking-summary">
                                        <div className="booking-summary-doctor">
                                            <Avatar name="Dr. Sarah Johnson" size="lg" />
                                            <div>
                                                <h3 className="booking-doctor-name">Dr. Sarah Johnson</h3>
                                                <p className="booking-doctor-specialty">Cardiologue</p>
                                            </div>
                                        </div>
                                        <div className="booking-grid-2 booking-summary-details">
                                            <div>
                                                <p className="booking-summary-label">Date</p>
                                                <p className="booking-summary-value">{selectedDate}</p>
                                            </div>
                                            <div>
                                                <p className="booking-summary-label">Heure</p>
                                                <p className="booking-summary-value">{selectedTime}</p>
                                            </div>
                                            <div>
                                                <p className="booking-summary-label">Type</p>
                                                <p className="booking-summary-value">Consultation en personne</p>
                                            </div>
                                            <div>
                                                <p className="booking-summary-label">Durée</p>
                                                <p className="booking-summary-value">30 minutes</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="booking-actions">
                                        <Button variant="outline" onClick={handleBack}>Retour</Button>
                                        <Button onClick={handleComplete}>Confirmer le rendez-vous</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {step < 4 && step > 1 && (
                    <div className="booking-nav">
                        <Button variant="outline" onClick={handleBack}>
                            <ChevronLeft size={16} className="booking-nav-icon" /> Retour
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';
import { Search, ChevronLeft, Check } from 'lucide-react';
import { getSpecialties, getDoctorsBySpecialty, createAppointment, getDoctorAvailability } from '../../services/api';
import { useToast } from '../ui/useToast.js';
import '../../styles/pages/BookingPage.css';

function getInitials(name = 'User') {
  return name.split(' ').filter(Boolean).map((part) => part[0]).join('').substring(0, 2).toUpperCase();
}




export function BookingPage({ isAuthenticated, onBookingComplete, embedded = false }) {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedSpecialtyName, setSelectedSpecialtyName] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [availability, setAvailability] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  // Fetch specialties on mount
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const data = await getSpecialties();
        setSpecialties(data);
      } catch (error) {
        console.error('Erreur lors du chargement des spécialités:', error);
      } finally {
        setLoadingSpecialties(false);
      }
    };
    fetchSpecialties();
  }, []);

  // Fetch doctors when specialty is selected
  const handleSpecialtySelect = async (specialty) => {
    setSelectedSpecialty(specialty.id);
    setSelectedSpecialtyName(specialty.name);
    setLoadingDoctors(true);
    setStep(2);
    try {
      const data = await getDoctorsBySpecialty(specialty.name);
      setDoctors(data);
    } catch (error) {
      console.error('Erreur lors du chargement des médecins:', error);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const filteredDoctors = searchQuery
    ? doctors.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : doctors;

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

  const loadAvailability = async (date) => {
    if (!selectedDoctor?.id || !date) return;
    setLoadingAvailability(true);
    try {
      const data = await getDoctorAvailability(selectedDoctor.id, date);
      setAvailability(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Erreur lors du chargement des disponibilités:', e);
      setAvailability([]);
    } finally {
      setLoadingAvailability(false);
    }
  };


  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    if (!isAuthenticated) {
      onBookingComplete?.();
      return;
    }

    if (!selectedDoctor?.id || !selectedDate || !selectedTime) {
      toast.error("Veuillez sélectionner un médecin, une date et une heure.");
      setStep(1);
      return;
    }

    try {
      await createAppointment({
        doctor_id: selectedDoctor?.id,
        date: selectedDate,
        time: selectedTime,
        type: 'in-person'
      });
      onBookingComplete?.();
    } catch (error) {
      console.error("Erreur lors de la création du rendez-vous:", error);
      const status = error?.response?.status;
      const msg = error?.response?.data?.message;
      if (status === 409) {
        toast.error(msg || "Ce créneau est déjà réservé. Veuillez en choisir un autre.");
        await loadAvailability(selectedDate);
        setStep(3);
        return;
      }
      toast.error(msg || "Une erreur est survenue lors de la réservation. Veuillez réessayer.");
    }
  };

  return (
    <div className={["booking-container", embedded ? "booking-container-embedded" : ""].filter(Boolean).join(" ")}>
            <div className="booking-content">
                {/* Progress Steps */}
                <div className="booking-progress">
                    <div className="booking-steps">
                        {[1, 2, 3, 4].map((num) =>
            <div key={num} className="booking-step">
                                <div className={`booking-step-circle ${step >= num ? 'active' : 'inactive'}`}>
                                    {step > num ? <Check size={20} /> : num}
                                </div>
                                {num < 4 &&
              <div className={`booking-step-line ${step > num ? 'active' : 'inactive'}`} />
              }
                            </div>
            )}
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
                {step === 1 &&
        <div>
                        <div className={["card", "booking-card"].filter(Boolean).join(" ")}>
                            <div className={["card-header", "flex", "flex-col", "gap-2"].filter(Boolean).join(" ")}>
                                <h3 className={["card-title", "booking-title"].filter(Boolean).join(" ")}>Sélectionnez une spécialité</h3>
                                <p className="booking-subtitle">Choisissez le type de médecin dont vous avez besoin</p>
                            </div>
                            <div className={["card-content"].filter(Boolean).join(" ")}>
                                {loadingSpecialties ? (
                                    <p className="text-muted" style={{ textAlign: 'center', padding: '3rem 0' }}>
                                        Chargement des spécialités...
                                    </p>
                                ) : (
                                    <div className="booking-grid-3">
                                        {specialties.map((specialty) =>
                    <button
                      key={specialty.id}
                      onClick={() => handleSpecialtySelect(specialty)}
                      className={`booking-specialty-btn ${selectedSpecialty === specialty.id ? 'selected' : ''}`}>
                      
                                                <div className="booking-specialty-icon">{specialty.icon}</div>
                                                <h3 className="booking-specialty-name">{specialty.name}</h3>
                                                <p className="booking-specialty-count">{specialty.count} médecins disponibles</p>
                                            </button>
                    )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
        }

                {/* Step 2: Choose Doctor */}
                {step === 2 &&
        <div>
                        <div className={["card", "booking-card"].filter(Boolean).join(" ")}>
                            <div className={["card-header", "flex", "flex-col", "gap-2"].filter(Boolean).join(" ")}>
                                <h3 className={["card-title", "booking-title"].filter(Boolean).join(" ")}>Choisissez votre médecin</h3>
                                <p className="booking-subtitle">Sélectionnez parmi nos meilleurs spécialistes en {selectedSpecialtyName}</p>
                                <div className="booking-search-wrapper">
                                    <Search className="booking-search-icon" size={20} />
                                    <input
                                        className={["input", "booking-search-input"].filter(Boolean).join(" ")}
                                        placeholder="Rechercher un médecin..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className={["card-content"].filter(Boolean).join(" ")}>
                                {loadingDoctors ? (
                                    <p className="text-muted" style={{ textAlign: 'center', padding: '3rem 0' }}>
                                        Chargement des médecins...
                                    </p>
                                ) : filteredDoctors.length > 0 ? (
                                    <div className="booking-doctor-list">
                                        {filteredDoctors.map((doctor) =>
                    <div
                      key={doctor.id}
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        setSelectedDate('');
                        setSelectedTime('');
                        setAvailability([]);
                        handleNext();
                      }}
                      className={`booking-doctor-card ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}>
                      
                                                <div className={["avatar", "avatar-lg"].filter(Boolean).join(" ")}>{getInitials(doctor.name)}</div>
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
                                                <span className="badge badge-success">{doctor.availability}</span>
                                            </div>
                    )}
                                    </div>
                                ) : (
                                    <p className="text-muted" style={{ textAlign: 'center', padding: '3rem 0' }}>
                                        Aucun médecin trouvé.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
        }

                {/* Step 3: Select Date & Time */}
                {step === 3 &&
        <div>
                        <div className={["card", "booking-card"].filter(Boolean).join(" ")}>
                            <div className={["card-header", "flex", "flex-col", "gap-2"].filter(Boolean).join(" ")}>
                                <h3 className={["card-title", "booking-title"].filter(Boolean).join(" ")}>Choisissez la date et l'heure</h3>
                                <p className="booking-subtitle">Choisissez votre créneau préféré</p>
                            </div>
                            <div className={["card-content"].filter(Boolean).join(" ")}>
                                <div className="booking-calendar-section">
                                    <h4 className="booking-section-title">Sélectionnez la date</h4>
                                    <div className="booking-calendar-scroll">
                                        {generateCalendarDays().map((day) =>
                  <button
                    key={day.date}
                    onClick={() => {
                      setSelectedDate(day.date);
                      setSelectedTime('');
                      loadAvailability(day.date);
                    }}
                    className={`booking-date-btn ${selectedDate === day.date ? 'selected' : ''}`}>
                    
                                                <div className="booking-date-day">{day.day}</div>
                                                <div className="booking-date-num">{day.dayNum}</div>
                                            </button>
                  )}
                                    </div>
                                </div>

                {selectedDate &&
              <div>
                                        <h4 className="booking-section-title">Sélectionnez l'heure</h4>
                                        {loadingAvailability ? (
                                            <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>
                                                Chargement des créneaux...
                                            </p>
                                        ) : availability.length > 0 ? (
                                            <div className="booking-grid-3">
                                                {availability.map((slot) =>
                  <button
                    key={slot.time}
                    disabled={!!slot.booked}
                    onClick={() => {
                      if (slot.booked) return;
                      setSelectedTime(slot.time);
                      handleNext();
                    }}
                    className={`booking-time-btn ${selectedTime === slot.time ? 'selected' : ''} ${slot.booked ? 'disabled' : ''}`}>
                    
                                                    {slot.time}
                  </button>
                  )}
                                            </div>
                                        ) : (
                                            <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>
                                                Aucun créneau disponible pour cette date.
                                            </p>
                                        )}
                                    </div>
              }
                            </div>
                        </div>
                    </div>
        }

                {/* Step 4: Confirmation */}
                {step === 4 &&
        <div>
                        <div className={["card", "booking-card"].filter(Boolean).join(" ")}>
                            <div className={["card-header", "flex", "flex-col", "gap-2"].filter(Boolean).join(" ")}>
                                <h3 className={["card-title", "booking-title"].filter(Boolean).join(" ")}>Confirmez votre rendez-vous</h3>
                                <p className="booking-subtitle">Veuillez vérifier les détails de votre réservation</p>
                            </div>
                            <div className={["card-content"].filter(Boolean).join(" ")}>
                                <div className="booking-confirmation-container">
                                    <div className="booking-summary">
                                        <div className="booking-summary-doctor">
                                            <div className={["avatar", "avatar-lg"].filter(Boolean).join(" ")}>{getInitials(selectedDoctor?.name || '')}</div>
                                            <div>
                                                <h3 className="booking-doctor-name">{selectedDoctor?.name || ''}</h3>
                                                <p className="booking-doctor-specialty">{selectedDoctor?.specialty || ''}</p>
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
                                        <button type="button" className={["btn", "btn-outline"].filter(Boolean).join(" ")} onClick={handleBack}>Retour</button>
                                        <button type="button" className={["btn", "btn-primary"].filter(Boolean).join(" ")} onClick={handleComplete}>Confirmer le rendez-vous</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
        }

                {step < 4 && step > 1 &&
        <div className="booking-nav">
                        <button type="button" className={["btn", "btn-outline"].filter(Boolean).join(" ")} onClick={handleBack}>
                            <ChevronLeft size={16} className="booking-nav-icon" /> Retour
                        </button>
                    </div>
        }
            </div>
        </div>);

}

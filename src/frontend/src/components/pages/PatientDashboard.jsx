import { useState, useEffect } from 'react';
import { Calendar, Clock, TrendingUp, DollarSign, Plus } from 'lucide-react';
import { Sidebar } from '../Sidebar.jsx';
import { DashboardHeader } from '../DashboardHeader.jsx';
import { useToast } from '../ui/useToast.js';
import { onEvent } from '../../services/events.js';
import { BookingPage } from './BookingPage.jsx';
import {
  getPatientStats,
  getPatientAppointments,
  getPatientAppointmentsPast,
  getPatientActivity,
  getPatientProfile,
  updatePatientProfile,
  getDoctorAvailability,
  updateAppointment,
  deleteAppointment
} from '../../services/api';
import '../../styles/pages/Dashboard.css';

function getInitials(name = 'User') {
  return name.split(' ').filter(Boolean).map((part) => part[0]).join('').substring(0, 2).toUpperCase();
}

function getAppointmentStatus(dateStr, timeStr) {
  if (!dateStr) return { label: 'Inconnu', class: 'badge-default' };
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const [year, month, day] = dateStr.split('-').map(Number);
  const appDate = new Date(year, month - 1, day);
  
  const diffTime = appDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { label: "Manqué", class: "badge-danger", isMissed: true };
  } else if (diffDays === 0) {
    return { label: `Aujourd'hui à ${timeStr}`, class: "badge-warning", timeLeft: "Aujourd'hui" };
  } else if (diffDays === 1) {
    return { label: `Demain à ${timeStr}`, class: "badge-primary", timeLeft: "Demain" };
  } else {
    return { label: `Dans ${diffDays} jours`, class: "badge-success", timeLeft: `Dans ${diffDays} jours` };
  }
}

export function PatientDashboard({ onLogout, user, onHomeClick }) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState(() => {
    const allowed = new Set(['dashboard', 'appointments', 'history', 'profile']);
    const saved = localStorage.getItem('patient_active_tab');
    return allowed.has(saved) ? saved : 'dashboard';
  });
  const initialTab = activeTab;
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]); // upcoming
  const [pastAppointments, setPastAppointments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [appointmentsMode, setAppointmentsMode] = useState(() => {
    const v = localStorage.getItem('patient_appointments_mode');
    return v === 'book' ? 'book' : 'list';
  }); // list|book
  const [bookingKey, setBookingKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Edit State
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [availability, setAvailability] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const userName = user?.name || 'Utilisateur';

  // Persist selected tab across refreshes.
  useEffect(() => {
    localStorage.setItem('patient_active_tab', activeTab);
  }, [activeTab]);

  // One-shot: if we landed here with mode=book from a redirect, clear it after applying.
  useEffect(() => {
    if (appointmentsMode === 'book') {
      localStorage.removeItem('patient_appointments_mode');
    }
  }, [appointmentsMode]);

  const loadAvailability = async (doctorId, date) => {
    if (!doctorId || !date) {
      setAvailability([]);
      return;
    }
    setAvailabilityLoading(true);
    try {
      const res = await getDoctorAvailability(doctorId, date);
      setAvailability(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error('Erreur availability:', e);
      setAvailability([]);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const loadData = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    try {
      const [statsData, appointmentsData, pastAppointmentsData, activityData] = await Promise.all([
        getPatientStats(),
        getPatientAppointments(),
        getPatientAppointmentsPast(),
        getPatientActivity(),
      ]);
      setStats(statsData);
      setAppointments(appointmentsData);
      setPastAppointments(pastAppointmentsData);
      setActivities(activityData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const fetchInitialData = async () => {
      try {
        const [statsData, appointmentsData, pastAppointmentsData, activityData] = await Promise.all([
          getPatientStats(),
          getPatientAppointments(),
          getPatientAppointmentsPast(),
          getPatientActivity(),
        ]);
        if (active) {
          setStats(statsData);
          setAppointments(appointmentsData);
          setPastAppointments(pastAppointmentsData);
          setActivities(activityData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement initial des données:', error);
      }
      // If the user is on the profile tab on first load, fetch profile too.
      try {
        if (active && initialTab === 'profile') {
          const data = await getPatientProfile();
          setProfile(data);
        }
      } catch (e) {
        console.error('Erreur profile patient initial:', e);
      }
      if (active) setLoading(false);
    };

    fetchInitialData();

    return () => {
      active = false;
    };
  }, [initialTab]);

  const loadProfile = async () => {
    setProfileLoading(true);
    try {
      const data = await getPatientProfile();
      setProfile(data);
    } catch (e) {
      console.error('Erreur profile patient:', e);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };


  // Keep patient UI consistent when appointments change elsewhere (admin creates, doctor completes).
  useEffect(() => {
    const off = onEvent('patient:appointments:changed', () => {
      loadData(false);
    });
    return () => off();
  }, []);

  // Handle sidebar tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'profile') loadProfile();
    if (tabId !== 'appointments') {
      setAppointmentsMode('list');
      localStorage.setItem('patient_appointments_mode', 'list');
    }
  };

  const handleStartEdit = (appointment) => {
    setEditingAppointmentId(appointment.id);
    setEditingDoctorId(appointment.doctor_id);
    setEditDate(appointment.date);
    setEditTime(appointment.time);
    loadAvailability(appointment.doctor_id, appointment.date);
  };

  const handleSaveEdit = async (appointmentId) => {
    if (!editDate || !editTime) {
      toast.error("Veuillez sélectionner une date et une heure valides.");
      return;
    }
    try {
      await updateAppointment(appointmentId, {
        date: editDate,
        time: editTime
      });
      setEditingAppointmentId(null);
      setEditingDoctorId(null);
      setAvailability([]);
      await loadData();
    } catch (error) {
      console.error("Erreur lors de la modification de l'appointment:", error);
      const msg = error?.response?.data?.message;
      toast.error(msg || "Une erreur est survenue lors de la modification. Veuillez réessayer.");
    }
  };

  const handleDeleteClick = async (appointmentId) => {
    const ok = await toast.confirm('Etes-vous sur de vouloir annuler ce rendez-vous ?', {
      title: 'Annuler le rendez-vous',
      confirmLabel: 'Annuler',
      cancelLabel: 'Retour',
      confirmVariant: 'danger',
      cancelVariant: 'outline',
    });
    if (!ok) return;
    try {
      await deleteAppointment(appointmentId);
      await loadData();
    } catch (error) {
      console.error("Erreur lors de l'annulation de l'appointment:", error);
      const msg = error?.response?.data?.message;
      toast.error(msg || "Une erreur est survenue lors de l'annulation. Veuillez réessayer.");
    }
  };

  const statCards = [
    {
      title: 'Rendez-vous à venir',
      value: stats ? String(stats.upcoming_appointments) : '...',
      icon: Calendar,
      color: 'var(--primary)',
      bgColor: 'rgba(37, 99, 235, 0.1)'
    },
    {
      title: 'Visites terminées',
      value: stats ? String(stats.completed_visits) : '...',
      icon: Clock,
      color: 'var(--success)',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Score de santé',
      value: stats ? stats.health_score + '%' : '...',
      icon: TrendingUp,
      color: 'var(--secondary)',
      bgColor: 'rgba(6, 182, 212, 0.1)'
    },
    {
      title: 'Factures à payer',
      // Pas de fonctionnalite de paiement: valeur informative toujours a 0.
      value: stats ? String(stats.bills_to_pay ?? 0) : '...',
      icon: DollarSign,
      color: 'var(--warning)',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    }
  ];

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userRole="patient"
        user={user}
        onLogout={onLogout}
        onHomeClick={onHomeClick}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <div className="main-content">
        <DashboardHeader
          title={activeTab === 'appointments' ? "Mes rendez-vous" : activeTab === 'profile' ? "Mon profil" : activeTab === 'history' ? "Mon historique" : "Tableau de bord"}
          subtitle={activeTab === 'appointments' ? "Gérez et reprogrammez vos consultations médicales" : `Bon retour, ${userName.split(' ')[0]} !`}
          user={user}
          onLogout={onLogout}
          onHomeClick={onHomeClick}
          notifications={activities}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {activeTab === 'dashboard' && (
          <>
            <div className="dashboard-stats-grid-2">
              {statCards.map((stat) => (
                <div className="card" key={stat.title}>
                  <div className="card-content dashboard-stat-card-content">
                    <div>
                      <p className="text-muted dashboard-stat-title">{stat.title}</p>
                      <p className="dashboard-stat-value">{stat.value}</p>
                    </div>
                    <div className="dashboard-stat-icon-wrapper" style={{ backgroundColor: stat.bgColor }}>
                      <stat.icon style={{ color: stat.color }} size={24} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="dashboard-main-grid">
              <div>
                <div className="card dashboard-margin-bottom">
                  <div className="card-header flex flex-col gap-2 dashboard-card-header-flex">
                    <h3 className="card-title">Rendez-vous à venir</h3>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        localStorage.setItem('patient_active_tab', 'appointments');
                        localStorage.setItem('patient_appointments_mode', 'book');
                        setActiveTab('appointments');
                        setBookingKey((k) => k + 1);
                        setAppointmentsMode('book');
                      }}
                    >
                      <Plus size={16} className="dashboard-btn-icon" />
                      Nouveau
                    </button>
                  </div>
                  <div className="card-content">
                    <div className="dashboard-appointment-list">
                      {loading ? (
                        <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>
                          Chargement des rendez-vous...
                        </p>
                      ) : appointments.length > 0 ? (
                        appointments.slice(0, 3).map((appointment) => {
                          const statusInfo = getAppointmentStatus(appointment.date, appointment.time);
                          return (
                            <div key={appointment.id} className="dashboard-appointment-item">
                              <div className="avatar avatar-lg">{getInitials(appointment.doctor)}</div>
                              <div className="dashboard-appointment-info">
                                <div className="dashboard-appointment-header">
                                  <h4 className="dashboard-appointment-doctor">{appointment.doctor}</h4>
                                  <span className="badge badge-primary">{appointment.type === 'video' ? '📹 Vidéo' : '🏥 En personne'}</span>
                                </div>
                                <p className="text-muted dashboard-appointment-specialty">{appointment.specialty}</p>
                                <div className="dashboard-appointment-meta" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                                  <span className="dashboard-appointment-meta-item"><Calendar size={14} /> {appointment.date}</span>
                                  <span className="dashboard-appointment-meta-item"><Clock size={14} /> {appointment.time}</span>
                                  <span className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600 }}>({statusInfo.label})</span>
                                </div>
                              </div>
                              <div className="dashboard-appointment-actions">
                                <button
                                  type="button"
                                  className="btn btn-outline"
                                  onClick={() => handleTabChange('appointments')}
                                >Gérer</button>
                                <button
                                  type="button"
                                  className="btn btn-ghost"
                                  style={{ color: 'var(--destructive)' }}
                                  onClick={() => handleDeleteClick(appointment.id)}
                                >Annuler</button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>
                          Aucun rendez-vous à venir.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions rapides removed for a simpler dashboard. */}
              </div>

              <div>
                <div className="card dashboard-full-height-card">
                  <div className="card-header flex flex-col gap-2">
                    <h3 className="card-title">Activité récente</h3>
                  </div>
                  <div className="card-content">
                    <div className="dashboard-activity-list">
                      {loading ? (
                        <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>
                          Chargement...
                        </p>
                      ) : activities.length > 0 ? (
                        activities.map((activity) => (
                          <div key={activity.id} className="dashboard-activity-item">
                            <div className="dashboard-activity-content">
                              <div className="dashboard-activity-dot"></div>
                              <div className="dashboard-activity-info">
                                <h4 className="dashboard-activity-title">{activity.action}</h4>
                                <p className="text-muted dashboard-activity-desc">{activity.description}</p>
                                <p className="dashboard-activity-time">{activity.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>
                          Aucune activité récente.
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-full dashboard-margin-top"
                      onClick={() => loadData()}
                    >
                      Voir toute l'activité
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'appointments' && (
          <div className="card">
            <div className="card-header flex flex-col gap-2 dashboard-card-header-flex" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 className="card-title">Tous mes rendez-vous</h3>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Visualisez, reprogrammez ou annulez vos rendez-vous médicaux.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={["btn", appointmentsMode === 'list' ? "btn-primary" : "btn-outline"].filter(Boolean).join(" ")}
                  onClick={() => setAppointmentsMode('list')}
                >
                  Mes rendez-vous
                </button>
                <button
                  type="button"
                  className={["btn", appointmentsMode === 'book' ? "btn-primary" : "btn-outline"].filter(Boolean).join(" ")}
                  onClick={() => { setBookingKey((k) => k + 1); setAppointmentsMode('book'); }}
                >
                  <Plus size={16} className="dashboard-btn-icon" />
                  Nouveau rendez-vous
                </button>
              </div>
            </div>
            <div className="card-content">
              {appointmentsMode === 'book' ? (
                <BookingPage
                  key={bookingKey}
                  embedded
                  isAuthenticated
                  onBookingComplete={async () => {
                    setAppointmentsMode('list');
                    await loadData();
                  }}
                />
              ) : (
                <div className="dashboard-appointment-list">
                  {loading ? (
                    <p className="text-muted" style={{ textAlign: 'center', padding: '3rem 0' }}>
                      Chargement de vos rendez-vous...
                    </p>
                  ) : appointments.length > 0 ? (
                    appointments.map((appointment) => {
                      const statusInfo = getAppointmentStatus(appointment.date, appointment.time);
                      const isEditing = editingAppointmentId === appointment.id;

                      return (
                        <div key={appointment.id} className="dashboard-appointment-item" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--background)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div className="avatar avatar-lg">{getInitials(appointment.doctor)}</div>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                  <h4 className="dashboard-appointment-doctor" style={{ margin: 0 }}>{appointment.doctor}</h4>
                                  <span className={`badge ${statusInfo.class}`} style={{ fontSize: '0.75rem' }}>
                                    {statusInfo.isMissed ? '❌ ' : '📅 '} {statusInfo.label}
                                  </span>
                                </div>
                                <p className="text-muted dashboard-appointment-specialty" style={{ margin: '0.25rem 0 0 0' }}>{appointment.specialty}</p>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>
                                {appointment.type === 'video' ? '📹 En ligne' : '🏥 Cabinet'}
                              </span>
                            </div>
                          </div>

                          {isEditing ? (
                            <div style={{ background: 'var(--muted)', padding: '1rem', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)' }}>
                              <h5 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600 }}>Reporter le rendez-vous</h5>
                              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--muted-foreground)' }}>Choisir une date</label>
                                  <input
                                    type="date"
                                    className="form-control"
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
                                    value={editDate}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => {
                                      const next = e.target.value;
                                      setEditDate(next);
                                      loadAvailability(editingDoctorId, next);
                                    }}
                                  />
                                </div>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--muted-foreground)' }}>Choisir une heure</label>
                                  <select
                                    className="form-control"
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
                                    value={editTime}
                                    onChange={(e) => setEditTime(e.target.value)}
                                    disabled={availabilityLoading || availability.length === 0}
                                  >
                                    {availabilityLoading ? (
                                      <option value={editTime}>{editTime || 'Chargement...'}</option>
                                    ) : availability.length === 0 ? (
                                      <option value={editTime}>{editTime || 'Aucune disponibilite'}</option>
                                    ) : (
                                      availability.map((slot) => (
                                        <option key={slot.time} value={slot.time} disabled={slot.booked}>
                                          {slot.time}{slot.booked ? ' (Indisponible)' : ''}
                                        </option>
                                      ))
                                    )}
                                  </select>
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-end' }}>
                                <button
                                  type="button"
                                  className="btn btn-outline"
                                  onClick={() => {
                                    setEditingAppointmentId(null);
                                    setEditingDoctorId(null);
                                    setAvailability([]);
                                  }}
                                >
                                  Annuler
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() => handleSaveEdit(appointment.id)}
                                >
                                  Enregistrer
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                              <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}><Calendar size={16} /> {appointment.date}</span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}><Clock size={16} /> {appointment.time}</span>
                              </div>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                  type="button"
                                  className="btn btn-outline"
                                  onClick={() => handleStartEdit(appointment)}
                                >
                                  Modifier la date
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-ghost"
                                  style={{ color: 'var(--destructive)', background: 'rgba(239, 68, 68, 0.05)' }}
                                  onClick={() => handleDeleteClick(appointment.id)}
                                >
                                  Annuler
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                      <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Vous n'avez aucun rendez-vous planifié.</p>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => { setBookingKey((k) => k + 1); setAppointmentsMode('book'); }}
                      >
                        Prendre un rendez-vous
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="card">
            <div className="card-header flex flex-col gap-2 dashboard-card-header-flex" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 className="card-title">Historique des rendez-vous</h3>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Consultez vos rendez-vous passés.</p>
              </div>
            </div>
            <div className="card-content">
              {loading ? (
                <p className="text-muted" style={{ textAlign: 'center', padding: '3rem 0' }}>
                  Chargement...
                </p>
              ) : pastAppointments.length > 0 ? (
                <div className="dashboard-appointment-list">
                  {pastAppointments.map((appointment) => (
                    <div key={appointment.id} className="dashboard-appointment-item" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '1rem', background: 'var(--background)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div className="avatar avatar-lg">{getInitials(appointment.doctor)}</div>
                          <div>
                            <h4 className="dashboard-appointment-doctor" style={{ margin: 0 }}>{appointment.doctor}</h4>
                            <p className="text-muted dashboard-appointment-specialty" style={{ margin: '0.25rem 0 0 0' }}>{appointment.specialty}</p>
                          </div>
                        </div>
                        <span className="badge badge-default" style={{ textTransform: 'capitalize' }}>
                          {appointment.status === 'completed' ? 'Terminé' : appointment.status}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--muted-foreground)', fontSize: '0.875rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}><Calendar size={16} /> {appointment.date}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}><Clock size={16} /> {appointment.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                  <p className="text-muted">Aucun rendez-vous passé.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="card">
            <div className="card-header flex flex-col gap-2 dashboard-card-header-flex" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 className="card-title">Mon profil</h3>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Mettez a jour vos informations personnelles.</p>
              </div>
            </div>
            <div className="card-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {profileLoading ? (
                <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0', gridColumn: '1 / -1' }}>Chargement...</p>
              ) : !profile ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem 0' }}>
                  <p className="text-muted">Impossible de charger votre profil.</p>
                  <button type="button" className="btn btn-outline" onClick={loadProfile}>Reessayer</button>
                </div>
              ) : (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--muted-foreground)' }}>Nom complet</label>
                    <input
                      className="form-control"
                      value={profile.name || ''}
                      onChange={(e) => setProfile((p) => ({ ...(p || {}), name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--muted-foreground)' }}>Email</label>
                    <input className="form-control" value={profile.email || ''} disabled />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--muted-foreground)' }}>Date de naissance</label>
                    <input
                      type="date"
                      className="form-control"
                      value={profile.birth_date || ''}
                      onChange={(e) => setProfile((p) => ({ ...(p || {}), birth_date: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--muted-foreground)' }}>Groupe sanguin</label>
                    <select
                      className="form-control"
                      value={profile.blood_type || ''}
                      onChange={(e) => setProfile((p) => ({ ...(p || {}), blood_type: e.target.value }))}
                    >
                      <option value="">-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--muted-foreground)' }}>Adresse</label>
                    <input
                      className="form-control"
                      placeholder="Votre adresse"
                      value={profile.address || ''}
                      onChange={(e) => setProfile((p) => ({ ...(p || {}), address: e.target.value }))}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button type="button" className="btn btn-outline" onClick={loadProfile} disabled={profileSaving}>
                      Recharger
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={profileSaving || !profile.name}
                      onClick={async () => {
                        setProfileSaving(true);
                        try {
                          const res = await updatePatientProfile({
                            name: profile.name,
                            birth_date: profile.birth_date || null,
                            blood_type: profile.blood_type || null,
                            address: profile.address || null,
                          });
                          toast.success(res?.message || 'Profil mis a jour.');
                          await loadProfile();
                        } catch (e) {
                          console.error(e);
                          const msg = e?.response?.data?.message;
                          toast.error(msg || 'Impossible de mettre a jour le profil.');
                        } finally {
                          setProfileSaving(false);
                        }
                      }}
                    >
                      Enregistrer
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

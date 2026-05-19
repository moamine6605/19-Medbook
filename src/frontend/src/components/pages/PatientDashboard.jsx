import { useState, useEffect } from 'react';
import { Calendar, Clock, TrendingUp, Heart, Plus, Search } from 'lucide-react';
import { Sidebar } from '../Sidebar.jsx';
import { DashboardHeader } from '../DashboardHeader.jsx';
import { useToast } from '../ui/useToast.js';
import {
  getPatientStats,
  getPatientAppointments,
  getPatientAppointmentsPast,
  getPatientActivity,
  updateAppointment,
  deleteAppointment
} from '../../services/api';
import '../../styles/pages/Dashboard.css';

function getInitials(name = 'User') {
  return name.split(' ').filter(Boolean).map((part) => part[0]).join('').substring(0, 2).toUpperCase();
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30'
];

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

export function PatientDashboard({ onLogout, user, onHomeClick, onNavigate }) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]); // upcoming
  const [pastAppointments, setPastAppointments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');

  const userName = user?.name || 'Utilisateur';

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
          setLoading(false);
        }
      } catch (error) {
        console.error('Erreur lors du chargement initial des données:', error);
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchInitialData();

    return () => {
      active = false;
    };
  }, []);

  // Handle sidebar tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleStartEdit = (appointment) => {
    setEditingAppointmentId(appointment.id);
    setEditDate(appointment.date);
    setEditTime(appointment.time);
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
      await loadData();
    } catch (error) {
      console.error("Erreur lors de la modification de l'appointment:", error);
      toast.error("Une erreur est survenue lors de la modification. Veuillez réessayer.");
    }
  };

  const handleDeleteClick = async (appointmentId) => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) {
      try {
        await deleteAppointment(appointmentId);
        await loadData();
      } catch (error) {
        console.error("Erreur lors de l'annulation de l'appointment:", error);
        toast.error("Une erreur est survenue lors de l'annulation. Veuillez réessayer.");
      }
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
      title: 'Ordonnances actives',
      value: stats ? String(stats.active_prescriptions) : '...',
      icon: Heart,
      color: 'var(--warning)',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    }
  ];

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} userRole="patient" user={user} onLogout={onLogout} onHomeClick={onHomeClick} />

      <div className="main-content">
        <DashboardHeader
          title={activeTab === 'appointments' ? "Mes rendez-vous" : activeTab === 'profile' ? "Mon profil" : activeTab === 'history' ? "Mon historique" : "Tableau de bord"}
          subtitle={activeTab === 'appointments' ? "Gérez et reprogrammez vos consultations médicales" : `Bon retour, ${userName.split(' ')[0]} !`}
          user={user}
          onLogout={onLogout}
          onHomeClick={onHomeClick}
          notifications={activities}
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
                      onClick={() => onNavigate?.('/booking')}
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

                <div className="card">
                  <div className="card-header flex flex-col gap-2">
                    <h3 className="card-title">Actions rapides</h3>
                  </div>
                  <div className="card-content">
                    <div className="dashboard-actions-grid">
                      <button className="dashboard-action-btn" onClick={() => onNavigate?.('/booking')}>
                        <div className="dashboard-action-icon-wrapper" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}>
                          <Calendar color="var(--primary)" size={24} />
                        </div>
                        <span className="dashboard-action-label">Prendre rendez-vous</span>
                      </button>
                      <button className="dashboard-action-btn" onClick={() => onNavigate?.('/booking')}>
                        <div className="dashboard-action-icon-wrapper" style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)' }}>
                          <Search color="var(--secondary)" size={24} />
                        </div>
                        <span className="dashboard-action-label">Trouver un médecin</span>
                      </button>
                      <button className="dashboard-action-btn" onClick={() => setActiveTab('dashboard')}>
                        <div className="dashboard-action-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                          <Heart color="var(--success)" size={24} />
                        </div>
                        <span className="dashboard-action-label">Dossiers médicaux</span>
                      </button>
                      <button className="dashboard-action-btn" onClick={() => setActiveTab('dashboard')}>
                        <div className="dashboard-action-icon-wrapper" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                          <Clock color="var(--warning)" size={24} />
                        </div>
                        <span className="dashboard-action-label">Ordonnances</span>
                      </button>
                    </div>
                  </div>
                </div>
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
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onNavigate?.('/booking')}
              >
                <Plus size={16} className="dashboard-btn-icon" />
                Nouveau rendez-vous
              </button>
            </div>
            <div className="card-content">
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
                                  onChange={(e) => setEditDate(e.target.value)}
                                />
                              </div>
                              <div style={{ flex: 1, minWidth: '200px' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--muted-foreground)' }}>Choisir une heure</label>
                                <select
                                  className="form-control"
                                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
                                  value={editTime}
                                  onChange={(e) => setEditTime(e.target.value)}
                                >
                                  {timeSlots.map((slot) => (
                                    <option key={slot} value={slot}>{slot}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-end' }}>
                              <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => setEditingAppointmentId(null)}
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
                      onClick={() => onNavigate?.('/booking')}
                    >
                      Prendre mon premier rendez-vous
                    </button>
                  </div>
                )}
              </div>
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
      </div>
    </div>
  );
}

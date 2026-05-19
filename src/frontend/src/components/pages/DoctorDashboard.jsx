import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Users, TrendingUp, Video, MapPin } from 'lucide-react';
import { Sidebar } from '../Sidebar.jsx';
import { DashboardHeader } from '../DashboardHeader.jsx';
import { useToast } from '../ui/useToast.js';
import { onEvent } from '../../services/events.js';
import {
  getDoctorStats,
  getDoctorTodayAppointments,
  getDoctorAppointments,
  updateDoctorAppointmentStatus,
  getDoctorRecentPatients,
  getDoctorMonthlySummary,
  getDoctorPatientsAll,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorSlots,
  addDoctorSlot,
  deleteDoctorSlot
} from '../../services/api';
import '../../styles/pages/Dashboard.css';

function getInitials(name = 'User') {
  return name.split(' ').filter(Boolean).map((part) => part[0]).join('').substring(0, 2).toUpperCase();
}




export function DoctorDashboard({ onLogout, user, onHomeClick }) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [appointmentsScope, setAppointmentsScope] = useState('today'); // today|upcoming|past|all
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [recentPatients, setRecentPatients] = useState([]);
  const [patientsAll, setPatientsAll] = useState([]);
  const [patientsQuery, setPatientsQuery] = useState('');
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [slotsDate, setSlotsDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [newSlotTime, setNewSlotTime] = useState('09:00');

  const userName = user?.name || 'Docteur';

  const activeTabRef = useRef(activeTab);
  const appointmentsScopeRef = useRef(appointmentsScope);
  const slotsDateRef = useRef(slotsDate);
  const patientsQueryRef = useRef(patientsQuery);

  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);
  useEffect(() => { appointmentsScopeRef.current = appointmentsScope; }, [appointmentsScope]);
  useEffect(() => { slotsDateRef.current = slotsDate; }, [slotsDate]);
  useEffect(() => { patientsQueryRef.current = patientsQuery; }, [patientsQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, appointmentsData, patientsData, summaryData] = await Promise.all([
          getDoctorStats(),
          getDoctorTodayAppointments(),
          getDoctorRecentPatients(),
          getDoctorMonthlySummary(),
        ]);
        setStats(statsData);
        setTodayAppointments(appointmentsData);
        setRecentPatients(patientsData);
        setMonthlySummary(summaryData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Keep doctor UI consistent when data changes elsewhere (admin/patient actions).
  useEffect(() => {
    const offs = [];

    offs.push(onEvent('doctor:appointments:changed', () => {
      refreshDashboardData();
      if (activeTabRef.current === 'appointments') {
        loadAppointments(appointmentsScopeRef.current);
      }
      if (activeTabRef.current === 'patients') {
        loadPatientsAll();
      }
    }));

    offs.push(onEvent('doctor:slots:changed', () => {
      if (activeTabRef.current === 'schedule') {
        loadSlots(slotsDateRef.current);
      }
    }));

    offs.push(onEvent('doctor:profile:changed', () => {
      if (activeTabRef.current === 'profile') {
        loadProfile();
      }
    }));

    return () => offs.forEach((off) => off());
  }, []);

  async function refreshDashboardData() {
    try {
      const [statsData, appointmentsData, patientsData, summaryData] = await Promise.all([
        getDoctorStats(),
        getDoctorTodayAppointments(),
        getDoctorRecentPatients(),
        getDoctorMonthlySummary(),
      ]);
      setStats(statsData);
      setTodayAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      setRecentPatients(Array.isArray(patientsData) ? patientsData : []);
      setMonthlySummary(summaryData || null);
    } catch (e) {
      console.error('Erreur refresh today', e);
    }
  }

  async function afterAppointmentStatusChange(newStatus) {
    // Keep all tabs consistent after a mutation.
    await refreshDashboardData();

    // If appointments tab data is present (or user is on it), refresh it.
    if (activeTab === 'appointments' || appointments.length > 0) {
      await loadAppointments(appointmentsScope);
    }

    // Patients tab is based on completed appointments; refresh it after completion.
    if (newStatus === 'completed' && (activeTab === 'patients' || patientsAll.length > 0)) {
      await loadPatientsAll();
    }
  }

  async function loadAppointments(scope) {
    setAppointmentsLoading(true);
    try {
      const data = await getDoctorAppointments({ scope });
      setAppointments(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Erreur appointments', e);
      setAppointments([]);
    } finally {
      setAppointmentsLoading(false);
    }
  }

  async function loadPatientsAll() {
    setPatientsLoading(true);
    try {
      const data = await getDoctorPatientsAll({ q: patientsQueryRef.current });
      setPatientsAll(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Erreur patients', e);
      setPatientsAll([]);
    } finally {
      setPatientsLoading(false);
    }
  }

  async function loadSlots(date) {
    setSlotsLoading(true);
    try {
      const data = await getDoctorSlots(date);
      setSlots(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Erreur slots', e);
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }

  async function loadProfile() {
    try {
      const data = await getDoctorProfile();
      setProfile(data);
    } catch (err) {
      console.error('Erreur profile', err);
    }
  }

  const handleTabChange = (nextTab) => {
    setActiveTab(nextTab);
    if (nextTab === 'profile') {
      loadProfile();
    }
    if (nextTab === 'appointments') {
      loadAppointments(appointmentsScope);
    }
    if (nextTab === 'patients') {
      loadPatientsAll();
    }
    if (nextTab === 'schedule') {
      loadSlots(slotsDate);
    }
  };

  const statCards = [
  {
    title: "Rendez-vous d'aujourd'hui",
    value: stats ? String(stats.today_appointments) : '...',
    change: stats ? stats.today_change : '',
    icon: Calendar,
    color: 'var(--primary)',
    bgColor: 'rgba(37, 99, 235, 0.1)'
  },
  {
    title: 'Total des patients',
    value: stats ? String(stats.total_patients) : '...',
    change: stats ? stats.new_patients_week : '',
    icon: Users,
    color: 'var(--secondary)',
    bgColor: 'rgba(6, 182, 212, 0.1)'
  },
  {
    title: 'Note moyenne',
    value: stats ? String(stats.rating) : '...',
    change: stats ? stats.rating_label : '',
    icon: TrendingUp,
    color: 'var(--success)',
    bgColor: 'rgba(16, 185, 129, 0.1)'
  },
  {
    title: 'Heures cette semaine',
    value: stats ? String(stats.hours_this_week) : '...',
    change: stats ? stats.hours_remaining : '',
    icon: Clock,
    color: 'var(--warning)',
    bgColor: 'rgba(245, 158, 11, 0.1)'
  }];


  return (
    <div className="app-container">
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} userRole="doctor" user={user} onLogout={onLogout} onHomeClick={onHomeClick} />

            <div className="main-content">
                <DashboardHeader
                    title="Tableau de bord du médecin"
                    subtitle={`Bonjour, ${userName} !`}
                    user={user}
                    onLogout={onLogout}
                    onHomeClick={onHomeClick}
                    notifications={todayAppointments.map(a => ({ id: a.id, action: `${a.patient} - ${a.time}`, description: a.reason, time: a.status === 'completed' ? 'Terminé' : a.status === 'in-progress' ? 'En cours' : 'À venir' }))}
                />

                {activeTab === 'dashboard' && (
                <>
                <div className="dashboard-stats-grid">
                    {statCards.map((stat) =>
          <div className={["card"].filter(Boolean).join(" ")} key={stat.title}>
                            <div className={["card-content", "dashboard-stat-card-content"].filter(Boolean).join(" ")}>
                                <div>
                                    <p className="text-muted dashboard-stat-title">{stat.title}</p>
                                    <p className="dashboard-stat-value" style={{ marginBottom: '0.25rem' }}>{stat.value}</p>
                                    <p className="text-muted" style={{ fontSize: '0.75rem', margin: 0 }}>{stat.change}</p>
                                </div>
                                <div className="dashboard-stat-icon-wrapper" style={{ backgroundColor: stat.bgColor }}>
                                    <stat.icon style={{ color: stat.color }} size={24} />
                                </div>
                            </div>
                        </div>
          )}
                </div>

                <div className="dashboard-main-grid">
                    <div>
                        <div className={["card"].filter(Boolean).join(" ")}>
                            <div className={["card-header", "flex", "flex-col", "gap-2", "dashboard-card-header-flex"].filter(Boolean).join(" ")}>
                                <h3 className={["card-title"].filter(Boolean).join(" ")}>Planning d'aujourd'hui</h3>
                                <span className="badge badge-primary">
                                    {loading ? '...' : `${todayAppointments.length} rendez-vous`}
                                </span>
                            </div>
                            <div className={["card-content"].filter(Boolean).join(" ")}>
                                <div className="dashboard-appointment-list">
                                    {loading ? (
                                        <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>
                                            Chargement du planning...
                                        </p>
                                    ) : todayAppointments.length > 0 ? (
                                        todayAppointments.map((appointment) =>
                                            <div key={appointment.id} className="dashboard-appointment-item">
                                                <div style={{ textAlign: 'center', minWidth: '5rem' }}>
                                                    <div className="text-muted" style={{ fontSize: '0.875rem' }}>{appointment.time}</div>
                                                    <span
                                                        className={`badge ${
                                                            appointment.status === 'completed' ?
                                                            'badge-success' :
                                                            appointment.status === 'in-progress' ?
                                                            'badge-warning' :
                                                            'badge-default'}`
                                                        }
                                                        style={{ marginTop: '0.25rem' }}>
                                                        {appointment.status === 'completed' ? 'Terminé' : appointment.status === 'in-progress' ? 'En cours' : 'À venir'}
                                                    </span>
                                                </div>
                                                <div className={["avatar", "avatar-lg"].filter(Boolean).join(" ")}>{getInitials(appointment.patient)}</div>
                                                <div className="dashboard-appointment-info">
                                                    <div className="dashboard-appointment-header">
                                                        <h4 className="dashboard-appointment-doctor">{appointment.patient}</h4>
                                                        {appointment.age && <span className="text-muted" style={{ fontSize: '0.875rem' }}>({appointment.age} ans)</span>}
                                                    </div>
                                                    <p className="text-muted dashboard-appointment-specialty" style={{ marginBottom: '0.5rem' }}>{appointment.reason}</p>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        {appointment.type === 'video' ? <Video size={16} color="var(--secondary)" /> : <MapPin size={16} color="var(--primary)" />}
                                                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>{appointment.type === 'video' ? 'Appel vidéo' : 'En personne'}</span>
                                                    </div>
                                                </div>
                                                    <div className="dashboard-appointment-actions">
                                                    {appointment.status === 'upcoming' && (
                                                      <button
                                                        type="button"
                                                        className={["btn", "btn-primary"].filter(Boolean).join(" ")}
                                                        onClick={async () => {
                                                          try {
                                                            await updateDoctorAppointmentStatus(appointment.id, 'in-progress');
                                                            await afterAppointmentStatusChange('in-progress');
                                                          } catch (e) {
                                                            console.error(e);
                                                            toast.error('Impossible de démarrer ce rendez-vous.');
                                                          }
                                                        }}
                                                      >
                                                        Démarrer
                                                      </button>
                                                    )}
                                                    {appointment.status === 'in-progress' && (
                                                      <button
                                                        type="button"
                                                        className={["btn", "btn-success"].filter(Boolean).join(" ")}
                                                        onClick={async () => {
                                                          try {
                                                            await updateDoctorAppointmentStatus(appointment.id, 'completed');
                                                            await afterAppointmentStatusChange('completed');
                                                          } catch (e) {
                                                            console.error(e);
                                                            toast.error('Impossible de terminer ce rendez-vous.');
                                                          }
                                                        }}
                                                      >
                                                        Terminer
                                                      </button>
                                                    )}
                                                    {appointment.status === 'completed' && <button type="button" className={["btn", "btn-outline"].filter(Boolean).join(" ")} disabled>Complété</button>}
                                                    </div>
                                            </div>
                                        )
                                    ) : (
                                        <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>
                                            Aucun rendez-vous aujourd'hui.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className={["card", "dashboard-margin-bottom"].filter(Boolean).join(" ")}>
                            <div className={["card-header", "flex", "flex-col", "gap-2"].filter(Boolean).join(" ")}>
                                <h3 className={["card-title"].filter(Boolean).join(" ")}>Patients récents</h3>
                            </div>
                            <div className={["card-content"].filter(Boolean).join(" ")}>
                                <div className="dashboard-patient-list">
                                    {loading ? (
                                        <p className="text-muted" style={{ textAlign: 'center', padding: '1rem 0' }}>
                                            Chargement...
                                        </p>
                                    ) : recentPatients.length > 0 ? (
                                        recentPatients.map((patient) =>
                                            <div key={patient.id} className="dashboard-patient-item">
                                                <div className={["avatar", "avatar-md"].filter(Boolean).join(" ")}>{getInitials(patient.name)}</div>
                                                <div className="dashboard-patient-info">
                                                    <p className="dashboard-patient-name">{patient.name}</p>
                                                    <p className="text-muted" style={{ fontSize: '0.75rem', margin: '0 0 0.25rem 0' }}>{patient.condition}</p>
                                                    <p className="text-muted" style={{ fontSize: '0.75rem', margin: 0 }}>{patient.last_visit}</p>
                                                </div>
                                            </div>
                                        )
                                    ) : (
                                        <p className="text-muted" style={{ textAlign: 'center', padding: '1rem 0' }}>
                                            Aucun patient récent.
                                        </p>
                                    )}
                                </div>
                                <button type="button" className={["btn", "btn-ghost", "btn-full", "dashboard-margin-top"].filter(Boolean).join(" ")}>
                                    Voir tous les patients
                                </button>
                            </div>
                        </div>

                        <div className={["card"].filter(Boolean).join(" ")} style={{ background: 'linear-gradient(to bottom right, var(--primary), var(--secondary))', color: 'white' }}>
                            <div className={["card-content"].filter(Boolean).join(" ")} style={{ paddingTop: '1.5rem' }}>
                                <h3 style={{ fontWeight: 500, marginBottom: '1rem' }}>Ce mois-ci</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ opacity: 0.9 }}>Patients vus</span>
                                        <span style={{ fontWeight: 'bold' }}>
                                            {monthlySummary ? monthlySummary.patients_seen : '...'}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ opacity: 0.9 }}>Temps d'attente moyen</span>
                                        <span style={{ fontWeight: 'bold' }}>
                                            {monthlySummary ? `${monthlySummary.avg_wait_time} min` : '...'}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ opacity: 0.9 }}>Satisfaction</span>
                                        <span style={{ fontWeight: 'bold' }}>
                                            {monthlySummary ? `${monthlySummary.satisfaction}%` : '...'}
                                        </span>
                                    </div>
                                </div>
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
                        <h3 className="card-title">Mes rendez-vous</h3>
                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>Gérez l’état de vos rendez-vous.</p>
                      </div>
                    </div>
                    <div className="card-content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {[
                          { id: 'today', label: "Aujourd'hui" },
                          { id: 'upcoming', label: 'À venir' },
                          { id: 'past', label: 'Terminés' },
                          { id: 'all', label: 'Tous' },
                        ].map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            className={["btn", appointmentsScope === t.id ? "btn-primary" : "btn-outline"].filter(Boolean).join(" ")}
                            onClick={() => {
                              setAppointmentsScope(t.id);
                              loadAppointments(t.id);
                            }}
                          >
                            {t.label}
                          </button>
                        ))}
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => loadAppointments(appointmentsScope)}
                          disabled={appointmentsLoading}
                        >
                          Actualiser
                        </button>
                      </div>

                      {appointmentsLoading ? (
                        <p className="text-muted" style={{ textAlign: 'center', padding: '1.5rem 0' }}>Chargement...</p>
                      ) : appointments.length === 0 ? (
                        <p className="text-muted" style={{ textAlign: 'center', padding: '1.5rem 0' }}>Aucun rendez-vous.</p>
                      ) : (
                        <div className="dashboard-table-container">
                          <table className="dashboard-table">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Heure</th>
                                <th>Patient</th>
                                <th>Type</th>
                                <th>Statut</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {appointments.map((a) => (
                                <tr key={a.id}>
                                  <td>{a.date}</td>
                                  <td>{a.time || '-'}</td>
                                  <td>{a.patient?.name || '-'}</td>
                                  <td className="text-muted">{a.type === 'video' ? 'Vidéo' : 'En personne'}</td>
                                  <td className="text-muted">
                                    {a.status === 'upcoming' ? 'Planifié' : a.status === 'in-progress' ? 'En cours' : a.status === 'completed' ? 'Complété' : a.status}
                                  </td>
                                  <td>
                                    {a.status === 'upcoming' ? (
                                      <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={async () => {
                                          try {
                                            await updateDoctorAppointmentStatus(a.id, 'in-progress');
                                            await afterAppointmentStatusChange('in-progress');
                                          } catch (e) {
                                            console.error(e);
                                            toast.error('Impossible de démarrer.');
                                          }
                                        }}
                                      >
                                        Démarrer
                                      </button>
                                    ) : a.status === 'in-progress' ? (
                                      <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={async () => {
                                          try {
                                            await updateDoctorAppointmentStatus(a.id, 'completed');
                                            await afterAppointmentStatusChange('completed');
                                          } catch (e) {
                                            console.error(e);
                                            toast.error('Impossible de terminer.');
                                          }
                                        }}
                                      >
                                        Terminer
                                      </button>
                                    ) : (
                                      <button type="button" className="btn btn-outline" disabled>OK</button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'patients' && (
                  <div className="card">
                    <div className="card-header flex flex-col gap-2 dashboard-card-header-flex" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                      <div>
                        <h3 className="card-title">Patients</h3>
                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>Tous les patients que vous avez vus (rendez-vous complétés).</p>
                      </div>
                    </div>
                    <div className="card-content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <input
                          className="input"
                          style={{ marginBottom: 0, minWidth: '240px', flex: 1 }}
                          placeholder="Rechercher un patient..."
                          value={patientsQuery}
                          onChange={(e) => setPatientsQuery(e.target.value)}
                        />
                        <button type="button" className="btn btn-primary" onClick={loadPatientsAll} disabled={patientsLoading}>
                          Rechercher
                        </button>
                      </div>

                      {patientsLoading ? (
                        <p className="text-muted" style={{ textAlign: 'center', padding: '1.5rem 0' }}>Chargement...</p>
                      ) : patientsAll.length === 0 ? (
                        <p className="text-muted" style={{ textAlign: 'center', padding: '1.5rem 0' }}>Aucun patient.</p>
                      ) : (
                        <div className="dashboard-table-container">
                          <table className="dashboard-table">
                            <thead>
                              <tr>
                                <th>Nom</th>
                                <th>Age</th>
                                <th>Visites</th>
                                <th>Derniere visite</th>
                              </tr>
                            </thead>
                            <tbody>
                              {patientsAll.map((p) => (
                                <tr key={p.id}>
                                  <td>{p.name}</td>
                                  <td className="text-muted">{p.age ?? '-'}</td>
                                  <td className="text-muted">{p.visits ?? 0}</td>
                                  <td className="text-muted">{p.last_visit || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'schedule' && (
                    <div className="card">
                        <div className="card-header flex flex-col gap-2 dashboard-card-header-flex" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <h3 className="card-title">Mes créneaux</h3>
                                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Ajoutez ou supprimez des créneaux. Ils deviennent visibles immédiatement côté patient.</p>
                            </div>
                        </div>
                        <div className="card-content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'end' }}>
                                <div style={{ minWidth: '220px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--muted-foreground)' }}>Date</label>
                                    <input
                                      type="date"
                                      className="form-control"
                                      value={slotsDate}
                                      onChange={(e) => {
                                        setSlotsDate(e.target.value);
                                        loadSlots(e.target.value);
                                      }}
                                    />
                                </div>
                                <div style={{ minWidth: '220px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--muted-foreground)' }}>Heure</label>
                                    <input
                                      type="time"
                                      className="form-control"
                                      value={newSlotTime}
                                      step={1800}
                                      onChange={(e) => setNewSlotTime(e.target.value)}
                                    />
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={async () => {
                                    try {
                                      await addDoctorSlot({ date: slotsDate, time: newSlotTime });
                                      await loadSlots(slotsDate);
                                    } catch (e) {
                                      console.error(e);
                                      toast.error("Impossible d'ajouter ce créneau (déjà existant ?).");
                                    }
                                  }}
                                >
                                  Ajouter
                                </button>
                            </div>

                            {slotsLoading ? (
                              <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>Chargement...</p>
                            ) : slots.length > 0 ? (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
                                  {slots.map((slot) => (
                                    <div key={slot.id} className="card" style={{ margin: 0 }}>
                                      <div className="card-content" style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                                        <span style={{ fontWeight: 600 }}>{slot.time}</span>
                                        <button
                                          type="button"
                                          className="btn btn-ghost"
                                          style={{ color: 'var(--destructive)', background: 'rgba(239, 68, 68, 0.05)' }}
                                          onClick={async () => {
                                            if (!window.confirm('Supprimer ce créneau ?')) return;
                                            try {
                                              await deleteDoctorSlot(slot.id);
                                              await loadSlots(slotsDate);
                                            } catch (e) {
                                              console.error(e);
                                              toast.error('Créneau déjà réservé.');
                                            }
                                          }}
                                        >
                                          Supprimer
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>Aucun créneau pour cette date.</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="card">
                        <div className="card-header flex flex-col gap-2 dashboard-card-header-flex" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <h3 className="card-title">Mon profil</h3>
                                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Mettez à jour votre spécialité et vos informations.</p>
                            </div>
                        </div>
                        <div className="card-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--muted-foreground)' }}>Spécialité</label>
                                <input className="form-control" value={profile?.specialty || ''} onChange={(e) => setProfile((p) => ({ ...(p || {}), specialty: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--muted-foreground)' }}>Expérience</label>
                                <input className="form-control" value={profile?.experience || ''} onChange={(e) => setProfile((p) => ({ ...(p || {}), experience: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--muted-foreground)' }}>Téléphone</label>
                                <input className="form-control" value={profile?.phone || ''} onChange={(e) => setProfile((p) => ({ ...(p || {}), phone: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--muted-foreground)' }}>Adresse</label>
                                <input className="form-control" value={profile?.address || ''} onChange={(e) => setProfile((p) => ({ ...(p || {}), address: e.target.value }))} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--muted-foreground)' }}>Bio</label>
                                <textarea className="form-control" rows={5} value={profile?.bio || ''} onChange={(e) => setProfile((p) => ({ ...(p || {}), bio: e.target.value }))} />
                            </div>
                            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  disabled={profileSaving}
                                  onClick={async () => {
                                    setProfileSaving(true);
                                    try {
                                      await updateDoctorProfile({
                                        specialty: profile?.specialty || null,
                                        experience: profile?.experience || null,
                                        phone: profile?.phone || null,
                                        address: profile?.address || null,
                                        bio: profile?.bio || null,
                                      });
                                      toast.success('Profil mis à jour.');
                                      await loadProfile();
                                    } catch (e) {
                                      console.error(e);
                                      toast.error('Erreur lors de la mise à jour.');
                                    } finally {
                                      setProfileSaving(false);
                                    }
                                  }}
                                >
                                  Enregistrer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>);

}

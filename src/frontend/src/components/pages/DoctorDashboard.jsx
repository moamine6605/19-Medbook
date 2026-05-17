import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, TrendingUp, Video, MapPin } from 'lucide-react';
import { Sidebar } from '../Sidebar.jsx';
import { DashboardHeader } from '../DashboardHeader.jsx';
import { getDoctorStats, getDoctorTodayAppointments, getDoctorRecentPatients, getDoctorMonthlySummary } from '../../services/api';
import '../../styles/pages/Dashboard.css';

function getInitials(name = 'User') {
  return name.split(' ').filter(Boolean).map((part) => part[0]).join('').substring(0, 2).toUpperCase();
}




export function DoctorDashboard({ onLogout, user, onHomeClick }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const userName = user?.name || 'Docteur';

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
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userRole="doctor" user={user} onLogout={onLogout} onHomeClick={onHomeClick} />

            <div className="main-content">
                <DashboardHeader
                    title="Tableau de bord du médecin"
                    subtitle={`Bonjour, ${userName} !`}
                    user={user}
                    onLogout={onLogout}
                    onHomeClick={onHomeClick}
                    notifications={todayAppointments.map(a => ({ id: a.id, action: `${a.patient} - ${a.time}`, description: a.reason, time: a.status === 'completed' ? 'Terminé' : a.status === 'in-progress' ? 'En cours' : 'À venir' }))}
                />

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
                                                    {appointment.status === 'upcoming' && <button type="button" className={["btn", "btn-primary"].filter(Boolean).join(" ")}>Démarrer</button>}
                                                    {appointment.status === 'in-progress' && <button type="button" className={["btn", "btn-success"].filter(Boolean).join(" ")}>Rejoindre</button>}
                                                    {appointment.status === 'completed' && <button type="button" className={["btn", "btn-outline"].filter(Boolean).join(" ")}>Notes</button>}
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
            </div>
        </div>);

}

import { useState, useEffect } from 'react';
import { Calendar, Clock, TrendingUp, Heart, Plus, Bell, Search } from 'lucide-react';
import { Sidebar } from '../Sidebar.jsx';
import { getPatientStats, getPatientAppointments, getPatientActivity } from '../../services/api';
import '../../styles/pages/Dashboard.css';

function getInitials(name = 'User') {
  return name.split(' ').filter(Boolean).map((part) => part[0]).join('').substring(0, 2).toUpperCase();
}




export function PatientDashboard({ onLogout, user, onHomeClick }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const userName = user?.name || 'Utilisateur';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, appointmentsData, activityData] = await Promise.all([
          getPatientStats(),
          getPatientAppointments(),
          getPatientActivity(),
        ]);
        setStats(statsData);
        setAppointments(appointmentsData);
        setActivities(activityData);
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
  }];


  return (
    <div className="app-container">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userRole="patient" user={user} onLogout={onLogout} onHomeClick={onHomeClick} />

            <div className="main-content">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Tableau de bord</h1>
                        <p className="text-muted">Bon retour, {userName.split(' ')[0]} !</p>
                    </div>
                    <div className="dashboard-user-actions">
                        <button type="button" className={["btn", "btn-ghost", "dashboard-bell-btn"].filter(Boolean).join(" ")}>
                            <Bell size={20} />
                            <span className="dashboard-notification-dot"></span>
                        </button>
                        <div className={["avatar", "avatar-md"].filter(Boolean).join(" ")}>{getInitials(userName)}</div>
                    </div>
                </div>

                <div className="dashboard-stats-grid-2">
                    {statCards.map((stat) =>
          <div className={["card"].filter(Boolean).join(" ")} key={stat.title}>
                            <div className={["card-content", "dashboard-stat-card-content"].filter(Boolean).join(" ")}>
                                <div>
                                    <p className="text-muted dashboard-stat-title">{stat.title}</p>
                                    <p className="dashboard-stat-value">{stat.value}</p>
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
                        <div className={["card", "dashboard-margin-bottom"].filter(Boolean).join(" ")}>
                            <div className={["card-header", "flex", "flex-col", "gap-2", "dashboard-card-header-flex"].filter(Boolean).join(" ")}>
                                <h3 className={["card-title"].filter(Boolean).join(" ")}>Rendez-vous à venir</h3>
                                <button type="button" className={["btn", "btn-primary"].filter(Boolean).join(" ")}>
                                    <Plus size={16} className="dashboard-btn-icon" />
                                    Nouveau
                                </button>
                            </div>
                            <div className={["card-content"].filter(Boolean).join(" ")}>
                                <div className="dashboard-appointment-list">
                                    {loading ? (
                                        <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>
                                            Chargement des rendez-vous...
                                        </p>
                                    ) : appointments.length > 0 ? (
                                        appointments.map((appointment) =>
                                            <div key={appointment.id} className="dashboard-appointment-item">
                                                <div className={["avatar", "avatar-lg"].filter(Boolean).join(" ")}>{getInitials(appointment.doctor)}</div>
                                                <div className="dashboard-appointment-info">
                                                    <div className="dashboard-appointment-header">
                                                        <h4 className="dashboard-appointment-doctor">{appointment.doctor}</h4>
                                                        <span className="badge badge-primary">{appointment.type === 'video' ? '📹 Vidéo' : '🏥 En personne'}</span>
                                                    </div>
                                                    <p className="text-muted dashboard-appointment-specialty">{appointment.specialty}</p>
                                                    <div className="dashboard-appointment-meta">
                                                        <span className="dashboard-appointment-meta-item"><Calendar size={14} /> {appointment.date}</span>
                                                        <span className="dashboard-appointment-meta-item"><Clock size={14} /> {appointment.time}</span>
                                                    </div>
                                                </div>
                                                <div className="dashboard-appointment-actions">
                                                    <button type="button" className={["btn", "btn-outline"].filter(Boolean).join(" ")}>Reporter</button>
                                                    <button type="button" className={["btn", "btn-ghost"].filter(Boolean).join(" ")}>Annuler</button>
                                                </div>
                                            </div>
                                        )
                                    ) : (
                                        <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>
                                            Aucun rendez-vous à venir.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={["card"].filter(Boolean).join(" ")}>
                            <div className={["card-header", "flex", "flex-col", "gap-2"].filter(Boolean).join(" ")}>
                                <h3 className={["card-title"].filter(Boolean).join(" ")}>Actions rapides</h3>
                            </div>
                            <div className={["card-content"].filter(Boolean).join(" ")}>
                                <div className="dashboard-actions-grid">
                                    <button className="dashboard-action-btn">
                                        <div className="dashboard-action-icon-wrapper" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}>
                                            <Calendar color="var(--primary)" size={24} />
                                        </div>
                                        <span className="dashboard-action-label">Prendre rendez-vous</span>
                                    </button>
                                    <button className="dashboard-action-btn">
                                        <div className="dashboard-action-icon-wrapper" style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)' }}>
                                            <Search color="var(--secondary)" size={24} />
                                        </div>
                                        <span className="dashboard-action-label">Trouver un médecin</span>
                                    </button>
                                    <button className="dashboard-action-btn">
                                        <div className="dashboard-action-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                                            <Heart color="var(--success)" size={24} />
                                        </div>
                                        <span className="dashboard-action-label">Dossiers médicaux</span>
                                    </button>
                                    <button className="dashboard-action-btn">
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
                        <div className={["card", "dashboard-full-height-card"].filter(Boolean).join(" ")}>
                            <div className={["card-header", "flex", "flex-col", "gap-2"].filter(Boolean).join(" ")}>
                                <h3 className={["card-title"].filter(Boolean).join(" ")}>Activité récente</h3>
                            </div>
                            <div className={["card-content"].filter(Boolean).join(" ")}>
                                <div className="dashboard-activity-list">
                                    {loading ? (
                                        <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>
                                            Chargement...
                                        </p>
                                    ) : activities.length > 0 ? (
                                        activities.map((activity) =>
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
                                        )
                                    ) : (
                                        <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>
                                            Aucune activité récente.
                                        </p>
                                    )}
                                </div>
                                <button type="button" className={["btn", "btn-ghost", "btn-full", "dashboard-margin-top"].filter(Boolean).join(" ")}>
                                    Voir toute l'activité
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);

}

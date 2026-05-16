import { useState } from 'react';
import { Calendar, Clock, TrendingUp, Heart, Plus, Bell, Search } from 'lucide-react';
import { Sidebar } from '../Sidebar.jsx';
import '../../styles/pages/Dashboard.css';

function getInitials(name = 'User') {
  return name.split(' ').filter(Boolean).map((part) => part[0]).join('').substring(0, 2).toUpperCase();
}




export function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
  {
    title: 'Rendez-vous à venir',
    value: '3',
    icon: Calendar,
    color: 'var(--primary)',
    bgColor: 'rgba(37, 99, 235, 0.1)'
  },
  {
    title: 'Visites terminées',
    value: '12',
    icon: Clock,
    color: 'var(--success)',
    bgColor: 'rgba(16, 185, 129, 0.1)'
  },
  {
    title: 'Score de santé',
    value: '92%',
    icon: TrendingUp,
    color: 'var(--secondary)',
    bgColor: 'rgba(6, 182, 212, 0.1)'
  },
  {
    title: 'Ordonnances actives',
    value: '2',
    icon: Heart,
    color: 'var(--warning)',
    bgColor: 'rgba(245, 158, 11, 0.1)'
  }];


  const upcomingAppointments = [
  {
    id: '1',
    doctor: 'Dr. Sarah Johnson',
    specialty: 'Cardiologue',
    date: '2026-05-18',
    time: '10:00',
    status: 'upcoming',
    type: 'in-person'
  },
  {
    id: '2',
    doctor: 'Dr. Michael Chen',
    specialty: 'Neurologue',
    date: '2026-05-22',
    time: '14:30',
    status: 'upcoming',
    type: 'video'
  },
  {
    id: '3',
    doctor: 'Dr. Emily Williams',
    specialty: 'Pédiatre',
    date: '2026-05-25',
    time: '11:00',
    status: 'upcoming',
    type: 'in-person'
  }];


  const recentActivity = [
  {
    action: 'Rendez-vous pris',
    description: 'Dr. Sarah Johnson - 18 Mai 2026',
    time: 'Il y a 2 heures',
    type: 'appointment'
  },
  {
    action: 'Résultats de laboratoire',
    description: 'Résultats du test sanguin prêts',
    time: 'Il y a 1 jour',
    type: 'results'
  },
  {
    action: 'Ordonnance renouvelée',
    description: 'Médicaments expédiés',
    time: 'Il y a 3 jours',
    type: 'prescription'
  }];


  return (
    <div className="app-container">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userRole="patient" userName="Jean Dupont" />

            <div className="main-content">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Tableau de bord</h1>
                        <p className="text-muted">Bon retour, Jean !</p>
                    </div>
                    <div className="dashboard-user-actions">
                        <button type="button" className={["btn", "btn-ghost", "dashboard-bell-btn"].filter(Boolean).join(" ")}>
                            <Bell size={20} />
                            <span className="dashboard-notification-dot"></span>
                        </button>
                        <div className={["avatar", "avatar-md"].filter(Boolean).join(" ")}>{getInitials("Jean Dupont")}</div>
                    </div>
                </div>

                <div className="dashboard-stats-grid-2">
                    {stats.map((stat) =>
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
                                    {upcomingAppointments.map((appointment) =>
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
                                    {recentActivity.map((activity, index) =>
                  <div key={index} className="dashboard-activity-item">
                                            <div className="dashboard-activity-content">
                                                <div className="dashboard-activity-dot"></div>
                                                <div className="dashboard-activity-info">
                                                    <h4 className="dashboard-activity-title">{activity.action}</h4>
                                                    <p className="text-muted dashboard-activity-desc">{activity.description}</p>
                                                    <p className="dashboard-activity-time">{activity.time}</p>
                                                </div>
                                            </div>
                                        </div>
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

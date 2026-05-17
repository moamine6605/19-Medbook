import { useState } from 'react';
import { Calendar, Clock, Users, TrendingUp, Bell, Video, MapPin } from 'lucide-react';
import { Sidebar } from '../Sidebar.jsx';
import '../../styles/pages/Dashboard.css';

function getInitials(name = 'User') {
  return name.split(' ').filter(Boolean).map((part) => part[0]).join('').substring(0, 2).toUpperCase();
}




export function DoctorDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
  {
    title: "Rendez-vous d'aujourd'hui",
    value: '8',
    change: '+2 par rapport à hier',
    icon: Calendar,
    color: 'var(--primary)',
    bgColor: 'rgba(37, 99, 235, 0.1)'
  },
  {
    title: 'Total des patients',
    value: '342',
    change: '+12 cette semaine',
    icon: Users,
    color: 'var(--secondary)',
    bgColor: 'rgba(6, 182, 212, 0.1)'
  },
  {
    title: 'Note moyenne',
    value: '4.9',
    change: '⭐ Excellent',
    icon: TrendingUp,
    color: 'var(--success)',
    bgColor: 'rgba(16, 185, 129, 0.1)'
  },
  {
    title: 'Heures cette semaine',
    value: '32',
    change: '8 heures restantes',
    icon: Clock,
    color: 'var(--warning)',
    bgColor: 'rgba(245, 158, 11, 0.1)'
  }];


  const todayAppointments = [
  {
    id: '1',
    patient: 'John Smith',
    age: 45,
    time: '09:00',
    type: 'in-person',
    reason: 'Bilan de santé régulier',
    status: 'completed'
  },
  {
    id: '2',
    patient: 'Emily Davis',
    age: 32,
    time: '10:00',
    type: 'video',
    reason: 'Consultation de suivi',
    status: 'in-progress'
  },
  {
    id: '3',
    patient: 'Michael Brown',
    age: 58,
    time: '11:00',
    type: 'in-person',
    reason: 'Évaluation de la santé cardiaque',
    status: 'upcoming'
  },
  {
    id: '4',
    patient: 'Sarah Wilson',
    age: 41,
    time: '14:00',
    type: 'in-person',
    reason: 'Renouvellement d\'ordonnance',
    status: 'upcoming'
  }];


  const recentPatients = [
  { name: 'John Smith', lastVisit: 'Il y a 2 jours', condition: 'Hypertension' },
  { name: 'Emily Davis', lastVisit: 'Il y a 1 semaine', condition: 'Diabète' },
  { name: 'Michael Brown', lastVisit: 'Il y a 2 semaines', condition: 'Maladie cardiaque' }];


  return (
    <div className="app-container">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userRole="doctor" userName="Dr. Sarah Johnson" onLogout={onLogout} />

            <div className="main-content">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Tableau de bord du médecin</h1>
                        <p className="text-muted">Bonjour, Dr. Johnson !</p>
                    </div>
                    <div className="dashboard-user-actions">
                        <button type="button" className={["btn", "btn-ghost", "dashboard-bell-btn"].filter(Boolean).join(" ")}>
                            <Bell size={20} />
                            <span className="dashboard-notification-dot"></span>
                        </button>
                        <div className={["avatar", "avatar-md"].filter(Boolean).join(" ")}>{getInitials("Dr. Sarah Johnson")}</div>
                    </div>
                </div>

                <div className="dashboard-stats-grid">
                    {stats.map((stat) =>
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
                                <span className="badge badge-primary">8 rendez-vous</span>
                            </div>
                            <div className={["card-content"].filter(Boolean).join(" ")}>
                                <div className="dashboard-appointment-list">
                                    {todayAppointments.map((appointment) =>
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
                                                    <span className="text-muted" style={{ fontSize: '0.875rem' }}>({appointment.age} ans)</span>
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
                                    {recentPatients.map((patient, index) =>
                  <div key={index} className="dashboard-patient-item">
                                            <div className={["avatar", "avatar-md"].filter(Boolean).join(" ")}>{getInitials(patient.name)}</div>
                                            <div className="dashboard-patient-info">
                                                <p className="dashboard-patient-name">{patient.name}</p>
                                                <p className="text-muted" style={{ fontSize: '0.75rem', margin: '0 0 0.25rem 0' }}>{patient.condition}</p>
                                                <p className="text-muted" style={{ fontSize: '0.75rem', margin: 0 }}>{patient.lastVisit}</p>
                                            </div>
                                        </div>
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
                                        <span style={{ fontWeight: 'bold' }}>124</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ opacity: 0.9 }}>Temps d'attente moyen</span>
                                        <span style={{ fontWeight: 'bold' }}>8 min</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ opacity: 0.9 }}>Satisfaction</span>
                                        <span style={{ fontWeight: 'bold' }}>98%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);

}

import { useState } from 'react';
import { Users, Calendar, TrendingUp, DollarSign, Bell, MoreVertical } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Sidebar } from '../Sidebar.jsx';
import '../../styles/pages/Dashboard.css';

function getInitials(name = 'User') {
  return name.split(' ').filter(Boolean).map((part) => part[0]).join('').substring(0, 2).toUpperCase();
}



export function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
  {
    title: 'Total des patients',
    value: '12 458',
    change: '+12.5%',
    icon: Users,
    color: 'var(--primary)',
    bgColor: 'rgba(37, 99, 235, 0.1)'
  },
  {
    title: 'Rendez-vous aujourd\'hui',
    value: '342',
    change: '+5.2%',
    icon: Calendar,
    color: 'var(--secondary)',
    bgColor: 'rgba(6, 182, 212, 0.1)'
  },
  {
    title: 'Médecins actifs',
    value: '89',
    change: '+2',
    icon: TrendingUp,
    color: 'var(--success)',
    bgColor: 'rgba(16, 185, 129, 0.1)'
  },
  {
    title: 'Revenus',
    value: '48,2k €',
    change: '+18.3%',
    icon: DollarSign,
    color: 'var(--warning)',
    bgColor: 'rgba(245, 158, 11, 0.1)'
  }];


  const appointmentsData = [
  { month: 'Jan', appointments: 1200 },
  { month: 'Fév', appointments: 1450 },
  { month: 'Mar', appointments: 1800 },
  { month: 'Avr', appointments: 1650 },
  { month: 'Mai', appointments: 2100 },
  { month: 'Juin', appointments: 2400 }];


  const revenueData = [
  { month: 'Jan', revenue: 32000 },
  { month: 'Fév', revenue: 38000 },
  { month: 'Mar', revenue: 42000 },
  { month: 'Avr', revenue: 39000 },
  { month: 'Mai', revenue: 45000 },
  { month: 'Juin', revenue: 48200 }];


  const topDoctors = [
  {
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologue',
    patients: 234,
    rating: 4.9,
    status: 'Actif'
  },
  {
    name: 'Dr. Michael Chen',
    specialty: 'Neurologue',
    patients: 189,
    rating: 4.8,
    status: 'Actif'
  },
  {
    name: 'Dr. Emily Williams',
    specialty: 'Pédiatre',
    patients: 312,
    rating: 5.0,
    status: 'Actif'
  }];


  const recentActivity = [
  { action: 'Nouveau patient inscrit', user: 'Jean Dupont', time: 'Il y a 5 min' },
  { action: 'Rendez-vous programmé', user: 'Dr. Sarah Johnson', time: 'Il y a 15 min' },
  { action: 'Paiement reçu', user: 'Emily Davis', time: 'Il y a 1 heure' },
  { action: 'Nouveau médecin ajouté', user: 'Dr. Michael Chen', time: 'Il y a 2 heures' }];


  return (
    <div className="app-container">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userRole="admin" userName="Administrateur" onLogout={onLogout} />

            <div className="main-content">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Tableau de bord administrateur</h1>
                        <p className="text-muted">Aperçu du système et analytique</p>
                    </div>
                    <div className="dashboard-user-actions">
                        <button type="button" className={["btn", "btn-ghost", "dashboard-bell-btn"].filter(Boolean).join(" ")}>
                            <Bell size={20} />
                            <span className="dashboard-notification-dot"></span>
                        </button>
                        <div className={["avatar", "avatar-md"].filter(Boolean).join(" ")}>{getInitials("Administrateur")}</div>
                    </div>
                </div>

                <div className="dashboard-stats-grid">
                    {stats.map((stat) =>
          <div className={["card"].filter(Boolean).join(" ")} key={stat.title}>
                            <div className={["card-content", "dashboard-stat-card-content"].filter(Boolean).join(" ")}>
                                <div>
                                    <p className="text-muted dashboard-stat-title">{stat.title}</p>
                                    <p className="dashboard-stat-value" style={{ marginBottom: '0.25rem' }}>{stat.value}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--success)', margin: 0 }}>{stat.change}</p>
                                </div>
                                <div className="dashboard-stat-icon-wrapper" style={{ backgroundColor: stat.bgColor }}>
                                    <stat.icon style={{ color: stat.color }} size={24} />
                                </div>
                            </div>
                        </div>
          )}
                </div>

                <div className="dashboard-main-grid">
                    <div className={["card"].filter(Boolean).join(" ")}>
                        <div className={["card-header", "flex", "flex-col", "gap-2"].filter(Boolean).join(" ")}>
                            <h3 className={["card-title"].filter(Boolean).join(" ")}>Tendance des rendez-vous</h3>
                        </div>
                        <div className={["card-content"].filter(Boolean).join(" ")}>
                            <div style={{ width: '100%', height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={appointmentsData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                        <XAxis dataKey="month" stroke="#64748B" />
                                        <YAxis stroke="#64748B" />
                                        <Tooltip />
                                        <Bar dataKey="appointments" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className={["card"].filter(Boolean).join(" ")}>
                        <div className={["card-header", "flex", "flex-col", "gap-2"].filter(Boolean).join(" ")}>
                            <h3 className={["card-title"].filter(Boolean).join(" ")}>Croissance des revenus</h3>
                        </div>
                        <div className={["card-content"].filter(Boolean).join(" ")}>
                            <div style={{ width: '100%', height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                        <XAxis dataKey="month" stroke="#64748B" />
                                        <YAxis stroke="#64748B" />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="revenue" stroke="var(--secondary)" strokeWidth={3} dot={{ fill: 'var(--secondary)', r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-main-grid" style={{ marginTop: '1.5rem' }}>
                    <div>
                        <div className={["card"].filter(Boolean).join(" ")}>
                            <div className={["card-header", "flex", "flex-col", "gap-2", "dashboard-card-header-flex"].filter(Boolean).join(" ")}>
                                <h3 className={["card-title"].filter(Boolean).join(" ")}>Meilleurs médecins</h3>
                                <button type="button" className={["btn", "btn-ghost"].filter(Boolean).join(" ")}>Voir tout</button>
                            </div>
                            <div className={["card-content"].filter(Boolean).join(" ")}>
                                <div className="dashboard-table-container">
                                    <table className="dashboard-table">
                                        <thead>
                                        <tr>
                                            <th>Médecin</th>
                                            <th>Spécialité</th>
                                            <th>Patients</th>
                                            <th>Note</th>
                                            <th>Statut</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {topDoctors.map((doctor, index) =>
                      <tr key={index}>
                                                <td>
                                                    <div className="dashboard-table-user">
                                                        <div className={["avatar", "avatar-sm"].filter(Boolean).join(" ")}>{getInitials(doctor.name)}</div>
                                                        <span className="dashboard-table-user-name">{doctor.name}</span>
                                                    </div>
                                                </td>
                                                <td className="text-muted">{doctor.specialty}</td>
                                                <td>{doctor.patients}</td>
                                                <td>
                                                    <div className="dashboard-actions-row">
                                                        <span>⭐</span>
                                                        <span>{doctor.rating}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge badge-success">{doctor.status}</span>
                                                </td>
                                                <td>
                                                    <button type="button" className={["btn", "btn-ghost"].filter(Boolean).join(" ")}>
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                      )}
                                        </tbody>
                                    </table>
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
                                                    <p className="text-muted dashboard-activity-desc">{activity.user}</p>
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

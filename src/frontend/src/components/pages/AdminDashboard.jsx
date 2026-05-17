import { useState, useEffect } from 'react';
import { Users, Calendar, TrendingUp, DollarSign, MoreVertical } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useNavigate } from 'react-router';
import { Sidebar } from '../Sidebar.jsx';
import { DashboardHeader } from '../DashboardHeader.jsx';
import { getAdminStats, getAdminAppointmentsAnalytics, getAdminRevenueAnalytics, getAdminTopDoctors, getAdminActivity } from '../../services/api';
import { AdminCreateModal } from './admin/AdminCreateModal.jsx';
import '../../styles/pages/Dashboard.css';

function getInitials(name = 'User') {
  return name.split(' ').filter(Boolean).map((part) => part[0]).join('').substring(0, 2).toUpperCase();
}



export function AdminDashboard({ onLogout, user, onHomeClick }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [topDoctors, setTopDoctors] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);

  const userName = user?.name || 'Administrateur';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, appointmentsRes, revenueRes, doctorsRes, activityRes] = await Promise.all([
          getAdminStats(),
          getAdminAppointmentsAnalytics(),
          getAdminRevenueAnalytics(),
          getAdminTopDoctors(),
          getAdminActivity(),
        ]);
        setStats(statsData);
        setAppointmentsData(appointmentsRes);
        setRevenueData(revenueRes);
        setTopDoctors(doctorsRes);
        setRecentActivity(activityRes);
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
    title: 'Total des patients',
    value: stats ? stats.total_patients : '...',
    change: stats ? stats.patient_growth : '',
    icon: Users,
    color: 'var(--primary)',
    bgColor: 'rgba(37, 99, 235, 0.1)'
  },
  {
    title: "Rendez-vous aujourd'hui",
    value: stats ? String(stats.today_appointments) : '...',
    change: stats ? stats.appointment_growth : '',
    icon: Calendar,
    color: 'var(--secondary)',
    bgColor: 'rgba(6, 182, 212, 0.1)'
  },
  {
    title: 'Médecins actifs',
    value: stats ? String(stats.active_doctors) : '...',
    change: stats ? stats.new_doctors : '',
    icon: TrendingUp,
    color: 'var(--success)',
    bgColor: 'rgba(16, 185, 129, 0.1)'
  },
  {
    title: 'Revenus',
    value: stats ? stats.revenue : '...',
    change: stats ? stats.revenue_growth : '',
    icon: DollarSign,
    color: 'var(--warning)',
    bgColor: 'rgba(245, 158, 11, 0.1)'
  }];


  return (
    <div className="app-container">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userRole="admin" user={user} onLogout={onLogout} onHomeClick={onHomeClick} />

            <div className="main-content">
                <DashboardHeader
                    title="Tableau de bord administrateur"
                    subtitle={`Bienvenue, ${userName}`}
                    user={user}
                    onLogout={onLogout}
                    onHomeClick={onHomeClick}
                    notifications={recentActivity.map((a, i) => ({ id: i, action: a.action, description: a.user, time: a.time }))}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <button type="button" className="btn btn-primary" onClick={() => setCreateOpen(true)}>
                        Ajouter
                    </button>
                </div>

                <div className="dashboard-stats-grid">
                    {statCards.map((stat) =>
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
                                {loading ? (
                                    <p className="text-muted" style={{ textAlign: 'center', paddingTop: '8rem' }}>Chargement...</p>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={appointmentsData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                            <XAxis dataKey="month" stroke="#64748B" />
                                            <YAxis stroke="#64748B" />
                                            <Tooltip />
                                            <Bar dataKey="appointments" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={["card"].filter(Boolean).join(" ")}>
                        <div className={["card-header", "flex", "flex-col", "gap-2"].filter(Boolean).join(" ")}>
                            <h3 className={["card-title"].filter(Boolean).join(" ")}>Croissance des revenus</h3>
                        </div>
                        <div className={["card-content"].filter(Boolean).join(" ")}>
                            <div style={{ width: '100%', height: '300px' }}>
                                {loading ? (
                                    <p className="text-muted" style={{ textAlign: 'center', paddingTop: '8rem' }}>Chargement...</p>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={revenueData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                            <XAxis dataKey="month" stroke="#64748B" />
                                            <YAxis stroke="#64748B" />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="revenue" stroke="var(--secondary)" strokeWidth={3} dot={{ fill: 'var(--secondary)', r: 5 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-main-grid" style={{ marginTop: '1.5rem' }}>
                    <div>
                        <div className={["card"].filter(Boolean).join(" ")}>
                            <div className={["card-header", "flex", "flex-col", "gap-2", "dashboard-card-header-flex"].filter(Boolean).join(" ")}>
                                <h3 className={["card-title"].filter(Boolean).join(" ")}>Meilleurs médecins</h3>
                                <button
                                  type="button"
                                  className={["btn", "btn-ghost"].filter(Boolean).join(" ")}
                                  onClick={() => navigate('/admin/doctors')}
                                >
                                  Voir tout
                                </button>
                            </div>
                            <div className={["card-content"].filter(Boolean).join(" ")}>
                                {loading ? (
                                    <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>Chargement...</p>
                                ) : (
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
                                            {topDoctors.map((doctor) =>
                          <tr key={doctor.id}>
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
                                                        <span className={`badge ${doctor.status === 'Actif' ? 'badge-success' : 'badge-default'}`}>{doctor.status}</span>
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
                                )}
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
                                        <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>Chargement...</p>
                                    ) : recentActivity.length > 0 ? (
                                        recentActivity.map((activity, index) =>
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
                                        )
                                    ) : (
                                        <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>Aucune activité récente.</p>
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

            <AdminCreateModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={() => {}} />
        </div>);

}

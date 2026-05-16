import { useState } from 'react';
import { Users, Calendar, TrendingUp, DollarSign, Bell, MoreVertical } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import '../../styles/pages/Dashboard.css';

export function AdminDashboard() {
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
        }
    ];

    const appointmentsData = [
        { month: 'Jan', appointments: 1200 },
        { month: 'Fév', appointments: 1450 },
        { month: 'Mar', appointments: 1800 },
        { month: 'Avr', appointments: 1650 },
        { month: 'Mai', appointments: 2100 },
        { month: 'Juin', appointments: 2400 }
    ];

    const revenueData = [
        { month: 'Jan', revenue: 32000 },
        { month: 'Fév', revenue: 38000 },
        { month: 'Mar', revenue: 42000 },
        { month: 'Avr', revenue: 39000 },
        { month: 'Mai', revenue: 45000 },
        { month: 'Juin', revenue: 48200 }
    ];

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
        }
    ];

    const recentActivity = [
        { action: 'Nouveau patient inscrit', user: 'Jean Dupont', time: 'Il y a 5 min' },
        { action: 'Rendez-vous programmé', user: 'Dr. Sarah Johnson', time: 'Il y a 15 min' },
        { action: 'Paiement reçu', user: 'Emily Davis', time: 'Il y a 1 heure' },
        { action: 'Nouveau médecin ajouté', user: 'Dr. Michael Chen', time: 'Il y a 2 heures' }
    ];

    return (
        <div className="app-container">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userRole="admin" userName="Administrateur" />

            <div className="main-content">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Tableau de bord administrateur</h1>
                        <p className="text-muted">Aperçu du système et analytique</p>
                    </div>
                    <div className="dashboard-user-actions">
                        <Button variant="ghost" className="dashboard-bell-btn">
                            <Bell size={20} />
                            <span className="dashboard-notification-dot"></span>
                        </Button>
                        <Avatar name="Administrateur" size="md" />
                    </div>
                </div>

                <div className="dashboard-stats-grid">
                    {stats.map((stat) => (
                        <Card key={stat.title}>
                            <CardContent className="dashboard-stat-card-content">
                                <div>
                                    <p className="text-muted dashboard-stat-title">{stat.title}</p>
                                    <p className="dashboard-stat-value" style={{ marginBottom: '0.25rem' }}>{stat.value}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--success)', margin: 0 }}>{stat.change}</p>
                                </div>
                                <div className="dashboard-stat-icon-wrapper" style={{ backgroundColor: stat.bgColor }}>
                                    <stat.icon style={{ color: stat.color }} size={24} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="dashboard-main-grid">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tendance des rendez-vous</CardTitle>
                        </CardHeader>
                        <CardContent>
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
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Croissance des revenus</CardTitle>
                        </CardHeader>
                        <CardContent>
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
                        </CardContent>
                    </Card>
                </div>

                <div className="dashboard-main-grid" style={{ marginTop: '1.5rem' }}>
                    <div>
                        <Card>
                            <CardHeader className="dashboard-card-header-flex">
                                <CardTitle>Meilleurs médecins</CardTitle>
                                <Button variant="ghost" size="sm">Voir tout</Button>
                            </CardHeader>
                            <CardContent>
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
                                        {topDoctors.map((doctor, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div className="dashboard-table-user">
                                                        <Avatar name={doctor.name} size="sm" />
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
                                                    <Badge variant="success">{doctor.status}</Badge>
                                                </td>
                                                <td>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card className="dashboard-full-height-card">
                            <CardHeader>
                                <CardTitle>Activité récente</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="dashboard-activity-list">
                                    {recentActivity.map((activity, index) => (
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
                                    ))}
                                </div>
                                <Button variant="ghost" fullWidth className="dashboard-margin-top">
                                    Voir toute l'activité
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
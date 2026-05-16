import { useState } from 'react';
import { Calendar, Clock, TrendingUp, Heart, Plus, Bell, Search } from 'lucide-react';
import '../../styles/pages/Dashboard.css';

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
        }
    ];

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
        }
    ];

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
        }
    ];

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
                        <Button variant="ghost" className="dashboard-bell-btn">
                            <Bell size={20} />
                            <span className="dashboard-notification-dot"></span>
                        </Button>
                        <Avatar name="Jean Dupont" size="md" />
                    </div>
                </div>

                <div className="dashboard-stats-grid-2">
                    {stats.map((stat) => (
                        <Card key={stat.title}>
                            <CardContent className="dashboard-stat-card-content">
                                <div>
                                    <p className="text-muted dashboard-stat-title">{stat.title}</p>
                                    <p className="dashboard-stat-value">{stat.value}</p>
                                </div>
                                <div className="dashboard-stat-icon-wrapper" style={{ backgroundColor: stat.bgColor }}>
                                    <stat.icon style={{ color: stat.color }} size={24} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="dashboard-main-grid">
                    <div>
                        <Card className="dashboard-margin-bottom">
                            <CardHeader className="dashboard-card-header-flex">
                                <CardTitle>Rendez-vous à venir</CardTitle>
                                <Button>
                                    <Plus size={16} className="dashboard-btn-icon" />
                                    Nouveau
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="dashboard-appointment-list">
                                    {upcomingAppointments.map((appointment) => (
                                        <div key={appointment.id} className="dashboard-appointment-item">
                                            <Avatar name={appointment.doctor} size="lg" />
                                            <div className="dashboard-appointment-info">
                                                <div className="dashboard-appointment-header">
                                                    <h4 className="dashboard-appointment-doctor">{appointment.doctor}</h4>
                                                    <Badge variant="primary">{appointment.type === 'video' ? '📹 Vidéo' : '🏥 En personne'}</Badge>
                                                </div>
                                                <p className="text-muted dashboard-appointment-specialty">{appointment.specialty}</p>
                                                <div className="dashboard-appointment-meta">
                                                    <span className="dashboard-appointment-meta-item"><Calendar size={14} /> {appointment.date}</span>
                                                    <span className="dashboard-appointment-meta-item"><Clock size={14} /> {appointment.time}</span>
                                                </div>
                                            </div>
                                            <div className="dashboard-appointment-actions">
                                                <Button variant="outline">Reporter</Button>
                                                <Button variant="ghost">Annuler</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Actions rapides</CardTitle>
                            </CardHeader>
                            <CardContent>
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
                                                    <p className="text-muted dashboard-activity-desc">{activity.description}</p>
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
import {
  LayoutDashboard,
  Calendar,
  Clock,
  User,
  Settings,
  LogOut,
  Users,
  FileText,
  Activity } from
'lucide-react';

import '../styles/components/Sidebar.css';

function getInitials(name = 'User') {
  return name.split(' ').filter(Boolean).map((part) => part[0]).join('').substring(0, 2).toUpperCase();
}

export function Sidebar({
  activeTab = 'dashboard',
  onTabChange = () => {},
  userRole = 'patient',
  userName = 'John Doe',
  onLogout = () => {}
}) {
  const patientMenuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { id: 'appointments', icon: Calendar, label: 'Rendez-vous' },
  { id: 'history', icon: Clock, label: 'Historique' },
  { id: 'profile', icon: User, label: 'Profil' }];


  const doctorMenuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { id: 'appointments', icon: Calendar, label: 'Mes rendez-vous' },
  { id: 'patients', icon: Users, label: 'Patients' },
  { id: 'schedule', icon: Clock, label: 'Planning' },
  { id: 'profile', icon: User, label: 'Profil' }];


  const adminMenuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { id: 'appointments', icon: Calendar, label: 'Tous les rendez-vous' },
  { id: 'users', icon: Users, label: 'Utilisateurs' },
  { id: 'doctors', icon: Activity, label: 'Médecins' },
  { id: 'reports', icon: FileText, label: 'Rapports' }];


  const menuItems = userRole === 'doctor' ?
  doctorMenuItems :
  userRole === 'admin' ?
  adminMenuItems :
  patientMenuItems;

  return (
    <div className="sidebar">
            {/* Logo */}
            <div className="sidebar-header">
                <div className="sidebar-logo-container">
                    <div className="sidebar-logo-icon">
                        <Activity color="white" />
                    </div>
                    <span className="sidebar-logo-text">Medbook</span>
                </div>
            </div>

            {/* User Profile */}
            <div className="sidebar-header sidebar-user-container">
                <div className={["avatar", "avatar-md"].filter(Boolean).join(" ")}>{getInitials(userName)}</div>
                <div className="sidebar-user-info">
                    <p className="sidebar-user-name">{userName}</p>
                    <p className="text-muted sidebar-user-role">{userRole === 'doctor' ? 'Médecin' : userRole === 'patient' ? 'Patient' : 'Administrateur'}</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`sidebar-item ${isActive ? 'active' : ''}`}>
              
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </button>);

        })}
            </nav>

            {/* Bottom Actions */}
            <div className="sidebar-footer">
                <button className="sidebar-item">
                    <Settings size={20} />
                    <span>Paramètres</span>
                </button>
                <button className="sidebar-item sidebar-logout-btn" onClick={onLogout}>
                    <LogOut size={20} />
                    <span>Se déconnecter</span>
                </button>
            </div>
        </div>);

}

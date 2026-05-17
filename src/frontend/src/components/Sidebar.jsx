import {
  LayoutDashboard,
  Calendar,
  Clock,
  User,
  LogOut,
  Users,
  Activity } from
'lucide-react';

import { useLocation, useNavigate } from 'react-router';
import '../styles/components/Sidebar.css';

function getInitials(name = 'User') {
  return name.split(' ').filter(Boolean).map((part) => part[0]).join('').substring(0, 2).toUpperCase();
}

export function Sidebar({
  activeTab = 'dashboard',
  onTabChange = () => {},
  userRole = 'patient',
  user = null,
  onLogout = () => {},
  onHomeClick = () => {}
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = user?.name || 'Utilisateur';

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
  { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de bord', to: '/admin/dashboard' },
  { id: 'appointments', icon: Calendar, label: 'Tous les rendez-vous', to: '/admin/appointments' },
  { id: 'patients', icon: Users, label: 'Patients', to: '/admin/patients' },
  { id: 'doctors', icon: Activity, label: 'Médecins', to: '/admin/doctors' }];


  const menuItems = userRole === 'doctor' ?
  doctorMenuItems :
  userRole === 'admin' ?
  adminMenuItems :
  patientMenuItems;

  return (
    <div className="sidebar">
            {/* Logo */}
            <div className="sidebar-header" onClick={onHomeClick} style={{ cursor: 'pointer' }}>
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
          const isActive = item.to ? location.pathname === item.to : activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.to) {
                  navigate(item.to);
                } else {
                  onTabChange(item.id);
                }
              }}
              className={`sidebar-item ${isActive ? 'active' : ''}`}>
              
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </button>);

        })}
            </nav>

            {/* Bottom Actions */}
            <div className="sidebar-footer">
                <button className="sidebar-item sidebar-logout-btn" onClick={onLogout}>
                    <LogOut size={20} />
                    <span>Se déconnecter</span>
                </button>
            </div>
        </div>);

}

import { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, Home, ChevronDown } from 'lucide-react';
import '../styles/components/DashboardHeader.css';

function getInitials(name = 'User') {
  return name.split(' ').filter(Boolean).map((part) => part[0]).join('').substring(0, 2).toUpperCase();
}

export function DashboardHeader({ title, subtitle, user, onLogout, onHomeClick, notifications = [] }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifSeen, setNotifSeen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const userName = user?.name || 'Utilisateur';
  const userRole = user?.role === 'doctor' ? 'Médecin' : user?.role === 'admin' ? 'Administrateur' : 'Patient';

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotifToggle = () => {
    setNotifOpen(!notifOpen);
    if (!notifOpen) setNotifSeen(true);
    setProfileOpen(false);
  };

  const handleProfileToggle = () => {
    setProfileOpen(!profileOpen);
    setNotifOpen(false);
  };

  const hasUnread = !notifSeen && notifications.length > 0;

  return (
    <div className="dashboard-header">
      <div>
        <h1 className="dashboard-title">{title}</h1>
        <p className="text-muted">{subtitle}</p>
      </div>
      <div className="dashboard-user-actions">
        {/* Notifications */}
        <div className="dh-dropdown-wrapper" ref={notifRef}>
          <button
            type="button"
            className="btn btn-ghost dashboard-bell-btn"
            onClick={handleNotifToggle}
          >
            <Bell size={20} />
            {hasUnread && <span className="dashboard-notification-dot"></span>}
          </button>

          {notifOpen && (
            <div className="dh-dropdown dh-notif-dropdown">
              <div className="dh-dropdown-title">
                <span>Notifications</span>
                <span className="dh-notif-count">{notifications.length}</span>
              </div>
              <div className="dh-dropdown-divider"></div>
              {notifications.length > 0 ? (
                <div className="dh-notif-list">
                  {notifications.slice(0, 6).map((notif, i) => (
                    <div key={notif.id || i} className="dh-notif-item">
                      <div className="dh-notif-dot"></div>
                      <div className="dh-notif-content">
                        <p className="dh-notif-action">{notif.action || notif.title}</p>
                        <p className="dh-notif-desc">{notif.description || notif.user || ''}</p>
                        <p className="dh-notif-time">{notif.time || ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="dh-notif-empty">Aucune notification</p>
              )}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="dh-dropdown-wrapper" ref={profileRef}>
          <button
            type="button"
            className="dh-profile-btn"
            onClick={handleProfileToggle}
          >
            <div className="avatar avatar-md dh-avatar">{getInitials(userName)}</div>
            <ChevronDown size={14} className={`dh-chevron ${profileOpen ? 'open' : ''}`} />
          </button>

          {profileOpen && (
            <div className="dh-dropdown dh-profile-dropdown">
              <div className="dh-profile-header">
                <div className="avatar avatar-lg dh-avatar">{getInitials(userName)}</div>
                <div className="dh-profile-info">
                  <p className="dh-profile-name">{userName}</p>
                  <p className="dh-profile-email">{user?.email || ''}</p>
                  <span className="dh-profile-role">{userRole}</span>
                </div>
              </div>
              <div className="dh-dropdown-divider"></div>
              <button
                type="button"
                className="dh-dropdown-item"
                onClick={() => { setProfileOpen(false); onHomeClick?.(); }}
              >
                <Home size={16} />
                <span>Accueil</span>
              </button>
              <div className="dh-dropdown-divider"></div>
              <button
                type="button"
                className="dh-dropdown-item dh-logout"
                onClick={() => { setProfileOpen(false); onLogout?.(); }}
              >
                <LogOut size={16} />
                <span>Se déconnecter</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Activity, Menu, X, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

import '../styles/components/Navbar.css';

function getInitials(name = 'User') {
  return name.split(' ').filter(Boolean).map((part) => part[0]).join('').substring(0, 2).toUpperCase();
}

export function Navbar({ onLoginClick, onSignUpClick, isAuthenticated, authChecked = true, user, onLogout, onHomeClick, onDashboardClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userName = user?.name || 'Utilisateur';

  return (
    <nav className="navbar">
            <div className="navbar-logo-container" onClick={onHomeClick} style={{ cursor: 'pointer' }}>
                <div className="navbar-logo-icon">
                    <Activity color="white" />
                </div>
                <span className="navbar-logo-text">Medbook</span>
            </div>

            <div className="desktop-nav">
                <a href="#features">Fonctionnalités</a>
                <a href="#doctors">Médecins</a>
                <a href="#about">À propos</a>
                <a href="#contact">Contact</a>
            </div>

            {!isAuthenticated ? (
                authChecked === false ? (
                    <div className="desktop-nav-auth" style={{ minHeight: '2.5rem' }} />
                ) : (
                    <div className="desktop-nav-auth">
                        <button type="button" className={["btn", "btn-ghost"].filter(Boolean).join(" ")} onClick={onLoginClick}>
                            Se connecter
                        </button>
                        <button type="button" className={["btn", "btn-primary"].filter(Boolean).join(" ")} onClick={onSignUpClick}>
                            S'inscrire
                        </button>
                    </div>
                )
            ) : (
                <div className="desktop-nav-auth" ref={dropdownRef}>
                    <button
                        type="button"
                        className="navbar-user-btn"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <div className="avatar avatar-md navbar-avatar">
                            {getInitials(userName)}
                        </div>
                        <span className="navbar-user-name">{userName}</span>
                        <ChevronDown size={16} className={`navbar-chevron ${dropdownOpen ? 'open' : ''}`} />
                    </button>

                    {dropdownOpen && (
                        <div className="navbar-dropdown">
                            <div className="navbar-dropdown-header">
                                <div className="avatar avatar-lg navbar-dropdown-avatar">
                                    {getInitials(userName)}
                                </div>
                                <div className="navbar-dropdown-user-info">
                                    <p className="navbar-dropdown-name">{userName}</p>
                                    <p className="navbar-dropdown-email">{user?.email || ''}</p>
                                    <span className="navbar-dropdown-role">
                                        {user?.role === 'doctor' ? 'Médecin' : user?.role === 'admin' ? 'Administrateur' : 'Patient'}
                                    </span>
                                </div>
                            </div>
                            <div className="navbar-dropdown-divider"></div>
                            <button
                                type="button"
                                className="navbar-dropdown-item"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    onDashboardClick?.();
                                }}
                            >
                                <LayoutDashboard size={16} />
                                <span>Tableau de bord</span>
                            </button>
                            <div className="navbar-dropdown-divider"></div>
                            <button
                                type="button"
                                className="navbar-dropdown-item navbar-dropdown-logout"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    onLogout?.();
                                }}
                            >
                                <LogOut size={16} />
                                <span>Se déconnecter</span>
                            </button>
                        </div>
                    )}
                </div>
            )}

            <button
        className="mobile-menu-btn"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Menu">
        
                {mobileMenuOpen ? <X /> : <Menu />}
            </button>

            {mobileMenuOpen && (
              <>
                <div
                  className="mobile-menu-backdrop open"
                  onClick={() => setMobileMenuOpen(false)}
                />

                <div className="mobile-menu-panel open">
                  <div className="mobile-menu-section">
                    <button type="button" className="mobile-menu-link" onClick={() => { setMobileMenuOpen(false); document.querySelector('#features')?.scrollIntoView?.({ behavior: 'smooth' }); }}>
                      Fonctionnalites
                    </button>
                    <button type="button" className="mobile-menu-link" onClick={() => { setMobileMenuOpen(false); document.querySelector('#doctors')?.scrollIntoView?.({ behavior: 'smooth' }); }}>
                      Medecins
                    </button>
                    <button type="button" className="mobile-menu-link" onClick={() => { setMobileMenuOpen(false); document.querySelector('#about')?.scrollIntoView?.({ behavior: 'smooth' }); }}>
                      A propos
                    </button>
                    <button type="button" className="mobile-menu-link" onClick={() => { setMobileMenuOpen(false); document.querySelector('#contact')?.scrollIntoView?.({ behavior: 'smooth' }); }}>
                      Contact
                    </button>
                  </div>

                  <div className="mobile-menu-divider" />

                  {!isAuthenticated ? (
                    <div className="mobile-menu-section">
                      <button type="button" className="btn btn-outline btn-full" onClick={() => { setMobileMenuOpen(false); onLoginClick?.(); }}>
                        Se connecter
                      </button>
                      <button type="button" className="btn btn-primary btn-full" onClick={() => { setMobileMenuOpen(false); onSignUpClick?.(); }}>
                        S'inscrire
                      </button>
                    </div>
                  ) : (
                    <div className="mobile-menu-section">
                      <button type="button" className="btn btn-outline btn-full" onClick={() => { setMobileMenuOpen(false); onDashboardClick?.(); }}>
                        Tableau de bord
                      </button>
                      <button type="button" className="btn btn-danger btn-full" onClick={() => { setMobileMenuOpen(false); onLogout?.(); }}>
                        Se deconnecter
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
        </nav>);

}

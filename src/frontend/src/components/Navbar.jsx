import { Activity, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import '../../styles/components/Navbar.css';

export function Navbar({ onLoginClick, onSignUpClick }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="navbar-logo-container">
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

            <div className="desktop-nav-auth">
                <Button variant="ghost" onClick={onLoginClick}>
                    Se connecter
                </Button>
                <Button onClick={onSignUpClick}>
                    S'inscrire
                </Button>
            </div>

            <button
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                {mobileMenuOpen ? <X /> : <Menu />}
            </button>
        </nav>
    );
}
import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Shield,
  Users,
  Star } from
'lucide-react';
import '../../styles/pages/LandingPage.css';

import { Navbar } from "../Navbar.jsx";
import { getFeaturedDoctors, getPublicStats } from '../../services/api';

function getInitials(name = 'User') {
  return name.split(' ').filter(Boolean).map((part) => part[0]).join('').substring(0, 2).toUpperCase();
}

function formatCount(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'K+';
  }
  return num + '+';
}

export function LandingPage({ onGetStarted, onLoginClick, onSignUpClick, isAuthenticated, user, onLogout }) {
  const [doctors, setDoctors] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsData, statsData] = await Promise.all([
          getFeaturedDoctors(),
          getPublicStats(),
        ]);
        setDoctors(doctorsData);
        setStats(statsData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const features = [
  {
    icon: Calendar,
    title: 'Réservation facile',
    description: 'Prenez rendez-vous en moins de 3 clics. Simple, rapide et intuitif.'
  },
  {
    icon: Clock,
    title: 'Gagnez du temps',
    description: 'Fini l\'attente au téléphone. Prenez rendez-vous en ligne 24h/24 et 7j/7.'
  },
  {
    icon: Shield,
    title: 'Sécurisé et privé',
    description: 'Vos données médicales sont cryptées et protégées.'
  },
  {
    icon: Users,
    title: 'Les meilleurs médecins',
    description: 'Accédez à un réseau de professionnels de la santé vérifiés et expérimentés.'
  }];


  return (
    <div className="landing-container">
            <Navbar
                onLoginClick={onLoginClick}
                onSignUpClick={onSignUpClick}
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={onLogout}
                onHomeClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />

            <section className="hero landing-hero">
                <div className="landing-hero-content">
                    <div className="landing-badge">
                        <span className="landing-badge-text">
                            La santé simplifiée
                        </span>
                    </div>
                    <h1 className="landing-hero-title">
                        Prenez vos rendez-vous médicaux <span className="landing-hero-title-highlight">instantanément</span>
                    </h1>
                    <p className="text-muted landing-hero-subtitle">
                        Dites adieu aux longues files d'attente. Prenez rendez-vous avec les meilleurs médecins en quelques secondes, gérez votre parcours de soins et concentrez-vous sur l'essentiel : votre santé.
                    </p>
                    <div className="landing-hero-actions">
                        <button type="button" className={["btn", "btn-primary"].filter(Boolean).join(" ")} onClick={onGetStarted}>
                            <Calendar size={20} className="landing-hero-action-icon" />
                            Prendre rendez-vous
                        </button>
                        <button type="button" className={["btn", "btn-outline"].filter(Boolean).join(" ")}>En savoir plus</button>
                    </div>

                    <div className="landing-stats-grid">
                        <div>
                            <p className="landing-stat-value">
                                {stats ? formatCount(stats.doctors_count) : '...'}
                            </p>
                            <p className="text-muted landing-stat-label">Médecins vérifiés</p>
                        </div>
                        <div>
                            <p className="landing-stat-value">
                                {stats ? formatCount(stats.patients_count) : '...'}
                            </p>
                            <p className="text-muted landing-stat-label">Patients satisfaits</p>
                        </div>
                        <div>
                            <p className="landing-stat-value">
                                {stats ? stats.average_rating + '★' : '...'}
                            </p>
                            <p className="text-muted landing-stat-label">Note moyenne</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="landing-section-alt">
                <div className="landing-section-content">
                    <div className="landing-section-header">
                        <h2>Pourquoi choisir Medbook ?</h2>
                        <p className="text-muted">La plateforme de réservation médicale la plus intuitive pour vous faciliter la vie.</p>
                    </div>
                    <div className="landing-features-grid">
                        {features.map((feature) =>
            <div className={["card"].filter(Boolean).join(" ")} key={feature.title}>
                                <div className={["card-content", "landing-feature-card-content"].filter(Boolean).join(" ")}>
                                    <div className="landing-feature-icon-wrapper">
                                        <feature.icon color="var(--primary)" size={28} />
                                    </div>
                                    <h3 className={["card-title", "landing-feature-title"].filter(Boolean).join(" ")}>{feature.title}</h3>
                                    <p className="text-muted landing-feature-desc">{feature.description}</p>
                                </div>
                            </div>
            )}
                    </div>
                </div>
            </section>

            <section id="doctors" className="landing-section">
                <div className="landing-section-content">
                    <div className="landing-section-header">
                        <h2>Nos spécialistes</h2>
                        <p className="text-muted">Des médecins vérifiés et expérimentés prêts à vous aider.</p>
                    </div>
                    <div className="landing-doctors-grid">
                        {loading ? (
                            <p className="text-muted" style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
                                Chargement des médecins...
                            </p>
                        ) : doctors.length > 0 ? (
                            doctors.map((doctor) =>
                                <div className={["card"].filter(Boolean).join(" ")} key={doctor.id}>
                                    <div className={["card-content", "landing-doctor-card-content"].filter(Boolean).join(" ")}>
                                        <div className={["avatar", "avatar-lg", "landing-doctor-avatar"].filter(Boolean).join(" ")}>{getInitials(doctor.name)}</div>
                                        <h3 className="landing-doctor-name">{doctor.name}</h3>
                                        <div className="landing-doctor-specialty">
                                            <span className="badge badge-default">{doctor.specialty}</span>
                                        </div>
                                        <div className="landing-doctor-rating-container">
                                            <Star color="var(--warning)" fill="var(--warning)" size={16} />
                                            <span className="landing-doctor-rating">{doctor.rating}</span>
                                            <span className="text-muted">({doctor.reviews} avis)</span>
                                        </div>
                                        <p className="text-muted landing-doctor-experience">Expérience : {doctor.experience}</p>
                                        <button type="button" className={["btn", "btn-outline", "btn-full"].filter(Boolean).join(" ")}>Voir le profil</button>
                                    </div>
                                </div>
                            )
                        ) : (
                            <p className="text-muted" style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
                                Aucun médecin disponible pour le moment.
                            </p>
                        )}
                    </div>
                </div>
            </section>

            <footer className="landing-footer">
                <div className="landing-footer-content">
                    <p className="text-muted landing-footer-text">© 2026 Medbook. Tous droits réservés.</p>
                </div>
            </footer>
        </div>);

}

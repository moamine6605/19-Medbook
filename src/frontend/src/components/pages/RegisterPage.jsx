import { useState } from 'react';
import { Mail, Lock, User, Phone, Activity, Eye, EyeOff } from 'lucide-react';
import '../../styles/pages/RegisterPage.css';
import {Card} from "../ui/card.jsx";
import {Input} from "../ui/input.jsx";
import {Button} from "../ui/button.jsx";

export function RegisterPage({ onRegister, onLoginClick }) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!formData.fullName || !formData.email || !formData.password) {
            setError('Veuillez remplir tous les champs obligatoires');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (formData.password.length < 6) {
            setError('Le mot de passe doit comporter au moins 6 caractères');
            return;
        }

        onRegister?.(formData);
    };

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="register-container">
            <div className="register-hero">
                <div className="register-hero-content">
                    <h2 className="register-hero-title">
                        Rejoignez Medbook aujourd'hui
                    </h2>
                    <p className="register-hero-subtitle">
                        Créez votre compte et commencez à gérer votre parcours de santé en toute simplicité.
                    </p>
                    <div className="register-hero-features">
                        <div className="register-hero-feature">
                            <span className="register-hero-feature-text">✓ Prise de rendez-vous instantanée</span>
                        </div>
                        <div className="register-hero-feature">
                            <span className="register-hero-feature-text">✓ Accédez à plus de 500 médecins vérifiés</span>
                        </div>
                        <div className="register-hero-feature">
                            <span className="register-hero-feature-text">✓ Gérez tous vos dossiers</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="register-form-container">
                <div className="register-form-wrapper">

                    <div className="register-logo-container">
                        <div className="register-logo-icon">
                            <Activity color="white" />
                        </div>
                        <span className="register-logo-text">Medbook</span>
                    </div>

                    <div className="register-header">
                        <h1>Créer un compte</h1>
                        <p className="text-muted">
                            Commencez votre parcours vers une meilleure santé
                        </p>
                    </div>

                    <Card className="register-card">
                        <form onSubmit={handleSubmit}>
                            <div className="register-input-group">
                                <label className="register-label">Nom complet</label>
                                <div className="register-input-wrapper">
                                    <User className="register-input-icon" size={20} />
                                    <Input
                                        type="text"
                                        placeholder="Jean Dupont"
                                        value={formData.fullName}
                                        onChange={(e) => updateField('fullName', e.target.value)}
                                        className="register-input"
                                    />
                                </div>
                            </div>

                            <div className="register-input-group">
                                <label className="register-label">Adresse E-mail</label>
                                <div className="register-input-wrapper">
                                    <Mail className="register-input-icon" size={20} />
                                    <Input
                                        type="email"
                                        placeholder="vous@exemple.com"
                                        value={formData.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        className="register-input"
                                    />
                                </div>
                            </div>

                            <div className="register-input-group">
                                <label className="register-label">Numéro de téléphone</label>
                                <div className="register-input-wrapper">
                                    <Phone className="register-input-icon" size={20} />
                                    <Input
                                        type="tel"
                                        placeholder="+33 6 00 00 00 00"
                                        value={formData.phone}
                                        onChange={(e) => updateField('phone', e.target.value)}
                                        className="register-input"
                                    />
                                </div>
                            </div>

                            <div className="register-input-group">
                                <label className="register-label">Mot de passe</label>
                                <div className="register-input-wrapper">
                                    <Lock className="register-input-icon" size={20} />
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Créez un mot de passe"
                                        value={formData.password}
                                        onChange={(e) => updateField('password', e.target.value)}
                                        className="register-input-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="register-password-toggle"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="register-input-group-last">
                                <label className="register-label">Confirmer le mot de passe</label>
                                <div className="register-input-wrapper">
                                    <Lock className="register-input-icon" size={20} />
                                    <Input
                                        type="password"
                                        placeholder="Entrez à nouveau votre mot de passe"
                                        value={formData.confirmPassword}
                                        onChange={(e) => updateField('confirmPassword', e.target.value)}
                                        className="register-input"
                                    />
                                </div>
                            </div>

                            {error &&
                                <div className="register-error">
                                    {error}
                                </div>
                            }

                            <div className="register-terms">
                                En vous inscrivant, vous acceptez nos{' '}
                                <a href="#" className="register-link">conditions d'utilisation</a>
                                {' '}et notre{' '}
                                <a href="#" className="register-link">politique de confidentialité</a>
                            </div>

                            <Button type="submit" fullWidth>
                                Créer un compte
                            </Button>
                        </form>

                        <div className="register-footer">
                            Vous avez déjà un compte ?{' '}
                            <button onClick={onLoginClick} className="register-login-btn">
                                Se connecter
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
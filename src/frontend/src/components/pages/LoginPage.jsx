import { useState } from 'react';
import { Mail, Lock, Activity, Eye, EyeOff } from 'lucide-react';
import '../../styles/pages/LoginPage.css';




export function LoginPage({ onLogin, onSignUpClick }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
        await onLogin?.(email, password);
    } catch (err) {
        setError(err.response?.data?.message || 'Identifiants invalides');
    }
  };

  return (
    <div className="login-container">
            <div className="login-form-container">
                <div className="login-form-wrapper">

                    <div className="login-logo-container">
                        <div className="login-logo-icon">
                            <Activity color="white" />
                        </div>
                        <span className="login-logo-text">Medbook</span>
                    </div>

                    <div className="login-header">
                        <h1>Bon retour</h1>
                        <p className="text-muted">
                            Connectez-vous pour accéder à votre tableau de bord santé
                        </p>
                    </div>

                    <div className={["card", "login-card"].filter(Boolean).join(" ")}>
                        <form onSubmit={handleSubmit}>
                            <div className="login-input-group">
                                <label className="login-label">Adresse E-mail</label>
                                <div className="login-input-wrapper">
                                    <Mail className="login-input-icon" size={20} />
                                    <input className={["input",




                  "login-input"].filter(Boolean).join(" ")} type="email" placeholder="vous@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  
                                </div>
                            </div>

                            <div className="login-input-group-last">
                                <label className="login-label">Mot de passe</label>
                                <div className="login-input-wrapper">
                                    <Lock className="login-input-icon" size={20} />
                                    <input className={["input",




                  "login-input-password"].filter(Boolean).join(" ")} type={showPassword ? 'text' : 'password'} placeholder="Entrez votre mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
                  
                                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="login-password-toggle">
                    
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {error &&
              <div className="login-error">
                                    {error}
                                </div>
              }

                            <div className="login-options">
                                <label className="login-remember">
                                    <input type="checkbox" />
                                    <span>Se souvenir de moi</span>
                                </label>
                                <a href="#" className="login-link">
                                    Mot de passe oublié ?
                                </a>
                            </div>

                            <button className={["btn", "btn-primary", "btn-full"].filter(Boolean).join(" ")} type="submit">
                                Se connecter
                            </button>
                        </form>

                        <div className="login-footer">
                            Vous n'avez pas de compte ?{' '}
                            <button onClick={onSignUpClick} className="login-signup-btn">
                                S'inscrire
                            </button>
                        </div>
                    </div>

                    <div className={["card", "login-demo-card"].filter(Boolean).join(" ")}>
                        <p className="login-demo-title">Identifiants de démonstration :</p>
                        <div className="login-demo-content">
                            <p>Patient: patient@demo.com / demo123</p>
                            <p>Médecin: doctor@demo.com / demo123</p>
                            <p>Admin: admin@demo.com / demo123</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="login-hero">
                <div className="login-hero-content">
                    <h2 className="login-hero-title">
                        La santé à portée de main
                    </h2>
                    <p className="login-hero-subtitle">
                        Accédez à vos dossiers médicaux, prenez rendez-vous et gérez votre parcours de santé au même endroit.
                    </p>
                    <div className="login-hero-features">
                        <div className="login-hero-feature">
                            <span className="login-hero-feature-text">✓ Prise de rendez-vous instantanée</span>
                        </div>
                        <div className="login-hero-feature">
                            <span className="login-hero-feature-text">✓ Dossiers médicaux sécurisés</span>
                        </div>
                        <div className="login-hero-feature">
                            <span className="login-hero-feature-text">✓ Accès aux médecins 24h/24 et 7j/7</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>);

}

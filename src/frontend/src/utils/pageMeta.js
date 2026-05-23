const TITLES_BY_PATH = {
  '/': 'Medbook | Accueil',
  '/booking': 'Medbook | Prendre rendez-vous',
  '/login': 'Medbook | Connexion',
  '/register': 'Medbook | Inscription',
  '/patient/dashboard': 'Medbook | Espace patient',
  '/doctor/dashboard': 'Medbook | Espace médecin',
  '/admin/dashboard': 'Medbook | Administration',
  '/admin/appointments': 'Medbook | Rendez-vous',
  '/admin/patients': 'Medbook | Patients',
  '/admin/doctors': 'Medbook | Médecins',
  '/admin/archive': 'Medbook | Archives',
};

export function getPageTitle(pathname) {
  return TITLES_BY_PATH[pathname] || 'Medbook';
}

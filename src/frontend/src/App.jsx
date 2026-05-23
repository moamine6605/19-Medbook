import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router';
import {LandingPage} from "./components/pages/LandingPage.jsx";
import {LoginPage} from "./components/pages/LoginPage.jsx";
import {RegisterPage} from "./components/pages/RegisterPage.jsx";
import {PatientDashboard} from "./components/pages/PatientDashboard.jsx";
import {DoctorDashboard} from "./components/pages/DoctorDashboard.jsx";
import {AdminDashboard} from "./components/pages/AdminDashboard.jsx";
import { BookingPage } from "./components/pages/BookingPage.jsx";
import { AdminAppointmentsPage } from "./components/pages/admin/AdminAppointmentsPage.jsx";
import { AdminPatientsPage } from "./components/pages/admin/AdminPatientsPage.jsx";
import { AdminDoctorsPage } from "./components/pages/admin/AdminDoctorsPage.jsx";
import { AdminArchivePage } from "./components/pages/admin/AdminArchivePage.jsx";
import { login, register, logout, getUser } from './services/api';
import { ToastProvider } from './components/ui/ToastProvider.jsx';
import { onEvent } from './services/events.js';
import { getPageTitle } from './utils/pageMeta.js';



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  return (
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes
              isAuthenticated={isAuthenticated}
              authChecked={authChecked}
              userRole={userRole}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUserRole={setUserRole}
              setUser={setUser}
              setAuthChecked={setAuthChecked} />
        </BrowserRouter>
      </ToastProvider>);

}

function AppRoutes({ isAuthenticated, authChecked, userRole, user, setIsAuthenticated, setUserRole, setUser, setAuthChecked }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getUser();
          setIsAuthenticated(true);
          setUserRole(userData.role);
          setUser(userData);
        } catch (error) {
          console.error('Error getting user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setAuthChecked(true);
    };
    initAuth();
  }, [setIsAuthenticated, setUserRole, setUser, setAuthChecked]);

  // When profile/user data changes elsewhere, refresh the in-memory user so headers update.
  useEffect(() => {
    const off = onEvent('user:changed', async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const userData = await getUser();
        setIsAuthenticated(true);
        setUserRole(userData.role);
        setUser(userData);
      } catch {
        // Ignore; auth state can recover on next navigation.
      }
    });
    return () => off();
  }, [setIsAuthenticated, setUserRole, setUser]);

  useEffect(() => {
    document.title = getPageTitle(location.pathname);
  }, [location.pathname]);

  // Remember the last visited admin route so refresh/server redirects can restore it.
  useEffect(() => {
    if (userRole !== 'admin') return;
    if (!location.pathname.startsWith('/admin/')) return;
    localStorage.setItem('last_admin_path', `${location.pathname}${location.search}${location.hash}`);
  }, [userRole, location.pathname, location.search, location.hash]);

  // If we land on /admin/dashboard but we previously visited another admin section, restore it.
  useEffect(() => {
    if (!isAuthenticated || userRole !== 'admin') return;
    if (location.pathname !== '/admin/dashboard') return;
    const last = localStorage.getItem('last_admin_path');
    if (!last || !last.startsWith('/admin/')) return;
    if (last === '/admin/dashboard') return;
    navigate(last, { replace: true });
  }, [isAuthenticated, userRole, location.pathname, navigate]);

  const handleLogin = async (email, password) => {
    const data = await login(email, password);
    setIsAuthenticated(true);
    setUserRole(data.user.role);
    setUser(data.user);

    // Navigate based on role
    if (data.user.role === 'doctor') {
      navigate('/doctor/dashboard');
    } else if (data.user.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/patient/dashboard');
    }
  };

  const handleRegister = async (data) => {
    const res = await register(data.fullName, data.email, data.password);
    setUserRole(res.user.role);
    setUser(res.user);
    setIsAuthenticated(true);
    navigate('/patient/dashboard');
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setUserRole(null);
    setUser(null);
    navigate('/');
  };

  const handleDashboardClick = () => {
    if (userRole === 'doctor') {
      navigate('/doctor/dashboard');
    } else if (userRole === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/patient/dashboard');
    }
  };

  return (
      <Routes>
        {/* Public Routes */}
        <Route
            path="/"
            element={
              <LandingPage
                  isAuthenticated={isAuthenticated}
                  authChecked={authChecked}
                  user={user}
                  onLogout={handleLogout}
                  onDashboardClick={handleDashboardClick}
                  onGetStarted={() => navigate('/booking')}
                  onLoginClick={() => navigate('/login')}
                  onSignUpClick={() => navigate('/register')} />

            } />

        <Route
            path="/booking"
            element={
              !authChecked ? (
                <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>Chargement...</p>
              ) : (
                <BookingPage
                    isAuthenticated={isAuthenticated}
                    onBookingComplete={() => navigate(isAuthenticated ? '/patient/dashboard' : '/login')} />
              )
            } />

        <Route
            path="/login"
            element={
              !authChecked ? (
                <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>Chargement...</p>
              ) : isAuthenticated ?
                  <Navigate to={userRole === 'doctor' ? '/doctor/dashboard' : userRole === 'admin' ? '/admin/dashboard' : '/patient/dashboard'} /> :

                  <LoginPage
                      onLogin={handleLogin}
                      onSignUpClick={() => navigate('/register')}
                      onHomeClick={() => navigate('/')} />


            } />

        <Route
            path="/register"
            element={
              !authChecked ? (
                <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>Chargement...</p>
              ) : isAuthenticated ?
                  <Navigate to="/patient/dashboard" /> :

                  <RegisterPage
                      onRegister={handleRegister}
                      onLoginClick={() => navigate('/login')}
                      onHomeClick={() => navigate('/')} />


            } />

        {/* Patient Routes */}
        <Route
            path="/patient/dashboard"
            element={
              !authChecked ? (
                <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>Chargement...</p>
              ) : isAuthenticated && userRole === 'patient' ?
                  <PatientDashboard user={user} onLogout={handleLogout} onHomeClick={() => navigate('/')} onNavigate={(path) => navigate(path)} /> :

                  <Navigate to="/login" />

            } />


        {/* Doctor Routes */}
        <Route
            path="/doctor/dashboard"
            element={
              !authChecked ? (
                <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>Chargement...</p>
              ) : isAuthenticated && userRole === 'doctor' ?
                  <DoctorDashboard user={user} onLogout={handleLogout} onHomeClick={() => navigate('/')} /> :

                  <Navigate to="/login" />

            } />


        {/* Admin Routes */}
        <Route
            path="/admin/dashboard"
            element={
              !authChecked ? (
                <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>Chargement...</p>
              ) : isAuthenticated && userRole === 'admin' ?
                  <AdminDashboard user={user} onLogout={handleLogout} onHomeClick={() => navigate('/')} /> :

                  <Navigate to="/login" />

            } />

        <Route
            path="/admin/appointments"
            element={
              !authChecked ? (
                <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>Chargement...</p>
              ) : isAuthenticated && userRole === 'admin' ?
                  <AdminAppointmentsPage user={user} onLogout={handleLogout} onHomeClick={() => navigate('/')} /> :

                  <Navigate to="/login" />

            } />

        <Route
            path="/admin/patients"
            element={
              !authChecked ? (
                <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>Chargement...</p>
              ) : isAuthenticated && userRole === 'admin' ?
                  <AdminPatientsPage user={user} onLogout={handleLogout} onHomeClick={() => navigate('/')} /> :

                  <Navigate to="/login" />

            } />

        <Route
            path="/admin/doctors"
            element={
              !authChecked ? (
                <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>Chargement...</p>
              ) : isAuthenticated && userRole === 'admin' ?
                  <AdminDoctorsPage user={user} onLogout={handleLogout} onHomeClick={() => navigate('/')} /> :

                  <Navigate to="/login" />

            } />

        <Route
            path="/admin/archive"
            element={
              !authChecked ? (
                <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>Chargement...</p>
              ) : isAuthenticated && userRole === 'admin' ?
                  <AdminArchivePage user={user} onLogout={handleLogout} onHomeClick={() => navigate('/')} /> :

                  <Navigate to="/login" />

            } />


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>);

}

export default App;

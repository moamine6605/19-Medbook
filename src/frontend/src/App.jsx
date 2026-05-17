import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router';
import {LandingPage} from "./components/pages/LandingPage.jsx";
import {LoginPage} from "./components/pages/LoginPage.jsx";
import {RegisterPage} from "./components/pages/RegisterPage.jsx";
import {PatientDashboard} from "./components/pages/PatientDashboard.jsx";
import {BookingPage} from "./components/pages/BookingPage.jsx";
import {DoctorDashboard} from "./components/pages/DoctorDashboard.jsx";
import {AdminDashboard} from "./components/pages/AdminDashboard.jsx";
import { login, register, logout, getUser } from './services/api';



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);

  return (
      <BrowserRouter>
        <AppRoutes
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            user={user}
            setIsAuthenticated={setIsAuthenticated}
            setUserRole={setUserRole}
            setUser={setUser} />

      </BrowserRouter>);

}

function AppRoutes({ isAuthenticated, userRole, user, setIsAuthenticated, setUserRole, setUser }) {
  const navigate = useNavigate();

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
    };
    initAuth();
  }, [setIsAuthenticated, setUserRole, setUser]);

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
                  user={user}
                  onLogout={handleLogout}
                  onDashboardClick={handleDashboardClick}
                  onGetStarted={() => navigate('/booking')}
                  onLoginClick={() => navigate('/login')}
                  onSignUpClick={() => navigate('/register')} />

            } />

        <Route
            path="/login"
            element={
              isAuthenticated ?
                  <Navigate to={userRole === 'doctor' ? '/doctor/dashboard' : userRole === 'admin' ? '/admin/dashboard' : '/patient/dashboard'} /> :

                  <LoginPage
                      onLogin={handleLogin}
                      onSignUpClick={() => navigate('/register')}
                      onHomeClick={() => navigate('/')} />


            } />

        <Route
            path="/register"
            element={
              isAuthenticated ?
                  <Navigate to="/patient/dashboard" /> :

                  <RegisterPage
                      onRegister={handleRegister}
                      onLoginClick={() => navigate('/login')}
                      onHomeClick={() => navigate('/')} />


            } />


        {/* Booking Route - Can be accessed by non-authenticated users */}
        <Route
            path="/booking"
            element={
              <BookingPage
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                  onLoginClick={() => navigate('/login')}
                  onSignUpClick={() => navigate('/register')}
                  onHomeClick={() => navigate('/')}
                  onBookingComplete={() => {
                    if (isAuthenticated) {
                      navigate('/patient/dashboard');
                    } else {
                      navigate('/login');
                    }
                  }} />

            } />


        {/* Patient Routes */}
        <Route
            path="/patient/dashboard"
            element={
              isAuthenticated && userRole === 'patient' ?
                  <PatientDashboard user={user} onLogout={handleLogout} onHomeClick={() => navigate('/')} onNavigate={(path) => navigate(path)} /> :

                  <Navigate to="/login" />

            } />


        {/* Doctor Routes */}
        <Route
            path="/doctor/dashboard"
            element={
              isAuthenticated && userRole === 'doctor' ?
                  <DoctorDashboard user={user} onLogout={handleLogout} onHomeClick={() => navigate('/')} /> :

                  <Navigate to="/login" />

            } />


        {/* Admin Routes */}
        <Route
            path="/admin/dashboard"
            element={
              isAuthenticated && userRole === 'admin' ?
                  <AdminDashboard user={user} onLogout={handleLogout} onHomeClick={() => navigate('/')} /> :

                  <Navigate to="/login" />

            } />


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>);

}

export default App;
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

  return (
      <BrowserRouter>
        <AppRoutes
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            setIsAuthenticated={setIsAuthenticated}
            setUserRole={setUserRole} />

      </BrowserRouter>);

}

function AppRoutes({ isAuthenticated, userRole, setIsAuthenticated, setUserRole }) {
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await getUser();
          setIsAuthenticated(true);
          setUserRole(user.role);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    };
    initAuth();
  }, [setIsAuthenticated, setUserRole]);

  const handleLogin = async (email, password) => {
    const data = await login(email, password);
    setIsAuthenticated(true);
    setUserRole(data.user.role);

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
    setIsAuthenticated(true);
    navigate('/patient/dashboard');
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/');
  };

  return (
      <Routes>
        {/* Public Routes */}
        <Route
            path="/"
            element={
              <LandingPage
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
                      onSignUpClick={() => navigate('/register')} />


            } />

        <Route
            path="/register"
            element={
              isAuthenticated ?
                  <Navigate to="/patient/dashboard" /> :

                  <RegisterPage
                      onRegister={handleRegister}
                      onLoginClick={() => navigate('/login')} />


            } />


        {/* Booking Route - Can be accessed by non-authenticated users */}
        <Route
            path="/booking"
            element={
              <BookingPage
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
                  <PatientDashboard onLogout={handleLogout} /> :

                  <Navigate to="/login" />

            } />


        {/* Doctor Routes */}
        <Route
            path="/doctor/dashboard"
            element={
              isAuthenticated && userRole === 'doctor' ?
                  <DoctorDashboard onLogout={handleLogout} /> :

                  <Navigate to="/login" />

            } />


        {/* Admin Routes */}
        <Route
            path="/admin/dashboard"
            element={
              isAuthenticated && userRole === 'admin' ?
                  <AdminDashboard onLogout={handleLogout} /> :

                  <Navigate to="/login" />

            } />


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>);

}

export default App;
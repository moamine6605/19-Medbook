import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { BookingPage } from './pages/BookingPage';



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

  const handleLogin = (email, password) => {
    // Demo login logic - check email to determine role
    if (email.includes('patient')) {
      setUserRole('patient');
    } else if (email.includes('doctor')) {
      setUserRole('doctor');
    } else if (email.includes('admin')) {
      setUserRole('admin');
    } else {
      // Default to patient role
      setUserRole('patient');
    }
    setIsAuthenticated(true);

    // Navigate based on role
    if (email.includes('doctor')) {
      navigate('/doctor/dashboard');
    } else if (email.includes('admin')) {
      navigate('/admin/dashboard');
    } else {
      navigate('/patient/dashboard');
    }
  };

  const handleRegister = (data) => {
    // Demo registration - default to patient
    setUserRole('patient');
    setIsAuthenticated(true);
    navigate('/patient/dashboard');
  };

  const handleLogout = () => {
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
                  <PatientDashboard /> :

                  <Navigate to="/login" />

            } />


        {/* Doctor Routes */}
        <Route
            path="/doctor/dashboard"
            element={
              isAuthenticated && userRole === 'doctor' ?
                  <DoctorDashboard /> :

                  <Navigate to="/login" />

            } />


        {/* Admin Routes */}
        <Route
            path="/admin/dashboard"
            element={
              isAuthenticated && userRole === 'admin' ?
                  <AdminDashboard /> :

                  <Navigate to="/login" />

            } />


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>);

}

export default App;
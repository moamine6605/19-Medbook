import axios from 'axios';

const API_BASE_URL =
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ?
        import.meta.env.VITE_API_BASE_URL :
        'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const logout = async () => {
    try {
        await api.post('/auth/logout');
    } catch (e) {
        console.error('Logout error', e);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getUser = async () => {
    const response = await api.get('/auth/user');
    return response.data;
};

export const getFeaturedDoctors = async () => {
    const response = await api.get('/doctors/featured');
    return response.data;
};

export const getPublicStats = async () => {
    const response = await api.get('/stats/public');
    return response.data;
};

export const getPatientStats = async () => {
    const response = await api.get('/patient/stats');
    return response.data;
};

export const getPatientAppointments = async () => {
    const response = await api.get('/patient/appointments', { params: { scope: 'upcoming' } });
    return response.data;
};

export const getPatientAppointmentsAll = async () => {
    const response = await api.get('/patient/appointments', { params: { scope: 'all' } });
    return response.data;
};

export const getPatientAppointmentsPast = async () => {
    const response = await api.get('/patient/appointments', { params: { scope: 'past' } });
    return response.data;
};

export const getPatientActivity = async () => {
    const response = await api.get('/patient/activity');
    return response.data;
};

export const getDoctorStats = async () => {
    const response = await api.get('/doctor/stats');
    return response.data;
};

export const getDoctorTodayAppointments = async () => {
    const response = await api.get('/doctor/appointments/today');
    return response.data;
};

export const getDoctorAppointments = async ({ scope = 'today' } = {}) => {
    const response = await api.get('/doctor/appointments', { params: { scope } });
    return response.data;
};

export const updateDoctorAppointmentStatus = async (appointmentId, status) => {
    const response = await api.patch(`/doctor/appointments/${appointmentId}/status`, { status });
    return response.data;
};

export const getDoctorRecentPatients = async () => {
    const response = await api.get('/doctor/patients/recent');
    return response.data;
};

export const getDoctorPatientsAll = async ({ q = '' } = {}) => {
    const response = await api.get('/doctor/patients', { params: { q } });
    return response.data;
};

export const getDoctorMonthlySummary = async () => {
    const response = await api.get('/doctor/monthly-summary');
    return response.data;
};

export const getAdminStats = async () => {
    const response = await api.get('/admin/stats');
    return response.data;
};

export const getAdminAppointmentsAnalytics = async () => {
    const response = await api.get('/admin/analytics/appointments');
    return response.data;
};

export const getAdminRevenueAnalytics = async () => {
    const response = await api.get('/admin/analytics/revenue');
    return response.data;
};

export const getAdminTopDoctors = async () => {
    const response = await api.get('/admin/doctors/top');
    return response.data;
};

export const getAdminActivity = async () => {
    const response = await api.get('/admin/activity');
    return response.data;
};

export const getAdminAppointments = async ({ q = '', timing = 'all', range = 'all', date = '' } = {}) => {
    const response = await api.get('/admin/appointments', { params: { q, timing, range, date } });
    return response.data;
};

export const getAdminPatients = async ({ q = '' } = {}) => {
    const response = await api.get('/admin/patients', { params: { q } });
    return response.data;
};

export const getAdminDoctors = async ({ q = '', min_rating = '' } = {}) => {
    const response = await api.get('/admin/doctors', { params: { q, min_rating } });
    return response.data;
};

export const createAdminPatient = async (data) => {
    const response = await api.post('/admin/patients', data);
    return response.data;
};

export const createAdminDoctor = async (data) => {
    const response = await api.post('/admin/doctors', data);
    return response.data;
};

export const createAdminAppointment = async (data) => {
    const response = await api.post('/admin/appointments', data);
    return response.data;
};

export const getSpecialties = async () => {
    const response = await api.get('/specialties');
    return response.data;
};

export const getDoctorsBySpecialty = async (specialty) => {
    const response = await api.get('/doctors', { params: { specialty } });
    return response.data;
};

export const getDoctorAvailability = async (doctorId, date) => {
    const response = await api.get(`/doctors/${doctorId}/availability`, { params: { date } });
    return response.data;
};

export const createAppointment = async (data) => {
    const response = await api.post('/patient/appointments', data);
    return response.data;
};

export const updateAppointment = async (id, data) => {
    const response = await api.put(`/patient/appointments/${id}`, data);
    return response.data;
};

export const deleteAppointment = async (id) => {
    const response = await api.delete(`/patient/appointments/${id}`);
    return response.data;
};

export const getDoctorProfile = async () => {
    const response = await api.get('/doctor/profile');
    return response.data;
};

export const updateDoctorProfile = async (data) => {
    const response = await api.put('/doctor/profile', data);
    return response.data;
};

export const getDoctorSlots = async (date = '') => {
    const response = await api.get('/doctor/slots', { params: date ? { date } : {} });
    return response.data;
};

export const addDoctorSlot = async (data) => {
    const response = await api.post('/doctor/slots', data);
    return response.data;
};

export const deleteDoctorSlot = async (slotId) => {
    const response = await api.delete(`/doctor/slots/${slotId}`);
    return response.data;
};

export const adminUpdateUser = async (userId, data) => {
    const response = await api.patch(`/admin/users/${userId}`, data);
    return response.data;
};

export const adminDeleteUser = async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
};

export default api;

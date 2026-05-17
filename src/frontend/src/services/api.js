import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
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
    const response = await api.post('/login', { email, password });
    if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const register = async (name, email, password) => {
    const response = await api.post('/register', { name, email, password });
    if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const logout = async () => {
    try {
        await api.post('/logout');
    } catch (e) {
        console.error('Logout error', e);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getUser = async () => {
    const response = await api.get('/user');
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
    const response = await api.get('/patient/appointments');
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

export const getDoctorRecentPatients = async () => {
    const response = await api.get('/doctor/patients/recent');
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

export const getSpecialties = async () => {
    const response = await api.get('/specialties');
    return response.data;
};

export const getDoctorsBySpecialty = async (specialty) => {
    const response = await api.get('/doctors', { params: { specialty } });
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

export default api;

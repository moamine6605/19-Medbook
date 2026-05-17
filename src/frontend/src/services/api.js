import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
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

export default api;

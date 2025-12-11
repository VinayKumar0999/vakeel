import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const lawyerAPI = {
  getAll: (params?: any) => api.get('/lawyers', { params }),
  getById: (id: string) => api.get(`/lawyers/${id}`),
  create: (data: any) => api.post('/lawyers', data),
  update: (id: string, data: any) => api.put(`/lawyers/${id}`, data),
  delete: (id: string) => api.delete(`/lawyers/${id}`),
};

export const authAPI = {
  login: (credentials: { email: string; password: string }) => api.post('/auth/login', credentials),
  register: (data: any) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

export const bookingAPI = {
  create: (data: any) => api.post('/bookings', data),
  getById: (id: string) => api.get(`/bookings/${id}`),
  getUserBookings: () => api.get('/bookings/user'),
  getLawyerBookings: () => api.get('/bookings/lawyer'),
  update: (id: string, data: any) => api.put(`/bookings/${id}`, data),
};

export const reviewAPI = {
  create: (data: any) => api.post('/reviews', data),
  getLawyerReviews: (lawyerId: string) => api.get(`/reviews/lawyer/${lawyerId}`),
};

export default api;

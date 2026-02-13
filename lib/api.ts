import axios from 'axios';

// Use Next.js API routes by default; set NEXT_PUBLIC_USE_NEXT_API=false to use external backend
const API_BASE_URL = process.env.NEXT_PUBLIC_USE_NEXT_API === 'false'
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api')
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests (auth store persists as "auth-storage" with state.token)
api.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config;
  let token: string | null = null;
  try {
    const raw = localStorage.getItem('auth-storage');
    if (raw) {
      const parsed = JSON.parse(raw);
      token = parsed?.state?.token ?? null;
    }
  } catch {
    // ignore
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const lawyerAPI = {
  getAll: (params?: any) => api.get('/lawyers', { params }),
  getById: (id: string) => api.get(`/lawyers/${id}`),
  getAvailability: (lawyerId: string, date: string) =>
    api.get(`/lawyers/${lawyerId}/availability`, { params: { date } }),
  create: (data: any) => api.post('/lawyers', data),
  update: (id: string, data: any) => api.put(`/lawyers/${id}`, data),
  delete: (id: string) => api.delete(`/lawyers/${id}`),
};

export const authAPI = {
  login: (credentials: { email: string; password: string }) => api.post('/auth/login', credentials),
  register: (data: any) => {
    // If data is FormData, use multipart/form-data headers
    if (data instanceof FormData) {
      return api.post('/auth/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.post('/auth/register', data);
  },
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

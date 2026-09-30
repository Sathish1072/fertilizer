import axios from 'axios';

// Detect API base URL: directly use http://localhost:5000/api in local development
const getApiBase = () => {
  if (typeof window !== 'undefined' && window.location) {
    const { hostname, port } = window.location;
    if ((hostname === 'localhost' || hostname === '127.0.0.1') && port !== '5000') {
      return 'http://localhost:5000/api';
    }
  }
  return process.env.REACT_APP_API_URL || '/api';
};

const API_BASE = getApiBase();

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token safely
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token && typeof token === 'string' && token.length > 10 && token.length < 2048) {
        config.headers.Authorization = `Bearer ${token}`;
      } else if (token && token.length >= 2048) {
        localStorage.removeItem('token');
      }
    } catch {
      // Ignore localStorage access errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// Auth endpoints
export const authAPI = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  updateProfile: async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    return res.data;
  },
};

// Products endpoints
export const productsAPI = {
  getAll: async (params = {}) => {
    const res = await api.get('/products', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
  create: async (productData) => {
    const res = await api.post('/products', productData);
    return res.data;
  },
  update: async (id, productData) => {
    const res = await api.put(`/products/${id}`, productData);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
  resetSeed: async () => {
    const res = await api.post('/products/reset-seed');
    return res.data;
  },
};

// Orders endpoints
export const ordersAPI = {
  create: async (orderData) => {
    const res = await api.post('/orders', orderData);
    return res.data;
  },
  getMyOrders: async () => {
    const res = await api.get('/orders/my-orders');
    return res.data;
  },
  getById: async (orderId) => {
    const res = await api.get(`/orders/${orderId}`);
    return res.data;
  },
  getAllOrders: async () => {
    const res = await api.get('/orders/admin/all');
    return res.data;
  },
  updateStatus: async (orderId, status, note) => {
    const res = await api.put(`/orders/${orderId}/status`, { status, note });
    return res.data;
  },
};

// Admin endpoints
export const adminAPI = {
  getStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  },
};

// System / DB Health
export const healthAPI = {
  checkHealth: async () => {
    const res = await api.get('/health');
    return res.data;
  },
};

export default api;

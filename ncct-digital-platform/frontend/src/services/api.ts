import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ncct_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async (phone: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append('username', phone);
  formData.append('password', password);

  const response = await api.post('/api/v1/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  
  if (response.data.access_token) {
    localStorage.setItem('ncct_token', response.data.access_token);
  }
  return response.data;
};

export const registerUser = async (userData: {
  full_name: string;
  phone: string;
  email: string;
  password: string;
  role: string;
}) => {
  const response = await api.post('/api/v1/auth/register', userData);
  return response.data;
};

export default api;
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8082',
  withCredentials: true
});

// Add request interceptor to include token
api.interceptors.request.use(
  config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Add response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
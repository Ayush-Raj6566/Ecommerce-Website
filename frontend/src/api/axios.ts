// frontend/src/api/axios.ts
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust if backend URL changes
});

// Always attach token if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default API;

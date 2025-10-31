import axios from 'axios';

// This is the "base" for all our API calls
const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Your backend URL
});

// This is a "magic" interceptor.
// It runs before EVERY request and adds the 'Authorization' header
// if we have a token saved.
api.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

export default api;
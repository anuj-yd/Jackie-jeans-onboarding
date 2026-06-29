import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const saveProfile = async (profileData) => {
  const response = await api.post('/profile', profileData);
  return response.data;
};

export default api;

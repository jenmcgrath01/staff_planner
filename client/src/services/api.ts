import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE,
});

export const getApiUrl = (path: string) => `${API_BASE}${path}`; 
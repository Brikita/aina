import axios from "axios";

const API_BASE = 'https://juvenile-explain-watched-wash.trycloudflare.com';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

// Counties
export const getCounties = () => api.get('/counties/');

// Sub-Counties
export const getSubCounties = () => api.get('/subcounties/');

// Warnings
export const getWarnings = () => api.get('/warnings/');
export const getWarningsByCounty = (county: string) => api.get(`/warnings/county/${county}`);

// Assets
export const getAssets = () => api.get('/assets/');
export const getAssetsByCounty = (county: string) => api.get(`/assets/county/${county}`);

// Decision Intelligence
export const generateDecision = (data: unknown) => api.post('/generate-decision', data);

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/');

export default api;
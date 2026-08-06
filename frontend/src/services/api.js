import axios from 'axios';

// ============================================
// API CONFIGURATION
// ============================================

const API_BASE = 'https://juvenile-explain-watched-wash.trycloudflare.com';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // No response from server
      console.error('API Network Error:', error.message);
    } else {
      // Other errors
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ============================================
// COUNTIES ENDPOINTS
// ============================================

export const getCounties = () => api.get('/counties/');
export const getCountyByName = (name) => api.get(`/counties/${encodeURIComponent(name)}`);

// ============================================
// SUB-COUNTIES ENDPOINTS
// ============================================

export const getSubCounties = () => api.get('/subcounties/');
export const getSubCountyByName = (name) => api.get(`/subcounties/${encodeURIComponent(name)}`);
export const getSubCountiesByCounty = (county) => api.get(`/subcounties/county/${encodeURIComponent(county)}`);

// ============================================
// WARDS ENDPOINTS
// ============================================

export const getWards = () => api.get('/wards/');
export const getWardById = (id) => api.get(`/wards/${id}`);
export const getWardsBySubCounty = (subCounty) => api.get(`/wards/subcounty/${encodeURIComponent(subCounty)}`);

// ============================================
// VILLAGES ENDPOINTS
// ============================================

export const getVillages = () => api.get('/villages/');
export const getVillagesByWard = (wardId) => api.get(`/villages/ward/${wardId}`);

// ============================================
// WARNINGS ENDPOINTS
// ============================================

export const getWarnings = () => api.get('/warnings/');
export const getWarningById = (id) => api.get(`/warnings/${id}`);
export const getWarningsByCounty = (county) => api.get(`/warnings/county/${encodeURIComponent(county)}`);
export const createWarning = (data) => api.post('/warnings/', data);

// ============================================
// ASSETS ENDPOINTS
// ============================================

export const getAssets = () => api.get('/assets/');
export const getAssetById = (id) => api.get(`/assets/${id}`);
export const getAssetsByCounty = (county) => api.get(`/assets/county/${encodeURIComponent(county)}`);

// ============================================
// DASHBOARD ENDPOINTS
// ============================================

export const getDashboardStats = () => api.get('/dashboard/');

// ============================================
// DECISION INTELLIGENCE ENDPOINTS
// ============================================

export const generateDecision = (data) => api.post('/generate-decision', data);

// ============================================
// IMPACT / EXPOSURE ENDPOINTS
// ============================================

export const getImpact = (warningId) => api.get(`/impact/${warningId}`);
export const getExposure = (warningId) => api.get(`/exposure/${warningId}`);

// ============================================
// RECOMMENDATIONS / ALLOCATIONS / SIMULATION
// ============================================

export const getRecommendations = (warningId) => api.get(`/recommendations/${warningId}`);
export const getAllocations = (warningId) => api.get(`/allocation/${warningId}`);
export const getSimulation = (warningId) => api.get(`/simulation/${warningId}`);

// ============================================
// IGAD COUNTRIES ENDPOINTS
// ============================================

export const getCountries = () => api.get('/countries/');
export const getCountryByName = (name) => api.get(`/countries/${encodeURIComponent(name)}`);

// ============================================
// DEFAULT EXPORT
// ============================================

export default api;
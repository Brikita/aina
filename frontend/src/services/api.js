import axios from 'axios';

// ============================================
// API CONFIGURATION
// ============================================

const API_BASE = 'https://juvenile-explain-watched-wash.trycloudflare.com';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

// ============================================
// WARNINGS ENDPOINTS
// ============================================

export const getWarnings = () => api.get('/warnings/');
export const getWarningById = (warningId) => api.get(`/warnings/${warningId}`);
export const createWarning = (data) => api.post('/warnings/', data);

// ============================================
// ASSETS ENDPOINTS
// ============================================

export const getAssets = () => api.get('/assets/');
export const getAssetById = (assetId) => api.get(`/assets/${assetId}`);
export const getAssetsByCounty = (county) => api.get(`/assets/county/${county}`);

// ============================================
// COUNTIES ENDPOINTS
// ============================================

export const getCounties = () => api.get('/counties/');
export const getCountyByName = (countyName) => api.get(`/counties/${countyName}`);

// ============================================
// SUB-COUNTIES ENDPOINTS
// ============================================

export const getSubCounties = () => api.get('/subcounties/');
export const getSubCountyByName = (subCountyName) => api.get(`/subcounties/${subCountyName}`);

// ============================================
// IMPACT ENDPOINTS
// ============================================

export const getImpact = (warningId) => api.get(`/impact/${warningId}`);
export const getExposure = (warningId) => api.get(`/exposure/${warningId}`);

// ============================================
// RECOMMENDATIONS ENDPOINTS
// ============================================

export const getRecommendations = (warningId) => api.get(`/recommendations/${warningId}`);

// ============================================
// ALLOCATIONS ENDPOINTS
// ============================================

export const getAllocations = (warningId) => api.get(`/allocation/${warningId}`);

// ============================================
// SIMULATION ENDPOINTS
// ============================================

export const getSimulation = (warningId) => api.get(`/simulation/${warningId}`);

// ============================================
// DASHBOARD ENDPOINTS
// ============================================

export const getDashboardStats = () => api.get('/dashboard/');

// ============================================
// LEGACY ENDPOINTS (Keep for backward compatibility)
// ============================================

export const getWards = () => api.get('/wards');
export const getWardRisk = (id) => api.get(`/wards/${id}/risk`);
export const getWaterPoints = () => api.get('/water-points');
export const getConflictEvents = (days = 30) => api.get(`/conflict-events?days=${days}`);
export const getMarkets = () => api.get('/markets');
export const getCorridors = () => api.get('/corridors');

export const getRecommendation = (actorType, actorId, wardId) =>
  api.get(`/recommendations/${actorType}/${actorId}?ward_id=${wardId}`);

export const sendSmsQuery = (message, location) =>
  api.post('/sms-simulator/query', { message, location });

export const logEvent = (event) => api.post('/observatory/events', event);
export const getTimeline = (warningId) => api.get(`/observatory/events/${warningId}`);

export default api;
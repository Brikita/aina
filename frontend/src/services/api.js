import axios from 'axios';
import {
  FALLBACK_COUNTIES,
  FALLBACK_WARNINGS,
  FALLBACK_ASSETS,
  FALLBACK_SUBCOUNTIES,
  FALLBACK_IGAD_COUNTRIES,
  FALLBACK_DASHBOARD_STATS,
  FALLBACK_DECISION_RESPONSE,
} from '../data/fallbackData';

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
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('API Network Error:', error.message);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ============================================
// HELPER: Simulate API Delay
// ============================================

const simulateDelay = (data, delay = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data }), delay);
  });
};

// ============================================
// COUNTIES ENDPOINTS (With Fallback)
// ============================================

export const getCounties = async () => {
  try {
    const response = await api.get('/counties/');
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback counties');
    return simulateDelay(FALLBACK_COUNTIES);
  }
};

export const getCountyByName = async (name) => {
  try {
    const response = await api.get(`/counties/${encodeURIComponent(name)}`);
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback county');
    const county = FALLBACK_COUNTIES.find(c => c.name === name);
    return simulateDelay(county || FALLBACK_COUNTIES[0]);
  }
};

// ============================================
// SUB-COUNTIES ENDPOINTS (With Fallback)
// ============================================

export const getSubCounties = async () => {
  try {
    const response = await api.get('/subcounties/');
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback sub-counties');
    return simulateDelay(FALLBACK_SUBCOUNTIES);
  }
};

export const getSubCountyByName = async (name) => {
  try {
    const response = await api.get(`/subcounties/${encodeURIComponent(name)}`);
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback sub-county');
    const subCounty = FALLBACK_SUBCOUNTIES.find(s => s.name === name);
    return simulateDelay(subCounty || FALLBACK_SUBCOUNTIES[0]);
  }
};

export const getSubCountiesByCounty = async (county) => {
  try {
    const response = await api.get(`/subcounties/county/${encodeURIComponent(county)}`);
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback sub-counties by county');
    const filtered = FALLBACK_SUBCOUNTIES.filter(s => s.county === county);
    return simulateDelay(filtered);
  }
};

// ============================================
// WARDS ENDPOINTS
// ============================================

export const getWards = async () => {
  try {
    const response = await api.get('/wards/');
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback wards');
    return simulateDelay([]);
  }
};

export const getWardById = async (id) => {
  try {
    const response = await api.get(`/wards/${id}`);
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback ward');
    return simulateDelay({ id, name: 'Fallback Ward' });
  }
};

export const getWardsBySubCounty = async (subCounty) => {
  try {
    const response = await api.get(`/wards/subcounty/${encodeURIComponent(subCounty)}`);
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback wards');
    return simulateDelay([]);
  }
};

// ============================================
// VILLAGES ENDPOINTS
// ============================================

export const getVillages = async () => {
  try {
    const response = await api.get('/villages/');
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback villages');
    return simulateDelay([]);
  }
};

export const getVillagesByWard = async (wardId) => {
  try {
    const response = await api.get(`/villages/ward/${wardId}`);
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback villages');
    return simulateDelay([]);
  }
};

// ============================================
// WARNINGS ENDPOINTS (With Fallback)
// ============================================

export const getWarnings = async () => {
  try {
    const response = await api.get('/warnings/');
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback warnings');
    return simulateDelay(FALLBACK_WARNINGS);
  }
};

export const getWarningById = async (id) => {
  try {
    const response = await api.get(`/warnings/${id}`);
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback warning');
    const warning = FALLBACK_WARNINGS.find(w => w.id === id);
    return simulateDelay(warning || FALLBACK_WARNINGS[0]);
  }
};

export const getWarningsByCounty = async (county) => {
  try {
    const response = await api.get(`/warnings/county/${encodeURIComponent(county)}`);
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback warnings by county');
    const filtered = FALLBACK_WARNINGS.filter(w => w.county === county);
    return simulateDelay(filtered);
  }
};

export const createWarning = async (data) => {
  try {
    const response = await api.post('/warnings/', data);
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - simulating warning creation');
    return simulateDelay({ id: Date.now(), ...data, status: 'Active' });
  }
};

// ============================================
// ASSETS ENDPOINTS (With Fallback)
// ============================================

export const getAssets = async () => {
  try {
    const response = await api.get('/assets/');
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback assets');
    return simulateDelay(FALLBACK_ASSETS);
  }
};

export const getAssetById = async (id) => {
  try {
    const response = await api.get(`/assets/${id}`);
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback asset');
    const asset = FALLBACK_ASSETS.find(a => a.id === id);
    return simulateDelay(asset || FALLBACK_ASSETS[0]);
  }
};

export const getAssetsByCounty = async (county) => {
  try {
    const response = await api.get(`/assets/county/${encodeURIComponent(county)}`);
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback assets by county');
    const filtered = FALLBACK_ASSETS.filter(a => a.county === county);
    return simulateDelay(filtered);
  }
};

// ============================================
// DASHBOARD ENDPOINTS (With Fallback)
// ============================================

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/');
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback dashboard stats');
    return simulateDelay(FALLBACK_DASHBOARD_STATS);
  }
};

// ============================================
// DECISION INTELLIGENCE ENDPOINTS (With Fallback)
// ============================================

export const generateDecision = async (data) => {
  try {
    const response = await api.post('/generate-decision', data);
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback decision response');
    return simulateDelay({
      ...FALLBACK_DECISION_RESPONSE,
      // Customize for the requested county
      recommendations: FALLBACK_DECISION_RESPONSE.recommendations.map(r => 
        r.replace('affected areas', data.name || 'the region')
      ),
    });
  }
};

// ============================================
// IMPACT / EXPOSURE ENDPOINTS
// ============================================

export const getImpact = async (warningId) => {
  try {
    const response = await api.get(`/impact/${warningId}`);
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback impact data');
    return simulateDelay({
      warningId,
      affected_population: 15000,
      displaced: 2000,
      affected_wards: 3,
    });
  }
};

export const getExposure = async (warningId) => {
  try {
    const response = await api.get(`/exposure/${warningId}`);
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback exposure data');
    return simulateDelay({
      warningId,
      exposure_level: 'High',
      vulnerability: 'Medium',
    });
  }
};

// ============================================
// RECOMMENDATIONS / ALLOCATIONS / SIMULATION
// ============================================

export const getRecommendations = async (warningId) => {
  try {
    const response = await api.get(`/recommendations/${warningId}`);
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback recommendations');
    return simulateDelay({
      warningId,
      recommendations: FALLBACK_DECISION_RESPONSE.recommendations,
    });
  }
};

export const getAllocations = async (warningId) => {
  try {
    const response = await api.get(`/allocation/${warningId}`);
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback allocations');
    return simulateDelay({
      warningId,
      ...FALLBACK_DECISION_RESPONSE.allocations,
    });
  }
};

export const getSimulation = async (warningId) => {
  try {
    const response = await api.get(`/simulation/${warningId}`);
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback simulation');
    return simulateDelay({
      warningId,
      ...FALLBACK_DECISION_RESPONSE.simulation,
    });
  }
};

// ============================================
// IGAD COUNTRIES ENDPOINTS (With Fallback)
// ============================================

export const getCountries = async () => {
  try {
    const response = await api.get('/countries/');
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback IGAD countries');
    return simulateDelay(FALLBACK_IGAD_COUNTRIES);
  }
};

export const getCountryByName = async (name) => {
  try {
    const response = await api.get(`/countries/${encodeURIComponent(name)}`);
    return response;
  } catch (error) {
    console.warn('⚠️ API unavailable - using fallback country');
    const country = FALLBACK_IGAD_COUNTRIES.find(c => c.name === name);
    return simulateDelay(country || FALLBACK_IGAD_COUNTRIES[0]);
  }
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default api;
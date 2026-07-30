import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Spatial data
export const getWards = () => api.get('/wards');
export const getWardRisk = (id) => api.get(`/wards/${id}/risk`);
export const getWaterPoints = () => api.get('/water-points');
export const getConflictEvents = (days = 30) => api.get(`/conflict-events?days=${days}`);
export const getMarkets = () => api.get('/markets');
export const getCorridors = () => api.get('/corridors');

// Decision intelligence
export const getRecommendation = (actorType, actorId, wardId) =>
  api.get(`/recommendations/${actorType}/${actorId}?ward_id=${wardId}`);

// SMS Simulator
export const sendSmsQuery = (message, location) =>
  api.post('/sms-simulator/query', { message, location });

// Observatory
export const logEvent = (event) => api.post('/observatory/events', event);
export const getTimeline = (warningId) => api.get(`/observatory/events/${warningId}`);
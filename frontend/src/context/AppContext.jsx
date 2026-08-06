import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  getCounties,
  getSubCounties,
  getWarnings,
  getAssets,
  getDashboardStats,
  generateDecision,
  getCountries,
} from '../services/api';

// Import fallback data - ONLY ONCE
import { FALLBACK_GEOJSON } from '../data/fallbackData';

const AppContext = createContext();

export function AppContextProvider({ children }) {
  // ============================================
  // DECISION INTELLIGENCE STATE
  // ============================================
  const [activeRegion, setActiveRegion] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [riskLevel, setRiskLevel] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [decisionError, setDecisionError] = useState(null);

  // ============================================
  // MAP DATA STATE
  // ============================================
  const [counties, setCounties] = useState([]);
  const [countiesLoading, setCountiesLoading] = useState(false);
  const [countiesError, setCountiesError] = useState(null);

  const [subCounties, setSubCounties] = useState([]);
  const [subCountiesLoading, setSubCountiesLoading] = useState(false);
  const [subCountiesError, setSubCountiesError] = useState(null);

  const [warnings, setWarnings] = useState([]);
  const [warningsLoading, setWarningsLoading] = useState(false);
  const [warningsError, setWarningsError] = useState(null);

  const [assets, setAssets] = useState([]);
  const [assetsLoading, setAssetsLoading] = useState(false);
  const [assetsError, setAssetsError] = useState(null);

  const [dashboardStats, setDashboardStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(null);

  const [igadCountries, setIgadCountries] = useState([]);
  const [igadLoading, setIgadLoading] = useState(false);
  const [igadError, setIgadError] = useState(null);

  const [countyGeoJSON, setCountyGeoJSON] = useState(FALLBACK_GEOJSON);

  // ============================================
  // SELECTED STATE
  // ============================================
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [selectedSubCounty, setSelectedSubCounty] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedWarning, setSelectedWarning] = useState(null);

  // ============================================
  // DATA LOADING FUNCTIONS
  // ============================================

  const loadCounties = useCallback(async () => {
    setCountiesLoading(true);
    setCountiesError(null);
    try {
      const response = await getCounties();
      console.log('✅ Counties loaded:', response.data);
      setCounties(response.data || []);
    } catch (error) {
      console.warn('⚠️ Error loading counties:', error.message);
      setCountiesError(error.message);
      setCounties([]);
    } finally {
      setCountiesLoading(false);
    }
  }, []);

  const loadSubCounties = useCallback(async () => {
    setSubCountiesLoading(true);
    setSubCountiesError(null);
    try {
      const response = await getSubCounties();
      console.log('✅ Sub-counties loaded:', response.data);
      setSubCounties(response.data || []);
    } catch (error) {
      console.warn('⚠️ Error loading sub-counties:', error.message);
      setSubCountiesError(error.message);
      setSubCounties([]);
    } finally {
      setSubCountiesLoading(false);
    }
  }, []);

  const loadWarnings = useCallback(async () => {
    setWarningsLoading(true);
    setWarningsError(null);
    try {
      const response = await getWarnings();
      console.log('✅ Warnings loaded:', response.data);
      setWarnings(response.data || []);
    } catch (error) {
      console.warn('⚠️ Error loading warnings:', error.message);
      setWarningsError(error.message);
      setWarnings([]);
    } finally {
      setWarningsLoading(false);
    }
  }, []);

  const loadAssets = useCallback(async () => {
    setAssetsLoading(true);
    setAssetsError(null);
    try {
      const response = await getAssets();
      console.log('✅ Assets loaded:', response.data);
      setAssets(response.data || []);
    } catch (error) {
      console.warn('⚠️ Error loading assets:', error.message);
      setAssetsError(error.message);
      setAssets([]);
    } finally {
      setAssetsLoading(false);
    }
  }, []);

  const loadDashboardStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const response = await getDashboardStats();
      console.log('✅ Dashboard stats loaded:', response.data);
      setDashboardStats(response.data);
    } catch (error) {
      console.warn('⚠️ Error loading dashboard stats:', error.message);
      setStatsError(error.message);
      setDashboardStats(null);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadIgadCountries = useCallback(async () => {
    setIgadLoading(true);
    setIgadError(null);
    try {
      const response = await getCountries();
      console.log('✅ IGAD countries loaded:', response.data);
      setIgadCountries(response.data || []);
    } catch (error) {
      console.warn('⚠️ Error loading IGAD countries:', error.message);
      setIgadError(error.message);
      setIgadCountries([]);
    } finally {
      setIgadLoading(false);
    }
  }, []);

  const loadAllData = useCallback(async () => {
    await Promise.all([
      loadCounties(),
      loadWarnings(),
      loadAssets(),
      loadSubCounties(),
      loadDashboardStats(),
      loadIgadCountries(),
    ]);
  }, [loadCounties, loadWarnings, loadAssets, loadSubCounties, loadDashboardStats, loadIgadCountries]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // ============================================
  // DECISION INTELLIGENCE - DEFINED ONCE
  // ============================================

  const fetchDecisionIntelligence = useCallback(async (region) => {
    if (!region) {
      setDecisionError('No region provided');
      return;
    }

    setIsAnalyzing(true);
    setDecisionError(null);

    try {
      const response = await generateDecision({
        id: region.id || region.name.toLowerCase().replace(/\s+/g, '-'),
        name: region.name,
        hazardType: region.hazardType || 'Flood',
        severity: region.severity || 'High',
        context: region.context || `${region.name} county analysis requested`,
      });

      console.log('✅ Decision intelligence loaded:', response.data);
      setRecommendations(response.data.recommendations || []);
      setRiskLevel(response.data.riskLevel || 'Medium');
    } catch (error) {
      console.error('❌ Error fetching decision:', error.message);
      setDecisionError(error.message);
      setRecommendations([
        `Pre-position supplies in ${region.name}`,
        `Coordinate with humanitarian partners`,
        `Monitor situation in affected areas`,
        `Run evacuation readiness drill`,
      ]);
      setRiskLevel('Medium');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value = {
    activeRegion,
    setActiveRegion,
    recommendations,
    riskLevel,
    isAnalyzing,
    decisionError,
    fetchDecisionIntelligence,

    counties,
    countiesLoading,
    countiesError,
    loadCounties,

    subCounties,
    subCountiesLoading,
    subCountiesError,
    loadSubCounties,

    warnings,
    warningsLoading,
    warningsError,
    loadWarnings,

    assets,
    assetsLoading,
    assetsError,
    loadAssets,

    dashboardStats,
    statsLoading,
    statsError,
    loadDashboardStats,

    igadCountries,
    igadLoading,
    igadError,
    loadIgadCountries,

    countyGeoJSON,

    selectedCounty,
    setSelectedCounty,
    selectedSubCounty,
    setSelectedSubCounty,
    selectedWard,
    setSelectedWard,
    selectedWarning,
    setSelectedWarning,

    loadAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
}

export default AppContext;
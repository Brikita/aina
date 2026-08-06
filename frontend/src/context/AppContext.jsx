import { createContext, useContext, useState, useCallback } from 'react';
import api, {
  getCounties,
  getSubCounties,
  getWarnings,
  getAssets,
  getDashboardStats,
  generateDecision,
} from '../services/api';

// Import fallback data for when API is down
import { FALLBACK_WARDS } from '../data/fallbackGeoJSON';

const AppContext = createContext();

export function AppContextProvider({ children }) {
  // ============================================
  // DECISION INTELLIGENCE STATE (Existing)
  // ============================================
  const [activeRegion, setActiveRegion] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [riskLevel, setRiskLevel] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [decisionError, setDecisionError] = useState(null);

  // ============================================
  // MAP DATA STATE (NEW)
  // ============================================
  
  // Counties
  const [counties, setCounties] = useState([]);
  const [countiesLoading, setCountiesLoading] = useState(false);
  const [countiesError, setCountiesError] = useState(null);

  // Sub-Counties
  const [subCounties, setSubCounties] = useState([]);
  const [subCountiesLoading, setSubCountiesLoading] = useState(false);
  const [subCountiesError, setSubCountiesError] = useState(null);

  // Warnings
  const [warnings, setWarnings] = useState([]);
  const [warningsLoading, setWarningsLoading] = useState(false);
  const [warningsError, setWarningsError] = useState(null);

  // Assets
  const [assets, setAssets] = useState([]);
  const [assetsLoading, setAssetsLoading] = useState(false);
  const [assetsError, setAssetsError] = useState(null);

  // Dashboard Stats
  const [dashboardStats, setDashboardStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(null);

  // ============================================
  // SELECTED STATE (NEW)
  // ============================================
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [selectedSubCounty, setSelectedSubCounty] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedWarning, setSelectedWarning] = useState(null);

  // ============================================
  // DATA LOADING FUNCTIONS (NEW)
  // ============================================

  // Load Counties
  const loadCounties = useCallback(async () => {
    setCountiesLoading(true);
    setCountiesError(null);
    
    try {
      const response = await getCounties();
      console.log('✅ Counties loaded from API:', response.data);
      
      // If API returns data with geometry, use it
      if (response.data && response.data.length > 0) {
        setCounties(response.data);
      } else {
        // Fallback to local GeoJSON
        const fallbackResponse = await fetch('/data/kenya_counties_admin.geojson');
        if (!fallbackResponse.ok) throw new Error('Fallback file not found');
        const fallbackData = await fallbackResponse.json();
        setCounties(fallbackData.features || []);
      }
    } catch (error) {
      console.warn('⚠️ Error loading counties:', error.message);
      setCountiesError(error.message);
      
      // Final fallback to mock data
      setCounties(FALLBACK_WARDS.features || []);
    } finally {
      setCountiesLoading(false);
    }
  }, []);

  // Load Warnings
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

  // Load Assets
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

  // Load Sub-Counties
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

  // Load Dashboard Stats
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

  // Load All Data
  const loadAllData = useCallback(async () => {
    await Promise.all([
      loadCounties(),
      loadWarnings(),
      loadAssets(),
      loadSubCounties(),
      loadDashboardStats(),
    ]);
  }, [loadCounties, loadWarnings, loadAssets, loadSubCounties, loadDashboardStats]);

  // ============================================
  // DECISION INTELLIGENCE (Existing - Updated)
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
      
      // Fallback recommendations
      setRecommendations([
        `Pre-position water treatment supplies in ${region.name}`,
        `Run evacuation readiness drill in high-risk areas`,
        `Issue early warning to communities`,
        `Coordinate with humanitarian partners`,
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
    // Decision Intelligence (Existing)
    activeRegion,
    setActiveRegion,
    recommendations,
    riskLevel,
    isAnalyzing,
    decisionError,
    fetchDecisionIntelligence,

    // Counties (NEW)
    counties,
    countiesLoading,
    countiesError,
    loadCounties,

    // Sub-Counties (NEW)
    subCounties,
    subCountiesLoading,
    subCountiesError,
    loadSubCounties,

    // Warnings (NEW)
    warnings,
    warningsLoading,
    warningsError,
    loadWarnings,

    // Assets (NEW)
    assets,
    assetsLoading,
    assetsError,
    loadAssets,

    // Dashboard Stats (NEW)
    dashboardStats,
    statsLoading,
    statsError,
    loadDashboardStats,

    // Selected State (NEW)
    selectedCounty,
    setSelectedCounty,
    selectedSubCounty,
    setSelectedSubCounty,
    selectedWard,
    setSelectedWard,
    selectedWarning,
    setSelectedWarning,

    // Load All (NEW)
    loadAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ============================================
// HOOK FOR USING CONTEXT
// ============================================

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
}

export default AppContext;
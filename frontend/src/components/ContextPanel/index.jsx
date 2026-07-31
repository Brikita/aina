import { useState } from 'react';
import OverviewTab from './tabs/OverviewTab';
import ImpactTab from './tabs/ImpactTab';
import RecommendationsTab from './tabs/RecommendationsTab';
import SimulationTab from './tabs/SimulationTab';
import ResourcesTab from './tabs/ResourcesTab';
import HistoryTab from './tabs/HistoryTab';

const TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'impact', label: 'Impact', icon: '🎯' },
  { id: 'recommendations', label: 'Recommendations', icon: '💡' },
  { id: 'simulation', label: 'Simulation', icon: '📈' },
  { id: 'resources', label: 'Resources', icon: '🚚' },
  { id: 'history', label: 'History', icon: '📅' },
];

export default function ContextPanel({ county, warning, onAction, isMobile }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  // Show Panel Button (when panel is closed)
  if (!isPanelOpen) {
    return (
      <button
        onClick={togglePanel}
        style={{
          position: 'fixed',
          right: '20px',
          top: '80px',
          zIndex: 2000,
          background: 'white',
          border: 'none',
          borderRadius: '50%',
          boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
          width: '44px',
          height: '44px',
          fontSize: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.35)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.25)'}
        title="Show Panel"
      >
        📋
      </button>
    );
  }

  // Empty State (No county selected)
  if (!county) {
    return (
      <div style={{
        position: 'fixed',
        right: 0,
        top: 0,
        width: isMobile ? '100%' : '380px',
        height: '100vh',
        background: '#FFFFFF',
        boxShadow: '-2px 0 24px rgba(0,0,0,0.08)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, -apple-system, sans-serif',
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontWeight: 600, fontSize: '16px', color: '#1F2937' }}>AINA Analysis</span>
          <button
            onClick={togglePanel}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              color: '#6B7280',
              padding: '4px 8px',
            }}
          >
            ✕
          </button>
        </div>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '40px',
          color: '#9CA3AF',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</span>
          <h3 style={{ color: '#1F2937', marginBottom: '8px' }}>Select a county</h3>
          <p style={{ fontSize: '14px' }}>Click on any county on the map to see detailed analysis</p>
        </div>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab county={county} warning={warning} />;
      case 'impact':
        return <ImpactTab county={county} warning={warning} />;
      case 'recommendations':
        return <RecommendationsTab warning={warning} onAction={onAction} />;
      case 'simulation':
        return <SimulationTab warning={warning} />;
      case 'resources':
        return <ResourcesTab warning={warning} onAction={onAction} />;
      case 'history':
        return <HistoryTab county={county} />;
      default:
        return <OverviewTab county={county} warning={warning} />;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      right: 0,
      top: 0,
      width: isMobile ? '100%' : '380px',
      height: '100vh',
      background: '#FFFFFF',
      boxShadow: '-2px 0 24px rgba(0,0,0,0.08)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, -apple-system, sans-serif',
    }}>
      {/* Header with Close Button */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1F2937', margin: 0 }}>
            {county?.name || 'Select a county'}
          </h2>
          {warning && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#DC2626' }} />
              <span style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500 }}>{warning.severity} • {warning.hazard}</span>
              <span style={{ fontSize: '10px', color: '#6B7280', background: '#F3F4F6', padding: '2px 8px', borderRadius: '12px' }}>{warning.status}</span>
            </div>
          )}
        </div>
        <button
          onClick={togglePanel}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            color: '#6B7280',
            padding: '4px 8px',
          }}
        >
          ✕
        </button>
      </div>

      {/* Tab Bar */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #E5E7EB',
        padding: '0 16px',
        overflowX: 'auto',
        background: '#FAFAFA',
      }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 14px',
              border: 'none',
              background: 'transparent',
              color: activeTab === tab.id ? '#1F2937' : '#6B7280',
              fontWeight: activeTab === tab.id ? 600 : 400,
              borderBottom: activeTab === tab.id ? '2px solid #2563EB' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>{renderTab()}</div>

      {/* Footer */}
      <div style={{
        padding: '8px 20px',
        borderTop: '1px solid #E5E7EB',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '11px',
        color: '#6B7280',
        background: '#FAFAFA',
      }}>
        <span>📊 Situation: <strong style={{ color: '#DC2626' }}>7</strong> Warnings</span>
        <span>Updated 2 min ago</span>
      </div>
    </div>
  );
}
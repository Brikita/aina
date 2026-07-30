import { useState, useEffect } from 'react';
import { buildTree, generateHierarchicalData } from '../../data/hierarchicalData';

export default function HierarchicalTree({ 
  onNodeClick, 
  onFocus, 
  onReset,
  focusedNode,
  isFocused,
  isMobile = false 
}) {
  const [treeData, setTreeData] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [isPanelVisible, setIsPanelVisible] = useState(!isMobile);

  useEffect(() => {
    const data = generateHierarchicalData();
    const tree = buildTree(data);
    setTreeData(tree);
  }, []);

  useEffect(() => {
    if (isMobile && isFocused) {
      setIsPanelVisible(false);
    }
  }, [isMobile, isFocused]);

  const toggleExpand = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
    if (onNodeClick) {
      const findNode = (nodes) => {
        for (const node of nodes) {
          if (node.id === nodeId) return node;
          if (node.children) {
            const found = findNode(node.children);
            if (found) return found;
          }
        }
        return null;
      };
      const node = findNode(treeData);
      if (node) onNodeClick(node);
    }
  };

  const handleNodeClick = (node) => {
    if (node.isLeaf) {
      if (onFocus) {
        onFocus(node);
      }
    } else {
      toggleExpand(node.id);
    }
  };

  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const renderTree = (nodes, level = 0) => {
    const indent = isMobile ? 12 : 16;
    
    return nodes.map(node => {
      const isExpanded = expandedNodes[node.id];
      const hasChildren = node.children && node.children.length > 0;
      const isFocusedNode = focusedNode && focusedNode.id === node.id;
      
      return (
        <div key={node.id} style={{ paddingLeft: `${level * indent}px` }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: isMobile ? '6px 8px' : '4px 8px',
              cursor: 'pointer',
              backgroundColor: isFocusedNode ? '#FFD700' : 'transparent',
              borderRadius: '4px',
              transition: 'background 0.2s',
              border: isFocusedNode ? '2px solid #FFD700' : 'none',
              minHeight: isMobile ? '36px' : 'auto',
              touchAction: 'manipulation',
            }}
            onMouseEnter={(e) => {
              if (!isFocusedNode) e.currentTarget.style.background = '#f0f0f0';
            }}
            onMouseLeave={(e) => {
              if (!isFocusedNode) e.currentTarget.style.background = 'transparent';
            }}
            onClick={() => handleNodeClick(node)}
          >
            {hasChildren && (
              <span style={{ marginRight: '6px', fontSize: isMobile ? '14px' : '12px', color: '#666' }}>
                {isExpanded ? '▼' : '▶'}
              </span>
            )}
            {!hasChildren && (
              <span style={{ marginRight: '6px', fontSize: isMobile ? '14px' : '12px', color: '#ccc' }}>
                •
              </span>
            )}
            
            <span style={{ 
              fontSize: isMobile ? '14px' : '12px',
              fontWeight: node.isLeaf ? 'bold' : 'normal',
              color: node.isLeaf ? '#1E90FF' : '#333',
              flex: 1,
            }}>
              {isMobile && node.name.length > 20 ? node.name.substring(0, 18) + '...' : node.name}
            </span>
            
            <span style={{
              fontSize: isMobile ? '9px' : '8px',
              color: '#999',
              background: '#f0f0f0',
              padding: '0 6px',
              borderRadius: '10px',
              marginLeft: '4px',
              whiteSpace: 'nowrap',
            }}>
              {node.level}
            </span>
          </div>
          
          {hasChildren && isExpanded && (
            <div>
              {renderTree(node.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const panelWidth = isMobile ? '85vw' : '280px';
  const maxHeight = isMobile ? '55vh' : '400px';

  if (!isPanelVisible) {
    return (
      <button
        onClick={togglePanel}
        style={{
          position: 'fixed',
          bottom: isMobile ? '80px' : '110px',
          right: isMobile ? '10px' : '15px',
          zIndex: 2000,
          background: 'white',
          border: 'none',
          borderRadius: '8px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
          width: isMobile ? '48px' : '40px',
          height: isMobile ? '48px' : '40px',
          fontSize: isMobile ? '22px' : '18px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'manipulation',
        }}
        title="Show Tree"
      >
        🌳
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: isMobile ? '80px' : '110px',
      right: isMobile ? '10px' : '15px',
      zIndex: 2000,
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
      width: panelWidth,
      maxHeight: maxHeight,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '10px 12px' : '8px 12px',
        background: '#f8f9fa',
        borderBottom: '1px solid #e0e0e0',
        flexShrink: 0,
      }}>
        <span style={{ fontWeight: 'bold', fontSize: isMobile ? '14px' : '13px', color: '#333' }}>
          🌳 Administrative Tree
        </span>
        <button
          onClick={togglePanel}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: isMobile ? '18px' : '14px',
            color: '#999',
            padding: '0 4px',
            touchAction: 'manipulation',
          }}
        >
          ✕
        </button>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: isMobile ? '6px 4px' : '8px 4px',
        WebkitOverflowScrolling: 'touch',
      }}>
        {treeData.length > 0 ? renderTree(treeData) : (
          <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
            Loading...
          </div>
        )}
      </div>

      <div style={{
        padding: isMobile ? '10px 12px' : '8px 12px',
        borderTop: '1px solid #e0e0e0',
        background: '#f8f9fa',
        display: 'flex',
        gap: '8px',
        flexShrink: 0,
        flexWrap: 'wrap',
      }}>
        {isFocused && (
          <button
            onClick={onReset}
            style={{
              flex: 1,
              padding: isMobile ? '10px 12px' : '6px 12px',
              background: '#FF6B35',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: isMobile ? '14px' : '12px',
              fontWeight: 'bold',
              minHeight: isMobile ? '44px' : 'auto',
              touchAction: 'manipulation',
            }}
          >
            🔄 Reset View
          </button>
        )}
        <div style={{
          fontSize: isMobile ? '11px' : '10px',
          color: '#999',
          textAlign: 'center',
          flex: 1,
        }}>
          {isFocused ? '📍 Focus mode active' : 'Click ▼ to expand • Click village to focus'}
        </div>
      </div>
    </div>
  );
}
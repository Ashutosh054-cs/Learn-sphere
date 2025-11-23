import { CheckCircle, Lock, Circle, Zap } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import FrostedCard from '../../../components/ui/FrostedCard';
import useRoadmapStore from '../../../stores/roadmapStore';

// Central difficulty color map (use CSS variables for theme support)
const getDifficultyColor = (difficulty) => {
  const colorMap = {
    Basic: 'var(--difficulty-basic)',
    Intermediate: 'var(--difficulty-intermediate)',
    Advanced: 'var(--difficulty-advanced)'
  };
  return colorMap[difficulty] || colorMap.Basic;
};

const DIFFICULTY_COLOR_MAP = {
  Basic: 'var(--difficulty-basic)',
  Intermediate: 'var(--difficulty-intermediate)',
  Advanced: 'var(--difficulty-advanced)'
};

function hexToRgba(hex, alpha = 1) {
  const c = hex.replace('#', '');
  const full = c.length === 3 ? c.split('').map(ch => ch + ch).join('') : c;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Node Hover Popup Component
const NodeHoverPopup = ({ node, nodeRef }) => {
  const [position, setPosition] = useState('center');
  const popupRef = useRef(null);
  const diffColor = DIFFICULTY_COLOR_MAP[node.difficulty] || DIFFICULTY_COLOR_MAP.Basic;

  useEffect(() => {
    if (nodeRef?.current && popupRef?.current) {
      const nodeRect = nodeRef.current.getBoundingClientRect();
      const popupWidth = 256; // w-64 = 16rem = 256px
      const viewportWidth = window.innerWidth;
      
      // Calculate if popup would overflow on left
      const popupLeft = nodeRect.left + (nodeRect.width / 2) - (popupWidth / 2);
      
      if (popupLeft < 16) {
        // Too close to left edge, align to left
        setPosition('left');
      } else if (popupLeft + popupWidth > viewportWidth - 16) {
        // Too close to right edge, align to right
        setPosition('right');
      } else {
        setPosition('center');
      }
    }
  }, [nodeRef]);

  const getPositionClasses = () => {
    if (position === 'left') {
      return 'left-0';
    } else if (position === 'right') {
      return 'right-0';
    }
    return 'left-1/2 -translate-x-1/2';
  };

  return (
    <div 
      ref={popupRef}
      className={`absolute ${getPositionClasses()} bottom-full mb-2 z-50 w-64 animate-in fade-in slide-in-from-bottom-2 duration-200`}
    >
      <div 
        className="rounded-lg border-2 p-4 shadow-2xl backdrop-blur-md"
        style={{
          backgroundColor: 'var(--node-hover-bg)',
          borderColor: node.status === 'completed' ? diffColor : node.status === 'current' ? DIFFICULTY_COLOR_MAP.Intermediate : 'var(--node-hover-border)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <h4 className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
          {node.title}
        </h4>

        {/* Description as bulleted list if comma-separated, otherwise paragraph */}
        {node.description && node.description.includes(',') ? (
          <ul className="text-xs mb-3" style={{ color: 'var(--text-secondary)', paddingLeft: 12, margin: 0 }}>
              {node.description.split(',').slice(0, 10).map((item, i) => (
              <li key={i} className="mb-1 flex items-start gap-2">
                <span style={{ width: 6, height: 6, borderRadius: 9999, backgroundColor: 'var(--text-primary)', display: 'inline-block', marginTop: 6 }}></span>
                <span style={{ marginTop: 1 }}>{item.trim()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs mb-3 opacity-70" style={{ color: 'var(--text-secondary)' }}>
            {node.description}
          </p>
        )}

        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            <span style={{ width: 8, height: 8, borderRadius: 9999, backgroundColor: diffColor, display: 'inline-block' }}></span>
            {node.difficulty}
          </span>
          <span className="font-semibold" style={{ color: diffColor }}>{node.xp} XP</span>
        </div>
      </div>
    </div>
  );
};

// Level-Based Roadmap Node Component
const LevelNode = ({ node, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const nodeRef = useRef(null);

  const getNodeStyle = () => {
    const nodeDiffColor = DIFFICULTY_COLOR_MAP[node.difficulty] || DIFFICULTY_COLOR_MAP.Basic;
    
    if (node.status === 'completed') {
      return {
        backgroundColor: `color-mix(in srgb, ${nodeDiffColor} 12%, transparent)`,
        borderWidth: '2px',
        borderColor: nodeDiffColor,
        color: nodeDiffColor,
        boxShadow: `0 0 12px color-mix(in srgb, ${nodeDiffColor} 25%, transparent)`,
        fontWeight: '600'
      };
    }
    
    if (node.status === 'current') {
      const currentColor = DIFFICULTY_COLOR_MAP.Intermediate;
      return {
        backgroundColor: `color-mix(in srgb, ${currentColor} 12%, transparent)`,
        borderWidth: '2px',
        borderColor: currentColor,
        color: currentColor,
        boxShadow: `0 0 15px color-mix(in srgb, ${currentColor} 30%, transparent)`,
        fontWeight: '600'
      };
    }
    
    return {
      backgroundColor: 'var(--node-locked-bg)',
      borderWidth: '1.5px',
      borderColor: 'var(--node-locked-border)',
      color: 'var(--node-locked-text)',
      fontWeight: '500'
    };
  };

  return (
    <div className="relative">
      <button
        ref={nodeRef}
        onClick={() => onClick(node.id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative px-2 py-1.5 rounded-md border transition-all duration-200 hover:scale-105 hover:shadow-xl w-[100px] h-[32px] flex items-center justify-center cursor-pointer"
        style={getNodeStyle()}
      >
        <div
          className="font-semibold leading-tight text-center whitespace-nowrap overflow-hidden text-ellipsis w-full"
          style={{ fontSize: '10px', margin: 0 }}
        >
          {node.title}
        </div>
      </button>
      {isHovered && <NodeHoverPopup node={node} nodeRef={nodeRef} />}
    </div>
  );
};

// Horizontal Connector between nodes
const LevelConnector = ({ fromCompleted, fromColor }) => {
  const color = fromCompleted ? (fromColor || DIFFICULTY_COLOR_MAP.Basic) : 'var(--node-locked-border)';
  const glow = fromCompleted ? `0 0 8px color-mix(in srgb, ${color} 25%, transparent)` : 'none';
  return (
    <div className="flex items-center mx-1" style={{ gap: 4 }}>
      <div style={{ width: 6, height: 6, borderRadius: 9999, backgroundColor: color, boxShadow: glow }} />
      <div style={{ width: 10, height: 2, backgroundColor: color, opacity: 0.9 }} />
      <div style={{ width: 6, height: 6, borderRadius: 9999, backgroundColor: color, boxShadow: glow }} />
      <div style={{ width: 10, height: 2, backgroundColor: color, opacity: 0.9 }} />
      <div style={{ width: 6, height: 6, borderRadius: 9999, backgroundColor: color, boxShadow: glow }} />
    </div>
  );
};

export default function RoadmapGraph() {
  const { nodes, selectNode, activeCareer, careers } = useRoadmapStore();

  // Group nodes into levels based on career path
  const getLevelsForCareer = () => {
    if (!activeCareer) return [];
    
    const selectedCareer = careers.find(c => c.id === activeCareer);
    if (!selectedCareer || !selectedCareer.roadmapNodes) return [];

    const allowedIds = selectedCareer.roadmapNodes;
    const orderedNodes = allowedIds
      .map(id => nodes.find(node => node.id === id))
      .filter(node => node !== undefined);
    
    // Group nodes into levels (5 nodes per level)
    const NODES_PER_LEVEL = 5;
    const levels = [];
    
    for (let i = 0; i < orderedNodes.length; i += NODES_PER_LEVEL) {
      levels.push({
        level: Math.floor(i / NODES_PER_LEVEL) + 1,
        nodes: orderedNodes.slice(i, i + NODES_PER_LEVEL)
      });
    }
    
    return levels;
  };

  const roadmapLevels = getLevelsForCareer();

  const getCareerTitle = () => {
    const titles = {
      'frontend': 'Frontend Developer Path',
      'backend': 'Backend Developer Path',
      'fullstack': 'Full-Stack Developer Path',
      'devops': 'DevOps Engineer Path',
      'cloud-engineer': 'Cloud Engineer Path',
      'aiml': 'AI / Machine Learning Engineer Path',
      'data-scientist': 'Data Scientist Path',
      'data-engineer': 'Data Engineer Path',
      'mobile-app-developer': 'Mobile App Developer Path',
      'blockchain': 'Blockchain Developer Path',
      'cyber-security': 'Cybersecurity Engineer Path',
      'pentester': 'Ethical Hacker / Pentester Path',
      'ux-design': 'Product Designer (UI/UX) Path',
      'software-architect': 'Software Architect Path',
      'qa': 'QA Engineer / Automation Tester Path',
      'game-dev': 'Game Developer Path',
      'system-design': 'System Design Engineer Path',
      'db-engineer': 'Database Administrator / Engineer Path',
      'sre': 'Site Reliability Engineer (SRE) Path',
      'api-developer': 'API Developer Path',
      'prompt-engineer': 'Prompt Engineer Path',
      'ai-app-developer': 'AI Application Developer Path',
      'big-data-engineer': 'Big Data Engineer Path',
      'cloud-security-engineer': 'Cloud Security Engineer Path',
      'mlops': 'MLOps Path'
    };
    return activeCareer ? titles[activeCareer] || 'Career Path' : 'Select a Career Path';
  };

  const renderLevelLayout = () => {
    return (
      <div className="space-y-4">
        {roadmapLevels.map((levelData, levelIdx) => (
          <div key={levelData.level} className="space-y-2">
            {/* Level Header */}
            <div className="flex items-center gap-2">
              <div 
                className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                style={{
                  backgroundColor: 'rgba(127, 0, 255, 0.15)',
                  color: '#7F00FF',
                  border: '1px solid rgba(127, 0, 255, 0.3)'
                }}
              >
                Level {levelData.level}
              </div>
              <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
            </div>
            
            {/* Horizontal Node Chain - centered, compact */}
            <div className="flex items-center justify-center flex-wrap gap-y-2 gap-x-1">
              {levelData.nodes.map((node, nodeIdx) => (
                <div key={node.id} className="flex items-center">
                  <LevelNode node={node} onClick={selectNode} />
                  {nodeIdx < levelData.nodes.length - 1 && (
                    <LevelConnector fromCompleted={node.status === 'completed'} fromColor={DIFFICULTY_COLOR_MAP[node.difficulty]} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <FrostedCard className="p-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          {getCareerTitle()}
        </h2>
          <div className="flex items-center gap-2 text-[9px]">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-2.5 h-2.5" style={{ color: DIFFICULTY_COLOR_MAP.Basic }} />
            <span style={{ color: 'var(--text-secondary)' }}>Done</span>
          </div>
          <div className="flex items-center gap-1">
            <Circle className="w-2.5 h-2.5" style={{ color: '#7F00FF' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Active</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="w-2.5 h-2.5" style={{ color: 'rgba(255, 255, 255, 0.3)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Locked</span>
          </div>
        </div>
      </div>

      {!activeCareer ? (
        <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
          <p className="text-sm">👆 Select a career path above to view your roadmap</p>
        </div>
      ) : roadmapLevels.length === 0 ? (
        <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
          <p className="text-sm">No nodes found for this career path</p>
        </div>
      ) : (
        <>
          <div className="max-w-full mx-auto">
            {renderLevelLayout()}
          </div>
          <div className="mt-4 text-center">
            <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
              {roadmapLevels.reduce((acc, level) => acc + level.nodes.filter(n => n.status === 'completed').length, 0)} / {roadmapLevels.reduce((acc, level) => acc + level.nodes.length, 0)} completed
            </p>
          </div>
        </>
      )}
    </FrostedCard>
  );
}

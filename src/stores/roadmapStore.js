import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import roadmapDataRaw from '../data/roadmapData.json';

// Helper to merge user progress (status) into fresh node data
const mergeNodeProgress = (freshNodes, progressMap = {}) => {
  return freshNodes.map(node => ({
    ...node,
    status: progressMap[node.id] || node.status
  }));
};

const useRoadmapStore = create(
  persist(
    (set, get) => ({
      // Raw data from JSON (not persisted)
      _rawNodes: roadmapDataRaw.nodes,
      edges: roadmapDataRaw.edges,
      careers: roadmapDataRaw.careers,
      skills: roadmapDataRaw.skills,
      badges: roadmapDataRaw.badges,
      
      // Computed nodes (merged with progress)
      get nodes() {
        return mergeNodeProgress(roadmapDataRaw.nodes, get().nodeProgress);
      },
      
      // User Progress - Only this gets persisted
      nodeProgress: {}, // { nodeId: 'completed' | 'current' | 'locked' }
      
      // UI State
      selectedNode: null,
      activeCareer: null,
      isDrawerOpen: false,
      isMentorPanelOpen: true,
      
      // User Progress
      xp: 0,
      weeklyGoals: [
        { id: 1, title: 'Complete 3 modules', completed: false, xp: 50 },
        { id: 2, title: 'Practice CSS Grid', completed: false, xp: 30 },
        { id: 3, title: 'Earn 200 XP', completed: false, xp: 40 }
      ],
      
      // Mentor Chat
      chatMessages: [
        { id: 1, role: 'ai', content: 'Hi! I\'m your AI mentor. How can I help you today?', timestamp: Date.now() }
      ],
      
      // Actions
      selectNode: (nodeId) => set((state) => {
        const nodes = mergeNodeProgress(roadmapDataRaw.nodes, state.nodeProgress);
        return {
          selectedNode: nodes.find(n => n.id === nodeId),
          isDrawerOpen: true
        };
      }),
      
      closeDrawer: () => set({ isDrawerOpen: false, selectedNode: null }),
      
      markNodeComplete: (nodeId) => set((state) => {
        const newProgress = { ...state.nodeProgress, [nodeId]: 'completed' };
        const nodes = mergeNodeProgress(roadmapDataRaw.nodes, newProgress);
        
        // Find completed node and add XP
        const completedNode = nodes.find(n => n.id === nodeId);
        const newXp = state.xp + (completedNode?.xp || 0);
        
        // Unlock child nodes if all prerequisites are met
        nodes.forEach(node => {
          if (node.status === 'locked' && node.prerequisites.length > 0) {
            const allPrereqsMet = node.prerequisites.every(prereqId => 
              newProgress[prereqId] === 'completed'
            );
            if (allPrereqsMet) {
              newProgress[node.id] = 'current';
            }
          }
        });
        
        return {
          nodeProgress: newProgress,
          xp: newXp,
          badges,
          isDrawerOpen: false,
          selectedNode: null
        };
      }),
      
      updateSkill: (skillId, newLevel) => set((state) => ({
        skills: state.skills.map(skill => 
          skill.id === skillId ? { ...skill, level: newLevel } : skill
        )
      })),
      
      setActiveCareer: (careerId) => set({ activeCareer: careerId }),
      
      toggleWeeklyGoal: (goalId) => set((state) => ({
        weeklyGoals: state.weeklyGoals.map(goal => 
          goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
        )
      })),
      
      toggleMentorPanel: () => set((state) => ({ 
        isMentorPanelOpen: !state.isMentorPanelOpen 
      })),
      
      addChatMessage: (message) => set((state) => ({
        chatMessages: [
          ...state.chatMessages,
          { id: Date.now(), ...message, timestamp: Date.now() }
        ]
      })),
      
      getNextSteps: (careerId) => {
        const state = get();
        const cid = careerId || state.activeCareer;
        const nodes = mergeNodeProgress(roadmapDataRaw.nodes, state.nodeProgress);

        // If no career selected, fallback to previous behavior (current nodes)
        if (!cid) {
          const currentNodes = nodes.filter(n => n.status === 'current');
          return currentNodes
            .sort((a, b) => a.xp - b.xp)
            .slice(0, 3)
            .map(node => ({ ...node, reason: `Based on your ${node.skills?.[0] || 'skills'}` }));
        }

        const career = state.careers.find(c => c.id === cid);
        if (!career || !Array.isArray(career.roadmapNodes)) return [];

        // Map the career roadmap nodes to actual nodes in the store
        const ordered = career.roadmapNodes
          .map(id => nodes.find(n => n.id === id))
          .filter(Boolean);

        // Recommend up to 3 items: prefer 'current' status, then locked (where prerequisites may be met), avoid completed
        const candidates = ordered.filter(n => n.status !== 'completed');

        candidates.sort((a, b) => {
          const score = (n) => (n.status === 'current' ? 0 : n.status === 'locked' ? 1 : 2) + (n.xp || 0) / 1000;
          return score(a) - score(b);
        });

        return candidates.slice(0, 3).map(node => ({
          ...node,
          reason: `Recommended for the ${career.title} role`
        }));
      },
      
      resetProgress: () => set({
        nodeProgress: {},
        xp: 0,
        badges: roadmapDataRaw.badges,
        weeklyGoals: [
          { id: 1, title: 'Complete 3 modules', completed: false, xp: 50 },
          { id: 2, title: 'Practice CSS Grid', completed: false, xp: 30 },
          { id: 3, title: 'Earn 200 XP', completed: false, xp: 40 }
        ]
      })
    }),
    {
      name: 'roadmap-storage',
      partialize: (state) => ({
        nodeProgress: state.nodeProgress,
        skills: state.skills,
        badges: state.badges,
        xp: state.xp,
        weeklyGoals: state.weeklyGoals,
        activeCareer: state.activeCareer,
        chatMessages: state.chatMessages
      })
    }
  )
);

export default useRoadmapStore;

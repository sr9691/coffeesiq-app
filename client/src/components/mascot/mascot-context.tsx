import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useLocation } from 'wouter';
import MascotTip, { Tip } from './mascot-tip';
import { MascotMood } from './bean-mascot';

// Define the context type
interface MascotContextType {
  showTips: (tips: Tip[], startIndex?: number) => void;
  hideTips: () => void;
  setMascotVisibility: (visible: boolean) => void;
  isMascotVisible: boolean;
  currentPathVisited: () => void;
  isFirstTimeVisitor: () => boolean;
}

// Create the context
const MascotContext = createContext<MascotContextType | undefined>(undefined);

// Props for provider
interface MascotProviderProps {
  children: ReactNode;
}

// Sample tips for different parts of the app

const TASTING_TIPS: Tip[] = [
  {
    id: 'tasting-intro',
    title: 'Flavor Exploration',
    content: 'Ready to develop your coffee palate? Let\'s explore how to identify the complex flavors in your cup!',
    mood: 'excited',
  },
  {
    id: 'tasting-smell',
    title: 'Start With Aroma',
    content: 'Before tasting, smell your coffee. Is it floral, fruity, nutty, chocolatey, or earthy? The aroma gives you a preview of what\'s to come.',
    mood: 'thinking',
  },
  {
    id: 'tasting-slurp',
    title: 'The Slurp Technique',
    content: 'Coffee professionals "slurp" to spray the coffee across their palate. This aerates the coffee and helps you detect more flavors!',
    mood: 'happy',
  },
  {
    id: 'tasting-notes',
    title: 'Identify Flavor Notes',
    content: 'Think about: Sweetness (caramel, honey), Acidity (citrus, apple), Body (light, heavy), and Aftertaste (lingering chocolate, quick finish).',
    mood: 'explaining',
  },
  {
    id: 'tasting-practice',
    title: 'Practice Makes Perfect',
    content: 'Keep a coffee journal to track what you taste. Over time, you\'ll develop your own flavor vocabulary and preferences!',
    mood: 'waving',
  },
];

export function MascotProvider({ children }: MascotProviderProps) {
  const [pathname] = useLocation();
  const [tipsVisible, setTipsVisible] = useState(false);
  const [currentTips, setCurrentTips] = useState<Tip[]>([]);
  const [tipsStartIndex, setTipsStartIndex] = useState(0);
  const [mascotVisible, setMascotVisible] = useState(true);
  
  // State to track visited paths
  const [visitedPaths, setVisitedPaths] = useState<string[]>(() => {
    const saved = localStorage.getItem('coffee-compass-visited-paths');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Save visited paths to localStorage
  React.useEffect(() => {
    localStorage.setItem('coffee-compass-visited-paths', JSON.stringify(visitedPaths));
  }, [visitedPaths]);
  
  // Show tips
  const showTips = (tips: Tip[], startIndex = 0) => {
    setCurrentTips(tips);
    setTipsStartIndex(startIndex);
    setTipsVisible(true);
  };
  
  // Hide tips
  const hideTips = () => {
    setTipsVisible(false);
  };
  
  // Set mascot visibility
  const setMascotVisibility = (visible: boolean) => {
    setMascotVisible(false);
    localStorage.setItem('coffee-compass-mascot-visible', JSON.stringify(false));
  };
  
  // Mark current path as visited
  const currentPathVisited = () => {
    if (!visitedPaths.includes(pathname)) {
      setVisitedPaths([...visitedPaths, pathname]);
    }
  };
  
  // Check if user is a first-time visitor
  const isFirstTimeVisitor = () => {
    return visitedPaths.length <= 1;
  };
  
  // Load mascot visibility preference
  React.useEffect(() => {
    const saved = localStorage.getItem('coffee-compass-mascot-visible');
    if (saved !== null) {
      setMascotVisible(JSON.parse(saved));
    }
  }, []);
  
  // Context value
  const contextValue: MascotContextType = {
    showTips,
    hideTips,
    setMascotVisibility,
    isMascotVisible: mascotVisible,
    currentPathVisited,
    isFirstTimeVisitor,
  };
  
  return (
    <MascotContext.Provider value={contextValue}>
      {children}
      
      {/* Tips modal */}
      {tipsVisible && (
        <MascotTip
          tips={currentTips}
          startIndex={tipsStartIndex}
          onClose={hideTips}
          onComplete={hideTips}
        />
      )}
    </MascotContext.Provider>
  );
}

// Custom hook to use the mascot context
export function useMascot() {
  const context = useContext(MascotContext);
  if (context === undefined) {
    throw new Error('useMascot must be used within a MascotProvider');
  }
  return context;
}

// Export predefined tip collections
export { TASTING_TIPS };
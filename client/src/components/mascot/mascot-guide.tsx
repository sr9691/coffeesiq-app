import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import BeanMascot, { MascotMood } from './bean-mascot';
import { useAuth } from '@/hooks/use-auth';

// Define guide instances for different parts of the app
export type GuideInstance = {
  id: string;
  message: string;
  mood: MascotMood;
  condition: (pathname: string, visited: string[], user: any) => boolean;
  dismissed?: boolean;
  autoHide?: boolean;
  hideAfter?: number;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  delay?: number; // Delay in milliseconds before showing
  priority: number; // Higher number = higher priority
};

// Guide instances for different parts of the app
const guideInstances: GuideInstance[] = [
  // Welcome guide
  {
    id: 'welcome',
    message: "Welcome to CoffeeCompass! I'm your coffee guide. I'll help you discover amazing coffees!",
    mood: 'waving',
    condition: (pathname, visited, user) => visited.length === 0,
    position: 'bottom-right',
    priority: 100,
    delay: 1000,
  },
  // Home page guide
  {
    id: 'home-page',
    message: "This is your coffee dashboard. Explore new flavors, track your favorites, and connect with other coffee lovers!",
    mood: 'explaining',
    condition: (pathname, visited, user) => pathname === '/' && !visited.includes('home-page'),
    position: 'bottom-left',
    priority: 90,
  },
  // Quiz page guide
  {
    id: 'quiz-intro',
    message: "Ready to find your perfect coffee match? Answer a few questions and I'll help you discover new favorites!",
    mood: 'excited',
    condition: (pathname, visited, user) => pathname === '/quiz' && !visited.includes('quiz-intro'),
    position: 'top-right',
    priority: 85,
  },
  // Add coffee guide
  {
    id: 'add-coffee',
    message: "Adding a new coffee? You can scan the barcode or enter details manually. Don't forget to add flavor notes!",
    mood: 'explaining',
    condition: (pathname, visited, user) => pathname === '/add-coffee' && !visited.includes('add-coffee'),
    position: 'top-right',
    priority: 80,
  },
  // Barcode scanner guide
  {
    id: 'barcode-scanner',
    message: "Position the coffee package barcode in front of your camera and hold steady!",
    mood: 'thinking',
    condition: (pathname, visited, user) => 
      pathname === '/add-coffee' && 
      document.querySelector('[data-active-tab="barcode"]') !== null,
    position: 'top-right',
    priority: 85,
    autoHide: true,
    hideAfter: 8000,
  },
  // Review page guide
  {
    id: 'review-page',
    message: "Share your thoughts on this coffee! Your reviews help other coffee enthusiasts find their perfect brew.",
    mood: 'happy',
    condition: (pathname, visited, user) => pathname.includes('/review') && !visited.includes('review-page'),
    position: 'top-right',
    priority: 75,
  },
  // Profile page guide
  {
    id: 'profile-page',
    message: "This is your coffee profile! Track your tasting journey and see your favorite flavor notes.",
    mood: 'explaining',
    condition: (pathname, visited, user) => pathname === '/profile' && !visited.includes('profile-page'),
    position: 'bottom-left',
    priority: 70,
  },
  // Authentication guide
  {
    id: 'auth-page',
    message: "Sign in to track your coffee adventures or create an account to join our community!",
    mood: 'waving',
    condition: (pathname, visited, user) => pathname === '/auth' && !user,
    position: 'bottom-right',
    priority: 95,
  },
  // New review reminder
  {
    id: 'review-reminder',
    message: "Don't forget to review the coffees you've tried! It helps you remember what you enjoyed.",
    mood: 'thinking',
    condition: (pathname, visited, user) => 
      pathname === '/' && 
      visited.length > 5 && 
      !visited.includes('review-reminder'),
    position: 'bottom-right',
    priority: 60,
    autoHide: true,
    hideAfter: 10000,
  },
];

// Positioning classes
const positionClasses = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-20 left-4 sm:bottom-4',  // Account for mobile nav
  'bottom-right': 'bottom-20 right-4 sm:bottom-4', // Account for mobile nav
  'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
};

export default function MascotGuide() {
  const [currentGuide, setCurrentGuide] = useState<GuideInstance | null>(null);
  const [visitedGuides, setVisitedGuides] = useState<string[]>(() => {
    // Load visited guides from localStorage
    const saved = localStorage.getItem('coffee-compass-visited-guides');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [pathname] = useLocation();
  const { user } = useAuth();
  
  // Save visited guides to localStorage
  useEffect(() => {
    localStorage.setItem('coffee-compass-visited-guides', JSON.stringify(visitedGuides));
  }, [visitedGuides]);
  
  // Find the appropriate guide to show based on current conditions
  useEffect(() => {
    // Sort instances by priority (higher first)
    const sortedInstances = [...guideInstances]
      .sort((a, b) => b.priority - a.priority);
    
    // Find the first eligible guide
    const eligibleGuide = sortedInstances.find(guide => 
      !guide.dismissed && 
      !visitedGuides.includes(guide.id) &&
      guide.condition(pathname, visitedGuides, user)
    );
    
    if (eligibleGuide) {
      const timer = setTimeout(() => {
        setCurrentGuide(eligibleGuide);
      }, eligibleGuide.delay || 0);
      
      return () => clearTimeout(timer);
    } else {
      setCurrentGuide(null);
    }
  }, [pathname, visitedGuides, user]);
  
  // Mark guide as visited when dismissed
  const handleGuideDismissed = (guideId: string) => {
    setVisitedGuides(prev => [...prev, guideId]);
    setCurrentGuide(null);
  };
  
  if (!currentGuide) return null;
  
  return (
    <div className={`fixed z-50 ${positionClasses[currentGuide.position]}`}>
      <div className="relative">
        <BeanMascot
          mood={currentGuide.mood}
          message={currentGuide.message}
          autoHide={currentGuide.autoHide}
          hideAfter={currentGuide.hideAfter}
          size="md"
          onHide={() => handleGuideDismissed(currentGuide.id)}
          className="cursor-pointer"
        />
        {/* Skip button */}
        <button 
          onClick={() => handleGuideDismissed(currentGuide.id)}
          className="absolute -top-2 -right-2 bg-coffee-cream text-coffee-brown rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md hover:bg-coffee-brown hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
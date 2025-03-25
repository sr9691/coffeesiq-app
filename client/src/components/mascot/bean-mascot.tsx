import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type MascotMood = 'happy' | 'excited' | 'thinking' | 'sleeping' | 'explaining' | 'waving';
export type MascotSize = 'sm' | 'md' | 'lg';

interface BeanMascotProps {
  mood?: MascotMood;
  size?: MascotSize;
  message?: string;
  autoHide?: boolean;
  hideAfter?: number; // in milliseconds
  onHide?: () => void;
  className?: string;
}

export default function BeanMascot({
  mood = 'happy',
  size = 'md',
  message,
  autoHide = false,
  hideAfter = 5000,
  onHide,
  className,
}: BeanMascotProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoHide && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onHide) onHide();
      }, hideAfter);
      
      return () => clearTimeout(timer);
    }
  }, [autoHide, hideAfter, visible, onHide]);

  // Size mapping
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
  };

  // Get size class
  const sizeClass = sizeMap[size];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.3, type: 'spring', bounce: 0.4 }}
          className={`relative ${className || ''}`}
        >
          <div className="flex flex-col items-center">
            {/* Bean SVG */}
            <div className={`relative ${sizeClass}`}>
              <BeanSvg mood={mood} />
            </div>
            
            {/* Speech bubble with message */}
            {message && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 bg-white rounded-xl px-4 py-2 shadow-md max-w-xs text-center border border-coffee-cream relative"
              >
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-white border-l border-t border-coffee-cream"></div>
                <p className="text-coffee-brown text-sm font-medium">{message}</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface BeanSvgProps {
  mood: MascotMood;
}

function BeanSvg({ mood }: BeanSvgProps) {
  // Base coffee cup shape for all moods
  const cupBody = (
    <>
      {/* Cup body main shape */}
      <motion.path
        d="M30,30 L30,75 Q50,85 70,75 L70,30 Q50,35 30,30 Z"
        fill="#4A3728"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ 
          repeat: Infinity, 
          repeatType: "reverse", 
          duration: 2,
          ease: "easeInOut"
        }}
      />
      
      {/* Cup handle */}
      <motion.path
        d="M70,40 Q85,40 85,50 Q85,60 70,60"
        stroke="#3A2718"
        strokeWidth="4"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      
      {/* Coffee surface with steam */}
      <motion.ellipse
        cx="50"
        cy="30"
        rx="20"
        ry="5"
        fill="#6F4E37"
      />
      
      {/* Steam */}
      <motion.path
        d="M40,25 Q38,20 40,15 Q42,10 40,5"
        stroke="#E4DFCA"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        animate={{ y: [0, -2, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />
      <motion.path
        d="M50,25 Q48,18 50,12 Q52,6 50,0"
        stroke="#E4DFCA"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        animate={{ y: [0, -2, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
      />
      <motion.path
        d="M60,25 Q58,20 60,15 Q62,10 60,5"
        stroke="#E4DFCA"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        animate={{ y: [0, -2, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ repeat: Infinity, duration: 3.5, delay: 0.2 }}
      />
    </>
  );

  // Different facial expressions based on mood
  const getFace = () => {
    switch (mood) {
      case 'happy':
        return (
          <>
            {/* Eyes */}
            <motion.circle 
              cx="40" 
              cy="40" 
              r="4" 
              fill="white"
              animate={{ y: [0, -1, 0] }}
              transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
            />
            <motion.circle 
              cx="60" 
              cy="40" 
              r="4" 
              fill="white"
              animate={{ y: [0, -1, 0] }}
              transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
            />
            
            {/* Smile */}
            <motion.path 
              d="M35,60 Q50,70 65,60" 
              stroke="white" 
              strokeWidth="2.5" 
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
            />
          </>
        );

      case 'excited':
        return (
          <>
            {/* Excited eyes */}
            <motion.ellipse 
              cx="40" 
              cy="40" 
              rx="4" 
              ry="5" 
              fill="white"
              animate={{ scaleY: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            />
            <motion.ellipse 
              cx="60" 
              cy="40" 
              rx="4" 
              ry="5" 
              fill="white"
              animate={{ scaleY: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            />
            
            {/* Open excited mouth */}
            <motion.ellipse 
              cx="50" 
              cy="62" 
              rx="10" 
              ry="8" 
              fill="#3A2718"
              stroke="white"
              strokeWidth="2"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3 }}
            />
          </>
        );

      case 'thinking':
        return (
          <>
            {/* Thoughtful eyes */}
            <motion.path 
              d="M36,40 Q40,36 44,40" 
              stroke="white" 
              strokeWidth="2.5" 
              fill="none"
            />
            <motion.path 
              d="M56,40 Q60,36 64,40" 
              stroke="white" 
              strokeWidth="2.5" 
              fill="none"
            />
            
            {/* Thinking mouth */}
            <motion.path 
              d="M42,65 L58,65" 
              stroke="white" 
              strokeWidth="2.5" 
              fill="none"
            />
            
            {/* Thinking bubble */}
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <circle cx="75" cy="25" r="3" fill="white" />
              <circle cx="82" cy="18" r="5" fill="white" />
              <circle cx="92" cy="10" r="7" fill="white" />
            </motion.g>
          </>
        );

      case 'sleeping':
        return (
          <>
            {/* Closed eyes (zzz) */}
            <motion.path 
              d="M36,40 Q40,43 44,40" 
              stroke="white" 
              strokeWidth="2.5" 
              fill="none"
            />
            <motion.path 
              d="M56,40 Q60,43 64,40" 
              stroke="white" 
              strokeWidth="2.5" 
              fill="none"
            />
            
            {/* Sleeping mouth */}
            <motion.path 
              d="M45,62 Q50,60 55,62" 
              stroke="white" 
              strokeWidth="2" 
              fill="none"
            />
            
            {/* ZZZ */}
            <motion.g
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <path d="M70,30 L80,20 L70,20 L80,10" stroke="white" strokeWidth="2" fill="none" />
              <text x="70" y="30" fill="white" fontSize="12">Z</text>
              <text x="77" y="20" fill="white" fontSize="10">Z</text>
              <text x="84" y="10" fill="white" fontSize="8">Z</text>
            </motion.g>
          </>
        );

      case 'explaining':
        return (
          <>
            {/* Explaining eyes - glasses effect */}
            <circle cx="40" cy="40" r="5" fill="none" stroke="white" strokeWidth="1.5" />
            <circle cx="60" cy="40" r="5" fill="none" stroke="white" strokeWidth="1.5" />
            <circle cx="40" cy="40" r="2" fill="white" />
            <circle cx="60" cy="40" r="2" fill="white" />
            <path d="M45,40 L55,40" stroke="white" strokeWidth="1.5" fill="none" />
            
            {/* Explaining mouth */}
            <motion.path 
              d="M40,60 Q50,65 60,60" 
              stroke="white" 
              strokeWidth="2" 
              fill="none"
              animate={{ d: ["M40,60 Q50,65 60,60", "M40,62 Q50,58 60,62", "M40,60 Q50,65 60,60"] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            
            {/* Light bulb idea */}
            <motion.g
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <path d="M85,25 Q85,15 75,15 Q65,15 65,25 Q65,32 75,35 L75,40" stroke="#FFD700" strokeWidth="2" fill="#FFEC80" />
              <path d="M72,40 L78,40 L72,43 L78,43" stroke="#FFD700" strokeWidth="1.5" fill="none" />
            </motion.g>
          </>
        );

      case 'waving':
        return (
          <>
            {/* Standard eyes */}
            <circle cx="40" cy="40" r="4" fill="white" />
            <circle cx="60" cy="40" r="4" fill="white" />
            
            {/* Smile */}
            <path d="M40,60 Q50,68 60,60" stroke="white" strokeWidth="2.5" fill="none" />
            
            {/* Waving arm */}
            <motion.path 
              d="M80,50 L95,35" 
              stroke="#4A3728" 
              strokeWidth="6" 
              strokeLinecap="round"
              animate={{ rotate: [0, -20, 0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1 }}
            />
            <motion.ellipse 
              cx="95" 
              cy="35" 
              rx="5" 
              ry="6" 
              fill="#4A3728"
              animate={{ rotate: [0, -20, 0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1 }}
            />
          </>
        );

      default:
        return (
          <>
            <circle cx="40" cy="40" r="4" fill="white" />
            <circle cx="60" cy="40" r="4" fill="white" />
            <path d="M40,60 Q50,68 60,60" stroke="white" strokeWidth="2.5" fill="none" />
          </>
        );
    }
  };

  return (
    <svg 
      viewBox="0 0 100 100" 
      className="w-full h-full"
    >
      {cupBody}
      {getFace()}
    </svg>
  );
}
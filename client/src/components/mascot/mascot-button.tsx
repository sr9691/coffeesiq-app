import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BeanMascot, { MascotMood } from './bean-mascot';
import { useMascot, TASTING_TIPS } from './mascot-context';

interface MascotButtonProps {
  tooltipText?: string;
  mood?: MascotMood;
  size?: 'sm' | 'md';
  tipsType?: 'tasting' | 'custom';
  customTips?: any[];
  className?: string;
}

export default function MascotButton({
  tooltipText = 'Get coffee tips!',
  mood = 'happy',
  size = 'sm',
  tipsType = 'tasting',
  customTips,
  className,
}: MascotButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { showTips, isMascotVisible } = useMascot();

  if (!isMascotVisible) return null;

  const handleClick = () => {
    // Determine which tips to show
    const tips = 
      tipsType === 'tasting' ? TASTING_TIPS :
      customTips;
    
    // Show tips if available
    if (tips && tips.length > 0) {
      showTips(tips);
    }
  };

  // Size mapping
  const sizeClass = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
  }[size];

  return (
    <div className={`relative ${className || ''}`}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleClick}
        className={`${sizeClass} rounded-full bg-coffee-cream flex items-center justify-center shadow-md p-1 border-2 border-coffee-brown`}
      >
        <BeanMascot mood={mood} size="sm" />
      </motion.button>
      
      {/* Tooltip */}
      {showTooltip && tooltipText && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full mb-2 bg-white rounded-lg px-3 py-1.5 shadow-md text-xs text-coffee-brown whitespace-nowrap"
        >
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 bg-white"></div>
          {tooltipText}
        </motion.div>
      )}
    </div>
  );
}
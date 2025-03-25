import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BeanMascot, { MascotMood } from './bean-mascot';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Tip {
  id: string;
  title: string;
  content: string | React.ReactNode;
  mood: MascotMood;
}

interface MascotTipProps {
  tips: Tip[];
  onClose: () => void;
  onComplete?: () => void;
  startIndex?: number;
}

export default function MascotTip({
  tips,
  onClose,
  onComplete,
  startIndex = 0,
}: MascotTipProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  if (!tips || tips.length === 0) return null;

  const currentTip = tips[currentIndex];

  const goToNext = () => {
    if (currentIndex < tips.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full relative overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-coffee-brown/60 hover:text-coffee-brown z-10"
        >
          <X size={20} />
        </button>

        {/* Tip content */}
        <div className="relative h-[350px]">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={currentTip.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -50 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <div className="flex flex-col h-full">
                {/* Mascot and title */}
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 mr-4">
                    <BeanMascot mood={currentTip.mood} size="sm" />
                  </div>
                  <h3 className="text-xl font-bold text-coffee-brown">{currentTip.title}</h3>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto text-coffee-brown/80">
                  {typeof currentTip.content === 'string' ? (
                    <p>{currentTip.content}</p>
                  ) : (
                    currentTip.content
                  )}
                </div>

                {/* Progress indicator */}
                <div className="flex items-center justify-between mt-6">
                  <div className="flex space-x-1">
                    {tips.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full ${
                          i === currentIndex
                            ? 'w-6 bg-coffee-red'
                            : 'w-2 bg-coffee-cream'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPrevious}
                      disabled={currentIndex === 0}
                      className="border-coffee-brown text-coffee-brown disabled:opacity-40"
                    >
                      <ChevronLeft size={16} className="mr-1" /> Previous
                    </Button>

                    <Button
                      variant="default"
                      size="sm"
                      onClick={goToNext}
                      className="bg-coffee-brown text-white hover:bg-coffee-brown/90"
                    >
                      {currentIndex === tips.length - 1 ? (
                        'Finish'
                      ) : (
                        <>
                          Next <ChevronRight size={16} className="ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
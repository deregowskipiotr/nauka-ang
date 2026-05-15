// src/components/Flashcard/Flashcard.tsx
import React from 'react';
import  { type Flashcard as FlashcardType } from '../../types/flashcard.types';

interface FlashcardProps {
  card: FlashcardType;
  onFlip?: () => void;  // Prepared for future flip functionality
  isFlipped?: boolean;   // Prepared for future
}

export const Flashcard: React.FC<FlashcardProps> = ({ 
  card, 
  onFlip,
  isFlipped = false 
}) => {
  return (
    <div 
      className="relative w-full max-w-2xl mx-auto perspective-1000 cursor-pointer"
      onClick={onFlip}  // Will be used for future flip, currently does nothing
    >
      <div className={`
        relative w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl 
        transition-all duration-500 transform-gpu
        ${!isFlipped ? 'rotate-y-0' : 'rotate-y-180'}
      `}>
        {/* Front Side */}
        <div className={`
          p-8 md:p-12 text-center transition-all duration-300 min-h-[320px] md:min-h-[400px] flex flex-col justify-center
          ${isFlipped ? 'opacity-0 invisible' : 'opacity-100 visible'}
        `}>
          <div className="space-y-8">
            {/* English Word/Sentence */}
            <div className="space-y-4">
              <div className="text-sm uppercase tracking-wider text-primary/50 font-title">
                English
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-primary font-title">
                {card.word}
              </h2>
            </div>
            
            {/* Polish Meaning */}
            <div className="space-y-4 pt-8 border-t border-primary/10">
              <div className="text-sm uppercase tracking-wider text-secondary/50 font-title">
                Znaczenie
              </div>
              <p className="text-lg md:text-2xl text-secondary font-text leading-relaxed">
                {card.meaning}
              </p>
            </div>
          </div>
        </div>
        
        {/* Back Side - Prepared for future */}
        <div className={`
          absolute inset-0 p-8 md:p-12 text-center transition-all duration-300 min-h-[320px] md:min-h-[400px] flex items-center justify-center
          ${isFlipped ? 'opacity-100 visible' : 'opacity-0 invisible'}
          transform rotate-y-180
        `}>
          <div className="flex items-center justify-center h-full">
            <p className="text-primary/50 font-text">
              Back side coming soon! 🔄
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
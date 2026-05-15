// src/components/Flashcard/FlashcardNavigation.tsx
import React from 'react';
import { Button } from '../UI/Button';
import { AudioButton } from '../UI/AudioButton';

interface FlashcardNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  onReset?: () => void;
  currentIndex: number;
  totalCards: number;
  currentWord: string;
  onFlip?: () => void;
  showResetConfirm?: boolean;
  setShowResetConfirm?: (show: boolean) => void;
}

export const FlashcardNavigation: React.FC<FlashcardNavigationProps> = ({
  onPrev,
  onNext,
  currentIndex,
  totalCards,
  currentWord,
}) => {
  return (
    <div className="flex flex-col items-center gap-6 w-full mx-auto">
      
      {/* DESKTOP LAYOUT (1 row - hidden on mobile) */}
      <div className="hidden md:flex items-center justify-between gap-4 w-full">
        {/* Previous button - fixed width */}
        <div className="w-[140px]">
          <Button variant="prev" onClick={onPrev} className="w-full justify-center">
            <span className="text-2xl">←</span>
            <span className="ml-2">Previous</span>
          </Button>
        </div>
        
        {/* Center group: Counter + Audio + Flip */}
        <div className="flex items-center gap-6">
          {/* Card Counter */}
          <div className="text-center min-w-[80px]">
            <span className="text-base text-primary font-title">
              {currentIndex + 1}<span className="text-lg">/{totalCards}</span>
            </span>
            <span className="text-xs text-secondary/60 font-text ml-1">kart</span>
          </div>
          
          {/* Audio Button - fixed width */}
          <div className="w-[140px]">
            <AudioButton text={currentWord} className="w-full justify-center" />
          </div>
          
          {/* Flip Button - fixed width */}
          {/*<div className="w-[140px]">
            <button
              type='button'
              onClick={() => {
                const tooltip = document.createElement('div');
                tooltip.textContent = '✨ Coming soon! Example sentences will appear here ✨';
                tooltip.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-text z-50 animate-in shadow-lg';
                document.body.appendChild(tooltip);
                setTimeout(() => tooltip.remove(), 2000);
              }}
              className="w-full min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white/50 hover:bg-white/80 transition-all group"
              aria-label="Flip card - coming soon"
            >
              <svg className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div> */}
        </div>
        
        {/* Next button - fixed width */}
        <div className="w-[140px]">
          <Button variant="next" onClick={onNext} className="w-full justify-center">
            <span className="mr-2">Next</span>
            <span className="text-2xl">→</span>
          </Button>
        </div>
      </div>
      
      {/* MOBILE LAYOUT (2 rows - hidden on desktop) */}
      <div className="flex md:hidden flex-col items-center gap-6 w-full">
        
        {/* Row 1: Previous & Next buttons - equal width */}
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex-1">
            <Button variant="prev" onClick={onPrev} className="w-full justify-center">
              <span className="text-2xl">←</span>
              <span className="ml-2">Previous</span>
            </Button>
          </div>
          
          <div className="flex-1">
            <Button variant="next" onClick={onNext} className="w-full justify-center">
              <span className="mr-2">Next</span>
              <span className="text-2xl">→</span>
            </Button>
          </div>
        </div>
        
        {/* Row 2: Counter | Audio | Flip - equal width distribution */}
        <div className="flex items-center justify-between gap-4 w-full">
          {/* Card Counter - Left */}
          <div className="flex-1 text-left">
            <div className="bg-white/50 rounded-xl px-3 py-2 min-h-[44px] flex items-center justify-center">
              <span className="text-sm text-primary font-title">
                {currentIndex + 1}<span className="text-base">/{totalCards}</span>
              </span>
              <span className="text-xs text-secondary/60 font-text ml-1">kart</span>
            </div>
          </div>
          
          {/* Audio Button - Center */}
          <div className="flex-1">
            <AudioButton text={currentWord} className="w-full justify-center" />
          </div>
          
          {/* Flip Button - Right */}
          {/*<div className="flex-1">
            <button
              type='button'
              onClick={() => {
                const tooltip = document.createElement('div');
                tooltip.textContent = '✨ Coming soon! Example sentences will appear here ✨';
                tooltip.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-text z-50 animate-in shadow-lg';
                document.body.appendChild(tooltip);
                setTimeout(() => tooltip.remove(), 2000);
              }}
              className="w-full min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white/50 hover:bg-white/80 transition-all group"
              aria-label="Flip card - coming soon"
            >
              <svg className="w-6 h-6 text-primary/70 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div> */}
        </div>
      </div>
      
      {/* Progress Bar (visible on both desktop & mobile) */}
      <div className="w-full">
        <div className="w-full h-1.5 bg-primary/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-linear-to-r from-primary to-secondary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
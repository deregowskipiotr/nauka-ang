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
  onReset,
  currentIndex,
  totalCards,
  currentWord,
  onFlip,
  showResetConfirm,
  //setShowResetConfirm
}) => {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Main navigation */}
      <div className="flex items-center justify-between gap-4 w-full">
        <Button variant="prev" onClick={onPrev}>
          <span className="text-2xl">←</span>
          <span className="hidden md:inline ml-2">Previous</span>
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-primary font-title">
              {currentIndex + 1} / {totalCards}
            </div>
            <div className="text-xs text-secondary/60 font-text mt-1">
              karta
            </div>
          </div>
          
          <AudioButton text={currentWord} />
          
          {/* Mobile Reset Button (visible on small screens) */}
          {onReset && !showResetConfirm && (
            <button
              type="button"
              onClick={onReset}
              className="block sm:hidden p-2 rounded-full bg-white/50 hover:bg-white/80 transition-all"
              aria-label="Reset to first card"
            >
              <svg className="w-5 h-5 text-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </div>
        
        <Button variant="next" onClick={onNext}>
          <span className="hidden md:inline mr-2">Next</span>
          <span className="text-2xl">→</span>
        </Button>
      </div>
      
      {/* Future flip button */}
      {onFlip && (
        <Button variant="flip" onClick={onFlip}>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Show example
          </span>
        </Button>
      )}
      
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-primary/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-linear-to-r from-primary to-secondary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
        />
      </div>
      
      {/* Desktop Reset link (below progress bar) */}
      {onReset && !showResetConfirm && (
        <button
          type="button"
          onClick={onReset}
          className="hidden sm:flex items-center gap-1 text-xs text-secondary/50 hover:text-secondary/80 transition-colors font-text mt-2"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Rozpocznij od początku
        </button>
      )}
    </div>
  );
};
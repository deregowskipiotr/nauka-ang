// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Flashcard } from '../components/FlashCard/FlashCard';
import { FlashcardNavigation } from '../components/FlashCard/FlashcardNavigation';
import { useFlashcard } from '../hooks/useFlashcard';
import { flashcardsData } from '../data/flashcards';

export const Dashboard: React.FC = () => {
  const {
    currentCard,
    currentIndex,
    totalCards,
    nextCard,
    prevCard,
    goToCard  // We'll need to add this to useFlashcard
  } = useFlashcard(flashcardsData);
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const handleReset = () => {
    goToCard(0);
    setShowResetConfirm(false);
    // Optional: Add a small visual feedback
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
      resetBtn.classList.add('scale-95');
      setTimeout(() => resetBtn.classList.remove('scale-95'), 200);
    }
  };
  
  // Auto-hide confirmation after 3 seconds
  useEffect(() => {
    if (showResetConfirm) {
      const timer = setTimeout(() => setShowResetConfirm(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showResetConfirm]);
  
  return (
    <div className="bg-main py-2 md:py-6 px-2 md:px-4 flex items-center justify-center" style={{ minHeight: '100vh' }}>
      {/* Screen-like container with border and shadow */}
      <div className="w-full max-w-4xl mx-auto bg-white/30 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/40 p-4 md:p-6">
        <div className="w-full px-4">
          {/* Header with Reset button */}
          <div className="flex justify-between items-center mb-4 md:mb-8">
            <div className="text-left">
              <h1 className="text-gradient-heading-main text-2xl md:text-4xl font-title font-bold">
                English Flashcards
              </h1>
              <p className="text-secondary/60 font-text text-xs md:text-sm mt-1">
                Nauka angielskiego od podstaw 🇬🇧 → 🇵🇱
              </p>
            </div>
            {/* Reset Button - Icon only on mobile (direct reset), text + confirmation on desktop */}
            <div className="relative">
              {!showResetConfirm ? (
                <button
                  type='button'
                  id="reset-btn"
                  onClick={() => {
                    // Mobile: reset directly (no confirmation)
                    if (window.innerWidth < 640) {
                      goToCard(0);
                      // Visual feedback
                      const resetBtn = document.getElementById('reset-btn');
                      if (resetBtn) {
                        resetBtn.classList.add('scale-95');
                        setTimeout(() => resetBtn.classList.remove('scale-95'), 200);
                      }
                    } else {
                      // Desktop: show confirmation
                      setShowResetConfirm(true);
                    }
                  }}
                  className="group flex items-center justify-center min-w-[44px] min-h-[44px] md:w-[140px] p-2 rounded-xl bg-white/50 hover:bg-white/80 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-md text-sm font-text text-primary cursor-pointer"
                  aria-label="Reset to first card"
                >
                  <svg 
                    className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="hidden sm:inline ml-2 text-sm text-primary/80 group-hover:text-primary font-text">
                    Reset
                  </span>
                </button>
              ) : (
                // Confirmation dialog - DESKTOP ONLY
                <div className="hidden sm:flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                  <span className="text-xs text-secondary/70 font-text bg-white/50 px-3 py-1.5 rounded-lg">
                    Start od początku?
                  </span>
                  <button
                    type='button'
                    onClick={handleReset}
                    className="min-w-[44px] px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 text-sm font-medium transition-all hover:scale-105"
                  >
                    Tak
                  </button>
                  <button
                    type='button'
                    onClick={() => setShowResetConfirm(false)}
                    className="min-w-[44px] px-3 py-1.5 rounded-lg bg-white/50 hover:bg-white/80 text-secondary text-sm transition-all"
                  >
                    Nie
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Flashcard */}
          <div className="mb-6 md:mb-10">
            <Flashcard card={currentCard} />
          </div>
          
          {/* Navigation */}
          <FlashcardNavigation
            onPrev={prevCard}
            onNext={nextCard}
            onReset={handleReset}  // Pass reset to navigation too
            currentIndex={currentIndex}
            totalCards={totalCards}
            currentWord={currentCard.word}
            showResetConfirm={showResetConfirm}
            setShowResetConfirm={setShowResetConfirm}
          />
        </div>
      </div>
    </div>
  );
};
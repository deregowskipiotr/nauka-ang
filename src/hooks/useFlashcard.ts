// src/hooks/useFlashcard.ts
import { useState, useEffect, useCallback } from 'react';
import { type Flashcard } from '../types/flashcard.types';

const STORAGE_KEY = 'flashcard-index';

export const useFlashcard = (cards: Flashcard[]) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const index = parseInt(saved, 10);
      if (!isNaN(index) && index >= 0 && index < cards.length) {
        return index;
      }
    }
    return 0;
  });
  
  const [currentCard, setCurrentCard] = useState<Flashcard>(cards[0]);
  
  useEffect(() => {
    setCurrentCard(cards[currentIndex]);
    localStorage.setItem(STORAGE_KEY, currentIndex.toString());
  }, [currentIndex, cards]);
  
  const nextCard = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  }, [cards.length]);
  
  const prevCard = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);
  
  const goToCard = useCallback((index: number) => {
    if (index >= 0 && index < cards.length) {
      setCurrentIndex(index);
    }
  }, [cards.length]);

    const resetToFirst = useCallback(() => {
    setCurrentIndex(0);
  }, []);
  
  return {
    currentCard,
    currentIndex,
    totalCards: cards.length,
    nextCard,
    prevCard,
    goToCard,
    resetToFirst,
    progress: ((currentIndex + 1) / cards.length) * 100
  };
};
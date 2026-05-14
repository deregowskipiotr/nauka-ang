// src/types/flashcard.types.ts
export interface Flashcard {
  id: number;
  word: string;        // English word or short sentence
  meaning: string;     // Polish translation/explanation
}

export interface CardProgress {
  currentIndex: number;
  totalCards: number;
}
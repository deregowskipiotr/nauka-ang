// src/hooks/useSpeech.ts
import { useCallback } from 'react';

interface UseSpeechProps {
  rate?: number;  // 0.5 to 2, default 1
  pitch?: number; // 0 to 2, default 1
  voice?: SpeechSynthesisVoice | null;
}

export const useSpeech = (options: UseSpeechProps = {}) => {
  const { rate = 0.85, pitch = 1.1 } = options; // Slower (0.85) and slightly higher pitch for female voice
  
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    // Try to find a female voice
    const setFemaleVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // Look for female-sounding voices (Google UK Female, Samantha, etc.)
      const femaleVoice = voices.find(voice => 
        voice.name.includes('Google UK Female') ||
        voice.name.includes('Samantha') ||
        voice.name.includes('Female') ||
        (voice.lang === 'en-US' && voice.name.includes('Female'))
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
    };
    
    // Voices might not be loaded yet
    if (window.speechSynthesis.getVoices().length > 0) {
      setFemaleVoice();
    } else {
      window.speechSynthesis.onvoiceschanged = setFemaleVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }, [rate, pitch]);
  
  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);
  
  return { speak, stop };
};
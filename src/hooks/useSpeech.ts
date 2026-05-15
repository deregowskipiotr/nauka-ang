// src/hooks/useSpeech.ts
import { useState, useCallback, useEffect, useRef } from 'react';

interface UseSpeechProps {
  rate?: number;
  pitch?: number;
}

export const useSpeech = (options: UseSpeechProps = {}) => {
  const { rate = 0.7, pitch = 1.15 } = options;
  
  const [supported] = useState(
    () => typeof window !== "undefined" && "speechSynthesis" in window,
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices
  useEffect(() => {
    if (!supported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
        setVoicesLoaded(true);
      }
    };

    loadVoices();
    
    // Better to use addEventListener if supported, to avoid overwriting other hooks
    if (window.speechSynthesis.addEventListener) {
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    } else if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis.removeEventListener) {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      } else {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [supported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentUtterance.current) {
        const utterance = currentUtterance.current;
        utterance.onstart = null;
        utterance.onend = null;
        utterance.onerror = null;
      }
      if (supported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [supported]);

  const getPreferredVoice = useCallback((voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    if (voices.length === 0) return null;

    // 1. Try saved voice preference first
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("preferredVoice");
      if (saved) {
        const savedVoice = voices.find((v) => v.name === saved);
        if (savedVoice) return savedVoice;
      }
    }

    // 2. Female voice priority list (order matters!)
    const femaleVoicePatterns = [
      // Microsoft Edge / Windows - Modern neural voices
      'Microsoft Emma',
      'Microsoft Jenny',
      'Microsoft Aria',
      'Microsoft Michelle',
      'Microsoft Zira',
      
      // Google Chrome
      'Google UK English Female',
      'Google US English Female',
      'Google UK English',
      'Google US English', // Often female by default on Chrome
      
      // macOS / iOS
      'Samantha',
      'Allison',
      'Ava',
      'Susan',
      'Karen',
      'Victoria',
      
      // Generic patterns (last resort)
      'female',
    ];

    // Search for female voices (allow ANY English language: en-US, en-GB, en-AU, etc.)
    for (const pattern of femaleVoicePatterns) {
      const voice = voices.find(v => 
        v.name.toLowerCase().includes(pattern.toLowerCase()) && 
        v.lang.startsWith('en')
      );
      if (voice) {
        if (typeof window !== "undefined") localStorage.setItem("preferredVoice", voice.name);
        return voice;
      }
    }

    // 3. Fallback: any English voice (not just US)
    const anyEnglishVoice = voices.find(v => v.lang.startsWith('en'));
    if (anyEnglishVoice) {
      if (typeof window !== "undefined") localStorage.setItem("preferredVoice", anyEnglishVoice.name);
      return anyEnglishVoice;
    }

    return null;
  }, []);

  const executeSpeech = useCallback((text: string, customRate?: number, voices: SpeechSynthesisVoice[] = []) => {
    // Cancel current speech
    if (currentUtterance.current) {
      window.speechSynthesis.cancel();
      currentUtterance.current = null;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance.current = utterance;

    const voice = getPreferredVoice(voices);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.lang = "en-US";
    utterance.rate = customRate !== undefined ? customRate : rate;
    utterance.pitch = pitch;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      currentUtterance.current = null;
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      currentUtterance.current = null;
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
      currentUtterance.current = null;
    }
  }, [getPreferredVoice, rate, pitch]);

  const speak = useCallback(
    (text: string, customRate?: number) => {
      if (!supported || !window.speechSynthesis) return;

      const voices = window.speechSynthesis.getVoices();
      
      // If voices are not loaded yet, wait a tiny bit then execute directly.
      // This completely avoids the infinite setTimeout loop.
      if (voices.length === 0) {
        setTimeout(() => {
          const freshVoices = window.speechSynthesis.getVoices();
          executeSpeech(text, customRate, freshVoices);
        }, 100);
        return;
      }

      executeSpeech(text, customRate, voices);
    },
    [supported, executeSpeech],
  );

  const speakWord = useCallback(
    (word: string) => {
      speak(word, rate);
    },
    [speak, rate],
  );

  const stopSpeaking = useCallback(() => {
    if (supported && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      currentUtterance.current = null;
    }
  }, [supported]);

  const stop = useCallback(() => {
    stopSpeaking();
  }, [stopSpeaking]);

  return { 
    speak: speakWord, 
    stop, 
    isSpeaking, 
    stopSpeaking,
    supported,
    availableVoices,
    voicesLoaded
  };
};
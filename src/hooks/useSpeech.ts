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
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("preferredVoice");
    }
    return null;
  });

  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices
  useEffect(() => {
    if (!supported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Debug: log all voices to console
      //console.log('📢 Available voices:', voices.map(v => ({ name: v.name, lang: v.lang })));
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
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

  const saveVoicePreference = useCallback((voiceName: string) => {
    setSelectedVoiceName(voiceName);
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredVoice", voiceName);
    }
  }, []);

  const getPreferredVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (availableVoices.length === 0) return null;

    // 1. Try saved voice preference first
    if (selectedVoiceName) {
      const savedVoice = availableVoices.find(
        (voice) => voice.name === selectedVoiceName,
      );
      if (savedVoice) return savedVoice;
    }

    // 2. Cross-platform female voice priority list
    const femaleVoicePatterns = [
      // Google Chrome (Windows/Mac/Android)
      'Google UK English Female',
      'Google US English Female',
      'Google UK English',
      // macOS / iOS
      'Samantha',
      'Siri',
      'Allison',
      'Ava',
      'Susan',
      'Karen',
      'Victoria',
      // Windows
      'Microsoft Zira',
      'Microsoft Helena',
      'Microsoft Susan',
      'Microsoft - English (United States) - Zira',
      // Android
      'en-US-x-',
      'English United States',
      'Female',
    ];

    // Try to find by pattern
    for (const pattern of femaleVoicePatterns) {
      const voice = availableVoices.find(v => 
        v.name.toLowerCase().includes(pattern.toLowerCase()) && 
        v.lang.startsWith('en-US')
      );
      if (voice) {
        console.log('🎤 Found female voice:', voice.name);
        saveVoicePreference(voice.name);
        return voice;
      }
    }

    // 3. Fallback: any US English voice (better than nothing)
    const anyUsVoice = availableVoices.find(v => v.lang.startsWith('en-US'));
    if (anyUsVoice) {
      console.log('🎤 Fallback US voice:', anyUsVoice.name);
      saveVoicePreference(anyUsVoice.name);
      return anyUsVoice;
    }

    // 4. Last resort: any English voice
    const anyEnglishVoice = availableVoices.find(v => v.lang.startsWith('en'));
    if (anyEnglishVoice) {
      console.log('🎤 Fallback English voice:', anyEnglishVoice.name);
      saveVoicePreference(anyEnglishVoice.name);
      return anyEnglishVoice;
    }

    return null;
  }, [availableVoices, selectedVoiceName, saveVoicePreference]);

  const speak = useCallback(
    (text: string, customRate?: number) => {
      if (!supported || !window.speechSynthesis) {
        console.warn("Speech synthesis not supported");
        return;
      }

      // Cancel current speech
      if (currentUtterance.current) {
        window.speechSynthesis.cancel();
        currentUtterance.current = null;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      currentUtterance.current = utterance;

      // Apply voice preference
      const voice = getPreferredVoice();
      if (voice) {
        utterance.voice = voice;
        console.log('🔊 Speaking with voice:', voice.name);
      } else {
        console.log('🔊 Speaking with default voice');
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
      utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
        console.error("Speech synthesis error:", event.error);
        setIsSpeaking(false);
        currentUtterance.current = null;
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("Failed to speak:", error);
        setIsSpeaking(false);
        currentUtterance.current = null;
      }
    },
    [supported, getPreferredVoice, rate, pitch],
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
    availableVoices
  };
};
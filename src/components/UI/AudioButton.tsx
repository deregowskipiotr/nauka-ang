// src/components/UI/AudioButton.tsx
import React, { useState } from 'react';
import { Button } from './Button';
import { useSpeech } from '../../hooks/useSpeech';

interface AudioButtonProps {
  text: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { speak, stop } = useSpeech({ rate: 0.8, pitch: 1.1 }); // Even slower for absolute beginner
  
  const handlePlay = () => {
    if (isPlaying) {
      stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speak(text);
      // Reset playing state after speech ends
      setTimeout(() => {
        setIsPlaying(false);
      }, text.length * 100); // Rough estimate: 100ms per character
    }
  };
  
  return (
    <Button
      variant="audio"
      icon={
        <svg 
          className={`w-8 h-8 md:w-10 md:h-10 transition-all ${isPlaying ? 'scale-110 text-primary' : 'text-primary/70'}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {isPlaying ? (
            // Stop icon
            <rect x="6" y="6" width="12" height="12" strokeWidth="2" stroke="currentColor" fill="currentColor" />
          ) : (
            // Speaker icon
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          )}
        </svg>
      }
      onClick={handlePlay}
      aria-label={isPlaying ? "Stop pronunciation" : "Hear pronunciation"}
    />
  );
};
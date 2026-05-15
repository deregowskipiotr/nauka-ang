// src/components/UI/AudioButton.tsx
import React, { useState } from 'react';
import { useSpeech } from '../../hooks/useSpeech';

interface AudioButtonProps {
  text: string;
  className?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({ text, className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { speak, stop } = useSpeech({ rate: 0.8, pitch: 1.1 });
  
  const handlePlay = () => {
    if (isPlaying) {
      stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speak(text);
      setTimeout(() => {
        setIsPlaying(false);
      }, text.length * 100);
    }
  };
  
  return (
    <button
      type='button'
      onClick={handlePlay}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/80 hover:bg-white backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200 min-w-[120px] cursor-pointer ${className}`}
      aria-label={isPlaying ? "Stop pronunciation" : "Hear pronunciation"}
    >
      <span className="text-xl">🔊</span>
      <span className="text-sm font-text text-primary">
        {isPlaying ? "Speaking..." : "Hear Word"}
      </span>
    </button>
  );
};
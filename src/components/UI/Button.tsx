// src/components/UI/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'prev' | 'next' | 'audio' | 'flip' | 'default';
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'default', 
  icon, 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    prev: 'px-6 py-3 rounded-xl bg-white/80 backdrop-blur-sm text-secondary hover:bg-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95',
    next: 'px-6 py-3 rounded-xl bg-white/80 backdrop-blur-sm text-secondary hover:bg-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95',
    audio: 'p-4 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300',
    flip: 'px-6 py-2 rounded-lg bg-primary/5 text-primary hover:bg-primary/10 border border-primary/20 transition-all duration-300',
    default: 'px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300'
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex items-center justify-center">{icon}</span>}
      {children}
    </button>
  );
};
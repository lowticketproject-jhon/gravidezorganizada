import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`glass-card rounded-[32px] p-6 ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  gender?: 'boy' | 'girl' | 'unknown';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  gender = 'girl',
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-[24px] font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none';
  
  const themeColors = {
    boy: {
      primary: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white premium-shadow hover:shadow-lg',
      secondary: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100',
      outline: 'border-2 border-blue-200 text-blue-600 hover:bg-blue-50',
    },
    girl: {
      primary: 'bg-gradient-to-br from-pink-400 to-pink-500 text-white premium-shadow hover:shadow-lg',
      secondary: 'bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-100',
      outline: 'border-2 border-pink-200 text-pink-600 hover:bg-pink-50',
    },
    unknown: {
      primary: 'bg-gradient-to-br from-violet-400 to-violet-500 text-white premium-shadow hover:shadow-lg',
      secondary: 'bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-100',
      outline: 'border-2 border-violet-200 text-violet-600 hover:bg-violet-50',
    }
  }[gender];

  const variants = {
    primary: themeColors.primary,
    secondary: themeColors.secondary,
    outline: themeColors.outline,
    ghost: 'text-gray-500 hover:bg-gray-100 hover:text-gray-800',
  };

  const sizes = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-7 py-3.5 text-base',
    lg: 'px-9 py-4.5 text-lg',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: string; className?: string }> = ({ 
  children, 
  color = 'pink',
  className = ''
}) => {
  const colors: Record<string, string> = {
    pink: 'bg-pink-100/80 text-pink-700 border-pink-200',
    blue: 'bg-blue-100/80 text-blue-700 border-blue-200',
    green: 'bg-green-100/80 text-green-700 border-green-200',
    amber: 'bg-amber-100/80 text-amber-700 border-amber-200',
    violet: 'bg-violet-100/80 text-violet-700 border-violet-200',
  };

  return (
    <span className={`px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider border ${colors[color] || colors.pink} ${className}`}>
      {children}
    </span>
  );
};

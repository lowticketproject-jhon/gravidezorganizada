import React from 'react';
import { 
  Heart, 
  Footprints, 
  Calendar, 
  Moon, 
  Star, 
  Leaf, 
  Sparkles,
  Baby
} from 'lucide-react';

import { BabyGender } from '../types';

interface BackgroundDecorationProps {
  gender?: BabyGender;
}

export const BackgroundDecoration: React.FC<BackgroundDecorationProps> = ({ gender = 'unknown' }) => {
  const themeColors = {
    boy: {
      primary: 'bg-blue-100/15',
      secondary: 'bg-blue-200/10',
      accent: 'bg-blue-50/20',
      icon: 'text-blue-900'
    },
    girl: {
      primary: 'bg-pink-100/15',
      secondary: 'bg-pink-200/10',
      accent: 'bg-pink-50/20',
      icon: 'text-pink-900'
    },
    unknown: {
      primary: 'bg-violet-100/15',
      secondary: 'bg-violet-200/10',
      accent: 'bg-violet-50/20',
      icon: 'text-violet-900'
    }
  }[gender === 'boy' ? 'boy' : gender === 'girl' ? 'girl' : 'unknown'];

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* Layer 1: Soft Organic Blurred Shapes */}
      <div className={`absolute top-[-10%] left-[-5%] w-[500px] h-[500px] ${themeColors.primary} rounded-full blur-[120px]`} />
      <div className={`absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] ${themeColors.secondary} rounded-full blur-[120px]`} />
      <div className={`absolute top-[20%] right-[10%] w-[400px] h-[400px] ${themeColors.accent} rounded-full blur-[100px]`} />
      <div className={`absolute bottom-[30%] left-[15%] w-[350px] h-[350px] ${themeColors.accent} rounded-full blur-[100px]`} />

      {/* Layer 2: Subtle Linear Icons (Watermarks) */}
      <div className={`absolute inset-0 opacity-[0.03] ${themeColors.icon}`}>
        {/* Top Left */}
        <div className="absolute top-[10%] left-[5%] rotate-[-15deg]">
          <Heart size={120} strokeWidth={1} />
        </div>
        
        {/* Top Right */}
        <div className="absolute top-[15%] right-[8%] rotate-[20deg]">
          <Sparkles size={160} strokeWidth={0.5} />
        </div>

        {/* Middle Left */}
        <div className="absolute top-[45%] left-[-2%] rotate-[10deg]">
          <Leaf size={200} strokeWidth={0.5} />
        </div>

        {/* Middle Right */}
        <div className="absolute top-[40%] right-[5%] rotate-[-10deg]">
          <Baby size={180} strokeWidth={0.5} />
        </div>

        {/* Bottom Left */}
        <div className="absolute bottom-[15%] left-[10%] rotate-[15deg]">
          <Calendar size={140} strokeWidth={0.8} />
        </div>

        {/* Bottom Right */}
        <div className="absolute bottom-[10%] right-[10%] rotate-[-20deg]">
          <Footprints size={150} strokeWidth={0.5} />
        </div>

        {/* Scattered Small Elements */}
        <div className="absolute top-[30%] left-[25%]">
          <Star size={24} strokeWidth={1} />
        </div>
        <div className="absolute top-[70%] right-[30%]">
          <Moon size={40} strokeWidth={1} />
        </div>
        <div className="absolute bottom-[40%] left-[40%]">
          <Heart size={32} strokeWidth={1} />
        </div>
      </div>
    </div>
  );
};

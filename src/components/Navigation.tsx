import React from 'react';
import { 
  Home, 
  Calendar, 
  ListChecks, 
  Baby, 
  User, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';

import { BabyGender } from '../types';

interface NavigationProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  gender?: BabyGender;
}

export const Navigation: React.FC<NavigationProps> = ({ activeScreen, onNavigate, gender = 'unknown' }) => {
  const navItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'today', label: 'Hoje', icon: Clock },
    { id: 'timeline', label: 'Jornada', icon: Calendar },
    { id: 'steps', label: 'Passos', icon: ListChecks },
    { id: 'symptoms', label: 'Sintomas', icon: AlertTriangle },
    { id: 'baby', label: 'Bebê', icon: Baby },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  const theme = {
    boy: {
      active: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100'
    },
    girl: {
      active: 'text-pink-600',
      bg: 'bg-pink-50',
      border: 'border-pink-100'
    },
    unknown: {
      active: 'text-violet-600',
      bg: 'bg-violet-50',
      border: 'border-violet-100'
    }
  }[gender === 'boy' ? 'boy' : gender === 'girl' ? 'girl' : 'unknown'];

  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 px-4 pointer-events-none flex justify-center">
      <nav className="bg-white/90 backdrop-blur-xl border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.12)] rounded-[32px] p-2 pointer-events-auto max-w-full overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-[24px] transition-all duration-300 group ${
                  isActive ? theme.active : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                {isActive && (
                  <div className={`absolute inset-0 ${theme.bg} ${theme.border} border rounded-[24px] transition-all duration-300`} />
                )}
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <Icon className={`w-6 h-6 transition-all duration-300 ${isActive ? 'stroke-[2.5px] -translate-y-0.5' : 'stroke-[2px] group-hover:-translate-y-0.5'}`} />
                  <span className={`text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 absolute bottom-1'}`}>
                    {item.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

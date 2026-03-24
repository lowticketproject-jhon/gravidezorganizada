import React from 'react';
import { motion } from 'motion/react';
import { UserData } from '../types';
import { calculatePregnancyData } from '../utils/pregnancyCalculations';
import { getPhaseInfo } from '../constants/pregnancyData';
import { Card, Badge } from './UI';
import { 
  Baby, 
  Zap, 
  Smile, 
  Utensils, 
  Info,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';

interface TodayScreenProps {
  userData: UserData;
  onBack?: () => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({ userData, onBack }) => {
  const pregData = calculatePregnancyData(
    userData.startDate,
    userData.conceptionDate,
    userData.dueDate,
    userData.manualWeeks
  );
  
  const phase = getPhaseInfo(pregData.currentWeeks);

  // Theme colors based on gender
  const theme = {
    boy: {
      primary: 'from-blue-500 to-blue-600',
      secondary: 'from-blue-400 to-blue-500',
      accent: 'blue',
      text: 'text-blue-700',
      heading: 'text-blue-900',
      iconBg: 'bg-blue-50',
      iconText: 'text-blue-600'
    },
    girl: {
      primary: 'from-pink-500 to-pink-600',
      secondary: 'from-pink-400 to-pink-500',
      accent: 'pink',
      text: 'text-pink-700',
      heading: 'text-pink-900',
      iconBg: 'bg-pink-50',
      iconText: 'text-pink-600'
    },
    unknown: {
      primary: 'from-violet-500 to-violet-600',
      secondary: 'from-violet-400 to-violet-500',
      accent: 'violet',
      text: 'text-violet-700',
      heading: 'text-violet-900',
      iconBg: 'bg-violet-50',
      iconText: 'text-violet-600'
    }
  }[userData.babyGender === 'boy' ? 'boy' : userData.babyGender === 'girl' ? 'girl' : 'unknown'];

  return (
    <div className="pb-32 pt-8 px-4 max-w-2xl mx-auto space-y-8">
      <header className="flex items-center gap-4 mb-8">
        {onBack && (
          <button 
            onClick={onBack}
            className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors shrink-0 border border-gray-100"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <div>
          <Badge color={theme.accent as any} className="mb-2 animate-pulse-slow">Semana {pregData.currentWeeks}</Badge>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Hoje na sua Gravidez</h1>
          <p className="text-gray-600 font-bold mt-1">{pregData.month}º Mês • {pregData.trimester}º Trimestre</p>
        </div>
      </header>

      {/* Baby Focus */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className={`p-8 bg-white border border-gray-100 shadow-sm relative overflow-hidden`}>
          <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${theme.primary}`} />
          <div className="flex items-center gap-6 mb-6 relative z-10">
            <div className={`w-16 h-16 rounded-[24px] ${theme.iconBg} flex items-center justify-center text-3xl shadow-sm shrink-0`}>
              <Baby className={`${theme.iconText} w-8 h-8`} />
            </div>
            <div>
              <h2 className={`text-2xl font-black ${theme.heading} tracking-tight`}>O Bebê</h2>
              <p className={`font-bold mt-0.5 ${theme.text}`}>{phase.babySize} • {phase.babyComparison}</p>
            </div>
          </div>
          <p className="text-gray-700 font-medium leading-relaxed relative z-10 text-lg">{phase.babyDevelopment}</p>
        </Card>
      </motion.div>

      {/* Mother Focus */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <Card className={`p-8 bg-white border border-gray-100 shadow-sm relative overflow-hidden`}>
          <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${theme.primary} opacity-70`} />
          <div className="flex items-center gap-6 mb-6 relative z-10">
            <div className={`w-16 h-16 rounded-[24px] ${theme.iconBg} flex items-center justify-center text-3xl shadow-sm shrink-0`}>
              <Smile className={`${theme.iconText} w-8 h-8`} />
            </div>
            <div>
              <h2 className={`text-2xl font-black ${theme.heading} tracking-tight`}>Você</h2>
              <p className={`font-bold mt-0.5 ${theme.text}`}>Mudanças no seu corpo</p>
            </div>
          </div>
          <p className="text-gray-700 font-medium leading-relaxed relative z-10 text-lg">{phase.motherChanges}</p>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: Zap, color: theme.accent, title: 'Energia', value: phase.energyLevel },
          { icon: Smile, color: 'violet', title: 'Humor', value: phase.moodChanges },
          { icon: Utensils, color: theme.accent, title: 'Desejos', value: phase.cravings },
          { icon: Info, color: 'blue', title: 'Sintoma', value: phase.commonSymptoms[0] },
        ].map((stat, i) => {
          const Icon = stat.icon;
          
          const colorStyles: Record<string, { bg: string, text: string, icon: string, heading: string }> = {
            amber: { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'text-amber-600', heading: 'text-amber-900' },
            violet: { bg: 'bg-violet-50', text: 'text-violet-700', icon: 'text-violet-600', heading: 'text-violet-900' },
            pink: { bg: 'bg-pink-50', text: 'text-pink-700', icon: 'text-pink-600', heading: 'text-pink-900' },
            blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-600', heading: 'text-blue-900' },
          };
          
          const currentStyle = colorStyles[stat.color] || colorStyles.blue;

          return (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.2 + (i * 0.05) }}>
              <Card className={`p-6 flex flex-col items-center text-center gap-4 border border-gray-100 shadow-sm transition-all hover:shadow-md h-full bg-white`}>
                <div className={`w-14 h-14 rounded-[20px] ${currentStyle.bg} flex items-center justify-center ${currentStyle.icon} shadow-sm`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <h4 className={`text-[10px] font-black ${currentStyle.text} uppercase tracking-widest mb-1`}>{stat.title}</h4>
                  <p className={`text-sm font-bold text-gray-800 leading-snug`}>{stat.value}</p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recommendation */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
        <Card className="p-8 bg-white border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
          <div className="flex gap-6 items-center relative z-10">
            <div className="w-16 h-16 rounded-[24px] bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-black text-gray-900 text-xl tracking-tight">Recomendação Prática</h4>
              <p className="text-gray-600 text-base mt-1 font-medium leading-relaxed">Aproveite para focar em: <span className="font-black text-emerald-600">{phase.nextStep}</span></p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

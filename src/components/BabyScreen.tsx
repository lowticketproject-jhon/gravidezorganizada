import React from 'react';
import { motion } from 'motion/react';
import { UserData } from '../types';
import { calculatePregnancyData } from '../utils/pregnancyCalculations';
import { getPhaseInfo } from '../constants/pregnancyData';
import { Card, Badge } from './UI';
import { 
  Baby, 
  Heart, 
  Sparkles, 
  ChevronRight, 
  Scale, 
  Maximize2,
  Info,
  ArrowLeft
} from 'lucide-react';

interface BabyScreenProps {
  userData: UserData;
  onBack?: () => void;
}

export const BabyScreen: React.FC<BabyScreenProps> = ({ userData, onBack }) => {
  const pregData = calculatePregnancyData(
    userData.startDate,
    userData.conceptionDate,
    userData.dueDate,
    userData.manualWeeks
  );
  
  const phase = getPhaseInfo(pregData.currentWeeks);

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
      <header className="flex items-center gap-4 mb-6">
        {onBack && (
          <button 
            onClick={onBack}
            className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors border border-gray-100"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Seu Bebê</h1>
          <p className="text-gray-600 font-bold mt-1">
            Semana {pregData.currentWeeks}
          </p>
        </div>
      </header>

      {/* Hero Comparison Card */}
      <div className="relative">
        <Card className="bg-white border border-gray-100 shadow-sm overflow-hidden relative p-10 text-center">
          <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.primary}`} />
          
          <div className="relative z-10 flex flex-col items-center">
            <span className={`text-[10px] font-black uppercase tracking-widest mb-8 ${theme.text}`}>Tamanho Comparativo</span>
            
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className={`w-36 h-36 rounded-full ${theme.iconBg} flex items-center justify-center text-7xl shadow-sm border border-gray-50 mb-8`}
            >
              {phase.babyComparisonIcon}
            </motion.div>

            <h2 className="text-2xl font-medium text-gray-600 mb-2">
              {userData.babyName || 'O bebê'} é do tamanho de uma
            </h2>
            <p className={`text-4xl font-black tracking-tight ${theme.heading}`}>{phase.babyComparison}</p>
          </div>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6 space-y-4 bg-white border border-gray-100 shadow-sm">
          <div className={`w-14 h-14 rounded-2xl ${theme.iconBg} shadow-sm flex items-center justify-center ${theme.iconText}`}>
            <Maximize2 className="w-7 h-7" />
          </div>
          <div>
            <h4 className={`text-[10px] font-black ${theme.text} uppercase tracking-widest mb-1`}>Comprimento</h4>
            <p className="text-2xl font-black text-gray-900 tracking-tight">{phase.babySize}</p>
          </div>
        </Card>
        
        <Card className="p-6 space-y-4 bg-white border border-gray-100 shadow-sm">
          <div className={`w-14 h-14 rounded-2xl ${theme.iconBg} shadow-sm flex items-center justify-center ${theme.iconText}`}>
            <Scale className="w-7 h-7" />
          </div>
          <div>
            <h4 className={`text-[10px] font-black ${theme.text} uppercase tracking-widest mb-1`}>Peso Estimado</h4>
            <p className="text-2xl font-black text-gray-900 tracking-tight">~{pregData.currentWeeks * 40}g</p>
          </div>
        </Card>
      </div>

      {/* Development Details */}
      <section className="space-y-4">
        <h3 className="text-xl font-black text-gray-900 tracking-tight">Desenvolvimento</h3>
        
        <Card className="p-8 bg-white border border-gray-100 shadow-sm space-y-4 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${theme.primary} opacity-50`} />
          <div className="flex items-start gap-5">
            <div className={`p-4 ${theme.iconBg} rounded-2xl ${theme.iconText} shrink-0 shadow-sm`}>
              <Info className="w-7 h-7" />
            </div>
            <p className="text-gray-700 font-medium leading-relaxed text-lg">
              {phase.babyDevelopment}
            </p>
          </div>
        </Card>
      </section>

      {/* Gender Card */}
      {userData.babyGender !== 'none' && (
        <Card className={`border border-gray-100 shadow-sm overflow-hidden relative p-8 bg-white`}>
          <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${theme.primary}`} />
          <div className="flex justify-between items-center relative z-10">
            <div>
              <h3 className={`font-black text-2xl tracking-tight mb-1 ${theme.heading}`}>Gênero</h3>
              <p className="text-gray-600 font-bold text-lg">
                {userData.babyGender === 'boy' ? 'É um menino!' :
                 userData.babyGender === 'girl' ? 'É uma menina!' :
                 'Ainda um mistério...'}
              </p>
            </div>
            <div className={`w-16 h-16 rounded-full ${theme.iconBg} flex items-center justify-center ${theme.iconText} shadow-sm`}>
              <Baby className="w-8 h-8" />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

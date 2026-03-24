import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserData } from '../types';
import { calculatePregnancyData } from '../utils/pregnancyCalculations';
import { getPhaseInfo } from '../constants/pregnancyData';
import { Card, Badge } from './UI';
import { 
  Calendar, 
  Baby, 
  Star, 
  Heart, 
  ChevronRight,
  Activity,
  Clock,
  ArrowLeft
} from 'lucide-react';

interface TimelineScreenProps {
  userData: UserData;
  onBack?: () => void;
}

export const TimelineScreen: React.FC<TimelineScreenProps> = ({ userData, onBack }) => {
  const [selectedMilestone, setSelectedMilestone] = React.useState<number | null>(null);

  const pregData = calculatePregnancyData(
    userData.startDate,
    userData.conceptionDate,
    userData.dueDate,
    userData.manualWeeks
  );

  // Theme colors based on gender
  const theme = {
    boy: {
      primary: 'from-blue-500 to-blue-600',
      accent: 'text-blue-600',
      line: 'from-blue-200 via-blue-100 to-blue-200',
      bg: 'bg-blue-50',
      icon: 'text-blue-600'
    },
    girl: {
      primary: 'from-pink-500 to-pink-600',
      accent: 'text-pink-600',
      line: 'from-pink-200 via-pink-100 to-pink-200',
      bg: 'bg-pink-50',
      icon: 'text-pink-600'
    },
    unknown: {
      primary: 'from-violet-500 to-violet-600',
      accent: 'text-violet-600',
      line: 'from-violet-200 via-violet-100 to-violet-200',
      bg: 'bg-violet-50',
      icon: 'text-violet-600'
    }
  }[userData.babyGender === 'boy' ? 'boy' : userData.babyGender === 'girl' ? 'girl' : 'unknown'];

  const milestones = [
    { week: 4, title: 'Descoberta', icon: Heart, color: theme.accent.replace('text-', '') },
    { week: 8, title: 'Primeiro Ultrassom', icon: Baby, color: theme.accent.replace('text-', '') },
    { week: 12, title: 'Fim do 1º Trimestre', icon: Star, color: theme.accent.replace('text-', '') },
    { week: 20, title: 'Morfológico 2º Tri', icon: Calendar, color: theme.accent.replace('text-', '') },
    { week: 24, title: 'Viabilidade Fetal', icon: Activity, color: theme.accent.replace('text-', '') },
    { week: 28, title: 'Início do 3º Trimestre', icon: Star, color: theme.accent.replace('text-', '') },
    { week: 36, title: 'Reta Final', icon: Clock, color: theme.accent.replace('text-', '') },
    { week: 40, title: 'Data Provável', icon: Baby, color: theme.accent.replace('text-', '') },
  ];

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
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Jornada</h1>
          <p className="text-gray-600 font-bold mt-1">Sua história de 40 semanas</p>
        </div>
      </header>

      <div className="relative pl-4">
        {/* Vertical Line */}
        <div className={`absolute left-[39px] top-8 bottom-8 w-1 bg-gradient-to-b ${theme.line} rounded-full opacity-50`} />
        
        <div className="space-y-10 relative z-10">
          {milestones.map((m, idx) => {
            const isPast = pregData.currentWeeks >= m.week;
            const isCurrent = pregData.currentWeeks >= m.week && (idx === milestones.length - 1 || pregData.currentWeeks < milestones[idx+1].week);
            const Icon = m.icon;
            const phase = getPhaseInfo(m.week);

            // Determine colors
            let bgClass = 'bg-white text-gray-300 border-2 border-gray-100';
            let shadowClass = '';
            let textClass = 'text-gray-400';
            let iconColorClass = 'text-gray-300';
            
            if (isPast) {
              bgClass = `bg-gradient-to-br ${theme.primary} text-white border-none`;
              shadowClass = `shadow-lg`;
              textClass = 'text-gray-900';
              iconColorClass = theme.accent;
            }

            return (
              <motion.div 
                key={m.week} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative flex gap-6 items-start group"
              >
                {/* Milestone Node */}
                <div className={`shrink-0 w-14 h-14 rounded-[20px] flex items-center justify-center transition-all duration-300 ${bgClass} ${shadowClass} ${isCurrent ? `scale-110 ring-4 ring-white shadow-md` : 'group-hover:scale-105'}`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content Card */}
                <Card className={`flex-1 p-6 border border-gray-100 transition-all duration-300 bg-white ${isCurrent ? `shadow-md ring-1 ring-gray-100` : isPast ? 'shadow-sm hover:shadow-md' : 'opacity-60 grayscale'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isPast ? iconColorClass : 'text-gray-400'}`}>Semana {m.week}</span>
                    {isCurrent && <Badge color={theme.accent.replace('text-', '') as any} className="animate-pulse-slow">Você está aqui</Badge>}
                  </div>
                  <h3 className={`text-lg font-black tracking-tight mb-1 ${textClass}`}>{m.title}</h3>
                  <p className="text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed">{phase.babyDevelopment}</p>
                  
                  {isPast && (
                    <button 
                      onClick={() => setSelectedMilestone(m.week)}
                      className={`mt-4 text-xs font-bold flex items-center transition-colors ${iconColorClass} hover:opacity-80`}
                    >
                      Ver detalhes <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal/View */}
      <AnimatePresence>
        {selectedMilestone !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMilestone(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className={`h-2 w-full bg-gradient-to-r ${theme.primary}`} />
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-16 h-16 rounded-[24px] ${theme.bg} flex items-center justify-center ${theme.icon} shadow-sm`}>
                    {React.createElement(milestones.find(m => m.week === selectedMilestone)?.icon || Star, { className: "w-8 h-8" })}
                  </div>
                  <button 
                    onClick={() => setSelectedMilestone(null)}
                    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 rotate-90" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <Badge color={theme.accent.replace('text-', '') as any} className="mb-2">Semana {selectedMilestone}</Badge>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                      {milestones.find(m => m.week === selectedMilestone)?.title}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <h4 className={`text-[10px] font-black ${theme.accent} uppercase tracking-widest mb-1`}>Desenvolvimento do Bebê</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {getPhaseInfo(selectedMilestone).babyDevelopment}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <h4 className={`text-[10px] font-black ${theme.accent} uppercase tracking-widest mb-1`}>Mudanças na Mamãe</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {getPhaseInfo(selectedMilestone).motherChanges}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <h4 className={`text-[10px] font-black ${theme.accent} uppercase tracking-widest mb-1`}>Recomendação</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {getPhaseInfo(selectedMilestone).nextStep}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedMilestone(null)}
                    className={`w-full py-4 rounded-2xl bg-gradient-to-r ${theme.primary} text-white font-bold shadow-lg shadow-${theme.accent.replace('text-', '')}-100/50 hover:opacity-90 transition-all`}
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

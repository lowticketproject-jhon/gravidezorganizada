import React from 'react';
import { motion } from 'motion/react';
import { UserData, Appointment } from '../types';
import { calculatePregnancyData } from '../utils/pregnancyCalculations';
import { getPhaseInfo } from '../constants/pregnancyData';
import { Card, Badge } from './UI';
import { 
  Calendar, 
  Baby, 
  Activity, 
  AlertCircle, 
  ChevronRight, 
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

interface DashboardProps {
  userData: UserData;
  appointments: Appointment[];
  onNavigate: (screen: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userData, appointments, onNavigate }) => {
  const pregData = calculatePregnancyData(
    userData.startDate,
    userData.conceptionDate,
    userData.dueDate,
    userData.manualWeeks
  );
  
  const phase = getPhaseInfo(pregData.currentWeeks);
  const nextAppointment = appointments
    .filter(a => !a.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  // Theme colors based on gender
  const theme = {
    boy: {
      primary: 'from-blue-500 to-blue-600',
      secondary: 'bg-blue-50 border-blue-100',
      accent: 'blue',
      text: 'text-blue-700',
      heading: 'text-blue-900',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      accentText: 'text-blue-600'
    },
    girl: {
      primary: 'from-pink-500 to-pink-600',
      secondary: 'bg-pink-50 border-pink-100',
      accent: 'pink',
      text: 'text-pink-700',
      heading: 'text-pink-900',
      iconBg: 'bg-pink-100',
      iconText: 'text-pink-600',
      accentText: 'text-pink-600'
    },
    unknown: {
      primary: 'from-violet-500 to-violet-600',
      secondary: 'bg-violet-50 border-violet-100',
      accent: 'violet',
      text: 'text-violet-700',
      heading: 'text-violet-900',
      iconBg: 'bg-violet-100',
      iconText: 'text-violet-600',
      accentText: 'text-violet-600'
    }
  }[userData.babyGender === 'boy' ? 'boy' : userData.babyGender === 'girl' ? 'girl' : 'unknown'];

  return (
    <div className="pb-32 pt-8 px-4 max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Olá, {userData.motherName}</h1>
          <p className="text-gray-500 font-medium mt-1">
            {userData.babyName ? (
              <>Seu bebê, <span className={`${theme.text} font-bold`}>{userData.babyName}</span>, está crescendo!</>
            ) : (
              <>Seu bebê está crescendo!</>
            )}
          </p>
        </div>
        <div className={`w-14 h-14 rounded-2xl bg-white flex items-center justify-center ${theme.text} font-black text-xl shadow-sm border border-gray-100`}>
          {userData.motherName.charAt(0)}
        </div>
      </header>

      {/* Main Progress Card - High Contrast */}
      <div className="relative">
        <Card className={`bg-white border border-gray-100 overflow-hidden relative p-8 shadow-sm`}>
          <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${theme.primary}`} />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <span className={`text-[10px] font-black uppercase tracking-widest ${theme.text}`}>Progresso</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl font-black tracking-tighter text-gray-900">{pregData.currentWeeks}</span>
                  <span className="text-xl font-black text-gray-900">Semanas</span>
                </div>
              </div>
              <div className={`${theme.secondary} border px-5 py-3 rounded-2xl shadow-sm text-center`}>
                <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${theme.text}`}>Trimestre</span>
                <div className={`text-3xl font-black ${theme.heading}`}>{pregData.trimester}º</div>
              </div>
            </div>

            <div className="w-full bg-gray-100 h-6 rounded-full mb-6 overflow-hidden p-1 shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(pregData.currentWeeks / 40) * 100}%` }}
                className={`h-full bg-gradient-to-r ${theme.primary} rounded-full relative shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-wider">
              <span className="text-gray-500">Início</span>
              <Badge color={theme.accent} className="px-4 py-1.5 font-black">{pregData.daysRemaining} dias para o parto</Badge>
              <span className="text-gray-500">40 Semanas</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Baby Size Comparison - High Contrast */}
      <Card 
        onClick={() => onNavigate('baby')}
        className={`flex items-center gap-6 bg-white border border-gray-100 hover:shadow-md transition-all group relative overflow-hidden p-6`}
      >
        <div className={`w-20 h-20 rounded-[24px] ${theme.iconBg} flex items-center justify-center text-5xl shadow-sm group-hover:scale-105 transition-transform`}>
          {phase.babyComparisonIcon}
        </div>
        <div className="flex-1">
          <h3 className={`text-[10px] font-black ${theme.text} uppercase tracking-widest mb-1`}>Tamanho do Bebê</h3>
          <p className="text-gray-600 font-medium leading-tight mt-1">
            Seu bebê tem o tamanho de uma <br/>
            <span className={`text-2xl ${theme.heading} font-black mt-1 inline-block`}>{phase.babyComparison}</span>
          </p>
        </div>
        <div className={`w-10 h-10 rounded-full ${theme.iconBg} flex items-center justify-center ${theme.iconText} group-hover:bg-opacity-80 transition-colors`}>
          <ChevronRight className="w-6 h-6" />
        </div>
      </Card>

      {/* Grid of Info - High Contrast */}
      <div className="grid grid-cols-2 gap-4">
        <Card className={`p-6 space-y-4 bg-white border border-gray-100 shadow-sm`}>
          <div className={`w-12 h-12 rounded-2xl ${theme.iconBg} flex items-center justify-center ${theme.iconText}`}>
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h4 className={`text-[10px] font-black ${theme.text} uppercase tracking-widest mb-1`}>Desenvolvimento</h4>
            <p className="text-sm text-gray-700 font-bold leading-snug line-clamp-3 mt-1">{phase.babyDevelopment}</p>
          </div>
        </Card>
        
        <Card className="p-6 space-y-4 bg-white border border-gray-100 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">Sintoma Comum</h4>
            <p className="text-sm text-gray-700 font-bold leading-snug mt-1">{phase.commonSymptoms[0]}</p>
          </div>
        </Card>
      </div>

      {/* Next Step / Action */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-xl font-black text-gray-900 tracking-tight">Próximos Passos</h3>
          <button onClick={() => onNavigate('steps')} className={`${theme.accentText} text-sm font-bold flex items-center hover:opacity-80`}>
            Ver todos <ArrowRight className="ml-1 w-4 h-4" />
          </button>
        </div>
        
        <Card className="relative overflow-hidden border border-gray-100 shadow-sm bg-white group hover:shadow-md transition-all">
          <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${theme.primary}`} />
          <div className="flex gap-5 items-center p-1">
            <div className={`w-14 h-14 rounded-[20px] ${theme.iconBg} flex items-center justify-center ${theme.iconText} shrink-0 group-hover:scale-105 transition-transform`}>
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-black text-gray-900">Recomendação da Semana</h4>
              <p className="text-gray-500 text-sm mt-1 font-medium">{phase.nextStep}</p>
            </div>
          </div>
        </Card>

        {nextAppointment && (
          <Card className="relative overflow-hidden border border-gray-100 shadow-sm bg-white group hover:shadow-md transition-all">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-blue-600" />
            <div className="flex gap-5 items-center p-1">
              <div className="w-14 h-14 rounded-[20px] bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
                <Calendar className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-black text-gray-900">Próximo Compromisso</h4>
                <p className="text-gray-700 font-bold mt-1">{nextAppointment.title}</p>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-blue-600 font-black uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" /> {nextAppointment.date} às {nextAppointment.time}
                </div>
              </div>
            </div>
          </Card>
        )}
      </section>

      <div className="text-center pb-8">
        <p className="text-[10px] text-gray-300 uppercase tracking-widest font-black">
          Gravidez Organizada • Informativo
        </p>
      </div>
    </div>
  );
};

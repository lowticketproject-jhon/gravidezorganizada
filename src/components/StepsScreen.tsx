import React from 'react';
import { motion } from 'motion/react';
import { UserData } from '../types';
import { calculatePregnancyData } from '../utils/pregnancyCalculations';
import { getPhaseInfo } from '../constants/pregnancyData';
import { Card, Badge, Button } from './UI';
import { 
  ListChecks, 
  Stethoscope, 
  Calendar, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

interface StepsScreenProps {
  userData: UserData;
  onNavigate: (screen: string) => void;
  onBack?: () => void;
}

export const StepsScreen: React.FC<StepsScreenProps> = ({ userData, onNavigate, onBack }) => {
  const pregData = calculatePregnancyData(
    userData.startDate,
    userData.conceptionDate,
    userData.dueDate,
    userData.manualWeeks
  );
  
  const phase = getPhaseInfo(pregData.currentWeeks);

  return (
    <div className="pb-32 pt-8 px-4 max-w-2xl mx-auto space-y-8">
      <header className="flex items-center gap-4 mb-8">
        {onBack && (
          <button 
            onClick={onBack}
            className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Próximos Passos</h1>
          <p className="text-gray-500 font-medium mt-1">Sua jornada organizada por etapas</p>
        </div>
      </header>

      {/* Immediate Action */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          O que fazer agora
        </h2>
        <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100/50 p-6 shadow-[0_8px_30px_rgba(16,185,129,0.06)]">
          <p className="text-gray-700 font-bold leading-relaxed text-lg">{phase.nextStep}</p>
          <Button 
            variant="outline" 
            className="mt-6 border-emerald-200 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 w-full sm:w-auto"
            onClick={() => onNavigate('checklists')}
          >
            Ver Checklist <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Card>
      </section>

      {/* Medical Focus */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
            <Stethoscope className="w-5 h-5" />
          </div>
          Saúde e Exames
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <Card className="p-5 flex items-start gap-5 border-none shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow">
            <div className="w-12 h-12 rounded-[20px] bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-gray-800 text-base">Exame Importante</h4>
              <p className="text-gray-500 font-medium mt-1 leading-relaxed">{phase.importantExam}</p>
            </div>
          </Card>
          <Card className="p-5 flex items-start gap-5 border-none shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow">
            <div className="w-12 h-12 rounded-[20px] bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-gray-800 text-base">O que observar</h4>
              <p className="text-gray-500 font-medium mt-1 leading-relaxed">{phase.observeNow}</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Preparation */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-500">
            <ListChecks className="w-5 h-5" />
          </div>
          Preparação do Trimestre
        </h2>
        <Card className="p-6 space-y-5 border-none shadow-[0_8px_30px_rgba(139,92,246,0.06)] bg-gradient-to-br from-violet-50/50 to-white">
          <div className="flex items-center justify-between">
            <span className="text-base font-black text-gray-800">{pregData.trimester}º Trimestre</span>
            <Badge color="violet" className="animate-pulse-slow">Em andamento</Badge>
          </div>
          <p className="text-gray-600 font-bold leading-relaxed">
            Nesta fase, é importante focar em {pregData.trimester === 1 ? 'suplementação e exames iniciais' : pregData.trimester === 2 ? 'conforto e enxoval' : 'preparação para o parto'}.
          </p>
          <Button className="w-full shadow-[0_8px_20px_rgba(139,92,246,0.25)]" variant="primary" onClick={() => onNavigate('checklists')}>
            Abrir Checklists de Preparação
          </Button>
        </Card>
      </section>
    </div>
  );
};

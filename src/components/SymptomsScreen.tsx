import React from 'react';
import { motion } from 'motion/react';
import { getPhaseInfo } from '../constants/pregnancyData';
import { Card, Badge } from './UI';
import { 
  AlertTriangle, 
  Info, 
  Stethoscope, 
  PhoneCall,
  ChevronDown,
  ArrowLeft
} from 'lucide-react';

interface SymptomsScreenProps {
  currentWeek: number;
  onBack?: () => void;
}

export const SymptomsScreen: React.FC<SymptomsScreenProps> = ({ currentWeek, onBack }) => {
  const phase = getPhaseInfo(currentWeek);

  const symptomDetails = [
    { name: 'Enjoo', status: 'comum', desc: 'Muito frequente no 1º trimestre devido aos hormônios.', action: 'Comer pequenas porções, evitar cheiros fortes.' },
    { name: 'Cansaço', status: 'comum', desc: 'Seu corpo está construindo uma placenta e um bebê!', action: 'Descanse sempre que possível.' },
    { name: 'Azia', status: 'observe', desc: 'O útero pressiona o estômago.', action: 'Evite deitar logo após comer.' },
    { name: 'Dor de cabeça', status: 'observe', desc: 'Pode ser hormonal ou tensão.', action: 'Se for persistente ou com visão turva, avise o médico.' },
    { name: 'Sangramento', status: 'atendimento', desc: 'Qualquer sangramento vivo deve ser avaliado.', action: 'Procure atendimento imediato.' },
    { name: 'Dores Fortes', status: 'atendimento', desc: 'Cólicas intensas ou dor abdominal aguda.', action: 'Procure atendimento imediato.' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'comum': return <Badge color="blue" className="bg-blue-50 text-blue-600 border-blue-100">Comum</Badge>;
      case 'observe': return <Badge color="amber" className="bg-amber-50 text-amber-600 border-amber-100">Observe</Badge>;
      case 'atendimento': return <Badge color="pink" className="bg-pink-50 text-pink-600 border-pink-100 animate-pulse-slow">Procure Atendimento</Badge>;
      default: return null;
    }
  };

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
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Sintomas e Alertas</h1>
          <p className="text-gray-500 font-medium mt-1">O que é normal e o que requer atenção</p>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
            <Info className="w-5 h-5" />
          </div>
          Sintomas da sua fase
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {phase.commonSymptoms.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-5 flex justify-between items-center border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow">
                <span className="font-bold text-gray-700 text-base">{s}</span>
                <Badge color="blue" className="bg-blue-50 text-blue-500 border-none">Esperado</Badge>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
          Guia de Sintomas
        </h2>
        <div className="space-y-4">
          {symptomDetails.map((s, i) => (
            <Card key={i} className="p-6 space-y-4 border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-lg tracking-tight text-gray-800">{s.name}</h3>
                {getStatusBadge(s.status)}
              </div>
              <p className="text-gray-600 font-medium leading-relaxed">{s.desc}</p>
              <div className="bg-gray-50/80 p-4 rounded-2xl text-sm text-gray-700 flex gap-3 items-start border border-gray-100">
                <Stethoscope className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                <span><strong className="text-gray-900">O que fazer:</strong> {s.action}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Card className="bg-gradient-to-br from-pink-50 to-pink-100/50 border-pink-200/50 p-6 shadow-[0_8px_30px_rgba(236,72,153,0.08)]">
        <div className="flex gap-5 items-center">
          <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center text-white shrink-0 shadow-[0_4px_15px_rgba(236,72,153,0.3)]">
            <PhoneCall className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-black text-pink-800 text-lg tracking-tight">Sinais de Alerta</h3>
            <p className="text-sm text-pink-700/90 font-medium mt-1 leading-relaxed">Em caso de febre, perda de líquido ou ausência de movimentos, contate seu médico imediatamente.</p>
          </div>
        </div>
      </Card>

      <div className="p-5 bg-blue-50/80 rounded-[24px] text-[10px] text-blue-600/80 text-center font-black uppercase tracking-widest leading-relaxed border border-blue-100/50">
        ESTE APLICATIVO NÃO SUBSTITUI CONSULTA MÉDICA. AS INFORMAÇÕES SÃO APENAS ORIENTATIVAS. EM CASO DE DÚVIDA, PROCURE SEU OBSTETRA.
      </div>
    </div>
  );
};

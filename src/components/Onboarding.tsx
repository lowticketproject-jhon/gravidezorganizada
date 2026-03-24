import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserData, BabyGender } from '../types';
import { Button, Card } from './UI';
import { Heart, Baby, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import { BackgroundDecoration } from './BackgroundDecoration';

interface OnboardingProps {
  onComplete: (data: UserData) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<UserData>({
    motherName: '',
    babyName: '',
    babyGender: 'unknown',
    setupComplete: false,
  });

  const [error, setError] = useState<string | null>(null);

  const updateData = (fields: Partial<UserData>) => {
    setData(prev => ({ ...prev, ...fields }));
    if (error) setError(null);
  };

  const nextStep = () => {
    if (step === 1 && !data.motherName.trim()) {
      setError('Por favor, informe seu nome para continuar.');
      return;
    }
    setStep(s => s + 1);
  };

  const prevStep = () => {
    setError(null);
    setStep(s => s - 1);
  };

  const isStep1Valid = data.motherName.trim().length > 0;
  const isStep3Valid = !!(data.startDate || data.conceptionDate || data.dueDate || data.manualWeeks);

  const handleFinish = () => {
    if (!isStep3Valid) {
      setError('Por favor, informe uma data ou as semanas atuais.');
      return;
    }
    onComplete({ ...data, setupComplete: true });
  };

  return (
    <div className="min-h-screen bg-[#FCFBFA] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <BackgroundDecoration />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md text-center relative z-10"
          >
            <div className="mb-12 flex justify-center relative">
              <div className="absolute inset-0 bg-violet-200 blur-2xl opacity-20 rounded-full" />
              <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center text-violet-400 shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-violet-50 relative z-10">
                <Heart className="w-12 h-12" strokeWidth={1.5} />
              </div>
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Bem-vinda ao<br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-blue-500">Gravidez Organizada</span></h1>
            <p className="text-gray-600 mb-10 font-bold">Vamos começar essa jornada incrível juntas? Primeiro, como podemos te chamar?</p>
            
            <Card className={`mb-6 p-2 transition-all border-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] bg-white ${error ? 'ring-2 ring-violet-400 ring-offset-2' : ''}`}>
              <input
                type="text"
                placeholder="Seu nome"
                className="w-full text-xl p-4 bg-gray-50/50 rounded-2xl border-none focus:ring-2 focus:ring-violet-400 outline-none text-center font-black text-gray-900 placeholder:text-gray-300 transition-all"
                value={data.motherName}
                onChange={(e) => updateData({ motherName: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && nextStep()}
                autoFocus
              />
            </Card>

            {error && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-violet-700 text-sm font-black mb-6 bg-violet-50 py-2 px-4 rounded-full inline-block"
              >
                {error}
              </motion.p>
            )}

            <Button 
              gender="unknown"
              className="w-full py-5 text-lg shadow-[0_8px_20px_rgba(139,92,246,0.25)]" 
              onClick={nextStep}
            >
              Continuar <ChevronRight className="ml-2 w-6 h-6" />
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-md relative z-10"
          >
            <button onClick={prevStep} className="mb-8 w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-violet-600 hover:bg-violet-50 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Sobre o seu bebê</h2>
            <p className="text-gray-600 mb-8 font-bold">Já tem um nome em mente ou sabe o sexo?</p>

            <Card className="mb-8 border-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] bg-white p-6">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Nome do Bebê (Opcional)</label>
              <input
                type="text"
                placeholder="Ex: Miguel, Helena..."
                className="w-full text-xl p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-violet-400 outline-none transition-all font-black text-gray-900 placeholder:text-gray-300"
                value={data.babyName}
                onChange={(e) => updateData({ babyName: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && nextStep()}
              />
            </Card>

            <div className="grid grid-cols-2 gap-4 mb-10">
              {(['boy', 'girl', 'unknown', 'none'] as BabyGender[]).map((gender) => {
                const isSelected = data.babyGender === gender;
                const genderColors = {
                  boy: { border: 'border-blue-200', bg: 'bg-blue-50/50', text: 'text-blue-600', icon: 'text-blue-400', iconBg: 'bg-blue-100/50' },
                  girl: { border: 'border-pink-200', bg: 'bg-pink-50/50', text: 'text-pink-600', icon: 'text-pink-400', iconBg: 'bg-pink-100/50' },
                  unknown: { border: 'border-violet-200', bg: 'bg-violet-50/50', text: 'text-violet-600', icon: 'text-violet-400', iconBg: 'bg-violet-100/50' },
                  none: { border: 'border-gray-200', bg: 'bg-gray-50/50', text: 'text-gray-600', icon: 'text-gray-400', iconBg: 'bg-gray-100/50' }
                }[gender];

                return (
                  <button
                    key={gender}
                    onClick={() => updateData({ babyGender: gender })}
                    className={`p-5 rounded-[28px] border transition-all duration-300 flex flex-col items-center gap-3 ${
                      isSelected 
                        ? `${genderColors.border} ${genderColors.bg} ${genderColors.text} shadow-sm scale-[1.02]` 
                        : 'border-gray-100 bg-white/80 text-gray-500 hover:bg-gray-50/50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSelected ? genderColors.iconBg : 'bg-gray-50'}`}>
                      <Baby className={`w-6 h-6 ${isSelected ? genderColors.icon : 'text-gray-300'}`} />
                    </div>
                    <span className="text-sm font-black">
                      {gender === 'boy' && 'Menino'}
                      {gender === 'girl' && 'Menina'}
                      {gender === 'unknown' && 'Ainda não sei'}
                      {gender === 'none' && 'Não informar'}
                    </span>
                  </button>
                );
              })}
            </div>

            <Button 
              gender={data.babyGender !== 'none' ? data.babyGender : 'unknown'}
              className="w-full py-5 text-lg shadow-lg" 
              onClick={nextStep}
            >
              Continuar <ChevronRight className="ml-2 w-6 h-6" />
            </Button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-md relative z-10"
          >
            <button onClick={prevStep} className="mb-8 w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-violet-600 hover:bg-violet-50 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Datas Importantes</h2>
            <p className="text-gray-600 mb-8 font-bold">Como você prefere calcular sua gestação?</p>

            <div className="space-y-6 mb-10">
              <Card className="border border-gray-100/50 shadow-sm bg-white/80 p-6">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Data da Última Menstruação (DUM)</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-violet-50/50 rounded-xl flex items-center justify-center">
                    <Calendar className="text-violet-400 w-5 h-5" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-16 pr-4 py-4 bg-gray-50/50 rounded-2xl border-none focus:ring-2 focus:ring-violet-200 outline-none font-black text-gray-900 transition-all"
                    onChange={(e) => updateData({ startDate: e.target.value, dueDate: undefined, manualWeeks: undefined })}
                  />
                </div>
              </Card>

              <div className="flex items-center gap-4 px-4">
                <div className="h-px bg-gray-100 flex-1" />
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">OU</span>
                <div className="h-px bg-gray-100 flex-1" />
              </div>

              <Card className="border border-gray-100/50 shadow-sm bg-white/80 p-6">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Data Provável do Parto (DPP)</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-50/50 rounded-xl flex items-center justify-center">
                    <Calendar className="text-blue-400 w-5 h-5" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-16 pr-4 py-4 bg-gray-50/50 rounded-2xl border-none focus:ring-2 focus:ring-blue-200 outline-none font-black text-gray-900 transition-all"
                    onChange={(e) => updateData({ dueDate: e.target.value, startDate: undefined, manualWeeks: undefined })}
                  />
                </div>
              </Card>

              <div className="flex items-center gap-4 px-4">
                <div className="h-px bg-gray-100 flex-1" />
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">OU</span>
                <div className="h-px bg-gray-100 flex-1" />
              </div>

              <Card className="border border-gray-100/50 shadow-sm bg-white/80 p-6">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Semanas Atuais</label>
                <input
                  type="number"
                  min="0"
                  max="42"
                  placeholder="Ex: 12"
                  className="w-full px-5 py-4 bg-gray-50/50 rounded-2xl border-none focus:ring-2 focus:ring-amber-200 outline-none font-black text-gray-900 text-xl transition-all"
                  onChange={(e) => updateData({ manualWeeks: parseInt(e.target.value), startDate: undefined, dueDate: undefined })}
                />
              </Card>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-violet-700 text-sm font-black mb-6 text-center bg-violet-50 py-2 px-4 rounded-full"
              >
                {error}
              </motion.p>
            )}

            <Button 
              gender={data.babyGender !== 'none' ? data.babyGender : 'unknown'}
              className="w-full py-5 text-lg shadow-lg" 
              onClick={handleFinish}
            >
              Finalizar Configuração
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

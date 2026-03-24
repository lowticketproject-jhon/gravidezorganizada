import React, { useState } from 'react';
import { UserData, BabyGender } from '../types';
import { Button, Card } from './UI';
import { ArrowLeft, User, Baby, Calendar, Check, Camera } from 'lucide-react';

interface EditProfileScreenProps {
  userData: UserData;
  onSave: (data: Partial<UserData>) => void;
  onBack: () => void;
  type: 'mother' | 'baby' | 'dates';
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ userData, onSave, onBack, type }) => {
  const [data, setData] = useState<UserData>({ ...userData });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(data);
    setSaved(true);
    setTimeout(() => {
      onBack();
    }, 1000);
  };

  const theme = {
    boy: { primary: 'from-blue-500 to-blue-600', accent: 'blue', iconText: 'text-blue-600', iconBg: 'bg-blue-50' },
    girl: { primary: 'from-pink-500 to-pink-600', accent: 'pink', iconText: 'text-pink-600', iconBg: 'bg-pink-50' },
    unknown: { primary: 'from-violet-500 to-violet-600', accent: 'violet', iconText: 'text-violet-600', iconBg: 'bg-violet-50' }
  }[userData.babyGender === 'boy' ? 'boy' : userData.babyGender === 'girl' ? 'girl' : 'unknown'];

  const titles = {
    mother: { title: 'Dados da Mãe', icon: User, desc: 'Atualize suas informações' },
    baby: { title: 'Dados do Bebê', icon: Baby, desc: 'Informações do seu baby' },
    dates: { title: 'Datas da Gestação', icon: Calendar, desc: 'Calendário da sua gravidez' }
  };

  const Icon = titles[type].icon;

  return (
    <div className="pb-32 pt-8 px-4 max-w-2xl mx-auto space-y-6">
      <header className="flex items-center gap-4 mb-4">
        <button 
          onClick={onBack}
          className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors shrink-0 border border-gray-100"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{titles[type].title}</h1>
          <p className="text-gray-600 font-bold mt-1">{titles[type].desc}</p>
        </div>
      </header>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="font-bold text-emerald-700">Dados salvos com sucesso!</span>
        </div>
      )}

      {type === 'mother' && (
        <Card className="p-6 border border-gray-100 bg-white rounded-[32px] space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                {data.motherImage ? (
                  <img src={data.motherImage} alt="Foto da mamãe" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-violet-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-violet-600 transition-colors">
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setData({ ...data, motherImage: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
            <span className="text-xs text-gray-400 font-bold">Foto da mamãe</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Seu Nome</label>
            <input
              type="text"
              value={data.motherName}
              onChange={(e) => setData({ ...data, motherName: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-violet-400 outline-none font-bold text-gray-900 text-lg"
              placeholder="Seu nome"
            />
          </div>
        </Card>
      )}

      {type === 'baby' && (
        <Card className="p-6 border border-gray-100 bg-white rounded-[32px] space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nome do Bebê</label>
            <input
              type="text"
              value={data.babyName || ''}
              onChange={(e) => setData({ ...data, babyName: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-violet-400 outline-none font-bold text-gray-900 text-lg"
              placeholder="Nome do baby (opcional)"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Sexo do Bebê</label>
            <div className="grid grid-cols-2 gap-3">
              {(['boy', 'girl', 'unknown', 'none'] as BabyGender[]).map((gender) => {
                const isSelected = data.babyGender === gender;
                return (
                  <button
                    key={gender}
                    onClick={() => setData({ ...data, babyGender: gender })}
                    className={`p-4 rounded-2xl border-2 transition-all font-bold ${
                      isSelected 
                        ? 'border-violet-500 bg-violet-50 text-violet-700' 
                        : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                    }`}
                  >
                    {gender === 'boy' && 'Menino'}
                    {gender === 'girl' && 'Menina'}
                    {gender === 'unknown' && 'Ainda não sei'}
                    {gender === 'none' && 'Não informar'}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {type === 'dates' && (
        <Card className="p-6 border border-gray-100 bg-white rounded-[32px] space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Data da Última Menstruação (DUM)</label>
            <input
              type="date"
              value={data.startDate || ''}
              onChange={(e) => setData({ ...data, startDate: e.target.value, dueDate: undefined, manualWeeks: undefined })}
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-violet-400 outline-none font-bold text-gray-900"
            />
          </div>

          <div className="flex items-center gap-4 px-2">
            <div className="h-px bg-gray-100 flex-1" />
            <span className="text-xs text-gray-400 font-black uppercase tracking-widest">OU</span>
            <div className="h-px bg-gray-100 flex-1" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Data Provável do Parto (DPP)</label>
            <input
              type="date"
              value={data.dueDate || ''}
              onChange={(e) => setData({ ...data, dueDate: e.target.value, startDate: undefined, manualWeeks: undefined })}
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-violet-400 outline-none font-bold text-gray-900"
            />
          </div>

          <div className="flex items-center gap-4 px-2">
            <div className="h-px bg-gray-100 flex-1" />
            <span className="text-xs text-gray-400 font-black uppercase tracking-widest">OU</span>
            <div className="h-px bg-gray-100 flex-1" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Semanas Atuais</label>
            <input
              type="number"
              min="0"
              max="42"
              value={data.manualWeeks || ''}
              onChange={(e) => setData({ ...data, manualWeeks: parseInt(e.target.value) || undefined, startDate: undefined, dueDate: undefined })}
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-violet-400 outline-none font-bold text-gray-900 text-lg"
              placeholder="Ex: 12"
            />
          </div>
        </Card>
      )}

      <Button 
        gender={userData.babyGender !== 'none' ? userData.babyGender : 'unknown'}
        className="w-full py-5 text-lg shadow-lg rounded-2xl" 
        onClick={handleSave}
      >
        Salvar Alterações
      </Button>
    </div>
  );
};

import React from 'react';
import { UserData } from '../types';
import { Card, Button } from './UI';
import { 
  User, 
  Baby, 
  Calendar, 
  Bell, 
  Globe, 
  Moon, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
  Cloud,
  CloudOff,
  CheckCircle2
} from 'lucide-react';

interface ProfileScreenProps {
  userData: UserData;
  onReset: () => void;
  onLogout: () => void;
  onBack?: () => void;
  userId?: string | null;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ userData, onReset, onLogout, onBack, userId }) => {
  // Theme colors based on gender
  const theme = {
    boy: {
      primary: 'from-blue-500 to-blue-600',
      secondary: 'from-blue-400 to-blue-500',
      accent: 'blue',
      text: 'text-blue-700',
      heading: 'text-blue-900',
      iconBg: 'bg-blue-50',
      iconText: 'text-blue-600',
      avatar: 'from-blue-100 to-blue-200',
      avatarIcon: 'text-blue-500',
      avatarBorder: 'border-blue-50'
    },
    girl: {
      primary: 'from-pink-500 to-pink-600',
      secondary: 'from-pink-400 to-pink-500',
      accent: 'pink',
      text: 'text-pink-700',
      heading: 'text-pink-900',
      iconBg: 'bg-pink-50',
      iconText: 'text-pink-600',
      avatar: 'from-pink-100 to-pink-200',
      avatarIcon: 'text-pink-500',
      avatarBorder: 'border-pink-50'
    },
    unknown: {
      primary: 'from-violet-500 to-violet-600',
      secondary: 'from-violet-400 to-violet-500',
      accent: 'violet',
      text: 'text-violet-700',
      heading: 'text-violet-900',
      iconBg: 'bg-violet-50',
      iconText: 'text-violet-600',
      avatar: 'from-violet-100 to-violet-200',
      avatarIcon: 'text-violet-500',
      avatarBorder: 'border-violet-50'
    }
  }[userData.babyGender === 'boy' ? 'boy' : userData.babyGender === 'girl' ? 'girl' : 'unknown'];

  return (
    <div className="pb-32 pt-8 px-4 max-w-2xl mx-auto space-y-8">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors shrink-0 border border-gray-100"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Perfil</h1>
            <p className="text-gray-600 font-bold mt-1">Suas configurações</p>
          </div>
        </div>
      </header>

      <div className="text-center space-y-4 mb-10">
        <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${theme.avatar} flex items-center justify-center ${theme.avatarIcon} mx-auto border-4 border-white shadow-lg relative`}>
          <User className="w-12 h-12" />
          <div className={`absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border-2 ${theme.avatarBorder}`}>
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{userData.motherName}</h2>
          <p className="text-gray-600 font-bold mt-1">Mamãe do {userData.babyName || 'Bebê'}</p>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Sincronização em Nuvem</h3>
        <Card className={`p-6 border border-gray-100 ${userId ? 'bg-emerald-50/30' : 'bg-amber-50/30'} rounded-[32px]`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-[20px] ${userId ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'} flex items-center justify-center shadow-sm`}>
              {userId ? <Cloud className="w-7 h-7" /> : <CloudOff className="w-7 h-7" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-black text-gray-900 tracking-tight">
                  {userId ? 'Backup Ativado' : 'Backup Desativado'}
                </h4>
                {userId && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              </div>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                {userId 
                  ? 'Seus dados estão sendo salvos com segurança no Supabase.' 
                  : 'Entre em sua conta para salvar seus dados na nuvem.'}
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Configurações da Conta</h3>
        <div className="space-y-3">
          <Card className="p-4 flex items-center justify-between group hover:shadow-md transition-all cursor-pointer border border-gray-100 bg-white">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-[18px] ${theme.iconBg} flex items-center justify-center ${theme.iconText} shadow-sm`}>
                <User className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-800 text-lg">Dados da Mãe</span>
            </div>
            <div className={`w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:${theme.iconBg} transition-colors`}>
              <ChevronRight className={`text-gray-400 group-hover:${theme.iconText} w-5 h-5`} />
            </div>
          </Card>
          
          <Card className="p-4 flex items-center justify-between group hover:shadow-md transition-all cursor-pointer border border-gray-100 bg-white">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-[18px] bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm`}>
                <Baby className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-800 text-lg">Dados do Bebê</span>
            </div>
            <div className={`w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors`}>
              <ChevronRight className={`text-gray-400 group-hover:text-blue-600 w-5 h-5`} />
            </div>
          </Card>

          <Card className="p-4 flex items-center justify-between group hover:shadow-md transition-all cursor-pointer border border-gray-100 bg-white">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-[18px] bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm`}>
                <Calendar className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-800 text-lg">Datas da Gestação</span>
            </div>
            <div className={`w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-amber-50 transition-colors`}>
              <ChevronRight className={`text-gray-400 group-hover:text-amber-600 w-5 h-5`} />
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Preferências</h3>
        <div className="space-y-3">
          <Card className="p-4 flex items-center justify-between border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-[18px] bg-violet-50 flex items-center justify-center text-violet-600 shadow-sm`}>
                <Bell className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-800 text-lg">Notificações</span>
            </div>
            <div className={`w-14 h-8 bg-gradient-to-r ${theme.primary} rounded-full relative cursor-pointer shadow-inner`}>
              <div className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full shadow-sm" />
            </div>
          </Card>

          <Card className="p-4 flex items-center justify-between border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-[18px] bg-gray-50 flex items-center justify-center text-gray-500 shadow-sm`}>
                <Moon className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-800 text-lg">Tema Escuro</span>
            </div>
            <div className="w-14 h-8 bg-gray-200 rounded-full relative cursor-pointer shadow-inner">
              <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-sm" />
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Sobre o App</h3>
        <div className="space-y-3">
          <Card className="p-4 flex items-center justify-between group hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all cursor-pointer border-none bg-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-emerald-500 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-800 text-lg">Privacidade</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
              <ChevronRight className="text-gray-400 group-hover:text-emerald-500 w-5 h-5" />
            </div>
          </Card>
        </div>
      </section>

      <div className="pt-8 space-y-4">
        <Button 
          variant="primary" 
          gender={userData.babyGender}
          className="w-full py-4 font-bold text-lg rounded-[20px]" 
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5 mr-2" /> Sair da Conta
        </Button>
        <Button 
          variant="outline" 
          gender={userData.babyGender}
          className="w-full py-4 font-bold text-lg rounded-[20px] border-gray-200 text-gray-400 hover:bg-gray-50" 
          onClick={onReset}
        >
          Redefinir Aplicativo
        </Button>
        <p className="text-center text-[11px] text-gray-400 mt-6 font-black uppercase tracking-widest">
          Versão 1.0.0 • Gravidez Organizada
        </p>
      </div>
    </div>
  );
};

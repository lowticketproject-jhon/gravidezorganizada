/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Clock, 
  Calendar, 
  ListChecks, 
  AlertTriangle, 
  Stethoscope, 
  ClipboardList, 
  User,
  Baby
} from 'lucide-react';
import { UserData, Appointment, Checklist } from './types';
import { Onboarding } from './components/Onboarding';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Navigation } from './components/Navigation';
import { TodayScreen } from './components/TodayScreen';
import { TimelineScreen } from './components/TimelineScreen';
import { StepsScreen } from './components/StepsScreen';
import { SymptomsScreen } from './components/SymptomsScreen';
import { AppointmentsScreen } from './components/AppointmentsScreen';
import { ChecklistsScreen } from './components/ChecklistsScreen';
import { BabyScreen } from './components/BabyScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { EditProfileScreen } from './components/EditProfileScreen';
import { DEFAULT_CHECKLISTS } from './constants/checklists';
import { calculatePregnancyData } from './utils/pregnancyCalculations';
import { AnimatePresence, motion } from 'motion/react';
import { supabase } from './lib/supabase';
import { supabaseService } from './services/supabaseService';
import { BackgroundDecoration } from './components/BackgroundDecoration';

const STORAGE_KEY = 'gravidez_organizada_data';

export default function App() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [checklists, setChecklists] = useState<Checklist[]>(DEFAULT_CHECKLISTS);
  const [activeScreen, setActiveScreen] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Load data from localStorage and check Supabase session
  useEffect(() => {
    const init = async () => {
      // 1. Check Supabase Session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
        
        // Fetch from Supabase
        const remoteData = await supabaseService.getUserData(session.user.id);
        if (remoteData) {
          setUserData(remoteData.userData);
          setAppointments(remoteData.appointments || []);
          setChecklists(remoteData.checklists || DEFAULT_CHECKLISTS);
          setIsLoading(false);
          return;
        }
      }

      // 2. Fallback to localStorage
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setUserData(parsed.userData);
          setAppointments(parsed.appointments || []);
          setChecklists(parsed.checklists || DEFAULT_CHECKLISTS);
          if (parsed.isAuthenticated) {
            setIsAuthenticated(true);
          }
        } catch (e) {
          console.error('Error loading data', e);
        }
      }
      setIsLoading(false);
    };

    init();
  }, []);

  // Save data to localStorage and Supabase
  useEffect(() => {
    if (userData) {
      // Local save
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        userData,
        appointments,
        checklists,
        isAuthenticated
      }));

      // Supabase save
      if (userId) {
        const timeoutId = setTimeout(() => {
          supabaseService.saveUserData(userId, {
            userData,
            appointments,
            checklists
          });
        }, 1000); // Debounce saves
        return () => clearTimeout(timeoutId);
      }
    }
  }, [userData, appointments, checklists, isAuthenticated, userId]);

  const handleLogin = (email: string, rememberMe: boolean, uid?: string) => {
    setIsAuthenticated(true);
    if (uid) setUserId(uid);
    if (!rememberMe) {
      // If not remember me, we don't save isAuthenticated to localStorage for next session
      // But for current session it's true
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserId(null);
  };

  const handleOnboardingComplete = (data: UserData) => {
    setUserData(data);
    setActiveScreen('home');
  };

  const updateUserData = async (data: Partial<UserData>) => {
    const updated = { ...userData!, ...data };
    setUserData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      userData: updated,
      appointments,
      checklists
    }));
    if (userId) {
      await supabaseService.saveUserData(userId, { userData: updated, appointments, checklists });
    }
  };

  const handleReset = () => {
    // For now, we'll just reset without confirm to avoid iframe issues, 
    // or the user can add a custom modal later.
    localStorage.removeItem(STORAGE_KEY);
    setUserData(null);
    setAppointments([]);
    setChecklists(DEFAULT_CHECKLISTS);
    setIsAuthenticated(false);
    setActiveScreen('home');
  };

  const addAppointment = (app: Appointment) => {
    setAppointments(prev => [...prev, app]);
  };

  const toggleAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const toggleChecklistItem = (checklistId: string, itemId: string) => {
    setChecklists(prev => prev.map(list => {
      if (list.id === checklistId) {
        return {
          ...list,
          items: list.items.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item)
        };
      }
      return list;
    }));
  };

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (!userData || !userData.setupComplete) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const pregData = calculatePregnancyData(
    userData.startDate,
    userData.conceptionDate,
    userData.dueDate,
    userData.manualWeeks
  );

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <Dashboard userData={userData} appointments={appointments} onNavigate={setActiveScreen} />;
      case 'today':
        return <TodayScreen userData={userData} onBack={() => setActiveScreen('home')} />;
      case 'timeline':
        return <TimelineScreen userData={userData} onBack={() => setActiveScreen('home')} />;
      case 'steps':
        return <StepsScreen userData={userData} onNavigate={setActiveScreen} onBack={() => setActiveScreen('home')} />;
      case 'symptoms':
        return <SymptomsScreen currentWeek={pregData.currentWeeks} onBack={() => setActiveScreen('home')} />;
      case 'appointments':
        return (
          <AppointmentsScreen 
            appointments={appointments} 
            onAdd={addAppointment} 
            onToggle={toggleAppointment} 
            onDelete={deleteAppointment} 
            onBack={() => setActiveScreen('home')}
          />
        );
      case 'checklists':
        return <ChecklistsScreen checklists={checklists} onToggleItem={toggleChecklistItem} onBack={() => setActiveScreen('home')} />;
      case 'baby':
        return <BabyScreen userData={userData} onBack={() => setActiveScreen('home')} />;
      case 'profile':
        return <ProfileScreen userData={userData} onReset={handleReset} onLogout={handleLogout} onBack={() => setActiveScreen('home')} userId={userId} onNavigate={setActiveScreen} darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />;
      case 'edit-mother':
        return <EditProfileScreen userData={userData} onSave={updateUserData} onBack={() => setActiveScreen('profile')} type="mother" />;
      case 'edit-baby':
        return <EditProfileScreen userData={userData} onSave={updateUserData} onBack={() => setActiveScreen('profile')} type="baby" />;
      case 'edit-dates':
        return <EditProfileScreen userData={userData} onSave={updateUserData} onBack={() => setActiveScreen('profile')} type="dates" />;
      default:
        return <Dashboard userData={userData} appointments={appointments} onNavigate={setActiveScreen} />;
    }
  };

  // Theme colors based on gender
  const theme = {
    boy: {
      sidebar: 'bg-white/95 border-r border-blue-50',
      activeTab: 'bg-blue-50 text-blue-700',
      inactiveTab: 'text-gray-500 hover:bg-gray-50 hover:text-gray-800',
      accent: 'blue',
      accentText: 'text-blue-600',
      gradient: 'from-blue-500 to-blue-600'
    },
    girl: {
      sidebar: 'bg-white/95 border-r border-pink-50',
      activeTab: 'bg-pink-50 text-pink-700',
      inactiveTab: 'text-gray-500 hover:bg-gray-50 hover:text-gray-800',
      accent: 'pink',
      accentText: 'text-pink-600',
      gradient: 'from-pink-500 to-pink-600'
    },
    unknown: {
      sidebar: 'bg-white/95 border-r border-violet-50',
      activeTab: 'bg-violet-50 text-violet-700',
      inactiveTab: 'text-gray-500 hover:bg-gray-50 hover:text-gray-800',
      accent: 'violet',
      accentText: 'text-violet-600',
      gradient: 'from-violet-500 to-violet-600'
    }
  }[userData.babyGender === 'boy' ? 'boy' : userData.babyGender === 'girl' ? 'girl' : 'unknown'];

  return (
    <div className={`min-h-screen bg-[#FCFBFA] dark:bg-gray-900 font-sans selection:bg-violet-100 selection:text-violet-700 overflow-x-hidden text-gray-900 dark:text-gray-100 ${darkMode ? 'dark' : ''}`}>
      <BackgroundDecoration gender={userData.babyGender} />
      
      {/* Desktop Sidebar (Hidden on mobile) */}
      <div className={`hidden lg:flex fixed left-0 top-0 bottom-0 w-64 ${theme.sidebar} dark:bg-gray-800 dark:border-gray-700 backdrop-blur-xl flex-col p-6 z-50`}>
        <div className="flex items-center gap-3 mb-12 relative z-10">
          <div className={`w-10 h-10 bg-gradient-to-br ${theme.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-100/50`}>
            <Baby className="w-6 h-6" />
          </div>
          <span className="font-black text-gray-900 dark:text-white tracking-tight">Gravidez <span className={`${theme.accentText} dark:text-white`}>Organizada</span></span>
        </div>
        
        <nav className="flex-1 space-y-2 relative z-10">
          {[
            { id: 'home', label: 'Início', icon: Home },
            { id: 'today', label: 'Hoje na Gravidez', icon: Clock },
            { id: 'timeline', label: 'Linha do Tempo', icon: Calendar },
            { id: 'steps', label: 'Próximos Passos', icon: ListChecks },
            { id: 'symptoms', label: 'Sintomas e Alertas', icon: AlertTriangle },
            { id: 'appointments', label: 'Consultas e Exames', icon: Stethoscope },
            { id: 'checklists', label: 'Checklists', icon: ClipboardList },
            { id: 'baby', label: 'Meu Bebê', icon: Baby },
            { id: 'profile', label: 'Perfil', icon: User },
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                  isActive ? theme.activeTab + ' shadow-sm' : theme.inactiveTab + ' dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? theme.accentText : 'text-gray-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="lg:ml-64 min-h-screen relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScreen}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Navigation (Hidden on desktop) */}
      <div className="lg:hidden relative z-50">
        <Navigation activeScreen={activeScreen} onNavigate={setActiveScreen} gender={userData.babyGender} />
      </div>
    </div>
  );
}

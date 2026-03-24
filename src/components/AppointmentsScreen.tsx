import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Appointment } from '../types';
import { Card, Button, Badge } from './UI';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Stethoscope, 
  Activity, 
  Baby,
  ChevronRight,
  X,
  ArrowLeft
} from 'lucide-react';

interface AppointmentsScreenProps {
  appointments: Appointment[];
  onAdd: (appointment: Appointment) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onBack?: () => void;
}

export const AppointmentsScreen: React.FC<AppointmentsScreenProps> = ({ 
  appointments, 
  onAdd, 
  onToggle, 
  onDelete,
  onBack
}) => {
  const [showForm, setShowForm] = useState(false);
  const [newApp, setNewApp] = useState<Partial<Appointment>>({
    type: 'consultation',
    title: '',
    date: '',
    time: '',
    notes: '',
  });

  const handleAdd = () => {
    if (newApp.title && newApp.date) {
      onAdd({
        id: Date.now().toString(),
        type: newApp.type as any,
        title: newApp.title,
        date: newApp.date,
        time: newApp.time || '00:00',
        notes: newApp.notes || '',
        completed: false,
      });
      setShowForm(false);
      setNewApp({ type: 'consultation', title: '', date: '', time: '', notes: '' });
    }
  };

  const sortedApps = [...appointments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="pb-32 pt-8 px-4 max-w-2xl mx-auto space-y-8">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Consultas</h1>
            <p className="text-gray-500 font-medium mt-1">Sua agenda de saúde</p>
          </div>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 text-white flex items-center justify-center shadow-[0_8px_20px_rgba(236,72,153,0.3)] hover:scale-105 transition-transform active:scale-95 shrink-0"
        >
          <Plus className="w-7 h-7" />
        </button>
      </header>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
            className="overflow-hidden"
          >
            <Card className="space-y-5 border-none shadow-[0_8px_30px_rgba(0,0,0,0.08)] bg-white relative p-6">
              <button 
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <h3 className="font-black text-xl text-gray-800 tracking-tight">Novo Agendamento</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {(['consultation', 'exam', 'ultrasound'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setNewApp(prev => ({ ...prev, type }))}
                      className={`py-3 px-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 flex flex-col items-center gap-2 ${
                        newApp.type === type 
                          ? 'bg-pink-50 text-pink-500 ring-2 ring-pink-400 ring-offset-2' 
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      {type === 'consultation' && <Stethoscope className="w-5 h-5" />}
                      {type === 'exam' && <Activity className="w-5 h-5" />}
                      {type === 'ultrasound' && <Baby className="w-5 h-5" />}
                      
                      {type === 'consultation' && 'Consulta'}
                      {type === 'exam' && 'Exame'}
                      {type === 'ultrasound' && 'Ultrassom'}
                    </button>
                  ))}
                </div>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Título (ex: Pré-natal)"
                    className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-400 outline-none font-medium text-gray-800 placeholder:text-gray-400 transition-all"
                    value={newApp.title}
                    onChange={e => setNewApp(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-400 outline-none font-medium text-gray-800 text-sm transition-all"
                      value={newApp.date}
                      onChange={e => setNewApp(prev => ({ ...prev, date: e.target.value }))}
                    />
                    <input
                      type="time"
                      className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-400 outline-none font-medium text-gray-800 text-sm transition-all"
                      value={newApp.time}
                      onChange={e => setNewApp(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                  <textarea
                    placeholder="Observações (opcional)"
                    className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-400 outline-none font-medium text-gray-800 placeholder:text-gray-400 h-28 resize-none transition-all"
                    value={newApp.notes}
                    onChange={e => setNewApp(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
                
                <Button 
                  className="w-full py-4 text-base shadow-[0_8px_20px_rgba(236,72,153,0.25)]" 
                  onClick={handleAdd}
                  disabled={!newApp.title || !newApp.date}
                >
                  Salvar Agendamento
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {sortedApps.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-16 space-y-4 bg-white/50 rounded-[32px] border border-dashed border-gray-200"
          >
            <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto">
              <Calendar className="text-pink-300 w-10 h-10" />
            </div>
            <div>
              <p className="text-gray-800 font-bold text-lg">Nenhum agendamento</p>
              <p className="text-gray-400 font-medium text-sm mt-1">Adicione suas consultas e exames aqui.</p>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            {sortedApps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`transition-all duration-300 border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] ${app.completed ? 'opacity-60 bg-gray-50' : 'bg-white'}`}>
                  <div className="flex gap-5">
                    <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center shrink-0 shadow-sm ${
                      app.type === 'consultation' ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-white' :
                      app.type === 'exam' ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white' : 'bg-gradient-to-br from-violet-400 to-violet-500 text-white'
                    }`}>
                      {app.type === 'consultation' && <Stethoscope className="w-7 h-7" />}
                      {app.type === 'exam' && <Activity className="w-7 h-7" />}
                      {app.type === 'ultrasound' && <Baby className="w-7 h-7" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={`font-black text-lg tracking-tight ${app.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{app.title}</h3>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] font-black uppercase tracking-widest text-gray-400">
                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {app.date}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {app.time}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => onDelete(app.id)} 
                          className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 hover:bg-pink-50 hover:text-pink-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {app.notes && (
                        <p className="text-sm text-gray-500 mt-3 bg-gray-50/80 p-3 rounded-2xl font-medium leading-relaxed border border-gray-100">
                          {app.notes}
                        </p>
                      )}
                      
                      <div className="flex justify-end mt-4">
                        <button 
                          onClick={() => onToggle(app.id)}
                          className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all ${
                            app.completed 
                              ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                              : 'bg-gray-50 text-gray-400 hover:bg-pink-50 hover:text-pink-500'
                          }`}
                        >
                          {app.completed ? <><CheckCircle2 className="w-4 h-4" /> Concluído</> : 'Marcar como concluído'}
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

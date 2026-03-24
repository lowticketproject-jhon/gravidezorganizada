import React from 'react';
import { motion } from 'motion/react';
import { Checklist } from '../types';
import { Card, Badge } from './UI';
import { CheckCircle2, Circle, ListTodo, ArrowLeft } from 'lucide-react';

interface ChecklistsScreenProps {
  checklists: Checklist[];
  onToggleItem: (checklistId: string, itemId: string) => void;
  onBack?: () => void;
}

export const ChecklistsScreen: React.FC<ChecklistsScreenProps> = ({ checklists, onToggleItem, onBack }) => {
  return (
    <div className="pb-32 pt-8 px-4 max-w-2xl mx-auto space-y-8">
      <header className="flex items-center justify-between mb-8">
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
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Checklists</h1>
            <p className="text-gray-500 font-medium mt-1">Organize cada detalhe</p>
          </div>
        </div>
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-500 shadow-inner border-2 border-white shrink-0">
          <ListTodo className="w-6 h-6" />
        </div>
      </header>

      <div className="space-y-6">
        {checklists.map((list, listIdx) => {
          const completedCount = list.items.filter(i => i.completed).length;
          const progress = (completedCount / list.items.length) * 100;
          const isFullyCompleted = progress === 100;

          return (
            <motion.div
              key={list.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: listIdx * 0.1 }}
            >
              <Card className={`overflow-hidden transition-all duration-500 ${isFullyCompleted ? 'bg-gradient-to-br from-emerald-50 to-white border-emerald-100/50' : 'bg-white'}`}>
                <div className="p-6 space-y-5">
                  <div className="flex justify-between items-center">
                    <h3 className={`font-black text-xl tracking-tight ${isFullyCompleted ? 'text-emerald-800' : 'text-gray-800'}`}>
                      {list.title}
                    </h3>
                    <Badge color={isFullyCompleted ? 'green' : 'indigo'} className="animate-pulse-slow">
                      {completedCount}/{list.items.length}
                    </Badge>
                  </div>

                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-gray-200/50">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, type: "spring" }}
                      className={`h-full rounded-full relative overflow-hidden ${isFullyCompleted ? 'bg-emerald-400' : 'bg-indigo-400'}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-[200%] animate-[shimmer_2s_infinite]" />
                    </motion.div>
                  </div>

                  <div className="space-y-2 pt-2">
                    {list.items.map((item, itemIdx) => (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (listIdx * 0.1) + (itemIdx * 0.05) }}
                        onClick={() => onToggleItem(list.id, item.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group border ${
                          item.completed 
                            ? 'bg-gray-50/50 border-transparent hover:bg-gray-100' 
                            : 'bg-white border-gray-100 hover:border-indigo-200 hover:shadow-md'
                        }`}
                      >
                        <div className={`shrink-0 transition-transform duration-300 ${item.completed ? 'scale-110' : 'group-hover:scale-110'}`}>
                          {item.completed ? (
                            <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                          ) : (
                            <Circle className="text-gray-300 w-6 h-6 group-hover:text-indigo-300" />
                          )}
                        </div>
                        <span className={`text-sm font-bold transition-all duration-300 ${
                          item.completed ? 'text-gray-400 line-through decoration-gray-300' : 'text-gray-700 group-hover:text-indigo-900'
                        }`}>
                          {item.text}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

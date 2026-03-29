import React from 'react';
import { motion } from 'motion/react';
import { UserData } from '../types';
import { Card } from './UI';
import { 
  Apple, 
  Carrot, 
  Egg, 
  Wheat, 
  Droplets, 
  CheckCircle2,
  Lightbulb,
  Utensils,
  Heart,
  ChevronRight
} from 'lucide-react';

interface AlimentacaoScreenProps {
  userData: UserData;
  onBack: () => void;
}

export const AlimentacaoScreen: React.FC<AlimentacaoScreenProps> = ({ userData, onBack }) => {
  const theme = {
    boy: { primary: 'blue', bg: 'bg-blue-50', text: 'text-blue-700' },
    girl: { primary: 'pink', bg: 'bg-pink-50', text: 'text-pink-700' },
    unknown: { primary: 'violet', bg: 'bg-violet-50', text: 'text-violet-700' }
  }[userData.babyGender === 'boy' ? 'boy' : userData.babyGender === 'girl' ? 'girl' : 'unknown'];

  const foodCategories = [
    {
      title: 'Frutas',
      icon: Apple,
      items: ['banana', 'maçã', 'mamão', 'pera', 'laranja', 'abacate', 'morango'],
      color: 'bg-green-50 border-green-100'
    },
    {
      title: 'Legumes e Verduras',
      icon: Carrot,
      items: ['cenoura', 'abóbora', 'brócolis', 'couve', 'espinafre', 'tomate', 'beterraba'],
      color: 'bg-emerald-50 border-emerald-100'
    },
    {
      title: 'Fontes de Proteína',
      icon: Egg,
      items: ['ovos bem cozidos', 'frango', 'peixe bem preparado', 'carne magra', 'iogurte natural', 'queijo pasteurizado'],
      color: 'bg-amber-50 border-amber-100'
    },
    {
      title: 'Grãos e Leguminosas',
      icon: Wheat,
      items: ['feijão', 'lentilha', 'grão-de-bico', 'aveia', 'arroz integral'],
      color: 'bg-orange-50 border-orange-100'
    },
    {
      title: 'Gorduras Boas',
      icon: Droplets,
      items: ['abacate', 'castanhas', 'sementes', 'azeite'],
      color: 'bg-yellow-50 border-yellow-100'
    }
  ];

  const benefits = [
    {
      title: 'Mais energia no dia a dia',
      desc: 'Uma alimentação equilibrada pode ajudar a mãe a se sentir melhor na rotina.'
    },
    {
      title: 'Mais apoio ao desenvolvimento do bebê',
      desc: 'Alimentos naturais ajudam a compor uma base melhor para essa fase.'
    },
    {
      title: 'Mais organização na rotina',
      desc: 'Ter ideias simples de alimentação ajuda a reduzir improvisos.'
    },
    {
      title: 'Mais variedade alimentar',
      desc: 'Frutas, legumes, proteínas e grãos ajudam a deixar a alimentação mais completa.'
    },
    {
      title: 'Mais praticidade para cuidar de você',
      desc: 'Sugestões simples facilitam escolhas melhores no dia a dia.'
    }
  ];

  const meals = {
    'Café da manhã': ['iogurte natural com banana e aveia', 'pão integral com ovo', 'mamão com aveia', 'vitamina de fruta'],
    'Lanche': ['fruta com castanhas', 'iogurte natural', 'banana com pasta de amendoim'],
    'Almoço': ['arroz, feijão, frango e legumes', 'carne magra com salada e legumes', 'peixe bem preparado com arroz e verduras'],
    'Jantar': ['sopa de legumes com frango', 'omelete com legumes', 'arroz, feijão e legumes']
  };

  const tips = [
    'prefira comida de verdade no dia a dia',
    'varie frutas, legumes e verduras',
    'mantenha boa hidratação',
    'tente incluir proteína nas principais refeições',
    'organize refeições simples para evitar pular horários'
  ];

  return (
    <div className="min-h-screen bg-[#FCFBFA] pb-24">
      <div className="bg-gradient-to-br from-violet-500 to-violet-600 p-6 pt-12 rounded-b-[40px]">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h1 className="text-3xl font-black text-white">Alimentação</h1>
        </div>
        <p className="text-white/90 font-medium text-sm">
          Sugestões de alimentos naturais para ajudar você a cuidar da sua alimentação durante a gravidez de forma mais prática e equilibrada.
        </p>
      </div>

      <div className="p-6 -mt-4">
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6">
          <p className="text-amber-800 text-xs font-bold">
            Importante: esta área traz sugestões gerais de apoio e não substitui orientação médica ou nutricional individual.
          </p>
        </div>

        <h2 className="text-xl font-black text-gray-900 mb-4">Alimentos que podem ajudar no dia a dia</h2>
        
        <div className="space-y-4 mb-8">
          {foodCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={`${category.color} border-0 shadow-sm`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${category.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <h3 className="font-black text-gray-900">{category.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((item) => (
                      <span key={item} className="px-3 py-1 bg-white rounded-full text-xs font-bold text-gray-600">
                        {item}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <h2 className="text-xl font-black text-gray-900 mb-4">Benefícios de uma alimentação mais equilibrada</h2>
        
        <div className="space-y-3 mb-8">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="bg-white border-0 shadow-sm p-4">
                <div className="flex items-start gap-3">
                  <Heart className={`w-5 h-5 ${theme.text} mt-0.5`} />
                  <div>
                    <h4 className="font-black text-gray-900 text-sm">{benefit.title}</h4>
                    <p className="text-gray-500 text-xs mt-1">{benefit.desc}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <h2 className="text-xl font-black text-gray-900 mb-4">Ideias simples para refeições</h2>
        
        <div className="space-y-4 mb-8">
          {Object.entries(meals).map(([mealName, options], idx) => (
            <motion.div
              key={mealName}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="bg-white border-0 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Utensils className="w-4 h-4 text-violet-500" />
                  <h4 className="font-black text-gray-900 text-sm">{mealName}</h4>
                </div>
                <div className="space-y-2">
                  {options.map((option) => (
                    <div key={option} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600 text-xs">{option}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <h2 className="text-xl font-black text-gray-900 mb-4">Dicas úteis</h2>
        
        <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-0 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-violet-600" />
            <h4 className="font-black text-gray-900 text-sm">Dicas para facilitar sua rotina</h4>
          </div>
          <div className="space-y-3">
            {tips.map((tip, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                <span className="text-gray-600 text-xs capitalize">{tip}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
          <h3 className="font-black text-gray-900 text-center mb-4">Organização da alimentação</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-xl text-center">
              <span className="text-2xl">🍎</span>
              <p className="text-xs font-bold text-gray-600 mt-1">Alimentos consumidos</p>
            </div>
            <div className="bg-white p-4 rounded-xl text-center">
              <span className="text-2xl">❤️</span>
              <p className="text-xs font-bold text-gray-600 mt-1">Favoritos saudáveis</p>
            </div>
            <div className="bg-white p-4 rounded-xl text-center">
              <span className="text-2xl">💡</span>
              <p className="text-xs font-bold text-gray-600 mt-1">Ideias salvas</p>
            </div>
            <div className="bg-white p-4 rounded-xl text-center">
              <span className="text-2xl">✅</span>
              <p className="text-xs font-bold text-gray-600 mt-1">Checklist simples</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

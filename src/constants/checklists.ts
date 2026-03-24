import { Checklist } from '../types';

export const DEFAULT_CHECKLISTS: Checklist[] = [
  {
    id: '1st-tri',
    title: 'Primeiro Trimestre',
    items: [
      { id: '1-1', text: 'Confirmar gravidez com exame de sangue', completed: false },
      { id: '1-2', text: 'Escolher obstetra e agendar 1ª consulta', completed: false },
      { id: '1-3', text: 'Iniciar Ácido Fólico', completed: false },
      { id: '1-4', text: 'Fazer exames laboratoriais iniciais', completed: false },
      { id: '1-5', text: 'Ultrassom de Translucência Nucal (11-13 semanas)', completed: false },
    ],
  },
  {
    id: 'maternity-bag',
    title: 'Mala da Maternidade',
    items: [
      { id: 'm-1', text: '6 Trocas de roupa para o bebê', completed: false },
      { id: 'm-2', text: 'Fraldas RN e P', completed: false },
      { id: 'm-3', text: 'Mantas e cueiros', completed: false },
      { id: 'm-4', text: 'Produtos de higiene para a mãe', completed: false },
      { id: 'm-5', text: 'Roupas confortáveis para amamentação', completed: false },
      { id: 'm-6', text: 'Documentos e plano de parto', completed: false },
    ],
  },
  {
    id: 'doctor-questions',
    title: 'Perguntas para o Médico',
    items: [
      { id: 'q-1', text: 'Quais medicamentos posso tomar para dor?', completed: false },
      { id: 'q-2', text: 'Quais exercícios físicos são recomendados?', completed: false },
      { id: 'q-3', text: 'Como entrar em contato em caso de emergência?', completed: false },
      { id: 'q-4', text: 'Quais sinais de alerta devo observar?', completed: false },
    ],
  },
];

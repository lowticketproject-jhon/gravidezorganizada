import { LucideIcon } from 'lucide-react';

export type BabyGender = 'boy' | 'girl' | 'unknown' | 'none';

export interface UserData {
  motherName: string;
  babyName: string;
  babyGender: BabyGender;
  startDate?: string; // DUM
  conceptionDate?: string;
  dueDate?: string;
  manualWeeks?: number;
  setupComplete: boolean;
}

export interface Appointment {
  id: string;
  type: 'consultation' | 'exam' | 'ultrasound';
  title: string;
  date: string;
  time: string;
  notes: string;
  completed: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface PregnancyPhaseInfo {
  week: number;
  trimester: number;
  month: number;
  babySize: string;
  babyComparison: string;
  babyComparisonIcon: string; // Emoji or icon name
  babyDevelopment: string;
  motherChanges: string;
  commonSymptoms: string[];
  alerts: string[];
  nextStep: string;
  importantExam: string;
  observeNow: string;
  energyLevel: string;
  moodChanges: string;
  cravings: string;
}

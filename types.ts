export type Language = 'en' | 'uz';

export enum TenseStatus {
  LOCKED = 'LOCKED',
  AVAILABLE = 'AVAILABLE',
  COMPLETED = 'COMPLETED'
}

export interface UserProgress {
  completedTenses: string[];
  unlockedTenses: string[];
  xp: number;
  streak: number;
  lastActive: string;
  level: number;
}

export interface User {
  fullName: string;
  username: string;
  phone: string;
  password: string;
  userCode: string; // Format: #12345678
  progress: UserProgress;
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface TenseMistake {
  wrong: string;
  correct: string;
  note: { en: string; uz: string };
}

export interface PracticeQuestion {
  type: 'writing' | 'choice';
  question: string;
  answer: string;
  options?: string[];
  hint: { en: string; uz: string };
}

export interface TenseExample {
  sentence: string;
  translation: string;
  type: 'positive' | 'negative' | 'question';
  note: { en: string; uz: string };
}

export interface TenseData {
  id: string;
  levelId: number;
  colorTheme: 'present' | 'past' | 'future' | 'perfect' | 'continuous';
  name: { en: string; uz: string };
  description: { en: string; uz: string };
  detailedExplanation: { en: string; uz: string };
  timeline: string;
  whenToUse: { en: string[]; uz: string[] };
  signalWords: string[];
  commonMistakes: TenseMistake[];
  structure: {
    positive: {
      rows: { subject: string; verb: string; example: string }[];
      formula: string;
    };
    negative: {
      rows: { subject: string; helper: string; verb: string; example: string }[];
      formula: string;
    };
    question: {
      rows: { helper: string; subject: string; verb: string; example: string }[];
      formula: string;
    };
    shortAnswers: string;
  };
  examples: TenseExample[];
  practice: PracticeQuestion[];
}

export interface VocabularyItem {
  word: string;
  translation: string;
  definition: { en: string; uz: string };
  example: string;
  type: string;
}

export interface VocabularyCategory {
  id: string;
  name: { en: string; uz: string };
  items: VocabularyItem[];
}

export interface FeedbackResult {
  score: number;
  mistakes: { original: string; corrected: string; reason: { en: string; uz: string } }[];
  improvementTips: { en: string; uz: string };
}
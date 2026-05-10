export type QuestionType = 
  | "MCQ_SINGLE" 
  | "MCQ_MULTIPLE" 
  | "TRUE_FALSE" 
  | "NUMERIC" 
  | "SHORT_ANSWER" 
  | "DESCRIPTIVE" 
  | "MATCH_THE_FOLLOWING" 
  | "ASSERTION_REASON" 
  | "TYPING";

export interface Question {
  _id: string;
  type: QuestionType;
  marks: number;
  negativeMarks: number;
  content: {
    en: string;
    hi?: string;
  };
  options?: {
    _id: string;
    text: { en: string; hi?: string };
    pair?: { en: string; hi?: string };
    isCorrect?: boolean;
  }[];
  assertion?: { en: string; hi?: string };
  reason?: { en: string; hi?: string };
  shortAnswer?: string;
  numericAnswer?: number;
  // Typing specific
  typingConfig?: any;
}

export interface ExamState {
  currentQuestionIndex: number;
  answers: Record<string, any>;
  visited: string[];
  attempted: string[];
  flagged: number[];
  timer: number;
  typingStats?: Record<string, any>;
}

export interface QuestionRendererProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  language: string;
  userName?: string;
}

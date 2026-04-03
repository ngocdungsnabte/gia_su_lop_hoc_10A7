export interface Question {
  id: string | number;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export interface Exam {
  id: string;
  title: string;
  questions: Question[];
  duration: number; // in minutes
}

export interface Subject {
  id: string;
  name: string;
  desc: string;
  icon: string;
  color: string;
  borderColor: string;
  exams: Exam[];
}

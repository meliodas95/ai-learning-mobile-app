import { useState, useCallback } from 'react';
import type { ExerciseQuestion, ExerciseAnswer } from '@/src/api/types';

// Mock questions for now - will be fetched from API
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface UseExerciseReturn {
  questions: ExerciseQuestion[];
  currentQuestionIndex: number;
  currentQuestion: ExerciseQuestion | undefined;
  shuffledAnswers: ExerciseAnswer[];
  selectedAnswer: ExerciseAnswer | null;
  isAnswered: boolean;
  isCorrect: boolean;
  correctCount: number;
  totalQuestions: number;
  isFinished: boolean;
  selectAnswer: (answer: ExerciseAnswer) => void;
  nextQuestion: () => void;
  restart: () => void;
}

export function useExercise(questions: ExerciseQuestion[]): UseExerciseReturn {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<ExerciseAnswer | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [shuffledAnswers, setShuffledAnswers] = useState<ExerciseAnswer[]>(() =>
    questions[0] ? shuffleArray(questions[0].answers) : []
  );

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer?.is_correct ?? false;

  const selectAnswer = useCallback((answer: ExerciseAnswer) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    if (answer.is_correct) {
      setCorrectCount((c) => c + 1);
    }
  }, [isAnswered]);

  const nextQuestion = useCallback(() => {
    const nextIdx = currentQuestionIndex + 1;
    if (nextIdx >= questions.length) {
      setIsFinished(true);
      return;
    }
    setCurrentQuestionIndex(nextIdx);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShuffledAnswers(shuffleArray(questions[nextIdx].answers));
  }, [currentQuestionIndex, questions]);

  const restart = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setIsFinished(false);
    if (questions[0]) {
      setShuffledAnswers(shuffleArray(questions[0].answers));
    }
  }, [questions]);

  return {
    questions,
    currentQuestionIndex,
    currentQuestion,
    shuffledAnswers,
    selectedAnswer,
    isAnswered,
    isCorrect,
    correctCount,
    totalQuestions: questions.length,
    isFinished,
    selectAnswer,
    nextQuestion,
    restart,
  };
}

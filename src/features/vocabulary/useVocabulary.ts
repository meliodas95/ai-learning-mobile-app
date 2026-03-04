import { useState, useCallback } from 'react';
import { useLearningStore } from '@/src/store/learningStore';
import { useDictionaryMutation } from '@/src/api/hooks/useLearning';
import type { DictionaryWord } from '@/src/api/types';

interface UseVocabularyReturn {
  words: string[];
  currentWordIndex: number;
  currentWord: string;
  definition: DictionaryWord | null;
  isLoadingDefinition: boolean;
  isFinished: boolean;
  nextWord: () => void;
  prevWord: () => void;
  lookupWord: (word: string) => void;
}

export function useVocabulary(): UseVocabularyReturn {
  const paragraph = useLearningStore((s) => s.paragraph);
  const dictionaryMutation = useDictionaryMutation();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [definition, setDefinition] = useState<DictionaryWord | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  // Parse keywords from paragraph
  const words = (paragraph?.keywords ?? '')
    .split(',')
    .map((w) => w.trim())
    .filter(Boolean);

  const currentWord = words[currentWordIndex] ?? '';

  const lookupWord = useCallback(
    async (word: string) => {
      try {
        const result = await dictionaryMutation.mutateAsync({ word });
        const dictData = result as { data?: { words?: DictionaryWord[] } };
        setDefinition(dictData?.data?.words?.[0] ?? null);
      } catch {
        setDefinition(null);
      }
    },
    [dictionaryMutation],
  );

  const nextWord = useCallback(() => {
    if (currentWordIndex < words.length - 1) {
      const next = currentWordIndex + 1;
      setCurrentWordIndex(next);
      setDefinition(null);
      lookupWord(words[next]);
    } else {
      setIsFinished(true);
    }
  }, [currentWordIndex, words, lookupWord]);

  const prevWord = useCallback(() => {
    if (currentWordIndex > 0) {
      const prev = currentWordIndex - 1;
      setCurrentWordIndex(prev);
      setDefinition(null);
      lookupWord(words[prev]);
    }
  }, [currentWordIndex, words, lookupWord]);

  return {
    words,
    currentWordIndex,
    currentWord,
    definition,
    isLoadingDefinition: dictionaryMutation.isPending,
    isFinished,
    nextWord,
    prevWord,
    lookupWord,
  };
}

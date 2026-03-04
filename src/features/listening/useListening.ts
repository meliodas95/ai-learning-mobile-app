import { useState, useCallback, useRef, useEffect } from 'react';
import { useLearningStore } from '@/src/store/learningStore';
import { useSettingsStore } from '@/src/store/settingsStore';
import { useEndListenMutation } from '@/src/api/hooks/useLearning';
import type { VideoPlayerRef } from '@/src/components/VideoPlayer';
import type { SentenceEntity } from '@/src/api/types';

interface UseListeningReturn {
  currentSentence: SentenceEntity | undefined;
  currentTime: number;
  isPlaying: boolean;
  isStarted: boolean;
  isFinished: boolean;
  sentenceIndex: number;
  totalSentences: number;
  handleProgress: (currentTime: number, duration: number) => void;
  handleStart: () => void;
  handleNextSentence: () => void;
  handleBackSentence: () => void;
  handleTogglePlay: () => void;
  handleFinish: () => void;
  handleRestart: () => void;
  videoRef: React.RefObject<VideoPlayerRef | null>;
}

export function useListening(): UseListeningReturn {
  const videoRef = useRef<VideoPlayerRef | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const lastSavedSentenceRef = useRef<number | null>(null);

  const sentences = useLearningStore((s) => s.sentences);
  const currentSentenceIndex = useLearningStore((s) => s.currentSentenceIndex);
  const setCurrentSentenceIndex = useLearningStore((s) => s.setCurrentSentenceIndex);
  const paragraph = useLearningStore((s) => s.paragraph);
  const autoPlay = useSettingsStore((s) => s.autoPlay);

  const endListenMutation = useEndListenMutation();

  // Find current sentence by time
  const currentSentence = sentences.find(
    (s) => s.start != null && s.end != null && currentTime >= s.start && currentTime <= s.end
  ) ?? sentences[currentSentenceIndex];

  // Update index when sentence changes by time
  useEffect(() => {
    if (currentSentence) {
      const idx = sentences.findIndex((s) => s.id === currentSentence.id);
      if (idx >= 0 && idx !== currentSentenceIndex) {
        setCurrentSentenceIndex(idx);
      }
    }
  }, [currentSentence?.id]);

  // Save sentence completion
  useEffect(() => {
    if (currentSentence && currentSentence.end != null && currentTime >= currentSentence.end - 0.05) {
      if (lastSavedSentenceRef.current !== currentSentence.id && paragraph) {
        lastSavedSentenceRef.current = currentSentence.id;
        endListenMutation.mutate({
          paragraph_id: paragraph.id,
          sentence_id: currentSentence.id,
        });
      }
    }
  }, [currentTime, currentSentence?.id]);

  const handleProgress = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const handleStart = useCallback(async () => {
    setIsStarted(true);
    setIsPlaying(true);
    await videoRef.current?.play();
  }, []);

  const handleTogglePlay = useCallback(async () => {
    if (isPlaying) {
      await videoRef.current?.pause();
    } else {
      await videoRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleNextSentence = useCallback(async () => {
    const nextIdx = currentSentenceIndex + 1;
    if (nextIdx < sentences.length) {
      setCurrentSentenceIndex(nextIdx);
      const nextSentence = sentences[nextIdx];
      if (nextSentence?.start != null) {
        await videoRef.current?.seekTo(nextSentence.start * 1000);
      }
    }
  }, [currentSentenceIndex, sentences, setCurrentSentenceIndex]);

  const handleBackSentence = useCallback(async () => {
    const prevIdx = currentSentenceIndex - 1;
    if (prevIdx >= 0) {
      setCurrentSentenceIndex(prevIdx);
      const prevSentence = sentences[prevIdx];
      if (prevSentence?.start != null) {
        await videoRef.current?.seekTo(prevSentence.start * 1000);
      }
    }
  }, [currentSentenceIndex, sentences, setCurrentSentenceIndex]);

  const handleFinish = useCallback(() => {
    setIsFinished(true);
    setIsPlaying(false);
    videoRef.current?.pause();
  }, []);

  const handleRestart = useCallback(async () => {
    setCurrentSentenceIndex(0);
    setIsFinished(false);
    lastSavedSentenceRef.current = null;
    await videoRef.current?.seekTo(0);
    await videoRef.current?.play();
    setIsPlaying(true);
  }, [setCurrentSentenceIndex]);

  return {
    currentSentence,
    currentTime,
    isPlaying,
    isStarted,
    isFinished,
    sentenceIndex: currentSentenceIndex,
    totalSentences: sentences.length,
    handleProgress,
    handleStart,
    handleNextSentence,
    handleBackSentence,
    handleTogglePlay,
    handleFinish,
    handleRestart,
    videoRef,
  };
}

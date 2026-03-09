import { useCallback, useEffect, useRef } from 'react';
import { useLearningStore } from '@/src/store/learningStore';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useScoring } from './useScoring';
import { SpeakingState } from '@/src/api/types';
import type { SentenceEntity, CharacterEntity } from '@/src/api/types';
import { Audio } from 'expo-av';

const RECORDING_TIMEOUT_SECONDS = 30;

interface UseSpeakingFlowReturn {
  state: SpeakingState;
  currentSentence: SentenceEntity | undefined;
  activeCharacter: CharacterEntity | null;
  isRecording: boolean;
  transcript: string;
  recordingDuration: number;
  score: number | null;
  sentenceIndex: number;
  totalSentences: number;
  startLesson: () => void;
  startRecording: () => Promise<void>;
  stopAndScore: () => Promise<void>;
  nextSentence: () => void;
  prevSentence: () => void;
  restartLesson: () => void;
}

export function useSpeakingFlow(): UseSpeakingFlowReturn {
  const sentences = useLearningStore((s) => s.sentences);
  const characters = useLearningStore((s) => s.characters);
  const currentSentenceIndex = useLearningStore((s) => s.currentSentenceIndex);
  const setCurrentSentenceIndex = useLearningStore((s) => s.setCurrentSentenceIndex);
  const speakingState = useLearningStore((s) => s.speakingState);
  const setSpeakingState = useLearningStore((s) => s.setSpeakingState);
  const activeCharacter = useLearningStore((s) => s.activeCharacter);
  const setActiveCharacter = useLearningStore((s) => s.setActiveCharacter);
  const currentScore = useLearningStore((s) => s.currentScore);
  const setCurrentScore = useLearningStore((s) => s.setCurrentScore);
  const paragraph = useLearningStore((s) => s.paragraph);

  const speech = useSpeechRecognition();
  const scoring = useScoring();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const currentSentence = sentences[currentSentenceIndex];

  // Set initial active character
  useEffect(() => {
    if (characters.length > 0 && !activeCharacter) {
      setActiveCharacter(characters[0]);
    }
  }, [characters, activeCharacter, setActiveCharacter]);

  const stopAndScore = useCallback(async () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSpeakingState(SpeakingState.SCORING);

    const result = await speech.stopRecording();
    if (!result || !currentSentence || !paragraph) {
      setSpeakingState(SpeakingState.IDLE);
      return;
    }

    const { scoreEntity } = await scoring.submitScore({
      sentence: currentSentence,
      transcript: result.transcript,
      audioUri: result.audioUri,
      recordTime: speech.recordingDuration,
      paragraphId: paragraph.id,
    });

    if (scoreEntity) {
      setCurrentScore(scoreEntity);
    }
    setSpeakingState(SpeakingState.SCORED);
  }, [speech, scoring, currentSentence, paragraph, setSpeakingState, setCurrentScore]);

  // Auto-stop recording after timeout
  useEffect(() => {
    if (speakingState === SpeakingState.RECORDING) {
      timeoutRef.current = setTimeout(() => {
        stopAndScore();
      }, RECORDING_TIMEOUT_SECONDS * 1000);

      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }
  }, [speakingState, stopAndScore]);

  const playAudio = useCallback(
    async (url: string) => {
      try {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
        }
        const { sound } = await Audio.Sound.createAsync({ uri: url });
        soundRef.current = sound;
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setSpeakingState(SpeakingState.COUNTDOWN);
          }
        });
      } catch {
        // If audio fails, go straight to countdown
        setSpeakingState(SpeakingState.COUNTDOWN);
      }
    },
    [setSpeakingState],
  );

  const determineNextState = useCallback(
    (sentence: SentenceEntity | undefined) => {
      if (!sentence || !activeCharacter) {
        setSpeakingState(SpeakingState.COUNTDOWN);
        return;
      }
      // If the sentence belongs to another character, play their audio first
      if (sentence.character_id !== activeCharacter.id && sentence.audios?.[0]?.url) {
        setSpeakingState(SpeakingState.LISTENING);
        playAudio(sentence.audios[0].url);
      } else {
        // User's turn - go to countdown
        setSpeakingState(SpeakingState.COUNTDOWN);
      }
    },
    [activeCharacter, setSpeakingState, playAudio],
  );

  const startLesson = useCallback(() => {
    setCurrentSentenceIndex(0);
    setCurrentScore(null);
    determineNextState(sentences[0]);
  }, [sentences, setCurrentSentenceIndex, setCurrentScore, determineNextState]);

  const startRecording = useCallback(async () => {
    setSpeakingState(SpeakingState.RECORDING);
    await speech.startRecording();
  }, [setSpeakingState, speech]);

  const nextSentence = useCallback(() => {
    const nextIdx = currentSentenceIndex + 1;
    if (nextIdx >= sentences.length) {
      setSpeakingState(SpeakingState.FINISHED);
      return;
    }
    setCurrentSentenceIndex(nextIdx);
    setCurrentScore(null);
    determineNextState(sentences[nextIdx]);
  }, [
    currentSentenceIndex,
    sentences,
    setCurrentSentenceIndex,
    setCurrentScore,
    setSpeakingState,
    determineNextState,
  ]);

  const prevSentence = useCallback(() => {
    if (currentSentenceIndex > 0) {
      const prevIdx = currentSentenceIndex - 1;
      setCurrentSentenceIndex(prevIdx);
      setCurrentScore(null);
      determineNextState(sentences[prevIdx]);
    }
  }, [
    currentSentenceIndex,
    sentences,
    setCurrentSentenceIndex,
    setCurrentScore,
    determineNextState,
  ]);

  const restartLesson = useCallback(() => {
    speech.cancelRecording();
    setCurrentSentenceIndex(0);
    setCurrentScore(null);
    setSpeakingState(SpeakingState.IDLE);
  }, [speech, setCurrentSentenceIndex, setCurrentScore, setSpeakingState]);

  return {
    state: speakingState,
    currentSentence,
    activeCharacter,
    isRecording: speech.isRecording,
    transcript: speech.transcript,
    recordingDuration: speech.recordingDuration,
    score: currentScore?.score ?? null,
    sentenceIndex: currentSentenceIndex,
    totalSentences: sentences.length,
    startLesson,
    startRecording,
    stopAndScore,
    nextSentence,
    prevSentence,
    restartLesson,
  };
}

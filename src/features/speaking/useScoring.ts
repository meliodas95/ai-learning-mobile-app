import { useCallback } from 'react';
import * as FileSystem from 'expo-file-system';
import { calculateSimilarity } from '@/src/utils/similarity';
import { encryptScoreData } from '@/src/utils/encryption';
import { getScoreColor } from '@/src/utils/score';
import { useEndSpeakMutation } from '@/src/api/hooks/useLearning';
import type { SentenceEntity, SentenceScoreEntity } from '@/src/api/types';

interface SubmitScoreParams {
  sentence: SentenceEntity;
  transcript: string;
  audioUri: string;
  recordTime: number;
  paragraphId: number;
}

interface UseScoring {
  submitScore: (params: SubmitScoreParams) => Promise<{ score: number; scoreEntity: SentenceScoreEntity | null }>;
  isSubmitting: boolean;
}

export function useScoring(): UseScoring {
  const endSpeakMutation = useEndSpeakMutation();

  const submitScore = useCallback(async (params: SubmitScoreParams) => {
    const { sentence, transcript, audioUri, recordTime, paragraphId } = params;

    // Calculate local similarity score
    const score = calculateSimilarity(transcript, sentence.content);
    const scoreData = encryptScoreData(transcript, score, recordTime);

    try {
      // Read audio file as blob
      const fileInfo = await FileSystem.getInfoAsync(audioUri);
      if (!fileInfo.exists) throw new Error('Audio file not found');

      const response = await fetch(audioUri);
      const blob = await response.blob();

      // Submit to server
      const result = await endSpeakMutation.mutateAsync({
        file: blob,
        template: sentence.content,
        transcript,
        score,
        score_data: scoreData,
        character_id: sentence.character_id,
        sentence_id: sentence.id,
        paragraph_id: paragraphId,
      });

      return {
        score,
        scoreEntity: result?.data?.sentenceScore ?? null,
      };
    } catch {
      // Return local score if server fails
      return {
        score,
        scoreEntity: {
          id: 0,
          sentence_id: sentence.id,
          character_id: sentence.character_id,
          score,
          color: getScoreColor(score),
        } as SentenceScoreEntity,
      };
    }
  }, [endSpeakMutation]);

  return {
    submitScore,
    isSubmitting: endSpeakMutation.isPending,
  };
}

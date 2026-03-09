import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/src/api/client';
import { Endpoints } from '@/src/api/endpoints';
import type { ApiResponse, SentenceListResponse, SentenceScoreEntity } from '@/src/api/types';

// === Sentence Queries ===

interface SentenceParams {
  paragraph_id: number;
  document_id?: number;
  course_id?: number;
  type?: string;
  exercise_token?: string;
}

export function useSentences(params: SentenceParams | undefined) {
  return useQuery({
    queryKey: ['sentences', params?.paragraph_id, params?.type],
    queryFn: () =>
      apiClient.get<unknown, ApiResponse<SentenceListResponse>>(Endpoints.SENTENCE_LIST_V1, {
        params,
      }),
    select: (res) => res.data,
    enabled: !!params?.paragraph_id,
    staleTime: Infinity,
  });
}

// === Learning Action Mutations ===

interface StartParagraphParams {
  paragraph_id: number;
  type: string;
}

interface EndListenParams {
  paragraph_id: number;
  sentence_id: number;
  action?: number;
}

interface EndSpeakParams {
  fileUri: string;
  template: string;
  transcript: string;
  score: number;
  score_data: string;
  character_id: number;
  sentence_id: number;
  paragraph_id: number;
  member_exercise_token?: string;
  action?: number;
}

export function useStartParagraphMutation() {
  return useMutation({
    mutationFn: (params: StartParagraphParams) => apiClient.post(Endpoints.START_PARAGRAPH, params),
  });
}

export function useEndListenMutation() {
  return useMutation({
    mutationFn: (params: EndListenParams) => apiClient.post(Endpoints.END_LISTEN, params),
  });
}

export function useEndSpeakMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: EndSpeakParams) => {
      const formData = new FormData();
      // React Native FormData accepts URI-based file objects
      formData.append('file', {
        uri: params.fileUri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      } as unknown as Blob);
      formData.append('template', params.template);
      formData.append('transcript', params.transcript);
      formData.append('score', String(params.score));
      formData.append('score_data', params.score_data);
      formData.append('character_id', String(params.character_id));
      formData.append('sentence_id', String(params.sentence_id));
      formData.append('paragraph_id', String(params.paragraph_id));
      if (params.member_exercise_token) {
        formData.append('member_exercise_token', params.member_exercise_token);
      }
      if (params.action !== undefined) {
        formData.append('action', String(params.action));
      }

      return apiClient.post<
        unknown,
        ApiResponse<{ sentenceScore: SentenceScoreEntity; member_token: number }>
      >(Endpoints.END_SPEAK, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });
}

export function useBackSentenceMutation() {
  return useMutation({
    mutationFn: (params: { paragraph_id: number; sentence_id: number; action: number }) =>
      apiClient.post(Endpoints.BACK_SENTENCE, params),
  });
}

export function useTranslateMutation() {
  return useMutation({
    mutationFn: (params: { sentence_id: number }) =>
      apiClient.post(Endpoints.TRANSLATE_SENTENCE, params),
  });
}

export function useDictionaryMutation() {
  return useMutation({
    mutationFn: (params: { word: string }) => apiClient.post(Endpoints.DICTIONARY, params),
  });
}

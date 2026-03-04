import { useQuery } from '@tanstack/react-query';
import apiClient from '../client';
import { Endpoints } from '../endpoints';
import type { SentenceListResponse } from '../types';

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
      apiClient.get<unknown, { data: SentenceListResponse }>(Endpoints.SENTENCE_LIST_V1, {
        params,
      }),
    select: (res) => res.data,
    enabled: !!params?.paragraph_id,
    staleTime: Infinity,
  });
}

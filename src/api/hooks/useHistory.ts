import { useQuery } from '@tanstack/react-query';
import apiClient from '../client';
import { Endpoints } from '../endpoints';
import type { ApiResponse, HistoryParagraphEntity } from '../types';

export function useHistory() {
  return useQuery({
    queryKey: ['history'],
    queryFn: () =>
      apiClient.get<unknown, ApiResponse<HistoryParagraphEntity[]>>(Endpoints.HISTORY_LIST),
    select: (res) => res.data,
  });
}

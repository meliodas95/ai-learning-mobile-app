import { useQuery } from '@tanstack/react-query';
import apiClient from '@/src/api/client';
import { Endpoints } from '@/src/api/endpoints';
import type { ApiResponse, HistoryParagraphEntity } from '@/src/api/types';

export function useHistory() {
  return useQuery({
    queryKey: ['history'],
    queryFn: () =>
      apiClient.get<unknown, ApiResponse<HistoryParagraphEntity[]>>(Endpoints.HISTORY_LIST),
    select: (res) => res.data,
  });
}

import { useQuery } from '@tanstack/react-query';
import apiClient from '../client';
import { Endpoints } from '../endpoints';
import type { HistoryItem } from '../types';

export function useHistory() {
  return useQuery({
    queryKey: ['history'],
    queryFn: () =>
      apiClient.get<unknown, { data: HistoryItem[] }>(Endpoints.HISTORY_LIST),
    select: (res) => res.data,
  });
}

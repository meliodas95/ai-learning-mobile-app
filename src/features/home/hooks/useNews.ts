import { useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '@/src/api/client';
import { Endpoints } from '@/src/api/endpoints';
import type { NewsItem } from '@/src/api/types';

const PAGE_SIZE = 15;

interface NewsApiResponse {
  data: {
    News: NewsItem[];
    total: number;
  };
}

export function useNews() {
  return useInfiniteQuery({
    queryKey: ['news'],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await apiClient.get<unknown, NewsApiResponse>(
        `${Endpoints.NEWS_LIST}?includes=total&limit=${PAGE_SIZE}&offset=${pageParam}`,
      );
      const news = res?.data?.News ?? [];
      const total = res?.data?.total ?? 0;
      return { news, total };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.news.length, 0);
      return loaded < lastPage.total && lastPage.news.length > 0 ? loaded : undefined;
    },
  });
}

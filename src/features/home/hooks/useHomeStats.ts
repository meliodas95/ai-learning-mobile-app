import { useQuery } from '@tanstack/react-query';
import apiClient from '@/src/api/client';
import { Endpoints } from '@/src/api/endpoints';
import { useAuthStore } from '@/src/store/authStore';
import type { ReportTotalLearns, ReportLearnItem } from '@/src/api/types';

function getTimestampRange(days: number) {
  const now = Math.floor(Date.now() / 1000);
  const start = now - days * 24 * 60 * 60;
  return { start_at: start, end_at: now };
}

export function useHomeStats() {
  const member = useAuthStore((s) => s.member);

  return useQuery({
    queryKey: ['homeStats', member?.id],
    queryFn: async () => {
      const res = await apiClient.get<unknown, { data: ReportTotalLearns }>(
        Endpoints.REPORT_TOTAL_LEARNS,
        { params: { member_id: member?.id, ...getTimestampRange(365) } },
      );
      return (res?.data ?? null) as ReportTotalLearns | null;
    },
    enabled: !!member?.id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useWeeklyLearns() {
  const member = useAuthStore((s) => s.member);

  return useQuery({
    queryKey: ['weeklyLearns', member?.id],
    queryFn: async () => {
      const res = await apiClient.get<unknown, { data: { report_learns?: ReportLearnItem[] } }>(
        Endpoints.REPORT_LEARNS,
        { params: { member_id: member?.id, type: 2, ...getTimestampRange(7) } },
      );
      return res?.data?.report_learns ?? [];
    },
    enabled: !!member?.id,
    staleTime: 5 * 60 * 1000,
  });
}

import { format, formatDistanceToNow } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';

export function formatDate(date: string | Date, locale: 'vi' | 'en' = 'vi'): string {
  return format(new Date(date), 'dd/MM/yyyy', {
    locale: locale === 'vi' ? vi : enUS,
  });
}

export function formatRelativeTime(date: string | Date, locale: 'vi' | 'en' = 'vi'): string {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: locale === 'vi' ? vi : enUS,
  });
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

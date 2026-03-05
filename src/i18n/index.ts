import { useCallback } from 'react';
import { FALLBACK_LOCALE } from '@/src/constants';
import { useSettingsStore } from '@/src/store/settingsStore';
import en from './locales/en';
import vi from './locales/vi';

type Locale = 'vi' | 'en';

const translations: Record<Locale, Record<string, unknown>> = { en, vi };

function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const result = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
  return typeof result === 'string' ? result : undefined;
}

function interpolate(str: string, params?: Record<string, string | number>): string {
  if (!params) return str;
  return str.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(params[key] ?? ''));
}

export function translate(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>,
): string {
  const value =
    getNestedValue(translations[locale], key) ??
    getNestedValue(translations[FALLBACK_LOCALE], key) ??
    key;
  return interpolate(value, params);
}

export function useI18n() {
  const locale = useSettingsStore((s) => s.locale);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => translate(locale, key, params),
    [locale],
  );

  return { t, locale };
}

import { colors } from './theme/colors';

// === Query ===
export const QUERY_STALE_TIME = 5 * 60 * 1000; // 5 minutes
export const QUERY_GC_TIME = 30 * 60 * 1000; // 30 minutes
export const QUERY_RETRY_COUNT = 2;

// === API ===
export const API_TIMEOUT = 30_000; // 30 seconds

// === SecureStore Keys ===
export const SECURE_STORE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  ACCOUNT_TOKEN: 'accountToken',
} as const;

// === Storage Keys ===
export const STORAGE_KEYS = {
  LOCALE: 'locale',
  SHOW_TRANSLATION: 'showTranslation',
  AUTO_PLAY: 'autoPlay',
} as const;

// === Score Thresholds ===
export const SCORE_THRESHOLD = {
  LOW: 50,
  MEDIUM: 80,
} as const;

export const SCORE_COLORS = {
  red: colors.scoreRed,
  yellow: colors.scoreYellow,
  green: colors.scoreGreen,
} as const;

// === UI ===
export const TAB_BAR_HEIGHT = 60;
export const TAB_BAR_PADDING_BOTTOM = 8;
export const TAB_BAR_PADDING_TOP = 4;
export const TAB_BAR_FONT_SIZE = 11;
export const BORDER_RADIUS = 12;
export const HOME_RECENT_COURSES_LIMIT = 5;

// === Lesson ===
export const PROCESS_QUIZ_COMPLETED = 2;
export const DEFAULT_CHARACTER_NAME = 'Unknown';

// === Default Locale ===
export const DEFAULT_LOCALE = 'vi' as const;
export const FALLBACK_LOCALE = 'en' as const;

# Learning AI App - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a mobile English learning app (Expo + React Native) that ports and refactors the longan web app's core learning features (Listen, Speaking, Word, Exercise) with clean architecture, TypeScript strict mode, and modern minimal UI using React Native Paper.

**Architecture:** Feature-based module structure with Expo Router v4 for file-based navigation, 3 Zustand stores (auth, learning, settings), TanStack Query v5 for all server state, and a clean API abstraction layer over the existing api.langenter.com backend. The 1084-line speaking hook is decomposed into a state machine pattern with 3 focused hooks.

**Tech Stack:** Expo SDK 52+, React Native, React Native Paper v5 (MD3), Zustand v5, TanStack Query v5, Axios, expo-av, @react-native-voice/voice, fuzzball, crypto-js, react-native-mmkv, expo-secure-store, i18next, react-hook-form + zod, bun

---

## Phase 1: Project Scaffolding & Core Setup

### Task 1: Initialize Expo Project

**Files:**

- Create: `package.json`
- Create: `app.json`
- Create: `tsconfig.json`
- Create: `babel.config.js`
- Create: `.gitignore`

**Step 1: Create Expo project with bun**

```bash
cd /Users/tuaansanh/WebstormProjects/learning-ai-app
bunx create-expo-app@latest . --template tabs
```

If the directory already has files, clean first or use `--yes` flag. Select "Tabs" template for bottom tab navigation.

**Step 2: Configure TypeScript strict mode**

Update `tsconfig.json`:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Step 3: Verify project runs**

```bash
bun run start
```

Expected: Expo dev server starts, QR code displayed.

**Step 4: Commit**

```bash
git init
git add .
git commit -m "chore: initialize Expo project with TypeScript strict mode"
```

---

### Task 2: Install Core Dependencies

**Files:**

- Modify: `package.json`

**Step 1: Install UI & state management**

```bash
bun add react-native-paper react-native-safe-area-context react-native-vector-icons
bun add zustand @tanstack/react-query
bun add axios
bun add react-native-mmkv expo-secure-store
```

**Step 2: Install media & speech**

```bash
bun add expo-av @react-native-voice/voice
bun add react-native-reanimated
```

**Step 3: Install utility libraries**

```bash
bun add fuzzball crypto-js
bun add i18next react-i18next
bun add react-hook-form @hookform/resolvers zod
bun add date-fns
bun add -d @types/crypto-js @types/react-native-vector-icons
```

**Step 4: Configure babel for reanimated**

Update `babel.config.js`:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

**Step 5: Verify build**

```bash
bun run start --clear
```

Expected: No errors, app loads.

**Step 6: Commit**

```bash
git add package.json bun.lockb babel.config.js
git commit -m "chore: install core dependencies"
```

---

### Task 3: Set Up Theme & Paper Provider

**Files:**

- Create: `src/theme/colors.ts`
- Create: `src/theme/index.ts`
- Modify: `app/_layout.tsx`

**Step 1: Create color palette**

Create `src/theme/colors.ts`:

```typescript
export const colors = {
  primary: '#1A1A2E',
  secondary: '#16213E',
  tertiary: '#0F3460',
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F7',
  background: '#FAFAFA',
  outline: '#E0E0E0',
  onPrimary: '#FFFFFF',
  onSurface: '#1A1A2E',
  onSurfaceVariant: '#6B7280',
  error: '#E53935',
  success: '#43A047',
  warning: '#FB8C00',
  scoreRed: '#E53935',
  scoreYellow: '#FB8C00',
  scoreGreen: '#43A047',
} as const;

export type AppColors = typeof colors;
```

**Step 2: Create Paper MD3 theme**

Create `src/theme/index.ts`:

```typescript
import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { colors } from './colors';

const fontConfig = {
  displayLarge: {
    fontFamily: 'System',
    fontSize: 57,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: 'System',
    fontSize: 45,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 44,
  },
  headlineLarge: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineSmall: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 32,
  },
  titleLarge: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '500' as const,
    letterSpacing: 0,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  bodyLarge: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  labelLarge: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelSmall: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    tertiary: colors.tertiary,
    surface: colors.surface,
    surfaceVariant: colors.surfaceVariant,
    background: colors.background,
    outline: colors.outline,
    onPrimary: colors.onPrimary,
    onSurface: colors.onSurface,
    onSurfaceVariant: colors.onSurfaceVariant,
    error: colors.error,
  },
  fonts: configureFonts({ config: fontConfig }),
  roundness: 12,
};

export type AppTheme = typeof theme;
```

**Step 3: Wrap app with PaperProvider**

Update `app/_layout.tsx` to wrap the root layout with `PaperProvider` and `QueryClientProvider`:

```typescript
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from '@/src/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

// Wrap existing layout content:
// <QueryClientProvider client={queryClient}>
//   <PaperProvider theme={theme}>
//     {existingContent}
//   </PaperProvider>
// </QueryClientProvider>
```

**Step 4: Verify theme renders**

```bash
bun run start --clear
```

Expected: App loads with custom theme applied.

**Step 5: Commit**

```bash
git add src/theme/ app/_layout.tsx
git commit -m "feat: add Paper MD3 theme with modern minimal palette"
```

---

### Task 4: Set Up i18n

**Files:**

- Create: `src/i18n/index.ts`
- Create: `src/i18n/locales/en.ts`
- Create: `src/i18n/locales/vi.ts`

**Step 1: Create locale files**

Create `src/i18n/locales/en.ts`:

```typescript
export default {
  common: {
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Retry',
    cancel: 'Cancel',
    save: 'Save',
    back: 'Back',
    next: 'Next',
    finish: 'Finish',
    start: 'Start',
  },
  auth: {
    login: 'Login',
    phone: 'Phone number',
    password: 'Password',
    otp: 'Enter OTP',
    register: 'Register',
    logout: 'Logout',
    fullName: 'Full name',
  },
  tabs: {
    home: 'Home',
    courses: 'Courses',
    history: 'History',
    profile: 'Profile',
  },
  learn: {
    listen: 'Listen',
    speaking: 'Speaking',
    word: 'Word',
    exercise: 'Exercise',
    score: 'Score',
    recording: 'Recording...',
    tapToRecord: 'Tap to record',
    tryAgain: 'Try again',
    wellDone: 'Well done!',
    keepPracticing: 'Keep practicing',
    excellent: 'Excellent!',
    continueLesson: 'Continue',
    finishLesson: 'Finish Lesson',
    startLesson: 'Start Lesson',
    noBalance: 'Insufficient tokens',
  },
  home: {
    greeting: 'Hello',
    continueLearning: 'Continue Learning',
    recentCourses: 'Recent Courses',
    dailyStats: "Today's Progress",
  },
} as const;
```

Create `src/i18n/locales/vi.ts`:

```typescript
export default {
  common: {
    loading: 'Đang tải...',
    error: 'Đã xảy ra lỗi',
    retry: 'Thử lại',
    cancel: 'Hủy',
    save: 'Lưu',
    back: 'Quay lại',
    next: 'Tiếp',
    finish: 'Hoàn thành',
    start: 'Bắt đầu',
  },
  auth: {
    login: 'Đăng nhập',
    phone: 'Số điện thoại',
    password: 'Mật khẩu',
    otp: 'Nhập mã OTP',
    register: 'Đăng ký',
    logout: 'Đăng xuất',
    fullName: 'Họ và tên',
  },
  tabs: {
    home: 'Trang chủ',
    courses: 'Khóa học',
    history: 'Lịch sử',
    profile: 'Cá nhân',
  },
  learn: {
    listen: 'Nghe',
    speaking: 'Nói',
    word: 'Từ vựng',
    exercise: 'Bài tập',
    score: 'Điểm',
    recording: 'Đang ghi âm...',
    tapToRecord: 'Nhấn để ghi âm',
    tryAgain: 'Thử lại',
    wellDone: 'Tốt lắm!',
    keepPracticing: 'Cố gắng hơn',
    excellent: 'Xuất sắc!',
    continueLesson: 'Tiếp tục',
    finishLesson: 'Hoàn thành bài',
    startLesson: 'Bắt đầu học',
    noBalance: 'Hết lượt học',
  },
  home: {
    greeting: 'Xin chào',
    continueLearning: 'Tiếp tục học',
    recentCourses: 'Khóa học gần đây',
    dailyStats: 'Tiến độ hôm nay',
  },
} as const;
```

**Step 2: Configure i18next**

Create `src/i18n/index.ts`:

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import vi from './locales/vi';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi },
  },
  lng: 'vi',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
```

**Step 3: Import i18n in root layout**

Add to `app/_layout.tsx`:

```typescript
import '@/src/i18n';
```

**Step 4: Commit**

```bash
git add src/i18n/
git commit -m "feat: add i18n with Vietnamese and English locales"
```

---

## Phase 2: API Layer & Types

### Task 5: Define TypeScript Types

**Files:**

- Create: `src/api/types.ts`

**Step 1: Create typed models**

Port and clean up types from longan's `/types/model.ts`. Create `src/api/types.ts`:

```typescript
// === Entity Types ===

export interface CourseEntity {
  id: number;
  title: string;
  title_vi?: string;
  status: number;
  study_type?: string;
  documents?: DocumentEntity[];
}

export interface DocumentEntity {
  id: number;
  title: string;
  keyx?: string;
  status: number;
  course_id: number;
  paragraphs: ParagraphEntity[];
  course: CourseEntity;
}

export interface ParagraphEntity {
  id: number;
  title: string;
  keyx?: string;
  status: number;
  document_id: number;
  course_id: number;
  type: ParagraphType;
  position: number;
  description?: string;
  image?: string;
  keywords?: string;
  process_quiz?: number;
  process_approve?: number;
  is_favourite?: boolean;
  account_id?: number;
}

export type ParagraphType = 'conversation' | 'essay' | 'gallery' | 'video';

export interface SentenceEntity {
  id: number;
  content: string;
  status: number;
  course_id: number;
  paragraph_id: number;
  character_id: number;
  start?: number;
  end?: number;
  character_name?: string;
  words?: string;
  words_arr?: string[];
  process_audio: number;
  process_content: number;
  score?: number;
  color?: ScoreColor;
  audios?: AudioEntity[];
  translation?: TranslationItem;
  sentence_group_id?: number;
  group?: number;
  position: number;
}

export interface AudioEntity {
  id: number;
  sentence_id: number;
  voice_id: number;
  accent_id: number;
  duration: number;
  url: string;
  transcription_id?: number;
  length?: number;
  process: number;
}

export interface CharacterEntity {
  id: number;
  voice_id?: number;
  fullname: string;
  gender?: string;
  accent?: string;
  age?: number;
  sentence_current_id?: number;
}

export interface TranslationItem {
  id?: number;
  sentence_id?: number;
  content?: string;
  language?: string;
  translate_google?: string;
  status?: number;
  type?: string;
}

export interface SentenceScoreEntity {
  id: number;
  sentence_id: number;
  character_id: number;
  score: number;
  color: ScoreColor;
  content?: string;
  member_token?: number;
}

export interface MemberEntity {
  id: number;
  fullname: string;
  avatar?: string;
  token: number;
  is_main: boolean;
  account_id: number;
}

export interface DictionaryWord {
  lemma: string;
  pos: string;
  definitions?: string[];
  examples?: string[];
  pronunciation?: string;
}

// === Enums ===

export type ScoreColor = 'red' | 'yellow' | 'green';

export enum LearnTab {
  LISTEN = 'listen',
  SPEAKING = 'speaking',
  WORD = 'word',
  EXERCISE = 'exercise',
}

export enum SpeakingState {
  IDLE = 'idle',
  LISTENING = 'listening',
  COUNTDOWN = 'countdown',
  RECORDING = 'recording',
  SCORING = 'scoring',
  SCORED = 'scored',
  FINISHED = 'finished',
}

// === API Response Types ===

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface SentenceListResponse {
  sentences: SentenceEntity[];
  characters: CharacterEntity[];
  listen_sentence_current_id?: number;
  paragraph_current_id?: number;
  total: number;
}

export interface ParagraphDetailResponse {
  paragraph?: ParagraphEntity;
  sentences: SentenceEntity[];
  characters: CharacterEntity[];
  listen_sentence_current_id?: number;
}

export interface LoginResponse {
  account: {
    id: number;
    phone: string;
    fullname: string;
  };
  member: MemberEntity;
  members: MemberEntity[];
  member_categories: string[];
  account_token: string;
  member_token: string;
}

export interface BalanceResponse {
  member_token: number;
}

export interface ExerciseQuestion {
  id: number;
  content: string;
  type: string;
  answers: ExerciseAnswer[];
  group?: number;
}

export interface ExerciseAnswer {
  id: number;
  content: string;
  is_correct: boolean;
  type: 'text' | 'audio' | 'image';
}

// === Conversation grouping ===

export interface ConversationGroup {
  characterId: number;
  characterName: string;
  sentences: SentenceEntity[];
}

export function groupSentencesByCharacter(sentences: SentenceEntity[]): ConversationGroup[] {
  const groups: ConversationGroup[] = [];
  let currentGroup: ConversationGroup | null = null;

  for (const sentence of sentences) {
    if (!currentGroup || currentGroup.characterId !== sentence.character_id) {
      currentGroup = {
        characterId: sentence.character_id,
        characterName: sentence.character_name ?? 'Unknown',
        sentences: [],
      };
      groups.push(currentGroup);
    }
    currentGroup.sentences.push(sentence);
  }

  return groups;
}
```

**Step 2: Commit**

```bash
git add src/api/types.ts
git commit -m "feat: add typed API models and enums"
```

---

### Task 6: Create API Client & Endpoints

**Files:**

- Create: `src/api/client.ts`
- Create: `src/api/endpoints.ts`

**Step 1: Create typed endpoints**

Create `src/api/endpoints.ts`:

```typescript
export const API_BASE_URL = 'https://api.langenter.com';

export const Endpoints = {
  // Auth
  LOGIN: '/v1/api/account/login',
  LOGIN_MEMBER: '/v1/api/account/members/login',
  REGISTER_SEND_OTP: '/v1/api/account/register/send-otp',
  REGISTER_VERIFY_OTP: '/v1/api/account/register/verify-otp',
  REGISTER_SAVE_PASSWORD: '/v1/api/account/register/save-password',
  FORGOT_PASSWORD: '/v1/api/account/forgot-password',

  // Courses & Content
  COURSE_LIST: '/v1/api/library/courses',
  DOCUMENT_LIST: '/v1/api/library/documents',
  PARAGRAPH_LIST: '/v1/api/library/paragraphs',
  PARAGRAPH_DETAIL_V3: '/v3/api/library/paragraphs',

  // Sentences
  SENTENCE_LIST_V1: '/v1/api/library/sentences',
  SENTENCE_LIST_V3: '/v3/api/library/sentences',

  // Learning Actions
  START_PARAGRAPH: '/v1/api/transaction/start-paragraph',
  END_LISTEN: '/v1/api/library/learn/listen/end',
  END_SPEAK: '/v1/api/library/learn/speak/end',
  BACK_SENTENCE: '/v1/api/transaction/learn/back-sentence',
  SPEAK_LIST: '/v1/api/library/learn/speak/list',

  // Translation & Dictionary
  TRANSLATE_SENTENCE: '/v1/api/library/learn/translate/sentence',
  DICTIONARY: '/v1/api/library/learn/dictionary',

  // Members & Profile
  MEMBER_LIST: '/v1/api/account/members',
  MEMBER_CATEGORIES: '/v1/api/account/categories',
  UPDATE_ACCOUNT: '/v1/api/account/update-account',

  // Transactions & Reports
  REPORT_TOKENS: '/v1/api/transaction/report/report-tokens',
  MEMBER_TOKEN_LIST: '/v1/api/transaction/report-member-token/list',
  HISTORY_LIST: '/v1/api/transaction/history/list',
  HISTORY_DETAIL: '/v1/api/transaction/history/detail',

  // Exercises
  EXERCISE_LIST: '/v1/api/config/account-exercises',

  // Favourites
  FAVOURITE_ADD: '/v1/api/library/paragraphs/favourite',
  FAVOURITE_LIST: '/v1/api/library/paragraphs/favourites',
} as const;
```

**Step 2: Create Axios client with interceptors**

Create `src/api/client.ts`:

```typescript
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, Endpoints } from './endpoints';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let getAccessToken: (() => string | null) | null = null;

export function setTokenGetter(getter: () => string | null) {
  getAccessToken = getter;
}

// Request interceptor: inject auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const isLoginEndpoint = config.url === Endpoints.LOGIN || config.url === Endpoints.LOGIN_MEMBER;

    if (!isLoginEndpoint && getAccessToken) {
      const token = getAccessToken();
      if (token) {
        config.headers.set('x-access-token', token);
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: extract data
apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired - will be handled by auth store
    }
    return Promise.reject(error.response ?? error);
  },
);

export default apiClient;
```

**Step 3: Commit**

```bash
git add src/api/client.ts src/api/endpoints.ts
git commit -m "feat: add API client with typed endpoints and auth interceptor"
```

---

### Task 7: Create API Query Hooks

**Files:**

- Create: `src/api/hooks/useAuth.ts`
- Create: `src/api/hooks/useCourses.ts`
- Create: `src/api/hooks/useLearning.ts`
- Create: `src/api/hooks/useSentences.ts`

**Step 1: Create auth API hooks**

Create `src/api/hooks/useAuth.ts`:

```typescript
import { useMutation } from '@tanstack/react-query';
import apiClient from '../client';
import { Endpoints } from '../endpoints';
import type { LoginResponse } from '../types';

interface LoginParams {
  phone: string;
  password: string;
}

interface MemberLoginParams {
  token: string;
  password: string;
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: (params: LoginParams) =>
      apiClient.post<unknown, LoginResponse>(Endpoints.LOGIN, params),
  });
}

export function useMemberLoginMutation() {
  return useMutation({
    mutationFn: (params: MemberLoginParams) =>
      apiClient.post<unknown, LoginResponse>(Endpoints.LOGIN_MEMBER, params),
  });
}

export function useSendOtpMutation() {
  return useMutation({
    mutationFn: (params: { phone: string; fullname: string; device_id: string }) =>
      apiClient.post(Endpoints.REGISTER_SEND_OTP, params),
  });
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: (params: { phone: string; otp: string; device_id: string }) =>
      apiClient.post(Endpoints.REGISTER_VERIFY_OTP, params),
  });
}

export function useSavePasswordMutation() {
  return useMutation({
    mutationFn: (params: { password: string; access_token: string }) =>
      apiClient.post(Endpoints.REGISTER_SAVE_PASSWORD, params),
  });
}
```

**Step 2: Create courses API hooks**

Create `src/api/hooks/useCourses.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import apiClient from '../client';
import { Endpoints } from '../endpoints';
import type {
  CourseEntity,
  DocumentEntity,
  ParagraphEntity,
  ParagraphDetailResponse,
} from '../types';

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: () => apiClient.get<unknown, { data: CourseEntity[] }>(Endpoints.COURSE_LIST),
    select: (res) => res.data,
  });
}

export function useDocuments(courseId: number | undefined) {
  return useQuery({
    queryKey: ['documents', courseId],
    queryFn: () =>
      apiClient.get<unknown, { data: DocumentEntity[] }>(Endpoints.DOCUMENT_LIST, {
        params: { course_id: courseId },
      }),
    select: (res) => res.data,
    enabled: !!courseId,
  });
}

export function useParagraphs(documentId: number | undefined) {
  return useQuery({
    queryKey: ['paragraphs', documentId],
    queryFn: () =>
      apiClient.get<unknown, { data: ParagraphEntity[] }>(Endpoints.PARAGRAPH_LIST, {
        params: { document_id: documentId },
      }),
    select: (res) => res.data,
    enabled: !!documentId,
  });
}

export function useParagraphDetail(paragraphId: number | undefined) {
  return useQuery({
    queryKey: ['paragraph', paragraphId],
    queryFn: () =>
      apiClient.get<unknown, { data: ParagraphDetailResponse }>(
        `${Endpoints.PARAGRAPH_DETAIL_V3}/${paragraphId}`,
      ),
    select: (res) => res.data,
    enabled: !!paragraphId,
    retry: false,
  });
}
```

**Step 3: Create sentences API hooks**

Create `src/api/hooks/useSentences.ts`:

```typescript
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
```

**Step 4: Create learning mutation hooks**

Create `src/api/hooks/useLearning.ts`:

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import { Endpoints } from '../endpoints';
import type { SentenceScoreEntity, BalanceResponse } from '../types';

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
  file: Blob;
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
      formData.append('file', params.file);
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
        { data: { sentenceScore: SentenceScoreEntity; member_token: number } }
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

export function useTranslateSentenceMutation() {
  return useMutation({
    mutationFn: (params: { sentence_id: number }) =>
      apiClient.post(Endpoints.TRANSLATE_SENTENCE, params),
  });
}

export function useDictionaryQuery(word: string | undefined) {
  return useMutation({
    mutationFn: (params: { word: string }) => apiClient.post(Endpoints.DICTIONARY, params),
  });
}
```

**Step 5: Commit**

```bash
git add src/api/hooks/
git commit -m "feat: add TanStack Query hooks for auth, courses, sentences, learning"
```

---

## Phase 3: State Management

### Task 8: Create Zustand Stores

**Files:**

- Create: `src/store/authStore.ts`
- Create: `src/store/learningStore.ts`
- Create: `src/store/settingsStore.ts`

**Step 1: Create auth store**

Create `src/store/authStore.ts`:

```typescript
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { MemberEntity, LoginResponse } from '@/src/api/types';
import { setTokenGetter } from '@/src/api/client';

interface AuthState {
  user: { id: number; phone: string; fullname: string } | null;
  member: MemberEntity | null;
  members: MemberEntity[];
  accessToken: string | null;
  accountToken: string | null;
  memberToken: string | null;
  memberCategories: string[];
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (data: LoginResponse) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Wire up token getter for API client
  setTokenGetter(() => get().accessToken);

  return {
    user: null,
    member: null,
    members: [],
    accessToken: null,
    accountToken: null,
    memberToken: null,
    memberCategories: [],
    isAuthenticated: false,
    isLoading: true,

    setAuth: async (data: LoginResponse) => {
      const token = data.member_token;
      await SecureStore.setItemAsync('accessToken', token);
      await SecureStore.setItemAsync('accountToken', data.account_token);

      set({
        user: data.account,
        member: data.member,
        members: data.members,
        accessToken: token,
        accountToken: data.account_token,
        memberToken: token,
        memberCategories: data.member_categories,
        isAuthenticated: true,
        isLoading: false,
      });
    },

    logout: async () => {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('accountToken');
      set({
        user: null,
        member: null,
        members: [],
        accessToken: null,
        accountToken: null,
        memberToken: null,
        memberCategories: [],
        isAuthenticated: false,
        isLoading: false,
      });
    },

    loadStoredAuth: async () => {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
          set({ accessToken: token, isAuthenticated: true, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      } catch {
        set({ isLoading: false });
      }
    },
  };
});
```

**Step 2: Create learning store**

Create `src/store/learningStore.ts`:

```typescript
import { create } from 'zustand';
import type {
  SentenceEntity,
  CharacterEntity,
  SentenceScoreEntity,
  ParagraphEntity,
  LearnTab,
  SpeakingState,
  ConversationGroup,
} from '@/src/api/types';

interface LearningState {
  // Lesson data
  activeTab: LearnTab;
  paragraph: ParagraphEntity | null;
  sentences: SentenceEntity[];
  characters: CharacterEntity[];
  conversationGroups: ConversationGroup[];

  // Navigation
  currentSentenceIndex: number;
  currentGroupIndex: number;
  listenCurrentId: number | null;

  // Speaking
  speakingState: SpeakingState;
  activeCharacter: CharacterEntity | null;
  currentScore: SentenceScoreEntity | null;

  // Balance
  tokenBalance: number;

  // Flags
  isFinished: boolean;

  // Actions
  setActiveTab: (tab: LearnTab) => void;
  setParagraph: (p: ParagraphEntity) => void;
  setSentences: (sentences: SentenceEntity[], characters: CharacterEntity[]) => void;
  setCurrentSentenceIndex: (index: number) => void;
  nextSentence: () => void;
  prevSentence: () => void;
  setSpeakingState: (state: SpeakingState) => void;
  setActiveCharacter: (char: CharacterEntity | null) => void;
  setCurrentScore: (score: SentenceScoreEntity | null) => void;
  setTokenBalance: (balance: number) => void;
  deductToken: (amount: number) => void;
  setFinished: (finished: boolean) => void;
  reset: () => void;
}

const initialState = {
  activeTab: 'listen' as LearnTab,
  paragraph: null,
  sentences: [],
  characters: [],
  conversationGroups: [],
  currentSentenceIndex: 0,
  currentGroupIndex: 0,
  listenCurrentId: null,
  speakingState: 'idle' as SpeakingState,
  activeCharacter: null,
  currentScore: null,
  tokenBalance: 0,
  isFinished: false,
};

export const useLearningStore = create<LearningState>((set, get) => ({
  ...initialState,

  setActiveTab: (tab) => set({ activeTab: tab }),

  setParagraph: (paragraph) => set({ paragraph }),

  setSentences: (sentences, characters) => {
    const groups: ConversationGroup[] = [];
    let current: ConversationGroup | null = null;
    for (const s of sentences) {
      if (!current || current.characterId !== s.character_id) {
        current = {
          characterId: s.character_id,
          characterName: s.character_name ?? 'Unknown',
          sentences: [],
        };
        groups.push(current);
      }
      current.sentences.push(s);
    }
    set({ sentences, characters, conversationGroups: groups });
  },

  setCurrentSentenceIndex: (index) => set({ currentSentenceIndex: index }),

  nextSentence: () => {
    const { currentSentenceIndex, sentences } = get();
    if (currentSentenceIndex < sentences.length - 1) {
      set({ currentSentenceIndex: currentSentenceIndex + 1 });
    }
  },

  prevSentence: () => {
    const { currentSentenceIndex } = get();
    if (currentSentenceIndex > 0) {
      set({ currentSentenceIndex: currentSentenceIndex - 1 });
    }
  },

  setSpeakingState: (speakingState) => set({ speakingState }),
  setActiveCharacter: (activeCharacter) => set({ activeCharacter }),
  setCurrentScore: (currentScore) => set({ currentScore }),
  setTokenBalance: (tokenBalance) => set({ tokenBalance }),
  deductToken: (amount) => set((s) => ({ tokenBalance: s.tokenBalance - amount })),
  setFinished: (isFinished) => set({ isFinished }),

  reset: () => set(initialState),
}));
```

**Step 3: Create settings store**

Create `src/store/settingsStore.ts`:

```typescript
import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

interface SettingsState {
  locale: 'vi' | 'en';
  showTranslation: boolean;
  autoPlay: boolean;

  setLocale: (locale: 'vi' | 'en') => void;
  setShowTranslation: (show: boolean) => void;
  setAutoPlay: (auto: boolean) => void;
  loadSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  locale: (storage.getString('locale') as 'vi' | 'en') ?? 'vi',
  showTranslation: storage.getBoolean('showTranslation') ?? true,
  autoPlay: storage.getBoolean('autoPlay') ?? false,

  setLocale: (locale) => {
    storage.set('locale', locale);
    set({ locale });
  },

  setShowTranslation: (showTranslation) => {
    storage.set('showTranslation', showTranslation);
    set({ showTranslation });
  },

  setAutoPlay: (autoPlay) => {
    storage.set('autoPlay', autoPlay);
    set({ autoPlay });
  },

  loadSettings: () => {
    set({
      locale: (storage.getString('locale') as 'vi' | 'en') ?? 'vi',
      showTranslation: storage.getBoolean('showTranslation') ?? true,
      autoPlay: storage.getBoolean('autoPlay') ?? false,
    });
  },
}));
```

**Step 4: Commit**

```bash
git add src/store/
git commit -m "feat: add Zustand stores for auth, learning, and settings"
```

---

## Phase 4: Utilities

### Task 9: Create Utility Functions

**Files:**

- Create: `src/utils/similarity.ts`
- Create: `src/utils/encryption.ts`
- Create: `src/utils/formatters.ts`
- Create: `src/utils/score.ts`

**Step 1: Create similarity scoring**

Create `src/utils/similarity.ts`:

```typescript
import fuzzball from 'fuzzball';

export function calculateSimilarity(userTranscript: string, template: string): number {
  const normalizedUser = userTranscript.toLowerCase().trim();
  const normalizedTemplate = template.toLowerCase().trim();

  if (!normalizedUser || !normalizedTemplate) return 0;

  return fuzzball.ratio(normalizedUser, normalizedTemplate);
}
```

**Step 2: Create score encryption**

Create `src/utils/encryption.ts`:

```typescript
import CryptoJS from 'crypto-js';

const KEY_3DES = 'langenterakMyGwqeKVEQjUi';

export function encryptScoreData(transcript: string, score: number, recordTime: number): string {
  const plainText = `${transcript}|${score}|${recordTime}`;
  return CryptoJS.TripleDES.encrypt(plainText, KEY_3DES).toString();
}
```

**Step 3: Create score color helper**

Create `src/utils/score.ts`:

```typescript
import type { ScoreColor } from '@/src/api/types';
import { colors } from '@/src/theme/colors';

export function getScoreColor(score: number): ScoreColor {
  if (score < 50) return 'red';
  if (score < 80) return 'yellow';
  return 'green';
}

export function getScoreHex(score: number): string {
  if (score < 50) return colors.scoreRed;
  if (score < 80) return colors.scoreYellow;
  return colors.scoreGreen;
}

export function getScoreMessage(score: number, t: (key: string) => string): string {
  if (score < 50) return t('learn.keepPracticing');
  if (score < 80) return t('learn.wellDone');
  return t('learn.excellent');
}
```

**Step 4: Create formatters**

Create `src/utils/formatters.ts`:

```typescript
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
```

**Step 5: Commit**

```bash
git add src/utils/
git commit -m "feat: add utility functions for scoring, encryption, and formatting"
```

---

## Phase 5: Auth Screens

### Task 10: Create Auth Flow

**Files:**

- Modify: `app/_layout.tsx` (add auth redirect logic)
- Create: `app/(auth)/_layout.tsx`
- Create: `app/(auth)/login.tsx`
- Create: `app/(auth)/otp.tsx`
- Create: `app/(tabs)/_layout.tsx`

**Step 1: Update root layout with auth guard**

Update `app/_layout.tsx` to check auth state and redirect:

- If `isLoading` → show splash/loading
- If `!isAuthenticated` → redirect to `/(auth)/login`
- If `isAuthenticated` → show `(tabs)`

Call `loadStoredAuth()` in useEffect on mount.

**Step 2: Create auth layout**

Create `app/(auth)/_layout.tsx`:

```typescript
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="otp" />
    </Stack>
  );
}
```

**Step 3: Create login screen**

Create `app/(auth)/login.tsx`:

- Phone input with Vietnamese format validation (regex: `/(84|0[35789])+(\d{8})\b/`)
- Password input (min 8 chars)
- Login button using Paper `Button`
- Uses `useLoginMutation()` → on success calls `authStore.setAuth(data)`
- Uses `react-hook-form` + `zod` for validation
- Error display via Paper `HelperText`
- Modern minimal design: clean white background, centered card

**Step 4: Create OTP screen**

Create `app/(auth)/otp.tsx`:

- 6-digit OTP input
- Timer countdown for resend
- Verify button
- Uses `useMemberLoginMutation()`
- Navigate back or to login on success

**Step 5: Create tabs layout**

Create `app/(tabs)/_layout.tsx`:

```typescript
import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: t('tabs.courses'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-open-variant" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('tabs.history'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clock-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

**Step 6: Commit**

```bash
git add app/
git commit -m "feat: add auth flow with login, OTP, and tab navigation"
```

---

## Phase 6: Main Tab Screens

### Task 11: Create Home Screen

**Files:**

- Create: `app/(tabs)/index.tsx`
- Create: `src/components/ContinueLearningCard.tsx`

**Step 1: Build home screen**

Create `app/(tabs)/index.tsx`:

- Greeting with user name from `authStore`
- "Continue Learning" card showing last active paragraph
- Daily stats row (placeholder for now)
- Recent courses horizontal `FlatList`
- Uses Paper `Surface`, `Text`, `Card` components
- Pull-to-refresh using `RefreshControl`

**Step 2: Create ContinueLearningCard**

Create `src/components/ContinueLearningCard.tsx`:

- Paper `Card` with paragraph title, course name
- Progress indicator (Paper `ProgressBar`)
- "Continue" button that navigates to `/lesson/[paragraphId]`
- Show placeholder if no recent lesson

**Step 3: Commit**

```bash
git add app/(tabs)/index.tsx src/components/ContinueLearningCard.tsx
git commit -m "feat: add home screen with continue learning and recent courses"
```

---

### Task 12: Create Courses Screen

**Files:**

- Create: `app/(tabs)/courses.tsx`
- Create: `app/course/[courseId].tsx`
- Create: `app/document/[documentId].tsx`

**Step 1: Build courses list**

Create `app/(tabs)/courses.tsx`:

- `FlatList` of courses from `useCourses()`
- Paper `Card` for each course with title
- Search bar using Paper `Searchbar`
- Navigate to course detail on press

**Step 2: Build course detail (documents)**

Create `app/course/[courseId].tsx`:

- Fetch documents via `useDocuments(courseId)`
- List documents, each expandable to show paragraphs
- Navigate to `/lesson/[paragraphId]` on paragraph press

**Step 3: Build document detail (paragraphs)**

Create `app/document/[documentId].tsx`:

- Fetch paragraphs via `useParagraphs(documentId)`
- List with title, type badge, favorite icon
- Navigate to lesson on press

**Step 4: Commit**

```bash
git add app/(tabs)/courses.tsx app/course/ app/document/
git commit -m "feat: add course browsing with documents and paragraphs"
```

---

### Task 13: Create History & Profile Screens

**Files:**

- Create: `app/(tabs)/history.tsx`
- Create: `app/(tabs)/profile.tsx`

**Step 1: Build history screen**

Create `app/(tabs)/history.tsx`:

- Fetch learning history
- `FlatList` with date grouping
- Each item shows: paragraph title, score, date
- Navigate to lesson on press for replay

**Step 2: Build profile screen**

Create `app/(tabs)/profile.tsx`:

- User info card (name, phone)
- Token balance display
- Settings section:
  - Language toggle (vi/en)
  - Show translation toggle
  - Auto-play toggle
- Logout button
- Uses `authStore` and `settingsStore`

**Step 3: Commit**

```bash
git add app/(tabs)/history.tsx app/(tabs)/profile.tsx
git commit -m "feat: add history and profile screens"
```

---

## Phase 7: Lesson Screen & Learning Modes

### Task 14: Create Lesson Container

**Files:**

- Create: `app/lesson/_layout.tsx`
- Create: `app/lesson/[paragraphId].tsx`
- Create: `src/components/LessonTabBar.tsx`

**Step 1: Create lesson layout**

Create `app/lesson/_layout.tsx`:

```typescript
import { Stack } from 'expo-router';

export default function LessonLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
```

**Step 2: Create lesson container**

Create `app/lesson/[paragraphId].tsx`:

- Fetch paragraph detail via `useParagraphDetail(paragraphId)`
- Fetch sentences via `useSentences({ paragraph_id: paragraphId })`
- Initialize `learningStore` with fetched data
- Render `LessonTabBar` + active tab content
- Tab content switches between: ListeningPlayer, SpeakingPlayer, WordList, ExerciseView
- Loading state with Paper `ActivityIndicator`
- Error state with retry
- Cleanup on unmount (`learningStore.reset()`)

**Step 3: Create lesson tab bar**

Create `src/components/LessonTabBar.tsx`:

- Paper `SegmentedButtons` for tab switching
- Tabs: Listen | Speaking | Word | Exercise
- Conditionally show Word tab (only if paragraph has keywords)
- Conditionally show Exercise tab (only if process_quiz === 2)
- Uses `learningStore.activeTab` and `setActiveTab`

**Step 4: Commit**

```bash
git add app/lesson/ src/components/LessonTabBar.tsx
git commit -m "feat: add lesson container with tab navigation"
```

---

### Task 15: Create Listening Feature

**Files:**

- Create: `src/features/listening/useListening.ts`
- Create: `src/features/listening/ListeningPlayer.tsx`
- Create: `src/features/listening/SentenceHighlight.tsx`
- Create: `src/components/VideoPlayer.tsx`

**Step 1: Create VideoPlayer component**

Create `src/components/VideoPlayer.tsx`:

- Wraps `expo-av` `Video` component
- Props: uri, onProgress, onEnd, onReady
- Playback controls (play/pause, seek)
- 16:9 aspect ratio
- Loading overlay

**Step 2: Create useListening hook**

Create `src/features/listening/useListening.ts`:

- Accepts sentences array and video ref
- Tracks `currentTime` from video progress callbacks
- Computes `currentSentence` by finding sentence where `start <= currentTime <= end`
- `handleNextSentence()`: seek to next sentence start time
- `handleBackSentence()`: seek to previous sentence start time
- `handleSentenceComplete()`: calls `useEndListenMutation` and deducts token
- `isAtEnd`: computed flag for last sentence completion
- Auto-advance logic when `autoPlay` setting is true
- Much cleaner than longan's 177-line hook - no useReducer needed

**Step 3: Create ListeningPlayer**

Create `src/features/listening/ListeningPlayer.tsx`:

- VideoPlayer at top (16:9)
- SentenceHighlight below (shows current sentence text)
- Navigation controls: back, play/pause, next, finish
- Uses Paper `IconButton` for controls
- Progress indicator showing sentence X of Y

**Step 4: Create SentenceHighlight**

Create `src/features/listening/SentenceHighlight.tsx`:

- Shows current sentence content with character name
- Translation below (if `showTranslation` setting is on)
- Animated fade-in/out on sentence change
- Character avatar icon

**Step 5: Commit**

```bash
git add src/features/listening/ src/components/VideoPlayer.tsx
git commit -m "feat: add listening feature with video sync and sentence tracking"
```

---

### Task 16: Create Speaking Feature (Core Refactor)

This is the most critical task - replacing the 1084-line `useSpeakingVideo.ts` with clean, focused hooks.

**Files:**

- Create: `src/features/speaking/useSpeechRecognition.ts`
- Create: `src/features/speaking/useScoring.ts`
- Create: `src/features/speaking/useSpeakingFlow.ts`
- Create: `src/features/speaking/SpeakingPlayer.tsx`
- Create: `src/features/speaking/RecordButton.tsx`
- Create: `src/features/speaking/ScoreDisplay.tsx`
- Create: `src/features/speaking/CountdownOverlay.tsx`

**Step 1: Create useSpeechRecognition hook**

Create `src/features/speaking/useSpeechRecognition.ts`:

```typescript
// Replaces useMicrophone.ts (1014 lines → ~100 lines)
// Uses @react-native-voice/voice instead of Web Speech API

import { useCallback, useRef, useState } from 'react';
import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';
import { Audio } from 'expo-av';

interface UseSpeechRecognitionReturn {
  isRecording: boolean;
  transcript: string;
  recording: Audio.Recording | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<{ audioUri: string; transcript: string } | null>;
  cancelRecording: () => Promise<void>;
  recordingDuration: number;
}

// Hook implementation:
// - Voice.start('en-US') for speech-to-text
// - Audio.Recording for audio capture (expo-av)
// - Runs both simultaneously
// - Returns combined result on stop
// - Clean cleanup in useEffect return
// - No race condition refs - simple boolean state
// - recordingDuration tracked via setInterval
```

**Step 2: Create useScoring hook**

Create `src/features/speaking/useScoring.ts`:

```typescript
// Extracts scoring logic from useSpeakingVideo.ts
// Pure functions + mutation hook

import { useCallback } from 'react';
import { calculateSimilarity } from '@/src/utils/similarity';
import { encryptScoreData } from '@/src/utils/encryption';
import { getScoreColor } from '@/src/utils/score';
import { useEndSpeakMutation } from '@/src/api/hooks/useLearning';
import type { SentenceEntity, SentenceScoreEntity } from '@/src/api/types';

interface UseScoring {
  submitScore: (params: {
    sentence: SentenceEntity;
    transcript: string;
    audioUri: string;
    recordTime: number;
    paragraphId: number;
  }) => Promise<SentenceScoreEntity | null>;
  isSubmitting: boolean;
}

// Implementation:
// 1. calculateSimilarity(transcript, sentence.content)
// 2. encryptScoreData(transcript, score, recordTime)
// 3. Create FormData with audio file blob
// 4. Call endSpeakMutation
// 5. Return score entity
```

**Step 3: Create useSpeakingFlow hook (state machine)**

Create `src/features/speaking/useSpeakingFlow.ts`:

```typescript
// Replaces the 1084-line monster with a clean state machine
// State: idle → listening → countdown → recording → scoring → scored → idle/finished

import { useCallback, useEffect } from 'react';
import { useLearningStore } from '@/src/store/learningStore';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useScoring } from './useScoring';
import type { SentenceEntity, CharacterEntity, SpeakingState } from '@/src/api/types';

interface UseSpeakingFlowReturn {
  // State
  state: SpeakingState;
  currentSentence: SentenceEntity | null;
  activeCharacter: CharacterEntity | null;
  isRecording: boolean;
  transcript: string;
  recordingDuration: number;

  // Actions
  startLesson: () => void;
  recordSpeech: () => Promise<void>;
  stopAndScore: () => Promise<void>;
  nextSentence: () => void;
  prevSentence: () => void;
  restartLesson: () => void;
}

// Implementation:
// 1. On startLesson: set state to 'listening' if other character speaks, 'countdown' if user's turn
// 2. On countdown end (3s): auto-start recording
// 3. On recording: useSpeechRecognition.startRecording()
// 4. On stop (manual or 30s timeout): useSpeechRecognition.stopRecording() → useScoring.submitScore()
// 5. On scored: display result, user presses next
// 6. On next: advance to next sentence, determine state (listening or countdown)
// 7. On all sentences done: state = 'finished'
//
// KEY IMPROVEMENT: No useReducer, no 15+ useEffects, no ref-based race conditions
// Each state transition is a single function call
```

**Step 4: Create SpeakingPlayer component**

Create `src/features/speaking/SpeakingPlayer.tsx`:

- Character avatar + name at top
- Sentence text to practice (Paper `Text`)
- Audio playback for other character's line (when state = 'listening')
- CountdownOverlay (when state = 'countdown')
- RecordButton (when state = 'recording' or 'idle')
- ScoreDisplay (when state = 'scored')
- Navigation: back/next buttons
- Progress: sentence X of Y
- Uses `useSpeakingFlow` hook

**Step 5: Create RecordButton component**

Create `src/features/speaking/RecordButton.tsx`:

- Large circular FAB (Paper `FAB`)
- Animated pulse when recording (react-native-reanimated)
- Microphone icon when idle, stop icon when recording
- Recording duration display
- Transcript display below button (live updating)

**Step 6: Create ScoreDisplay component**

Create `src/features/speaking/ScoreDisplay.tsx`:

- Circular score indicator (0-100)
- Color-coded: red (<50), yellow (50-80), green (>80)
- Score message (keep practicing / well done / excellent)
- User's transcript vs template comparison
- "Next" and "Try Again" buttons
- Animated entrance

**Step 7: Create CountdownOverlay**

Create `src/features/speaking/CountdownOverlay.tsx`:

- Full-screen overlay with countdown 3, 2, 1
- Animated number change
- Auto-dismisses and triggers recording start
- Uses `react-native-reanimated` for smooth animation

**Step 8: Commit**

```bash
git add src/features/speaking/
git commit -m "feat: add speaking feature with state machine, recording, and scoring"
```

---

### Task 17: Create Vocabulary Feature

**Files:**

- Create: `src/features/vocabulary/useVocabulary.ts`
- Create: `src/features/vocabulary/WordCard.tsx`
- Create: `src/features/vocabulary/WordList.tsx`

**Step 1: Create useVocabulary hook**

Create `src/features/vocabulary/useVocabulary.ts`:

- Extracts keywords from paragraph
- Tracks current word index
- Fetches dictionary definition for each word
- Navigation: next/prev word
- Completion tracking

**Step 2: Create WordCard**

Create `src/features/vocabulary/WordCard.tsx`:

- Paper `Card` with word, pronunciation, part of speech
- Definition text
- Audio playback button for pronunciation
- Translation (if available)
- Swipe gesture for next/prev (optional, basic tap works too)

**Step 3: Create WordList**

Create `src/features/vocabulary/WordList.tsx`:

- Horizontal `FlatList` of WordCards
- Progress dots at bottom
- Current word indicator
- Navigation arrows
- Finish state when all words viewed

**Step 4: Commit**

```bash
git add src/features/vocabulary/
git commit -m "feat: add vocabulary feature with word cards"
```

---

### Task 18: Create Exercise Feature

**Files:**

- Create: `src/features/exercise/useExercise.ts`
- Create: `src/features/exercise/QuizCard.tsx`
- Create: `src/features/exercise/ExerciseResult.tsx`

**Step 1: Create useExercise hook**

Create `src/features/exercise/useExercise.ts`:

- Fetches exercise questions for paragraph
- Tracks current question index
- Validates answers
- Calculates total score
- Tracks correct/incorrect counts

**Step 2: Create QuizCard**

Create `src/features/exercise/QuizCard.tsx`:

- Question text at top
- Multiple choice answers using Paper `RadioButton.Group` or `Chip` components
- Answer shuffling (using simple array shuffle)
- Visual feedback: correct (green), wrong (red), not selected (default)
- Locked state after answering
- "Next" button

**Step 3: Create ExerciseResult**

Create `src/features/exercise/ExerciseResult.tsx`:

- Score summary (X/Y correct)
- Percentage circle
- "Try Again" and "Finish" buttons
- Paper `Card` with results

**Step 4: Commit**

```bash
git add src/features/exercise/
git commit -m "feat: add exercise feature with quiz cards and results"
```

---

## Phase 8: Shared Components

### Task 19: Create Shared UI Components

**Files:**

- Create: `src/components/LoadingScreen.tsx`
- Create: `src/components/EmptyState.tsx`
- Create: `src/components/ProgressBar.tsx`
- Create: `src/components/ErrorBoundary.tsx`

**Step 1: Create LoadingScreen**

Create `src/components/LoadingScreen.tsx`:

```typescript
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {message && (
        <Text variant="bodyMedium" style={styles.message}>
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  message: { marginTop: 16 },
});
```

**Step 2: Create EmptyState**

Create `src/components/EmptyState.tsx`:

- Icon + title + subtitle
- Optional action button
- Centered layout

**Step 3: Create ErrorBoundary**

Create `src/components/ErrorBoundary.tsx`:

- Class component error boundary
- Shows error message with "Retry" button
- Logs error for debugging (dev only)

**Step 4: Commit**

```bash
git add src/components/
git commit -m "feat: add shared UI components"
```

---

## Phase 9: Integration & Polish

### Task 20: Wire Up Root Layout & Navigation Guards

**Files:**

- Modify: `app/_layout.tsx`

**Step 1: Complete root layout**

Wire together all providers and navigation guards:

1. Load stored auth on mount
2. Show splash while loading
3. Redirect to auth or tabs based on `isAuthenticated`
4. Initialize i18n from settings store locale
5. Set up `QueryClientProvider` + `PaperProvider`
6. Error boundary wrapping

**Step 2: Test full navigation flow**

```bash
bun run start
```

Verify:

- App loads → auth check → login screen
- Login → home screen with tabs
- Navigate through all tabs
- Navigate to course → document → paragraph → lesson
- Lesson shows tab bar with all 4 modes

**Step 3: Commit**

```bash
git add app/_layout.tsx
git commit -m "feat: wire up root layout with auth guard and providers"
```

---

### Task 21: Add Expo Configuration

**Files:**

- Modify: `app.json`

**Step 1: Configure app.json**

```json
{
  "expo": {
    "name": "Learning AI",
    "slug": "learning-ai-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1A1A2E"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.langenter.learningai",
      "infoPlist": {
        "NSMicrophoneUsageDescription": "This app needs microphone access for speech practice",
        "NSSpeechRecognitionUsageDescription": "This app uses speech recognition for language learning"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1A1A2E"
      },
      "package": "com.langenter.learningai",
      "permissions": ["RECORD_AUDIO"]
    },
    "plugins": [
      "expo-router",
      "expo-secure-store",
      [
        "expo-av",
        {
          "microphonePermission": "Allow Learning AI to access your microphone for speech practice."
        }
      ],
      [
        "@react-native-voice/voice",
        {
          "microphonePermission": "Allow Learning AI to access your microphone for speech recognition.",
          "speechRecognitionPermission": "Allow Learning AI to use speech recognition for language learning."
        }
      ]
    ]
  }
}
```

**Step 2: Commit**

```bash
git add app.json
git commit -m "chore: configure Expo with permissions for microphone and speech"
```

---

### Task 22: Final Testing & Verification

**Step 1: Type check**

```bash
bunx tsc --noEmit
```

Expected: No type errors (strict mode).

**Step 2: Start dev server and test on device**

```bash
bun run start
```

Test on physical device or emulator:

- [ ] Auth flow: login → home
- [ ] Course browsing: courses → documents → paragraphs
- [ ] Listening: video plays, sentences sync, navigation works
- [ ] Speaking: recording starts, transcript appears, scoring works
- [ ] Vocabulary: word cards display, navigation works
- [ ] Exercise: quiz loads, answers selectable, results show
- [ ] Profile: settings toggle, logout works
- [ ] i18n: language switch works

**Step 3: Fix any issues found during testing**

**Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete Learning AI mobile app v1.0"
```

---

## Summary

| Phase | Tasks | Description                                         |
| ----- | ----- | --------------------------------------------------- |
| 1     | 1-4   | Project scaffolding, dependencies, theme, i18n      |
| 2     | 5-7   | API types, client, query hooks                      |
| 3     | 8     | Zustand stores (auth, learning, settings)           |
| 4     | 9     | Utility functions (scoring, encryption, formatting) |
| 5     | 10    | Auth screens (login, OTP, tab layout)               |
| 6     | 11-13 | Home, courses, history, profile screens             |
| 7     | 14-18 | Lesson container + all 4 learning modes             |
| 8     | 19    | Shared UI components                                |
| 9     | 20-22 | Integration, config, testing                        |

**Total: 22 tasks across 9 phases**

**Key refactoring wins:**

- 1084-line speaking hook → 3 focused hooks (~100 lines each)
- 1014-line microphone hook → native @react-native-voice/voice (~80 lines)
- 19 stores → 3 stores
- SWR + React Query → TanStack Query only
- TypeScript strict mode ON
- Clean state machine for speaking flow

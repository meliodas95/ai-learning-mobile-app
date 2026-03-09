# CLAUDE.md - Project Guidelines for AI Assistants

## Project Overview

Mobile English learning app (Learning AI) built with Expo SDK 55 + React Native Paper v5. Uses existing backend at `api.langenter.com`. Target: Vietnamese learners only (no admin/teacher features).

## Commands

```bash
bun install          # Install dependencies
bun start            # Start Expo dev server
bun run ios          # Run on iOS simulator
bun run android      # Run on Android emulator
bun run lint         # ESLint check
bun run lint:fix     # ESLint auto-fix
bun run format       # Prettier format all files
bun run format:check # Prettier check
bunx tsc --noEmit    # TypeScript type check
```

## Architecture

### Routing (Expo Router v4 - file-based)

- `app/_layout.tsx` - Root: GestureHandlerRootView > SafeAreaProvider > ErrorBoundary > QueryClientProvider > PaperProvider > AuthGuard
- `app/(auth)/` - Auth screens (unauthenticated):
  - `login.tsx` - Phone + password login (react-hook-form + zod)
  - `register.tsx` - Registration step 1: fullname + phone → send OTP
  - `verify-otp.tsx` - Registration step 2: 6-digit OTP verification with countdown + resend
  - `create-password.tsx` - Registration step 3: set password → create account
  - `forgot-password.tsx` - Password reset via phone
  - `otp.tsx` - Member login (token + OTP password)
- `app/(tabs)/` - Bottom tabs: Home, Courses, History, Profile
- `app/course/[courseId].tsx` - Documents list
- `app/document/[documentId].tsx` - Paragraphs list
- `app/lesson/[paragraphId].tsx` - Lesson container with 4 lazy-loaded tabs (listen, speaking, word, exercise)

### Provider Stack (app/_layout.tsx)

```
GestureHandlerRootView (react-native-gesture-handler)
  └─ SafeAreaProvider
    └─ ErrorBoundary
      └─ QueryClientProvider (TanStack Query)
        └─ PaperProvider (React Native Paper MD3 theme)
          └─ Stack (Expo Router)
```

### Auth Flow

```
App start → LoadingScreen (branded logo + animated dots)
  → loadStoredAuth() restores tokens from SecureStore
  → GET /v1/api/account/members validates token against backend
  → Valid: populate user/member/members → redirect to /(tabs)
  → Invalid/expired: clear tokens → redirect to /(auth)/login
  → 401 on any API call: auto-logout via response interceptor
```

Registration flow (matches longan web app):
```
Register (fullname + phone) → Send OTP → Verify OTP → Create Password → Login
```

### State Management (Zustand v5 - 3 stores only)

- `authStore` - Tokens (SecureStore), user (Account), member (MemberEntity), members[], memberCategories[], isAuthenticated, isLoading. On restore: validates token via API call, clears if invalid.
- `learningStore` - Active lesson: sentences, characters, conversationGroups, currentSentenceIndex, activeTab (LearnTab enum), speakingState (SpeakingState enum), currentScore, tokenBalance. reset() on unmount.
- `settingsStore` - locale (vi|en), showTranslation, autoPlay. Persisted via AsyncStorage (Zustand persist middleware).

### Data Fetching (TanStack Query v5)

- All API calls go through `src/api/client.ts` (Axios instance, baseURL: `https://api.langenter.com`, timeout: 30s)
- API hooks are co-located with their features in `src/features/*/hooks/`
- Auth token injected via request interceptor (`x-access-token` header)
- Public endpoints (login, register, forgot-password) skip token injection
- 401 responses trigger automatic logout (dynamic import to avoid circular dep)
- Response interceptor extracts `response.data` - hooks receive unwrapped data
- Query config: staleTime 5min, gcTime 30min, retry 2, refetchOnWindowFocus false
- Network status: `src/api/networkManager.ts` (NetInfo → onlineManager)
- App focus: `src/api/focusManager.ts` (AppState → focusManager)

### Feature Modules (`src/features/`)

Each feature has `hooks/` and `components/` subdirectories. API hooks are co-located with their domain, not in a separate `api/hooks/` folder.

```
src/features/<feature>/
  hooks/       — Custom hooks + API query/mutation hooks
  components/  — React components
```

- `auth/hooks/useAuth.ts` - useLoginMutation, useMemberLoginMutation, useSendOtpMutation, useVerifyOtpMutation, useSavePasswordMutation, useForgotPasswordMutation
- `courses/hooks/useCourses.ts` - useCourses, useDocuments(courseId), useParagraphs(documentId), useParagraphDetail(paragraphId)
- `history/hooks/useHistory.ts` - useHistory()
- `lesson/hooks/useLearning.ts` - useSentences (staleTime: Infinity), useStartParagraphMutation, useEndListenMutation, useEndSpeakMutation (FormData), useBackSentenceMutation, useTranslateMutation, useDictionaryMutation
- `listening/hooks/` - useListening | `components/` - ListeningPlayer, SentenceHighlight
- `speaking/hooks/` - useSpeechRecognition, useScoring, useSpeakingFlow (state machine) | `components/` - SpeakingPlayer, RecordButton, ScoreDisplay, CountdownOverlay
- `vocabulary/hooks/` - useVocabulary (keyword parsing + dictionary lookup) | `components/` - WordCard, WordList
- `exercise/hooks/` - useExercise (quiz with answer shuffling) | `components/` - QuizCard, ExerciseView, ExerciseResult

### Speaking State Machine

```
IDLE → LISTENING → COUNTDOWN → RECORDING → SCORING → SCORED → FINISHED
```

Managed in `useSpeakingFlow.ts`. Never add states without updating the SpeakingState enum in `src/api/types.ts`. Auto-stop on 30s timeout.

### Components (src/components/)

- `SettingsBottomSheet.tsx` - Reusable @gorhom/bottom-sheet with ToggleRow and SelectRow helpers
- `VideoPlayer.tsx` - expo-av Video wrapper with imperative handle (play, pause, seekTo, getStatus)
- `LoadingScreen.tsx` - Branded loading (LangEnter logo, fade-in animation, pulsing dots)
- `ErrorBoundary.tsx` - Class component for error UI
- `CourseCard.tsx` - Course card with title + subtitle
- `LessonItem.tsx` - Lesson item with number circle + meta
- `PillTabBar.tsx` - Custom bottom tab bar (pill-shaped active indicator)
- `LessonTabBar.tsx` - Segment control for lesson tabs
- `SegmentedControl.tsx` - Reusable segmented control
- `EmptyState.tsx` - Generic empty state

### Constants (src/constants/)

- `index.ts` - Query config, API timeout, SecureStore keys, score thresholds, UI constants, locale defaults

### Utils (src/utils/)

- `similarity.ts` - fuzzball.ratio() wrapper (normalize, lowercase, 0-100 score)
- `encryption.ts` - TripleDES encrypt (key from app.json expo.extra)
- `score.ts` - getScoreColor/getScoreHex/getScoreMessage (red <50, yellow 50-80, green ≥80)
- `formatters.ts` - formatDate, formatRelativeTime, formatDuration (date-fns with vi/en locales)
- `logger.ts` - No-op in production, wraps console.log/warn/error

### Theme (src/theme/)

- `colors.ts` - Primary green (#3D8A5A), coral accent (#D89575), warm beige background (#F5F4F1), full palette
- `index.ts` - MD3LightTheme base + custom fontConfig (all Material Design 3 text styles), roundness: 12

### i18n (src/i18n/)

- `index.ts` - Lightweight translate(locale, key, params) with `{{key}}` interpolation, fallback to EN
- `locales/vi.ts` - Vietnamese (default locale)
- `locales/en.ts` - English
- Hook: `useI18n()` returns `{ t, locale }`
- Sections: common, auth, tabs, learn, home, profile, courses, history, error

## Code Conventions

### General

- **TypeScript strict mode** - No `any` types (use proper typing or `unknown`)
- **Functional components only** - No class components (except ErrorBoundary)
- **Named exports** - Prefer `export function` over `export default` for non-route files
- **Route files use default exports** - Required by Expo Router
- **React.lazy** for code splitting heavy components (lesson tabs)

### Imports

- Use `type` imports for type-only: `import type { Foo } from './bar'`
- Path alias: `@/` maps to project root (e.g., `@/src/api/types`)
- Order: react → react-native → expo → third-party → local

### Styling

- Use `StyleSheet.create()` at bottom of file
- Use theme colors from `src/theme/colors.ts` - never hardcode hex values
- Use `useTheme()` for dynamic theme access in components
- Score colors: `colors.success` (green), `colors.warning` (orange), `colors.error` (red)

### i18n

- All user-facing strings must use `t()` from `useI18n()`
- Locale files: `src/i18n/locales/en.ts` and `vi.ts`
- Add keys to BOTH locale files when adding new strings
- Vietnamese is the default locale

### State

- Do NOT create new Zustand stores - use the existing 3
- Use TanStack Query for all server state (not Zustand)
- Settings persisted via Zustand `persist` middleware with AsyncStorage

### API

- Add new endpoints to `src/api/endpoints.ts`
- Add new types to `src/api/types.ts`
- Add new hooks to `src/features/<domain>/hooks/` (co-located with the feature that uses them)
- Shared API infra stays in `src/api/` (client.ts, endpoints.ts, types.ts, queryClient.ts)
- Public (no-auth) endpoints must be added to the interceptor skip list in `src/api/client.ts`
- Response interceptor extracts `response.data` - hooks receive unwrapped data

### Logging

- Use `logger` from `src/utils/logger.ts` - never use `console.log/warn/error` directly
- Logger is no-op in production builds

### Security

- Encryption keys go in `app.json > expo.extra` (accessed via expo-constants)
- Auth tokens in expo-secure-store only (never AsyncStorage)
- Never commit `.env` files or secrets
- TripleDES encryption for score data (transcript|score|recordTime)

## Key Dependencies

- **expo** ~55.0.5, **expo-router** ~55.0.4 (file-based routing)
- **react-native-paper** v5 (Material Design 3 UI)
- **@tanstack/react-query** v5 (server state)
- **zustand** v5 (client state, 3 stores)
- **axios** v1 (HTTP client)
- **@gorhom/bottom-sheet** v5 + **react-native-gesture-handler** (bottom sheets)
- **react-native-reanimated** v4 (animations)
- **expo-av** (audio/video), **@react-native-voice/voice** (speech recognition)
- **fuzzball** (similarity scoring), **crypto-js** (TripleDES encryption)
- **react-hook-form** + **zod** (form validation)
- **date-fns** (date formatting with vi/en locales)

## Known Issues / TODOs

- Profile stats (day streak, lessons, vocabulary) are hardcoded placeholders
- History weekly stats are hardcoded placeholders
- Home search bar is UI-only (not functional)
- Notifications bell is decorative
- Appearance settings toggle does nothing (no dark mode)
- Favorites endpoints defined but unused (FAVOURITE_ADD, FAVOURITE_LIST)
- API has mixed v1/v3 endpoints (paragraphs, sentences)
- Some hardcoded strings in OTP screen should use i18n

## Package Manager

**Always use `bun`** - not npm, yarn, or pnpm.

## Git

- Remote: `git@meliodas95.github.com:meliodas95/ai-learning-mobile-app.git`
- SSH host alias `meliodas95.github.com` uses `~/.ssh/anhpt891995-key`
- Branch: `main`

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
- `app/(auth)/` - Login + OTP (unauthenticated)
- `app/(tabs)/` - Bottom tabs: Home, Courses, History, Profile
- `app/course/[courseId].tsx` - Documents list
- `app/document/[documentId].tsx` - Paragraphs list
- `app/lesson/[paragraphId].tsx` - Lesson container with 4 tabs
- `app/_layout.tsx` - Root: SafeAreaProvider > ErrorBoundary > QueryClientProvider > PaperProvider > AuthGuard

### State Management (Zustand v5 - 3 stores only)
- `authStore` - Tokens, user info, login/logout. Tokens in expo-secure-store.
- `learningStore` - Active lesson: sentences, current index, tab, paragraph, speaking state.
- `settingsStore` - Locale, showTranslation, autoPlay. Persisted via AsyncStorage (Zustand persist middleware).

### Data Fetching (TanStack Query v5)
- All API calls go through `src/api/client.ts` (Axios instance)
- Hooks in `src/api/hooks/` - use `useQuery`/`useMutation` patterns
- Auth token injected via request interceptor (`x-access-token` header)
- 401 responses trigger automatic logout

### Feature Modules (`src/features/`)
Each feature is self-contained with hooks + components:
- `listening/` - useListening hook + ListeningPlayer + SentenceHighlight
- `speaking/` - useSpeechRecognition + useScoring + useSpeakingFlow + UI components
- `vocabulary/` - useVocabulary + WordCard + WordList
- `exercise/` - useExercise + QuizCard + ExerciseResult

### Speaking State Machine
```
IDLE → LISTENING → COUNTDOWN → RECORDING → SCORING → SCORED → FINISHED
```
Managed in `useSpeakingFlow.ts`. Never add states without updating the SpeakingState enum in `src/api/types.ts`.

## Code Conventions

### General
- **TypeScript strict mode** - No `any` types (use proper typing or `unknown`)
- **Functional components only** - No class components (except ErrorBoundary)
- **Named exports** - Prefer `export function` over `export default` for non-route files
- **Route files use default exports** - Required by Expo Router

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
- All user-facing strings must use `t()` from `useTranslation()`
- Locale files: `src/i18n/locales/en.ts` and `vi.ts`
- Add keys to BOTH locale files when adding new strings
- Vietnamese is the default locale

### State
- Do NOT create new Zustand stores - use the existing 3
- Use TanStack Query for all server state (not Zustand)
- Settings persisted via Zustand `persist` middleware with AsyncStorage

### API
- Add new endpoints to `src/api/endpoints.ts`
- Add new hooks to `src/api/hooks/`
- Add new types to `src/api/types.ts`
- Response interceptor extracts `response.data` - hooks receive unwrapped data

### Logging
- Use `logger` from `src/utils/logger.ts` - never use `console.log/warn/error` directly
- Logger is no-op in production builds

### Security
- Encryption keys go in `app.json > expo.extra` (accessed via expo-constants)
- Auth tokens in expo-secure-store only
- Never commit `.env` files or secrets

## Package Manager

**Always use `bun`** - not npm, yarn, or pnpm.

## Git

- Remote: `git@meliodas95.github.com:meliodas95/ai-learning-mobile-app.git`
- SSH host alias `meliodas95.github.com` uses `~/.ssh/anhpt891995-key`
- Branch: `main`

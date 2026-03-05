# Learning AI App - Mobile Design Document

**Date:** 2026-03-04
**Based on:** Longan (Lang Enter) web app
**Platform:** iOS & Android via Expo

## Overview

Mobile English language learning app with video-based lessons, speech recognition, vocabulary, and quizzes. Learner-only (no admin/teacher features). Uses existing Lang Enter backend API.

## Requirements

- **Target:** Students/learners only
- **Features:** All 4 learning modes (Listen, Speaking, Word, Exercise)
- **Backend:** Existing api.langenter.com
- **Navigation:** Bottom tabs
- **Lesson format:** Video-based (same as web, mobile-optimized)
- **Design:** Modern minimal (clean, spacious, subtle shadows)
- **Package manager:** bun

## Tech Stack

| Purpose            | Library                   | Version  |
| ------------------ | ------------------------- | -------- |
| Framework          | Expo SDK                  | 52+      |
| Routing            | Expo Router               | v4       |
| UI Components      | React Native Paper        | v5 (MD3) |
| State Management   | Zustand                   | v5       |
| Data Fetching      | TanStack Query            | v5       |
| HTTP Client        | Axios                     | latest   |
| Video/Audio        | expo-av                   | latest   |
| Speech Recognition | @react-native-voice/voice | latest   |
| Scoring            | fuzzball                  | latest   |
| Encryption         | crypto-js                 | latest   |
| Storage            | react-native-mmkv         | latest   |
| Auth Storage       | expo-secure-store         | latest   |
| Animations         | react-native-reanimated   | v3       |
| i18n               | i18next + react-i18next   | latest   |
| Forms              | react-hook-form + zod     | latest   |
| Icons              | @expo/vector-icons        | built-in |
| Package Manager    | bun                       | latest   |

## Project Structure

```
learning-ai-app/
├── app/                          # Expo Router (file-based routing)
│   ├── _layout.tsx               # Root layout (Paper Provider + theme)
│   ├── (auth)/                   # Auth screens
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── otp.tsx
│   ├── (tabs)/                   # Bottom tab navigator
│   │   ├── _layout.tsx           # Tab bar config
│   │   ├── index.tsx             # Home/Dashboard
│   │   ├── courses.tsx           # Course browser
│   │   ├── history.tsx           # Learning history
│   │   └── profile.tsx           # User profile
│   └── lesson/                   # Lesson screens (stack)
│       ├── _layout.tsx
│       └── [paragraphId].tsx     # Lesson container
├── src/
│   ├── api/                      # API layer (clean abstraction)
│   │   ├── client.ts             # Axios instance + interceptors
│   │   ├── endpoints.ts          # Typed endpoint constants
│   │   ├── hooks/                # TanStack Query hooks
│   │   │   ├── useCourses.ts
│   │   │   ├── useSentences.ts
│   │   │   ├── useAuth.ts
│   │   │   └── useLearning.ts
│   │   └── types.ts              # API response types
│   ├── features/                 # Feature modules (domain logic)
│   │   ├── listening/
│   │   │   ├── useListening.ts
│   │   │   ├── ListeningPlayer.tsx
│   │   │   └── SentenceHighlight.tsx
│   │   ├── speaking/
│   │   │   ├── useSpeechRecognition.ts
│   │   │   ├── useScoring.ts
│   │   │   ├── useSpeakingFlow.ts
│   │   │   ├── SpeakingPlayer.tsx
│   │   │   ├── RecordButton.tsx
│   │   │   └── ScoreDisplay.tsx
│   │   ├── vocabulary/
│   │   │   ├── useVocabulary.ts
│   │   │   ├── WordCard.tsx
│   │   │   └── WordList.tsx
│   │   └── exercise/
│   │       ├── useExercise.ts
│   │       ├── QuizCard.tsx
│   │       └── ExerciseResult.tsx
│   ├── store/                    # Zustand stores (3 total)
│   │   ├── authStore.ts
│   │   ├── learningStore.ts
│   │   └── settingsStore.ts
│   ├── theme/                    # Paper theme customization
│   │   ├── index.ts
│   │   └── colors.ts
│   ├── components/               # Shared UI components
│   │   ├── VideoPlayer.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── EmptyState.tsx
│   │   └── LoadingScreen.tsx
│   ├── utils/
│   │   ├── similarity.ts
│   │   ├── encryption.ts
│   │   └── formatters.ts
│   └── constants/
│       ├── learnTypes.ts
│       └── config.ts
├── assets/
├── app.json
├── babel.config.js
├── tsconfig.json                 # strict: true
└── package.json
```

## Navigation

### Bottom Tabs

| Tab     | Icon              | Screen                                     |
| ------- | ----------------- | ------------------------------------------ |
| Home    | home              | Dashboard - continue learning, daily stats |
| Courses | book-open-variant | Course browser                             |
| History | clock-outline     | Learning history with scores               |
| Profile | account-circle    | Account, settings, balance                 |

### Screen Flow

```
Auth: Login → OTP → Home
Main: Home → Courses → Documents → Paragraphs → Lesson
Lesson: Listen tab | Speaking tab | Word tab | Exercise tab
Profile: Settings | Balance | Favorites
```

## Theme

Modern minimal palette for Paper MD3:

```typescript
{
  primary: '#1A1A2E',
  secondary: '#16213E',
  tertiary: '#0F3460',
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F7',
  outline: '#E0E0E0',
  error: '#E53935',       // Score < 50
  // Custom
  warning: '#FB8C00',     // Score 50-80
  success: '#43A047',     // Score > 80
}
```

## State Management

### 3 Zustand Stores

**authStore** - User auth, tokens, member info
**learningStore** - Active lesson, sentences, speaking state machine, tab, balance
**settingsStore** - Locale, theme, preferences (persisted via MMKV)

### Speaking State Machine

```
idle → listening → recording → scoring → scored → idle (next)
                      │                     │
                      └── cancel ──→ idle   └── finished (all done)
```

Replaces the 1084-line useSpeakingVideo.ts with clean state transitions.

## API Integration

Uses existing api.langenter.com. TanStack Query for all data fetching (replaces SWR + React Query mix).

Key endpoints:

- `POST /v1/api/account/login` - Auth
- `GET /v1/api/library/courses` - Course list
- `GET /v1/api/library/sentences` - Lesson sentences
- `POST /v1/api/library/learn/listen/end` - End listening
- `POST /v1/api/library/learn/speak/end` - End speaking (with audio upload)
- `POST /v1/api/transaction/start-paragraph` - Start lesson

## Key Refactoring from Longan

| Problem                       | Solution                                                   |
| ----------------------------- | ---------------------------------------------------------- |
| 1084-line useSpeakingVideo.ts | 3 hooks: useSpeechRecognition, useScoring, useSpeakingFlow |
| 19 Zustand stores             | 3 stores: auth, learning, settings                         |
| SWR + React Query mixed       | TanStack Query only                                        |
| Web Speech API                | @react-native-voice/voice (native)                         |
| console.logs in production    | Dev-only logger                                            |
| strict: false                 | strict: true                                               |
| No tests                      | Jest + React Native Testing Library                        |
| Race conditions via refs      | State machine                                              |
| sessionStorage                | MMKV                                                       |
| No error boundaries           | Error boundaries + retry UI                                |

## Error Handling

- API errors → TanStack Query onError → Toast
- Auth 401 → Axios interceptor → Login redirect
- Network → Query retry (3x) → Offline message
- Speech → Fallback UI
- Video → expo-av error handler + retry

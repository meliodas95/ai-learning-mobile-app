# Learning AI

Mobile English language learning app with video-based lessons, speech recognition, vocabulary, and quizzes. Built with Expo and React Native for iOS & Android.

## Features

- **Listen** - Watch video lessons with synchronized sentence highlighting
- **Speaking** - Practice pronunciation with speech recognition and similarity scoring
- **Vocabulary** - Swipeable word cards with dictionary definitions
- **Exercise** - Multiple-choice quizzes with instant feedback
- **Bilingual** - Vietnamese and English interface (i18n)
- **Offline settings** - Preferences persisted via MMKV

## Tech Stack

| Category | Library |
|----------|---------|
| Framework | Expo SDK 55, React Native 0.83 |
| Routing | Expo Router v4 (file-based) |
| UI | React Native Paper v5 (Material Design 3) |
| State | Zustand v5 (3 stores) |
| Data Fetching | TanStack Query v5 |
| HTTP | Axios + auth interceptor |
| Video/Audio | expo-av |
| Speech | @react-native-voice/voice |
| Scoring | fuzzball (Levenshtein similarity) |
| Encryption | crypto-js (Triple DES) |
| Storage | MMKV (settings), expo-secure-store (auth) |
| i18n | i18next + react-i18next |
| Forms | react-hook-form + zod |
| Linting | ESLint + Prettier |
| Package Manager | bun |

## Project Structure

```
app/                        # Expo Router (file-based routing)
├── _layout.tsx             # Root layout (providers + auth guard)
├── (auth)/                 # Login + OTP screens
├── (tabs)/                 # Bottom tab navigator (Home, Courses, History, Profile)
├── course/[courseId].tsx    # Document list for a course
├── document/[documentId].tsx # Paragraph list for a document
└── lesson/[paragraphId].tsx  # Lesson container (4 learning modes)

src/
├── api/                    # API layer
│   ├── client.ts           # Axios instance + interceptors
│   ├── endpoints.ts        # Typed endpoint constants
│   ├── types.ts            # API response/entity types
│   └── hooks/              # TanStack Query hooks
├── features/               # Feature modules
│   ├── listening/          # Video player + sentence sync
│   ├── speaking/           # Speech recognition + scoring state machine
│   ├── vocabulary/         # Word cards + dictionary
│   └── exercise/           # Quiz cards + results
├── store/                  # Zustand stores
│   ├── authStore.ts        # Auth tokens, user info
│   ├── learningStore.ts    # Active lesson state
│   └── settingsStore.ts    # Locale, preferences (MMKV-backed)
├── components/             # Shared UI components
├── theme/                  # Paper MD3 theme + colors
├── i18n/                   # Vietnamese + English locales
└── utils/                  # Similarity, encryption, scoring, formatters, logger
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [bun](https://bun.sh/) (package manager)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator (macOS) or Android Emulator

### Install

```bash
bun install
```

### Configure

Set the Triple DES encryption key in `app.json`:

```json
{
  "expo": {
    "extra": {
      "tripleDesKey": "YOUR_ACTUAL_KEY"
    }
  }
}
```

### Run

```bash
# Start Expo dev server
bun start

# iOS
bun run ios

# Android
bun run android
```

### Lint & Format

```bash
# Check for lint errors
bun run lint

# Auto-fix lint errors
bun run lint:fix

# Format all files
bun run format

# Check formatting
bun run format:check
```

## Backend API

Uses the existing Lang Enter API at `https://api.langenter.com`. Key endpoints:

- `POST /v1/api/account/login` - Phone/password auth
- `GET /v1/api/library/courses` - Course listing
- `GET /v1/api/library/sentences` - Lesson sentences
- `POST /v1/api/library/learn/listen/end` - Save listening progress
- `POST /v1/api/library/learn/speak/end` - Submit speaking score with audio
- `POST /v1/api/transaction/start-paragraph` - Start a lesson (token deduction)

## Architecture Notes

### Speaking State Machine

```
IDLE → LISTENING → COUNTDOWN → RECORDING → SCORING → SCORED → FINISHED
                                   │                     │
                                   └── cancel → IDLE     └── next sentence
```

The speaking flow is decomposed into 3 focused hooks:
- `useSpeechRecognition` - Native voice capture + audio recording
- `useScoring` - Similarity calculation + encrypted score submission
- `useSpeakingFlow` - State machine orchestration

### Auth Flow

```
Login → setAuth() → AuthGuard detects isAuthenticated → redirect to (tabs)
                     ↕
            401 API response → auto-logout → redirect to (auth)
```

Tokens stored in `expo-secure-store`. API client injects `x-access-token` header via request interceptor.

## License

Private - Lang Enter

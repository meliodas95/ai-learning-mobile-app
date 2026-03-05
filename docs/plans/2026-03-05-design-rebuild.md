# Design Rebuild - Learning AI Mobile App

## Overview

Full UI rebuild of the Learning AI mobile app to match Pencil design system. Earthy/natural tone palette with green accent. Keep all existing business logic, rebuild screen layouts.

## Color System

| Token            | Light   | Dark    | Usage                                |
| ---------------- | ------- | ------- | ------------------------------------ |
| primary          | #3D8A5A | #3D8A5A | Green accent, buttons, active states |
| primaryDark      | #4D9B6A | #4D9B6A | Darker green variant                 |
| primaryLight     | #C8F0D8 | #1A3D28 | Light green badges, number circles   |
| coral            | #D89575 | #D89575 | Secondary accent                     |
| background       | #F5F4F1 | #121214 | Page background                      |
| surface          | #FFFFFF | #1E1E22 | Cards                                |
| surfaceVariant   | #EDECEA | #2A2A2E | Muted bg, segmented control          |
| elevated         | #FAFAF8 | #2A2A2E | Elevated surfaces                    |
| outline          | #E5E4E1 | #2E2E32 | Borders                              |
| outlineStrong    | #D1D0CD | #3E3E42 | Strong borders                       |
| onSurface        | #1A1918 | #F5F4F1 | Primary text                         |
| onSurfaceVariant | #6D6C6A | #9C9B99 | Secondary text                       |
| textTertiary     | #9C9B99 | #6D6C6A | Muted text                           |
| tabInactive      | #A8A7A5 | #6D6C6A | Inactive tab                         |
| error            | #D08068 | #D08068 | Errors                               |
| warning          | #D4A64A | #D4A64A | Warnings                             |
| onPrimary        | #FFFFFF | #FFFFFF | Text on primary                      |

## Screens

### Login

- Hero area: large green circle with languages icon, app name, tagline
- Phone input with VN +84 prefix, password input
- Green "Sign In" button (full width, rounded 12)
- Footer: register link + terms text

### Home (tabs/index)

- Greeting header: avatar circle + "Good Morning / name" + bell icon
- Search bar (placeholder, navigates to search)
- Lesson Types: 4 colored cards (Image, Chat, Paragraph, Video)
- Learning Modes: 3 pills (Vocab, Listening, Speaking)
- Continue Learning: CourseCard with image + progress
- Daily Streak: card with day circles

### Courses (tabs/courses)

- Header: "My Courses" + search icon
- SegmentedControl: All / In Progress / Completed
- Course cards list (CourseCard with image, badge, progress bar)

### Course Detail (course/[courseId])

- Back button + course title + bookmark
- Stats row: lessons count, vocab count, est. time
- Progress card: bar + percentage + completion text
- Lessons list: LessonItem components (numbered)

### Document Detail (document/[documentId])

- Same pattern as Course Detail but for paragraphs
- LessonItem components for each paragraph

### Lesson (lesson/[paragraphId])

- Back + title + type badge + more menu
- SegmentedControl: Listening / Speaking / Vocab / Exercise
- Content area renders active tab feature component
- Existing feature components (ListeningPlayer, SpeakingPlayer, WordList, ExerciseView) stay

### History (tabs/history)

- Header: "Learning History" + bell
- Weekly stats card: time studied, lessons done, words learned
- "Recent Activity" section with type filter
- Activity items: icon + title + type/duration + score percentage

### Profile (tabs/profile)

- Header: "Profile" + settings gear
- Avatar circle with initial letter
- Name + email
- Stats row: day streak, lessons, words
- Settings menu items: Language, Appearance, Notifications, Audio Settings, Help

## Reusable Components

### PillTabBar

Custom bottom tab bar replacing Expo's default. Pill-shaped container with 4 tabs. Active tab has green bg + white icon/label. Inactive has muted icon/label.

### SegmentedControl

Rounded container (bg-muted), inner items with rounded active indicator (bg-card with shadow). Props: segments[], activeIndex, onChange.

### CourseCard

Card with: image area (top, rounded top corners), content area with title, type badge (pill), description, progress bar + label.

### LessonItem

Row card with: numbered circle (green bg), title + meta text + type badge, chevron right.

### StatCard

Vertical stack: icon/value + label. Used in Home stats, History weekly, Profile stats.

## Architecture Notes

- Keep existing 3 Zustand stores (auth, learning, settings)
- Keep existing TanStack Query hooks
- Keep existing feature modules (listening, speaking, vocabulary, exercise)
- Only rebuild: theme, screen layouts, tab bar, shared components
- All colors via theme — no hardcoded hex in screens

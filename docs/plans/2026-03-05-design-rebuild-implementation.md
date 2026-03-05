# Design Rebuild Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Full UI rebuild of all screens to match Pencil design system with earthy/natural color palette and modern layout.

**Architecture:** Update theme/colors first, then create reusable components (PillTabBar, SegmentedControl, CourseCard, LessonItem), then rebuild each screen from scratch while keeping all existing business logic (hooks, stores, API calls). System font throughout (no custom Outfit).

**Tech Stack:** Expo SDK 55, React Native Paper v5, Expo Router v4, Zustand v5, TanStack Query v5, Lucide icons via @expo/vector-icons

---

## Task 1: Update Color System & Theme

**Files:**

- Rewrite: `src/theme/colors.ts`
- Rewrite: `src/theme/index.ts`
- Modify: `src/constants.ts`

**Step 1: Rewrite `src/theme/colors.ts`**

```typescript
export const colors = {
  // Primary greens
  primary: '#3D8A5A',
  primaryDark: '#4D9B6A',
  primaryLight: '#C8F0D8',

  // Accent
  coral: '#D89575',

  // Backgrounds
  background: '#F5F4F1',
  surface: '#FFFFFF',
  surfaceVariant: '#EDECEA',
  elevated: '#FAFAF8',

  // Borders
  outline: '#E5E4E1',
  outlineStrong: '#D1D0CD',

  // Text
  onSurface: '#1A1918',
  onSurfaceVariant: '#6D6C6A',
  textTertiary: '#9C9B99',
  onPrimary: '#FFFFFF',

  // Tab bar
  tabInactive: '#A8A7A5',
  tabBarBg: '#FFFFFF',

  // Status
  error: '#D08068',
  warning: '#D4A64A',
  success: '#3D8A5A',

  // Score colors (reuse success/warning/error)
  scoreGreen: '#3D8A5A',
  scoreYellow: '#D4A64A',
  scoreRed: '#D08068',
} as const;

export type AppColors = typeof colors;
```

**Step 2: Rewrite `src/theme/index.ts`**

```typescript
import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { colors } from './colors';

const fontConfig = {
  displayLarge: {
    fontFamily: 'System',
    fontSize: 57,
    fontWeight: '400' as const,
    letterSpacing: -0.25,
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
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
    lineHeight: 36,
  },
  headlineSmall: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
    lineHeight: 32,
  },
  titleLarge: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 20,
  },
  bodyLarge: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 16,
  },
  labelLarge: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0,
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
    secondary: colors.primaryDark,
    tertiary: colors.coral,
    surface: colors.surface,
    surfaceVariant: colors.surfaceVariant,
    background: colors.background,
    outline: colors.outline,
    onPrimary: colors.onPrimary,
    onSurface: colors.onSurface,
    onSurfaceVariant: colors.onSurfaceVariant,
    error: colors.error,
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level0: 'transparent',
      level1: colors.surface,
      level2: colors.elevated,
    },
  },
  fonts: configureFonts({ config: fontConfig }),
  roundness: 12,
};

export type AppTheme = typeof theme;
```

**Step 3: Update `src/constants.ts` score colors**

Update `SCORE_COLORS` to use new color values (they reference `colors` import, so auto-updates). Verify `TAB_BAR_HEIGHT` and other UI constants still make sense.

**Step 4: Verify & commit**

Run: `bunx tsc --noEmit` to check no type errors.
Commit: `git commit -m "feat: update theme to earthy/natural design system"`

---

## Task 2: Add New i18n Keys

**Files:**

- Modify: `src/i18n/locales/vi.ts`
- Modify: `src/i18n/locales/en.ts`

**Step 1: Add new keys to both locale files**

Add to both (with appropriate translations):

```typescript
// Add to home section:
home: {
  ...existing,
  goodMorning: 'Chào buổi sáng', // 'Good Morning'
  searchPlaceholder: 'Tìm bài học, từ vựng...', // 'Search lessons, vocabulary...'
  lessonTypes: 'Loại bài học', // 'Lesson Types'
  learningModes: 'Chế độ học', // 'Learning Modes'
  dailyStreak: 'Chuỗi ngày học', // 'Daily Streak'
  dayStreak: '{{count}} ngày', // '{{count}} days'
  timeStudied: 'Thời gian', // 'Time Studied'
  lessonsDone: 'Bài học', // 'Lessons Done'
  wordsLearned: 'Từ vựng', // 'Words Learned'
  vocab: 'Từ vựng', // 'Vocab'
  listening: 'Nghe', // 'Listening'
  speaking: 'Nói', // 'Speaking'
  image: 'Hình ảnh', // 'Image'
  chat: 'Hội thoại', // 'Chat'
  paragraph: 'Đoạn văn', // 'Paragraph'
  video: 'Video', // 'Video'
},

// Add to courses section:
courses: {
  ...existing,
  myCourses: 'Khóa học', // 'My Courses'
  all: 'Tất cả', // 'All'
  inProgress: 'Đang học', // 'In Progress'
  completed: 'Hoàn thành', // 'Completed'
  lessons: '{{count}} bài học', // '{{count}} lessons'
  vocabulary: '{{count}} từ vựng', // '{{count}} vocabulary'
  complete: '{{percent}}% hoàn thành', // '{{percent}}% complete'
  yourProgress: 'Tiến độ', // 'Your Progress'
  estTime: 'Ước tính', // 'Est. Time'
  lessonsCompleted: '{{done}} / {{total}} bài hoàn thành', // '{{done}} of {{total}} completed'
},

// Add to history section:
history: {
  title: 'Lịch sử học', // 'Learning History'
  thisWeek: 'Tuần này', // 'This Week'
  recentActivity: 'Hoạt động gần đây', // 'Recent Activity'
  allTypes: 'Tất cả', // 'All Types'
  score: 'Điểm', // 'Score'
  vsLastWeek: '+{{percent}}% so với tuần trước', // '+{{percent}}% vs last week'
},

// Add to profile section:
profile: {
  ...existing,
  appearance: 'Giao diện', // 'Appearance'
  lightMode: 'Sáng', // 'Light Mode'
  notifications: 'Thông báo', // 'Notifications'
  dailyReminders: 'Nhắc nhở hàng ngày', // 'Daily reminders on'
  audioSettings: 'Cài đặt âm thanh', // 'Audio Settings'
  audioDesc: 'Tự động phát, tốc độ, bản dịch', // 'Auto-play, speed, translation'
  helpSupport: 'Trợ giúp', // 'Help & Support'
  helpDesc: 'FAQ, liên hệ', // 'FAQs, contact us'
  dayStreak: 'Chuỗi ngày', // 'Day Streak'
  lessonsCount: 'Bài học', // 'Lessons'
  wordsCount: 'Từ vựng', // 'Words'
},
```

**Step 2: Commit**

Commit: `git commit -m "feat: add new i18n keys for redesigned screens"`

---

## Task 3: Create SegmentedControl Component

**Files:**

- Create: `src/components/SegmentedControl.tsx`

**Step 1: Create component**

```typescript
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { colors } from '@/src/theme/colors';

interface Segment {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  segments: Segment[];
  activeValue: string;
  onValueChange: (value: string) => void;
}

export function SegmentedControl({ segments, activeValue, onValueChange }: SegmentedControlProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceVariant }]}>
      {segments.map((segment) => {
        const isActive = segment.value === activeValue;
        return (
          <Pressable
            key={segment.value}
            style={[
              styles.segment,
              isActive && [styles.activeSegment, { backgroundColor: colors.surface }],
            ]}
            onPress={() => onValueChange(segment.value)}
          >
            <Text
              style={[
                styles.label,
                { color: isActive ? colors.onSurface : colors.textTertiary },
                isActive && styles.activeLabel,
              ]}
            >
              {segment.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    borderRadius: 8,
  },
  activeSegment: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  activeLabel: {
    fontWeight: '600',
  },
});
```

**Step 2: Commit**

Commit: `git commit -m "feat: add SegmentedControl component"`

---

## Task 4: Create CourseCard Component

**Files:**

- Create: `src/components/CourseCard.tsx`

**Step 1: Create component**

```typescript
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '@/src/theme/colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface CourseCardProps {
  title: string;
  subtitle?: string;
  lessonsCount?: number;
  vocabCount?: number;
  progress?: number; // 0-100
  type?: string;
  onPress?: () => void;
}

export function CourseCard({
  title,
  subtitle,
  lessonsCount,
  vocabCount,
  progress,
  type,
  onPress,
}: CourseCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {/* Image placeholder area */}
      <View style={styles.imageArea}>
        <MaterialCommunityIcons name="image-outline" size={32} color={colors.primary} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {type && (
          <View style={styles.badge}>
            <MaterialCommunityIcons
              name={type === 'video' ? 'video' : 'image'}
              size={12}
              color={colors.primary}
            />
            <Text style={styles.badgeText}>{type}</Text>
          </View>
        )}

        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}

        {progress !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${Math.min(progress, 100)}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}% complete</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.outline,
    overflow: 'hidden',
    shadowColor: '#1A1918',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 1,
  },
  imageArea: {
    height: 140,
    backgroundColor: colors.primaryLight,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.onSurface,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  progressContainer: {
    gap: 6,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 100,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 100,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
});
```

**Step 2: Commit**

Commit: `git commit -m "feat: add CourseCard component"`

---

## Task 5: Create LessonItem Component

**Files:**

- Create: `src/components/LessonItem.tsx`

**Step 1: Create component**

```typescript
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '@/src/theme/colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface LessonItemProps {
  number: number;
  title: string;
  meta?: string; // e.g. "12 sentences - 5 min"
  type?: string; // e.g. "Image", "Video", "Conversation"
  onPress?: () => void;
}

export function LessonItem({ number, title, meta, type, onPress }: LessonItemProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {/* Number circle */}
      <View style={styles.numberCircle}>
        <Text style={styles.numberText}>{String(number).padStart(2, '0')}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {meta && <Text style={styles.meta}>{meta}</Text>}
        {type && (
          <View style={styles.typeBadge}>
            <MaterialCommunityIcons name="image" size={10} color={colors.primary} />
            <Text style={styles.typeText}>{type}</Text>
          </View>
        )}
      </View>

      {/* Chevron */}
      <MaterialCommunityIcons name="chevron-right" size={18} color={colors.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    paddingHorizontal: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.outline,
    shadowColor: '#1A1918',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  numberCircle: {
    width: 44,
    height: 44,
    borderRadius: 100,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.onSurface,
  },
  meta: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary,
  },
});
```

**Step 2: Commit**

Commit: `git commit -m "feat: add LessonItem component"`

---

## Task 6: Create Custom PillTabBar

**Files:**

- Create: `src/components/PillTabBar.tsx`
- Modify: `app/(tabs)/_layout.tsx`

**Step 1: Create `src/components/PillTabBar.tsx`**

```typescript
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '@/src/theme/colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const TAB_ICONS: Record<string, string> = {
  index: 'home',
  courses: 'book-open-variant',
  history: 'history',
  profile: 'account',
};

export function PillTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.pill}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const isFocused = state.index === index;
          const iconName = TAB_ICONS[route.name] ?? 'circle';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={[styles.tab, isFocused && styles.activeTab]}
            >
              <MaterialCommunityIcons
                name={iconName as any}
                size={18}
                color={isFocused ? colors.onPrimary : colors.tabInactive}
              />
              <Text
                style={[
                  styles.label,
                  { color: isFocused ? colors.onPrimary : colors.tabInactive },
                  isFocused && styles.activeLabel,
                ]}
              >
                {String(label).toUpperCase()}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    paddingHorizontal: 21,
    paddingTop: 12,
    paddingBottom: 21,
  },
  pill: {
    flexDirection: 'row',
    backgroundColor: colors.tabBarBg,
    borderRadius: 36,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
    borderRadius: 26,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  activeLabel: {
    fontWeight: '600',
  },
});
```

**Step 2: Rewrite `app/(tabs)/_layout.tsx`**

```typescript
import { Tabs } from 'expo-router';
import { useI18n } from '@/src/i18n';
import { PillTabBar } from '@/src/components/PillTabBar';

export default function TabLayout() {
  const { t } = useI18n();

  return (
    <Tabs tabBar={(props) => <PillTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: t('tabs.home') }} />
      <Tabs.Screen name="courses" options={{ title: t('tabs.courses') }} />
      <Tabs.Screen name="history" options={{ title: t('tabs.history') }} />
      <Tabs.Screen name="profile" options={{ title: t('tabs.profile') }} />
    </Tabs>
  );
}
```

**Step 3: Run & verify visually, commit**

Run: `bun start` and verify tab bar renders correctly.
Commit: `git commit -m "feat: add pill-shaped custom tab bar"`

---

## Task 7: Rebuild Login Screen

**Files:**

- Rewrite: `app/(auth)/login.tsx`

**Step 1: Full rewrite**

Keep existing auth logic (useForm, zodResolver, useLoginMutation, setAuth). Rebuild layout to match design:

- Hero area with green circle + languages icon + app name + tagline
- Phone input with "VN +84" prefix
- Password input with eye toggle
- "Forgot Password?" link
- Green "Sign In" full-width button
- "Don't have an account? Register" footer
- Terms text at bottom

Use `MaterialCommunityIcons` for the hero icon (`translate` icon). Use `colors.primary`, `colors.primaryLight`, etc. from theme.

**Step 2: Commit**

Commit: `git commit -m "feat: rebuild login screen to match design"`

---

## Task 8: Rebuild Home Screen

**Files:**

- Rewrite: `app/(tabs)/index.tsx`

**Step 1: Full rewrite**

Keep existing data hooks (useCourses, useAuthStore). Rebuild layout:

- Greeting header: avatar circle (initial letter, green bg) + "Good Morning\nName" + bell icon button
- Search bar (pressable, placeholder text, search icon)
- "Lesson Types" section: 4 colored cards in a row (Image, Chat, Paragraph, Video) — each is a rounded rect with icon + label
- "Learning Modes" section: 3 pills in a row (Vocab green, Listening coral, Speaking green-dark)
- "Continue Learning" section: CourseCard component with first course data
- Layout: ScrollView with 24px horizontal padding, 24px gap between sections

**Step 2: Commit**

Commit: `git commit -m "feat: rebuild home screen to match design"`

---

## Task 9: Rebuild Courses Screen

**Files:**

- Rewrite: `app/(tabs)/courses.tsx`

**Step 1: Full rewrite**

Keep existing hooks (useCourses, search filter logic). Rebuild layout:

- Header: "My Courses" title + search icon button
- SegmentedControl with 3 segments: All / In Progress / Completed
- FlatList of CourseCard components
- Each card shows course title, type badge, subtitle (lessons + vocab count), progress bar

**Step 2: Commit**

Commit: `git commit -m "feat: rebuild courses screen to match design"`

---

## Task 10: Rebuild Course Detail Screen

**Files:**

- Rewrite: `app/course/[courseId].tsx`

**Step 1: Full rewrite**

Keep existing hooks (useDocuments). Rebuild layout:

- Header: back chevron + course title + bookmark icon
- Stats row: 3 columns (Lessons count, Vocabulary count, Est. Time)
- Progress card: "Your Progress" label + percentage + progress bar + completion text
- "Lessons" section header
- FlatList of LessonItem components (one per document)

**Step 2: Commit**

Commit: `git commit -m "feat: rebuild course detail screen to match design"`

---

## Task 11: Rebuild Document Detail Screen

**Files:**

- Rewrite: `app/document/[documentId].tsx`

**Step 1: Full rewrite**

Keep existing hooks (useParagraphs). Rebuild layout:

- Same structure as Course Detail but for paragraphs
- Header with back + document title
- FlatList of LessonItem components (one per paragraph)
- Each item shows paragraph number, title, type badge

**Step 2: Commit**

Commit: `git commit -m "feat: rebuild document detail screen to match design"`

---

## Task 12: Rebuild Lesson Screen & LessonTabBar

**Files:**

- Rewrite: `src/components/LessonTabBar.tsx`
- Rewrite: `app/lesson/[paragraphId].tsx`

**Step 1: Rewrite LessonTabBar to use SegmentedControl**

```typescript
import { SegmentedControl } from '@/src/components/SegmentedControl';
import { useI18n } from '@/src/i18n';
import { LearnTab } from '@/src/api/types';
import { useLearningStore } from '@/src/store/learningStore';
import { StyleSheet, View } from 'react-native';

interface LessonTabBarProps {
  hasKeywords: boolean;
  hasExercise: boolean;
}

export function LessonTabBar({ hasKeywords, hasExercise }: LessonTabBarProps) {
  const { t } = useI18n();
  const activeTab = useLearningStore((s) => s.activeTab);
  const setActiveTab = useLearningStore((s) => s.setActiveTab);

  const segments = [
    { value: LearnTab.LISTEN, label: t('learn.listen') },
    { value: LearnTab.SPEAKING, label: t('learn.speaking') },
    ...(hasKeywords ? [{ value: LearnTab.WORD, label: t('learn.word') }] : []),
    ...(hasExercise ? [{ value: LearnTab.EXERCISE, label: t('learn.exercise') }] : []),
  ];

  return (
    <View style={styles.container}>
      <SegmentedControl
        segments={segments}
        activeValue={activeTab}
        onValueChange={(v) => setActiveTab(v as LearnTab)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingVertical: 8 },
});
```

**Step 2: Rewrite lesson screen layout**

Keep all existing logic (useParagraphDetail, useSentences, useLearningStore, lazy imports). Rebuild layout:

- Header: back icon + title + type badge (pill) + more menu icon
- LessonTabBar (using new SegmentedControl)
- Content area for active tab (same Suspense wrapper)

**Step 3: Commit**

Commit: `git commit -m "feat: rebuild lesson screen with custom segmented control"`

---

## Task 13: Rebuild History Screen

**Files:**

- Rewrite: `app/(tabs)/history.tsx`

**Step 1: Full rewrite**

Keep existing hooks (useHistory). Rebuild layout:

- Header: "Learning History" title + bell icon
- Weekly stats card: white card with "This Week" badge, 3 stat columns (time studied, lessons done, words learned)
- "Recent Activity" section header with "All Types" filter
- FlatList of activity items — each row: type icon (green circle) + title + type/duration + score percentage (colored by threshold)

**Step 2: Commit**

Commit: `git commit -m "feat: rebuild history screen to match design"`

---

## Task 14: Rebuild Profile Screen

**Files:**

- Rewrite: `app/(tabs)/profile.tsx`

**Step 1: Full rewrite**

Keep existing hooks (useAuthStore, useSettingsStore, logout logic). Rebuild layout:

- Header: "Profile" title + settings gear icon
- Avatar: large green circle with initial letter, name + email below
- Stats row: 3 columns (Day Streak, Lessons, Words) — bold numbers + small labels
- Settings menu: 5 rounded card rows, each with icon (in green circle) + title + description + chevron
  - Language (Vietnamese + English)
  - Appearance (Light Mode)
  - Notifications (Daily reminders on)
  - Audio Settings (Auto-play, speed, translation)
  - Help & Support (FAQs, contact us)
- Logout button at bottom

**Step 2: Commit**

Commit: `git commit -m "feat: rebuild profile screen to match design"`

---

## Task 15: Final Integration & Cleanup

**Files:**

- Check: all files for hardcoded colors
- Check: unused imports from old components
- Verify: `bunx tsc --noEmit`
- Verify: `bun run lint`

**Step 1: Search for any hardcoded hex colors in screen files**

Run: `grep -rn '#[0-9A-Fa-f]\{6\}' app/ src/components/` and replace any remaining with `colors.*` references.

**Step 2: Run type check**

Run: `bunx tsc --noEmit`

**Step 3: Run linter**

Run: `bun run lint:fix`

**Step 4: Final commit**

Commit: `git commit -m "chore: cleanup hardcoded colors and lint fixes"`

---

## Execution Order & Dependencies

```
Task 1 (Theme) ─────────────────────┐
Task 2 (i18n)  ─────────────────────┤
Task 3 (SegmentedControl) ──────────┤
Task 4 (CourseCard) ────────────────┤
Task 5 (LessonItem) ───────────────┤── Foundation (parallel OK)
                                    │
Task 6 (PillTabBar + Tab Layout) ───┤── Depends on Task 1
                                    │
Task 7  (Login)          ──────────┐│
Task 8  (Home)           ──────────┤│
Task 9  (Courses)        ──────────┤├── Depends on Tasks 1-5
Task 10 (Course Detail)  ──────────┤│
Task 11 (Document Detail)──────────┤│
Task 12 (Lesson)         ──────────┤│
Task 13 (History)        ──────────┤│
Task 14 (Profile)        ──────────┘│
                                    │
Task 15 (Cleanup)        ───────────┘── Last
```

Tasks 1-5 can run in parallel. Tasks 7-14 can run in parallel after 1-5 complete. Task 6 and 15 are sequential.

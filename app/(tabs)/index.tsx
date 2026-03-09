import { useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useI18n } from '@/src/i18n';
import { useAuthStore } from '@/src/store/authStore';
import { useCourses } from '@/src/features/courses/hooks/useCourses';
import { colors } from '@/src/theme/colors';
import { CourseCard } from '@/src/components/CourseCard';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const LESSON_TYPES = [
  { key: 'image', icon: 'image' as const, color: colors.primaryLight },
  { key: 'chat', icon: 'chat' as const, color: '#FDEEE6' },
  { key: 'paragraph', icon: 'text-box' as const, color: '#FFF5E0' },
  { key: 'video', icon: 'video' as const, color: '#E8F0FE' },
];

const LEARNING_MODES = [
  { key: 'vocab', icon: 'book-open-variant' as const, color: colors.primary },
  { key: 'listening', icon: 'headphones' as const, color: colors.coral },
  { key: 'speaking', icon: 'microphone' as const, color: colors.primaryDark },
];

export default function HomeScreen() {
  const { t } = useI18n();
  const user = useAuthStore((s) => s.user);
  const member = useAuthStore((s) => s.member);
  const { data: courses, refetch, isRefetching } = useCourses();

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const displayName = user?.fullname ?? member?.fullname ?? '';
  const initial = displayName.charAt(0).toUpperCase() || '?';
  const firstCourse = courses?.courses?.[0];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Header */}
        <View style={styles.greetingRow}>
          <View style={styles.greetingLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={styles.greetingTextCol}>
              <Text style={styles.greetingSmall}>{t('home.goodMorning')}</Text>
              <Text style={styles.greetingName}>{displayName}</Text>
            </View>
          </View>
          <Pressable style={styles.bellButton}>
            <MaterialCommunityIcons name="bell-outline" size={22} color={colors.onSurface} />
          </Pressable>
        </View>

        {/* Search Bar */}
        <Pressable style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.textTertiary} />
          <Text style={styles.searchPlaceholder}>{t('home.searchPlaceholder')}</Text>
        </Pressable>

        {/* Lesson Types */}
        <Text style={styles.sectionTitle}>{t('home.lessonTypes')}</Text>
        <View style={styles.lessonTypesRow}>
          {LESSON_TYPES.map((item) => (
            <Pressable
              key={item.key}
              style={[styles.lessonTypeCard, { backgroundColor: item.color }]}
            >
              <MaterialCommunityIcons name={item.icon} size={28} color={colors.primary} />
              <Text style={styles.lessonTypeLabel}>
                {t(`home.${item.key}` as `home.${typeof item.key}`)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Learning Modes */}
        <Text style={styles.sectionTitle}>{t('home.learningModes')}</Text>
        <View style={styles.modesRow}>
          {LEARNING_MODES.map((mode) => (
            <Pressable key={mode.key} style={[styles.modePill, { backgroundColor: mode.color }]}>
              <MaterialCommunityIcons name={mode.icon} size={18} color={colors.onPrimary} />
              <Text style={styles.modePillText}>
                {t(`home.${mode.key}` as `home.${typeof mode.key}`)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Continue Learning */}
        <Text style={styles.sectionTitle}>{t('home.continueLearning')}</Text>
        {firstCourse ? (
          <CourseCard
            title={firstCourse.title}
            subtitle={firstCourse.title_vi}
            onPress={() => router.push(`/course/${firstCourse.id}`)}
          />
        ) : (
          <View style={styles.empty}>
            <MaterialCommunityIcons
              name="book-open-page-variant"
              size={48}
              color={colors.outline}
            />
            <Text style={styles.emptyText}>{t('common.noResults')}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 24,
  },
  // Greeting Header
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  greetingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 100,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  greetingTextCol: {
    gap: 2,
  },
  greetingSmall: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  greetingName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.onSurface,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 100,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A1918',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  // Search Bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    height: 48,
    borderWidth: 1,
    borderColor: colors.outline,
    paddingHorizontal: 16,
    gap: 12,
  },
  searchPlaceholder: {
    fontSize: 15,
    color: colors.textTertiary,
  },
  // Section Title
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.onSurface,
    letterSpacing: -0.2,
  },
  // Lesson Types
  lessonTypesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: -12,
  },
  lessonTypeCard: {
    flex: 1,
    minWidth: 70,
    height: 100,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  lessonTypeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.onSurface,
  },
  // Learning Modes
  modesRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: -12,
  },
  modePill: {
    flex: 1,
    height: 46,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  // Empty
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
});

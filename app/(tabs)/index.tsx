import { useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, useTheme, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useI18n } from '@/src/i18n';
import { useAuthStore } from '@/src/store/authStore';
import { useCourses } from '@/src/api/hooks/useCourses';
import { colors } from '@/src/theme/colors';
import { HOME_RECENT_COURSES_LIMIT } from '@/src/constants';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function HomeScreen() {
  const theme = useTheme();
  const { t } = useI18n();
  const user = useAuthStore((s) => s.user);
  const member = useAuthStore((s) => s.member);
  const { data: courses, refetch, isRefetching } = useCourses();

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />}
      >
        {/* Greeting */}
        <View style={styles.header}>
          <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>
            {t('home.greeting', { name: user?.fullname ?? member?.fullname ?? '' })}
          </Text>
        </View>

        {/* Daily Stats */}
        <Text
          variant="titleMedium"
          style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
        >
          {t('home.dailyStats')}
        </Text>
        <View style={styles.statsRow}>
          <Surface
            style={[styles.statCard, { backgroundColor: theme.colors.surface }]}
            elevation={1}
          >
            <MaterialCommunityIcons name="book-check" size={24} color={theme.colors.primary} />
            <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: '700' }}>
              0
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('home.lessonsCompleted')}
            </Text>
          </Surface>
          <Surface
            style={[styles.statCard, { backgroundColor: theme.colors.surface }]}
            elevation={1}
          >
            <MaterialCommunityIcons name="star" size={24} color={colors.warning} />
            <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: '700' }}>
              --
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('home.avgScore')}
            </Text>
          </Surface>
          <Surface
            style={[styles.statCard, { backgroundColor: theme.colors.surface }]}
            elevation={1}
          >
            <MaterialCommunityIcons name="translate" size={24} color={colors.success} />
            <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: '700' }}>
              0
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('home.wordsLearned')}
            </Text>
          </Surface>
        </View>

        {/* Token Balance */}
        {member && (
          <Surface
            style={[styles.balanceCard, { backgroundColor: theme.colors.primary }]}
            elevation={2}
          >
            <View style={styles.balanceRow}>
              <MaterialCommunityIcons name="star-circle" size={28} color={colors.onPrimary} />
              <View style={{ marginLeft: 12 }}>
                <Text variant="bodySmall" style={{ color: colors.onPrimaryMuted }}>
                  {t('profile.tokenBalance')}
                </Text>
                <Text variant="titleLarge" style={{ color: colors.onPrimary, fontWeight: '700' }}>
                  {t('profile.tokens', { count: member.member_token?.quantity ?? 0 })}
                </Text>
              </View>
            </View>
          </Surface>
        )}

        {/* Recent Courses */}
        <Text
          variant="titleMedium"
          style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
        >
          {t('home.recentCourses')}
        </Text>
        {courses?.courses?.slice(0, HOME_RECENT_COURSES_LIMIT).map((course) => (
          <Card
            key={course.id}
            style={[styles.courseCard, { backgroundColor: theme.colors.surface }]}
            onPress={() => router.push(`/course/${course.id}`)}
          >
            <Card.Content>
              <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
                {course.title}
              </Text>
              {course.title_vi && (
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
                >
                  {course.title_vi}
                </Text>
              )}
            </Card.Content>
          </Card>
        ))}

        {(!courses || courses.courses.length === 0) && (
          <View style={styles.empty}>
            <MaterialCommunityIcons
              name="book-open-page-variant"
              size={48}
              color={theme.colors.outline}
            />
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}
            >
              {t('common.noResults')}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 24 },
  sectionTitle: { fontWeight: '600', marginBottom: 12, marginTop: 8 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statCard: { flex: 1, alignItems: 'center', padding: 16, borderRadius: 12, gap: 4 },
  balanceCard: { padding: 16, borderRadius: 12, marginBottom: 16 },
  balanceRow: { flexDirection: 'row', alignItems: 'center' },
  courseCard: { marginBottom: 8, borderRadius: 12 },
  empty: { alignItems: 'center', paddingVertical: 48 },
});

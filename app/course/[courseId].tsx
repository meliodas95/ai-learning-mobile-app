import { useCallback } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useI18n } from '@/src/i18n';
import { useDocuments } from '@/src/features/courses/hooks/useCourses';
import type { DocumentEntity } from '@/src/api/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '@/src/theme/colors';
import { Typography } from '@/src/components/Typography';
import { LessonItem } from '@/src/components/LessonItem';

export default function CourseDetailScreen() {
  const { t } = useI18n();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { data: documents, isLoading } = useDocuments(courseId ? Number(courseId) : undefined);

  const totalDocuments = documents?.length ?? 0;
  const completedCount = 0; // placeholder - no completion tracking in current API
  const progressPercent =
    totalDocuments > 0 ? Math.round((completedCount / totalDocuments) * 100) : 0;

  const courseTitle = documents?.[0]?.course?.title ?? t('courses.documents');

  const renderDocument = useCallback(
    ({ item, index }: { item: DocumentEntity; index: number }) => (
      <LessonItem
        number={index + 1}
        title={item.title}
        meta={t('courses.lessons', { count: item.paragraphs?.length ?? 0 })}
        onPress={() => router.push(`/document/${item.id}`)}
      />
    ),
    [t],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={colors.onSurface} />
        </Pressable>
        <Typography size={22} weight="600" style={styles.headerTitle} numberOfLines={1}>
          {courseTitle}
        </Typography>
        <MaterialCommunityIcons name="bookmark-outline" size={22} color={colors.textTertiary} />
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCol}>
          <Typography size={22} weight="700" style={styles.statValue}>
            {totalDocuments}
          </Typography>
          <Typography size={12} color={colors.onSurfaceVariant} style={styles.statLabel}>
            {t('home.lessonsDone')}
          </Typography>
        </View>
        <View style={styles.statCol}>
          <Typography size={22} weight="700" style={styles.statValue}>
            240+
          </Typography>
          <Typography size={12} color={colors.onSurfaceVariant} style={styles.statLabel}>
            {t('home.vocab')}
          </Typography>
        </View>
        <View style={styles.statCol}>
          <Typography size={22} weight="700" style={styles.statValue}>
            3.5 hrs
          </Typography>
          <Typography size={12} color={colors.onSurfaceVariant} style={styles.statLabel}>
            {t('courses.estTime')}
          </Typography>
        </View>
      </View>

      {/* Progress Card */}
      <View style={styles.progressCard}>
        <View style={styles.progressTop}>
          <Typography size={15} weight="600">
            {t('courses.yourProgress')}
          </Typography>
          <Typography size={15} weight="700" color={colors.primary}>
            {progressPercent}%
          </Typography>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
        <Typography size={12} color={colors.onSurfaceVariant}>
          {t('courses.lessonsCompleted', { done: completedCount, total: totalDocuments })}
        </Typography>
      </View>

      {/* Lessons Section */}
      <View style={styles.lessonsSection}>
        <Typography size={18} weight="600" style={styles.lessonsHeader}>
          {t('courses.paragraphs')}
        </Typography>
        <FlatList
          data={documents}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderDocument}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.empty}>
                <MaterialCommunityIcons
                  name="book-open-variant"
                  size={48}
                  color={colors.textTertiary}
                />
                <Typography size={14} color={colors.onSurfaceVariant}>
                  {t('common.noResults')}
                </Typography>
              </View>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  headerTitle: {
    letterSpacing: -0.3,
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  statCol: { flex: 1, alignItems: 'center' },
  statValue: {
    letterSpacing: -0.5,
  },
  statLabel: { marginTop: 2 },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.outline,
    shadowColor: '#1A1918',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 1,
    gap: 14,
    marginHorizontal: 24,
  },
  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 100,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 100,
  },
  lessonsSection: { paddingHorizontal: 24, flex: 1, paddingTop: 24 },
  lessonsHeader: {
    letterSpacing: -0.2,
    marginBottom: 12,
  },
  list: { paddingBottom: 32 },
  empty: { alignItems: 'center', paddingVertical: 48, gap: 12 },
});

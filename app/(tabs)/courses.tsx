import { useState, useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Pressable, TextInput } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useI18n } from '@/src/i18n';
import { useCourses } from '@/src/features/courses/hooks/useCourses';
import type { CourseEntity } from '@/src/api/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '@/src/theme/colors';
import { CourseCard } from '@/src/components/CourseCard';
import { SegmentedControl } from '@/src/components/SegmentedControl';
import { Typography } from '@/src/components/Typography';

const SEGMENT_VALUES = ['all', 'inProgress', 'completed'] as const;

export default function CoursesScreen() {
  const { t } = useI18n();
  const { data: courses, refetch, isRefetching, isLoading } = useCourses();
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  const segments = useMemo(
    () => [
      { label: t('courses.all'), value: 'all' },
      { label: t('courses.inProgress'), value: 'inProgress' },
      { label: t('courses.completed'), value: 'completed' },
    ],
    [t],
  );

  const searchFiltered = useMemo(() => {
    const allCourses = courses?.courses ?? [];
    if (!search) return allCourses;
    const q = search.toLowerCase();
    return allCourses.filter(
      (c: CourseEntity) =>
        c.title.toLowerCase().includes(q) || c.title_vi?.toLowerCase().includes(q),
    );
  }, [courses, search]);

  const tabData = useMemo(
    () => [
      searchFiltered,
      searchFiltered.filter((c: CourseEntity) => c.status === 1),
      searchFiltered.filter((c: CourseEntity) => c.status === 2),
    ],
    [searchFiltered],
  );

  const handleSegmentChange = useCallback((value: string) => {
    const index = SEGMENT_VALUES.indexOf(value as (typeof SEGMENT_VALUES)[number]);
    if (index >= 0) {
      setActiveIndex(index);
      pagerRef.current?.setPage(index);
    }
  }, []);

  const renderCourse = useCallback(
    ({ item }: { item: CourseEntity }) => (
      <CourseCard
        title={item.title}
        subtitle={item.title_vi}
        onPress={() => router.push(`/course/${item.id}`)}
      />
    ),
    [],
  );

  const renderEmpty = useCallback(
    () =>
      !isLoading ? (
        <View style={styles.empty}>
          <MaterialCommunityIcons name="book-search" size={48} color={colors.textTertiary} />
          <Typography size={14} color={colors.onSurfaceVariant}>
            {t('common.noResults')}
          </Typography>
        </View>
      ) : null,
    [isLoading, t],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Typography size={26} weight="600" style={styles.headerTitle}>
          {t('courses.myCourses')}
        </Typography>
        <Pressable style={styles.searchButton} onPress={() => setShowSearch(!showSearch)}>
          <MaterialCommunityIcons
            name={showSearch ? 'close' : 'magnify'}
            size={18}
            color={colors.onSurfaceVariant}
          />
        </Pressable>
      </View>

      <View style={styles.content}>
        {showSearch && (
          <View style={styles.searchContainer}>
            <MaterialCommunityIcons name="magnify" size={16} color={colors.textTertiary} />
            <SearchInput value={search} onChangeText={setSearch} placeholder={t('common.search')} />
          </View>
        )}

        <SegmentedControl
          segments={segments}
          activeValue={SEGMENT_VALUES[activeIndex]}
          onValueChange={handleSegmentChange}
        />

        <PagerView
          ref={pagerRef}
          style={styles.pager}
          initialPage={0}
          onPageSelected={(e) => setActiveIndex(e.nativeEvent.position)}
        >
          {tabData.map((data, index) => (
            <View key={SEGMENT_VALUES[index]} style={styles.page}>
              <FlatList
                data={data}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderCourse}
                contentContainerStyle={styles.list}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                refreshControl={
                  <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
                }
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmpty}
              />
            </View>
          ))}
        </PagerView>
      </View>
    </SafeAreaView>
  );
}

function SearchInput({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textTertiary}
      style={styles.searchInputField}
      autoFocus
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  headerTitle: {
    letterSpacing: -0.5,
  },
  searchButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { paddingHorizontal: 24, gap: 24, flex: 1, paddingTop: 20 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 8,
    height: 44,
  },
  searchInputField: {
    flex: 1,
    fontSize: 14,
    color: colors.onSurface,
    height: 44,
  },
  pager: { flex: 1 },
  page: { flex: 1 },
  list: { paddingBottom: 32 },
  empty: { alignItems: 'center', paddingVertical: 48, gap: 12 },
});

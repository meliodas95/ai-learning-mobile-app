import { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Pressable, TextInput } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useI18n } from '@/src/i18n';
import { useCourses } from '@/src/api/hooks/useCourses';
import type { CourseEntity } from '@/src/api/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '@/src/theme/colors';
import { CourseCard } from '@/src/components/CourseCard';
import { SegmentedControl } from '@/src/components/SegmentedControl';

export default function CoursesScreen() {
  const { t } = useI18n();
  const { data: courses, refetch, isRefetching, isLoading } = useCourses();
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [activeSegment, setActiveSegment] = useState('all');

  const segments = useMemo(
    () => [
      { label: t('courses.all'), value: 'all' },
      { label: t('courses.inProgress'), value: 'inProgress' },
      { label: t('courses.completed'), value: 'completed' },
    ],
    [t],
  );

  const filtered = useMemo(() => {
    let list = courses?.courses ?? [];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c: CourseEntity) =>
          c.title.toLowerCase().includes(q) || c.title_vi?.toLowerCase().includes(q),
      );
    }

    if (activeSegment === 'inProgress') {
      list = list.filter((c: CourseEntity) => c.status === 1);
    } else if (activeSegment === 'completed') {
      list = list.filter((c: CourseEntity) => c.status === 2);
    }

    return list;
  }, [courses, search, activeSegment]);

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('courses.myCourses')}</Text>
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
          activeValue={activeSegment}
          onValueChange={setActiveSegment}
        />

        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderCourse}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.empty}>
                <MaterialCommunityIcons name="book-search" size={48} color={colors.textTertiary} />
                <Text style={styles.emptyText}>{t('common.noResults')}</Text>
              </View>
            ) : null
          }
        />
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
    fontSize: 26,
    fontWeight: '600',
    letterSpacing: -0.5,
    color: colors.onSurface,
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
  list: { paddingBottom: 32 },
  empty: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  emptyText: { fontSize: 14, color: colors.onSurfaceVariant },
});

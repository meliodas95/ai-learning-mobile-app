import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Pressable, TextInput, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useI18n } from '@/src/i18n';
import { useAuthStore } from '@/src/store/authStore';
import { useCourses } from '@/src/features/courses/hooks/useCourses';
import { colors } from '@/src/theme/colors';
import { Typography } from '@/src/components/Typography';
import { CourseCard } from '@/src/components/CourseCard';
import type { CourseEntity } from '@/src/api/types';

const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT = 10;

export default function SearchScreen() {
  const { t } = useI18n();
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const memberCategories = useAuthStore((s) => s.memberCategories);
  const { data: courses } = useCourses();

  // Load recent searches
  useEffect(() => {
    AsyncStorage.getItem(RECENT_SEARCHES_KEY).then((raw) => {
      if (raw) setRecentSearches(JSON.parse(raw));
    });
  }, []);

  // Auto-focus input
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const saveRecent = useCallback(
    async (term: string) => {
      const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, MAX_RECENT);
      setRecentSearches(updated);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    },
    [recentSearches],
  );

  const removeRecent = useCallback(
    async (term: string) => {
      const updated = recentSearches.filter((s) => s !== term);
      setRecentSearches(updated);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    },
    [recentSearches],
  );

  const clearAllRecent = useCallback(async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
  }, []);

  // Popular keywords from member categories
  const popularKeywords = useMemo(() => {
    return memberCategories
      .flatMap((cat) => [cat, ...cat.items])
      .filter((cat) => cat.title)
      .slice(0, 8)
      .map((cat) => cat.title);
  }, [memberCategories]);

  const handleSearch = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      if (!trimmed) return;
      setQuery(trimmed);
      saveRecent(trimmed);
      Keyboard.dismiss();
    },
    [saveRecent],
  );

  // Filter courses by query
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return (courses?.courses ?? []).filter(
      (c: CourseEntity) =>
        c.title.toLowerCase().includes(q) || c.title_vi?.toLowerCase().includes(q),
    );
  }, [courses, query]);

  const hasQuery = query.trim().length > 0;

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
      {/* Search Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.onSurface} />
        </Pressable>
        <View style={styles.searchInputContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.textTertiary} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder={t('common.search')}
            placeholderTextColor={colors.textTertiary}
            returnKeyType="search"
            onSubmitEditing={() => handleSearch(query)}
          />
          {hasQuery && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <MaterialCommunityIcons name="close-circle" size={18} color={colors.textTertiary} />
            </Pressable>
          )}
        </View>
      </View>

      {hasQuery ? (
        /* Search Results */
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderCourse}
          contentContainerStyle={styles.resultsList}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="magnify-close" size={48} color={colors.textTertiary} />
              <Typography size={14} color={colors.onSurfaceVariant}>
                {t('common.noResults')}
              </Typography>
            </View>
          }
        />
      ) : (
        /* Default: Popular Keywords + Recent Searches */
        <FlatList
          data={[]}
          renderItem={null}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.suggestions}>
              {/* Popular Keywords */}
              {popularKeywords.length > 0 && (
                <View style={styles.section}>
                  <Typography size={14} color={colors.onSurfaceVariant}>
                    {t('search.popularKeywords')}
                  </Typography>
                  <View style={styles.chipsRow}>
                    {popularKeywords.map((keyword) => (
                      <Pressable
                        key={keyword}
                        style={styles.chip}
                        onPress={() => handleSearch(keyword)}
                      >
                        <Typography size={14} weight="500">
                          {keyword}
                        </Typography>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Typography size={14} color={colors.onSurfaceVariant}>
                      {t('search.recentSearches')}
                    </Typography>
                    <Pressable onPress={clearAllRecent} hitSlop={8}>
                      <Typography size={13} color={colors.primary}>
                        {t('search.clearAll')}
                      </Typography>
                    </Pressable>
                  </View>
                  {recentSearches.map((term) => (
                    <View key={term} style={styles.recentRow}>
                      <Pressable style={styles.recentTextRow} onPress={() => handleSearch(term)}>
                        <MaterialCommunityIcons
                          name="history"
                          size={18}
                          color={colors.onSurfaceVariant}
                        />
                        <Typography size={15} style={styles.recentText}>
                          {term}
                        </Typography>
                      </Pressable>
                      <Pressable onPress={() => removeRecent(term)} hitSlop={8}>
                        <MaterialCommunityIcons
                          name="close"
                          size={16}
                          color={colors.textTertiary}
                        />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.onSurface,
    paddingVertical: 0,
  },
  // Suggestions
  suggestions: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 28,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Chips
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  // Recent
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  recentTextRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recentText: {
    flex: 1,
  },
  // Results
  resultsList: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
});

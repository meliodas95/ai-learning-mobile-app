import { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, Searchbar, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useCourses } from '@/src/api/hooks/useCourses';
import type { CourseEntity } from '@/src/api/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function CoursesScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { data: courses, refetch, isRefetching, isLoading } = useCourses();
  const [search, setSearch] = useState('');

  const filtered = courses?.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.title_vi?.toLowerCase().includes(search.toLowerCase())
  );

  const renderCourse = useCallback(({ item }: { item: CourseEntity }) => (
    <Card
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={() => router.push(`/course/${item.id}`)}
    >
      <Card.Content style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>{item.title}</Text>
          {item.title_vi && (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              {item.title_vi}
            </Text>
          )}
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.onSurfaceVariant} />
      </Card.Content>
    </Card>
  ), [theme]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerSection}>
        <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>
          {t('courses.allCourses')}
        </Text>
        <Searchbar
          placeholder={t('common.search')}
          value={search}
          onChangeText={setSearch}
          style={[styles.searchbar, { backgroundColor: theme.colors.surfaceVariant }]}
          inputStyle={{ fontSize: 14 }}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderCourse}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <MaterialCommunityIcons name="book-search" size={48} color={theme.colors.outline} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}>
                {t('common.noResults')}
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerSection: { padding: 16, gap: 12 },
  searchbar: { borderRadius: 12, elevation: 0 },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  card: { marginBottom: 8, borderRadius: 12 },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  empty: { alignItems: 'center', paddingVertical: 48 },
});

import { useCallback } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useI18n } from '@/src/i18n';
import { useParagraphs } from '@/src/api/hooks/useCourses';
import type { ParagraphEntity } from '@/src/api/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '@/src/theme/colors';
import { LessonItem } from '@/src/components/LessonItem';

export default function DocumentDetailScreen() {
  const { t } = useI18n();
  const { documentId } = useLocalSearchParams<{ documentId: string }>();
  const { data: paragraphs, isLoading } = useParagraphs(
    documentId ? Number(documentId) : undefined,
  );

  const renderParagraph = useCallback(
    ({ item, index }: { item: ParagraphEntity; index: number }) => (
      <LessonItem
        number={index + 1}
        title={item.title}
        type={item.type !== undefined ? String(item.type) : undefined}
        onPress={() => router.push(`/lesson/${item.id}`)}
      />
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {t('courses.paragraphs')}
        </Text>
      </View>

      {/* Paragraphs List */}
      <FlatList
        data={paragraphs}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderParagraph}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <MaterialCommunityIcons
                name="text-box-outline"
                size={48}
                color={colors.textTertiary}
              />
              <Text style={styles.emptyText}>{t('common.noResults')}</Text>
            </View>
          ) : null
        }
      />
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
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.3,
    flex: 1,
    color: colors.onSurface,
  },
  list: { paddingHorizontal: 24, paddingBottom: 32 },
  empty: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  emptyText: { fontSize: 14, color: colors.onSurfaceVariant },
});

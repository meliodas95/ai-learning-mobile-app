import { useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, useTheme, IconButton, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useParagraphs } from '@/src/api/hooks/useCourses';
import type { ParagraphEntity } from '@/src/api/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function DocumentDetailScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { documentId } = useLocalSearchParams<{ documentId: string }>();
  const { data: paragraphs, isLoading } = useParagraphs(
    documentId ? Number(documentId) : undefined,
  );

  const renderParagraph = useCallback(
    ({ item }: { item: ParagraphEntity }) => (
      <Card
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        onPress={() => router.push(`/lesson/${item.id}`)}
      >
        <Card.Content>
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
                {item.title}
              </Text>
              {item.description && (
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
              )}
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.colors.onSurfaceVariant}
            />
          </View>
          <View style={styles.chipRow}>
            <Chip compact textStyle={{ fontSize: 11 }} style={styles.chip}>
              {item.type}
            </Chip>
            {item.is_favourite && (
              <MaterialCommunityIcons name="heart" size={16} color={theme.colors.error} />
            )}
          </View>
        </Card.Content>
      </Card>
    ),
    [theme],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} />
        <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: '700' }}>
          {t('courses.paragraphs')}
        </Text>
      </View>
      <FlatList
        data={paragraphs}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderParagraph}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
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
  header: { flexDirection: 'row', alignItems: 'center', paddingRight: 16, gap: 4 },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  card: { marginBottom: 8, borderRadius: 12 },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  chipRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  chip: { height: 24 },
  empty: { alignItems: 'center', paddingVertical: 48 },
});

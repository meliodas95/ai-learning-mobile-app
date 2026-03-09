import { View, StyleSheet, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { Typography } from '@/src/components/Typography';
import { colors } from '@/src/theme/colors';
import type { NewsItem } from '@/src/api/types';

interface NewsFeedItemProps {
  item: NewsItem;
}

function getItemData(newsItem: NewsItem) {
  const key = newsItem.item as keyof NewsItem;
  const nested = newsItem[key] as
    | { title?: string; title_vi?: string; keyx?: string; id?: number }
    | undefined;
  return nested;
}

function getIcon(type: number) {
  switch (type) {
    case 1:
      return 'text-box-outline' as const;
    case 2:
      return 'chat-outline' as const;
    case 3:
      return 'file-document-outline' as const;
    case 4:
      return 'image-outline' as const;
    default:
      return 'text-box-outline' as const;
  }
}

export function NewsFeedItem({ item }: NewsFeedItemProps) {
  const nested = getItemData(item);
  const title = nested?.title ?? item.title;
  const sentences = item.new_details?.slice(0, 3) ?? [];

  const handlePress = () => {
    if (item.paragraph) {
      router.push(`/lesson/${item.paragraph.id}`);
    } else if (item.document) {
      router.push(`/document/${item.document.id}`);
    } else if (item.course) {
      router.push(`/course/${item.course.id}`);
    }
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name={getIcon(item.type)} size={16} color={colors.primary} />
        </View>
        <Typography size={15} weight="600" style={styles.title} numberOfLines={2}>
          {title}
        </Typography>
      </View>

      {sentences.length > 0 && (
        <View style={styles.sentences}>
          {sentences.map((detail, i) => (
            <Typography
              key={detail.sentence?.id ?? i}
              size={14}
              color={colors.onSurfaceVariant}
              numberOfLines={1}
              style={styles.sentence}
            >
              {detail.sentence?.content}
            </Typography>
          ))}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
  },
  sentences: {
    marginTop: 10,
    gap: 6,
    paddingLeft: 42,
  },
  sentence: {
    lineHeight: 20,
  },
});

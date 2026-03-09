import { View, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { Typography } from '@/src/components/Typography';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = 'alert-circle-outline',
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
        size={56}
        color={theme.colors.outline}
      />
      <Typography weight="600" color={theme.colors.onSurface} style={styles.title}>
        {title}
      </Typography>
      {subtitle && (
        <Typography size={14} color={theme.colors.onSurfaceVariant} style={styles.subtitle}>
          {subtitle}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button mode="contained" onPress={onAction} style={styles.button}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { marginTop: 16, textAlign: 'center' },
  subtitle: { marginTop: 8, textAlign: 'center' },
  button: { marginTop: 24, borderRadius: 12 },
});

import { useCallback, forwardRef } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Typography } from '@/src/components/Typography';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { colors } from '@/src/theme/colors';

interface SettingsBottomSheetProps {
  title: string;
  children: React.ReactNode;
}

export const SettingsBottomSheet = forwardRef<BottomSheet, SettingsBottomSheetProps>(
  function SettingsBottomSheet({ title, children }, ref) {
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.4} />
      ),
      [],
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        enablePanDownToClose
        enableDynamicSizing
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={styles.handle}
        backgroundStyle={styles.background}
      >
        <BottomSheetView style={styles.content}>
          <Typography size={20} weight="700" color={colors.onSurface} style={styles.title}>
            {title}
          </Typography>
          {children}
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

// Reusable row components for bottom sheet content

interface ToggleRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}

export function ToggleRow({ icon, title, description, value, onToggle }: ToggleRowProps) {
  return (
    <Pressable style={styles.row} onPress={() => onToggle(!value)}>
      <View style={styles.rowIconCircle}>{icon}</View>
      <View style={styles.rowTextCol}>
        <Typography size={15} weight="600" color={colors.onSurface}>
          {title}
        </Typography>
        <Typography size={12} color={colors.onSurfaceVariant}>
          {description}
        </Typography>
      </View>
      <View style={[styles.toggle, value && styles.toggleActive]}>
        <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
      </View>
    </Pressable>
  );
}

interface SelectRowProps {
  icon: React.ReactNode;
  title: string;
  selected: boolean;
  onPress: () => void;
}

export function SelectRow({ icon, title, selected, onPress }: SelectRowProps) {
  return (
    <Pressable style={[styles.row, selected && styles.rowSelected]} onPress={onPress}>
      <View style={[styles.rowIconCircle, selected && styles.rowIconCircleSelected]}>{icon}</View>
      <Typography
        size={15}
        weight="600"
        color={selected ? colors.primary : colors.onSurface}
        style={styles.rowTitleFlex}
      >
        {title}
      </Typography>
      {selected && (
        <View style={styles.checkCircle}>
          <Typography size={14} weight="700" color={colors.onPrimary}>
            ✓
          </Typography>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  handle: {
    backgroundColor: colors.outlineStrong,
    width: 40,
  },
  background: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
  },
  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.elevated,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  rowSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  rowIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconCircleSelected: {
    backgroundColor: colors.primary,
  },
  rowTextCol: {
    flex: 1,
    marginLeft: 12,
    gap: 2,
  },
  rowTitleFlex: {
    flex: 1,
    marginLeft: 12,
  },
  // Toggle
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.outlineStrong,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surface,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  // Check
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

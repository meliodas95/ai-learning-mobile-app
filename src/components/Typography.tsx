import { Text, type TextProps } from 'react-native';
import { colors } from '@/src/theme/colors';

interface TypographyProps extends TextProps {
  size?: number;
  weight?: TextProps['style'] extends infer S
    ? S extends { fontWeight?: infer W }
      ? W
      : never
    : never;
  color?: string;
}

const DEFAULT_SIZE = 16;

export function Typography({
  size = DEFAULT_SIZE,
  weight,
  color = colors.onSurface,
  style,
  ...props
}: TypographyProps) {
  return <Text style={[{ fontSize: size, fontWeight: weight, color }, style]} {...props} />;
}

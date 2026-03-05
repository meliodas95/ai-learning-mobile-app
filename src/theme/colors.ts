export const colors = {
  // Primary greens
  primary: '#3D8A5A',
  primaryDark: '#4D9B6A',
  primaryLight: '#C8F0D8',

  // Accent
  coral: '#D89575',

  // Backgrounds
  background: '#F5F4F1',
  surface: '#FFFFFF',
  surfaceVariant: '#EDECEA',
  elevated: '#FAFAF8',

  // Borders
  outline: '#E5E4E1',
  outlineStrong: '#D1D0CD',

  // Text
  onSurface: '#1A1918',
  onSurfaceVariant: '#6D6C6A',
  textTertiary: '#9C9B99',
  onPrimary: '#FFFFFF',

  // Tab bar
  tabInactive: '#A8A7A5',
  tabBarBg: '#FFFFFF',

  // Status
  error: '#D08068',
  warning: '#D4A64A',
  success: '#3D8A5A',

  // Score colors
  scoreGreen: '#3D8A5A',
  scoreYellow: '#D4A64A',
  scoreRed: '#D08068',
} as const;

export type AppColors = typeof colors;

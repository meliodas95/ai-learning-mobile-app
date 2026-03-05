export const colors = {
  primary: '#1A1A2E',
  secondary: '#16213E',
  tertiary: '#0F3460',
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F7',
  background: '#FAFAFA',
  outline: '#E0E0E0',
  onPrimary: '#FFFFFF',
  onPrimaryMuted: 'rgba(255,255,255,0.7)',
  onSurface: '#1A1A2E',
  onSurfaceVariant: '#6B7280',
  error: '#E53935',
  success: '#43A047',
  warning: '#FB8C00',
  scoreRed: '#E53935',
  scoreYellow: '#FB8C00',
  scoreGreen: '#43A047',
} as const;

export type AppColors = typeof colors;

import { vars } from 'nativewind';
import { fontSize, spacing } from './sizes';

export const globalThemeVars = vars({
  '--scale-font-xs': fontSize.xs,
  '--scale-font-sm': fontSize.sm,
  '--scale-font-md': fontSize.md,
  '--scale-font-lg': fontSize.lg,
  '--scale-font-xl': fontSize.xl,
  '--scale-font-xxl': fontSize.xxl,
  '--scale-font-xxxl': fontSize.xxxl,
  '--scale-font-display': fontSize.display,

  '--scale-space-xs': spacing.xs,
  '--scale-space-sm': spacing.sm,
  '--scale-space-md': spacing.md,
  '--scale-space-lg': spacing.lg,
  '--scale-space-xl': spacing.xl,
  '--scale-space-xxl': spacing.xxl,
  '--scale-space-xxxl': spacing.xxxl,
});

import { vars } from 'nativewind';
import { fontSize, spacing } from './sizes';

const scaleVars = {
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
};

export const darkThemeVars = vars({
  ...scaleVars,
  '--color-primary': '#3B82F6',
  '--color-secondary': '#60A5FA',
  '--color-accent': '#10B981',
  '--color-bg': '#0B1120',
  '--color-surface': '#1E293B',
  '--color-surface-alt': '#0E1A2E',
  '--color-text': '#F8FAFC',
  '--color-muted': '#94A3B8',
  '--color-border': 'rgba(255, 255, 255, 0.1)',
});

export const lightThemeVars = vars({
  ...scaleVars,
  '--color-primary': '#2563EB',
  '--color-secondary': '#3B82F6',
  '--color-accent': '#059669',
  '--color-bg': '#F1F5F9',
  '--color-surface': '#FFFFFF',
  '--color-surface-alt': '#E2E8F0',
  '--color-text': '#0F172A',
  '--color-muted': '#64748B',
  '--color-border': 'rgba(0, 0, 0, 0.08)',
});

// Keep backwards-compat export
export const globalThemeVars = darkThemeVars;


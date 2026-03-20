import { useAppStore } from '@/store/useAppStore';
import { COLORS, LIGHT_COLORS } from '@/constants/theme';
import { darkThemeVars, lightThemeVars } from '@/constants/themeVars';

/**
 * Returns the current theme's color palette and CSS vars for use in JS-side styles.
 * Use className for NativeWind classes (they automatically adapt via CSS vars).
 * Use `colors` for style={{ color: colors.text }} type usage.
 */
export const useTheme = () => {
  const { theme } = useAppStore();
  const isDark = theme === 'dark';

  return {
    isDark,
    colors: isDark ? COLORS : LIGHT_COLORS,
    vars: isDark ? darkThemeVars : lightThemeVars,
  };
};

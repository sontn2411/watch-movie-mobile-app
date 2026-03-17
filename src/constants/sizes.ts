import { normalize, moderateScale } from '../utils/responsive';

export const spacing = {
  xs: normalize(4),
  sm: normalize(8),
  md: normalize(16),
  lg: normalize(24),
  xl: normalize(32),
  xxl: normalize(40),
  xxxl: normalize(48),
};

export const fontSize = {
  xs: moderateScale(12),
  sm: moderateScale(14),
  md: moderateScale(16),
  lg: moderateScale(18),
  xl: moderateScale(20),
  xxl: moderateScale(24),
  xxxl: moderateScale(32),
  display: moderateScale(40),
};

export const borderRadius = {
  sm: normalize(4),
  md: normalize(8),
  lg: normalize(16),
  xl: normalize(24),
  full: 9999,
};

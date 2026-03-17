import { Dimensions, PixelRatio } from 'react-native';

const baseWidth = 375;

const scale = (size: number) => {
  const currentWidth = Dimensions.get('window').width;
  return (currentWidth / baseWidth) * size;
};

export const normalize = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(scale(size)));

export const moderateScale = (size: number, factor = 0.5) =>
  Math.round(PixelRatio.roundToNearestPixel(size + (scale(size) - size) * factor));

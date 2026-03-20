import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const isPad = Platform.OS === 'ios' && (width >= 768 || height >= 768);

export const getResponsiveWidth = (mobileWidth: number, padWidth: number) => {
  return isPad ? padWidth : mobileWidth;
};

export const getResponsiveMultiplier = (mobileMultiplier: number, padMultiplier: number) => {
  return isPad ? padMultiplier : mobileMultiplier;
};

import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, DimensionValue } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  className?: string;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export const Skeleton = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 8,
  className 
}: SkeletonProps) => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      (width?.toString().includes('%') ? -400 : -(Number(width) || 400)), 
      (width?.toString().includes('%') ? 400 : (Number(width) || 400))
    ],
  });

  return (
    <View 
      className={`bg-white/5 overflow-hidden ${className || ''}`}
      style={{ 
        width, 
        height, 
        borderRadius 
      }}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.05)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

export const MovieCardSkeleton = ({ width = 110, height = 160 }: { width?: number; height?: number }) => (
  <View style={{ width, marginRight: 12 }}>
    <Skeleton width={width} height={height} borderRadius={12} className="mb-2" />
    <Skeleton width={width * 0.8} height={12} borderRadius={4} className="mb-1" />
    <Skeleton width={width * 0.5} height={10} borderRadius={4} />
  </View>
);

export const SearchCardSkeleton = ({ width }: { width: number }) => (
  <View style={{ width, margin: 4 }}>
    <Skeleton width={width} height={width * 1.5} borderRadius={12} className="mb-2" />
    <Skeleton width={width * 0.8} height={12} borderRadius={4} className="mb-1" />
  </View>
);

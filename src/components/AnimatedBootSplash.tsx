import React, { useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import BootSplash from 'react-native-bootsplash';

type Props = {
  onAnimationEnd: () => void;
};

export const AnimatedBootSplash = ({ onAnimationEnd }: Props) => {
  const [opacity] = useState(() => new Animated.Value(1));
  const [scale] = useState(() => new Animated.Value(1));
  
  const { container, logo } = BootSplash.useHideAnimation({
    manifest: require('../assets/bootsplash/manifest.json'),
    logo: require('../assets/bootsplash/logo.png'),
    statusBarTranslucent: true,
    navigationBarTranslucent: false,

    animate: () => {
      Animated.sequence([
        // Step 1: Subtle pop-up bounce
        Animated.spring(scale, {
          useNativeDriver: true,
          toValue: 1.15,
          friction: 5,
          tension: 60,
        }),
        // Step 2: Smooth scale down and fade out simultaneously
        Animated.parallel([
          Animated.timing(scale, {
            useNativeDriver: true,
            toValue: 0.8,
            duration: 350,
          }),
          Animated.timing(opacity, {
            useNativeDriver: true,
            toValue: 0,
            duration: 350,
            delay: 100, // wait slightly before fading
          }),
        ])
      ]).start(() => {
        onAnimationEnd();
      });
    },
  });

  return (
    <Animated.View {...container} style={[container.style, { opacity }]}>
      <Animated.Image
        {...logo}
        style={[logo.style, { transform: [{ scale }] }]}
      />
    </Animated.View>
  );
};

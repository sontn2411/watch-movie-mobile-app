import React, { useState } from 'react';
import { StatusBar, View, Image, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  DarkTheme,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { globalThemeVars } from '@/constants/themeVars';
import { COLORS } from '@/constants/theme';
import { AnimatedBootSplash } from '@/components/AnimatedBootSplash';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import RNLinearGradient from 'react-native-linear-gradient';

const queryClient = new QueryClient();

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [appReady, setAppReady] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);
  const [currentRouteName, setCurrentRouteName] = useState<
    string | undefined
  >();

  const navigationRef = useNavigationContainerRef();

  const isAuthRoute =
    currentRouteName === 'Welcome' || currentRouteName === 'Auth';

  const bgColor = COLORS.background;
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer
          ref={navigationRef}
          theme={DarkTheme}
          onReady={() => {
            setAppReady(true);
            const route = navigationRef.getCurrentRoute()?.name;
            setCurrentRouteName(route);
          }}
          onStateChange={() => {
            const route = navigationRef.getCurrentRoute()?.name;
            setCurrentRouteName(route);
          }}
        >
          <View style={[globalThemeVars, { backgroundColor: bgColor }]} className="flex-1">
            <StatusBar
              barStyle="light-content"
              backgroundColor={COLORS.background}
            />

            {/* Conditional Auth Background */}
            {isAuthRoute && (
              <View 
                style={{ height: isLandscape ? height * 0.8 : height * 0.6 }}
                className="absolute top-0 left-0 right-0 w-full"
              >
                <Image
                  source={require('@/assets/images/bgSplash.webp')}
                  resizeMode="cover"
                  className="w-full h-full"
                />
                
                {/* Cinematic Gradient Overlays (matching Hero style) */}
                <RNLinearGradient
                  colors={[
                    'transparent',
                    'rgba(11, 17, 32, 0.4)',
                    'rgba(11, 17, 32, 0.8)',
                    'rgba(11, 17, 32, 1)',
                  ]}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                />
                <RNLinearGradient
                  colors={['transparent', 'rgba(11, 17, 32, 0.9)', 'rgba(11, 17, 32, 1)']}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                  }}
                />
              </View>
            )}
            <View className="flex-1">{children}</View>
          </View>
        </NavigationContainer>
      </QueryClientProvider>

      {appReady && splashVisible && (
        <AnimatedBootSplash onAnimationEnd={() => setSplashVisible(false)} />
      )}
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
  },
});

export default RootLayout;

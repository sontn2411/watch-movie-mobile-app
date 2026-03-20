import React, { useState } from 'react';
import { StatusBar, View, Image, useWindowDimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { darkThemeVars, lightThemeVars } from '@/constants/themeVars';
import { AnimatedBootSplash } from '@/components/AnimatedBootSplash';
import RNLinearGradient from 'react-native-linear-gradient';
import { ToastProvider } from '@/components/common/ToastProvider';
import { useAppStore } from '@/store/useAppStore';

const queryClient = new QueryClient();

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [appReady, setAppReady] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);
  const [currentRouteName, setCurrentRouteName] = useState<string | undefined>();

  const { theme } = useAppStore();
  const isDark = theme === 'dark';

  const navigationRef = useNavigationContainerRef();

  const isAuthRoute =
    currentRouteName === 'Welcome' || currentRouteName === 'Auth';

  const themeVars = isDark ? darkThemeVars : lightThemeVars;
  const navTheme = isDark ? DarkTheme : {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#F1F5F9',
      card: '#FFFFFF',
      text: '#0F172A',
      border: 'rgba(0,0,0,0.08)',
    },
  };

  const bgColor = isDark ? '#0B1120' : '#F1F5F9';

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer
          ref={navigationRef}
          theme={navTheme}
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
          <View style={[themeVars, { backgroundColor: bgColor }]} className="flex-1">
            <StatusBar
              barStyle={isDark ? 'light-content' : 'dark-content'}
              backgroundColor={bgColor}
            />

            {/* Auth Background - Image for both but different overlays */}
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
                
                {/* Layered gradients for smooth blending */}
                <RNLinearGradient
                  colors={[
                    'transparent',
                    isDark ? 'rgba(11, 17, 32, 0.4)' : 'rgba(241, 245, 249, 0.4)',
                    isDark ? 'rgba(11, 17, 32, 0.8)' : 'rgba(241, 245, 249, 0.8)',
                    bgColor,
                  ]}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                />
                <RNLinearGradient
                  colors={['transparent', isDark ? 'rgba(11, 17, 32, 0.9)' : 'rgba(241, 245, 249, 0.9)', bgColor]}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '60%',
                  }}
                />
              </View>
            )}

            <View className="flex-1">{children}</View>
            <ToastProvider />
          </View>
        </NavigationContainer>
      </QueryClientProvider>

      {appReady && splashVisible && (
        <AnimatedBootSplash isDark={isDark} onAnimationEnd={() => setSplashVisible(false)} />
      )}

    </SafeAreaProvider>
  );
};

export default RootLayout;

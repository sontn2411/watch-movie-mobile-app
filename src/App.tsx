import React, { useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './styles/global.css'; // Global styles
import { globalThemeVars } from '@/constants/themeVars';
import BootSplash from 'react-native-bootsplash';
import { COLORS } from '@/constants/theme';
import RootNavigator from '@/navigation/RootNavigator';
import { AnimatedBootSplash } from '@/components/AnimatedBootSplash';

const queryClient = new QueryClient();

function App() {
  const [appReady, setAppReady] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer theme={DarkTheme} onReady={() => setAppReady(true)}>
          <View style={globalThemeVars} className="flex-1">
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
            <RootNavigator />
          </View>
        </NavigationContainer>
      </QueryClientProvider>
      
      {appReady && splashVisible && (
        <AnimatedBootSplash onAnimationEnd={() => setSplashVisible(false)} />
      )}
    </SafeAreaProvider>
  );
}

export default App;

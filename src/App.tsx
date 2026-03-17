import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './styles/global.css'; // Global styles
import { globalThemeVars } from '@/constants/themeVars';
import { COLORS } from '@/constants/theme';
import RootNavigator from '@/navigation/RootNavigator';

const queryClient = new QueryClient();

function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer theme={DarkTheme}>
          <View style={globalThemeVars} className="flex-1">
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
            <RootNavigator />
          </View>
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;

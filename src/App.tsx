import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './styles/global.css'; // Global styles
import { globalThemeVars } from '@/constants/themeVars';
import RootNavigator from '@/navigation/RootNavigator';

const queryClient = new QueryClient();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <View style={globalThemeVars} className="flex-1">
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <RootNavigator />
          </View>
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;

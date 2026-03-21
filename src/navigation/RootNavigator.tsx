import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import DetailScreen from '@/screens/DetailScreen';
import SeeMoreScreen from '@/screens/SeeMoreScreen';
import WatchScreen from '@/screens/WatchScreen';
import WelcomeScreen, { storage } from '@/screens/WelcomeScreen';
import AuthScreen from '@/screens/AuthScreen';
import HistoryScreen from '@/screens/HistoryScreen';
import WatchOfflineScreen from '@/screens/WatchOfflineScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const hasSeenWelcome = storage.getBoolean('hasSeenWelcome');

  return (
    <Stack.Navigator
      initialRouteName={hasSeenWelcome ? 'Main' : 'Welcome'}
      // initialRouteName={'Welcome'}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0B1120',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={DetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SeeMore"
        component={SeeMoreScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
      <Stack.Screen
        name="Watch"
        component={WatchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WatchOffline"
        component={WatchOfflineScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

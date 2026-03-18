import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import DetailScreen from '@/screens/DetailScreen';
import SeeMoreScreen from '@/screens/SeeMoreScreen';
import WatchScreen from '@/screens/WatchScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
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
    </Stack.Navigator>
  );
}

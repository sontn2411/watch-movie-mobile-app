import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/screens/HomeScreen';
import ExploreScreen from '@/screens/ExploreScreen';
import DownloadsScreen from '@/screens/DownloadsScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import CustomTabBar from '@/components/navigation/CustomTabBar';
import { View } from 'react-native';

export type TabParamList = {
  'Trang chủ': undefined;
  'Khám phá': undefined;
  'Tải về': undefined;
  'Cá nhân': undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Trang chủ" component={HomeScreen} />
      <Tab.Screen name="Khám phá" component={ExploreScreen} />
      <Tab.Screen name="Tải về" component={DownloadsScreen} />
      <Tab.Screen name="Cá nhân" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;

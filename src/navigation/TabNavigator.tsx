import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/screens/HomeScreen';
import SearchScreen from '@/screens/SearchScreen';
import DownloadsScreen from '@/screens/DownloadsScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import CustomTabBar from '@/components/navigation/CustomTabBar';
import { View } from 'react-native';

export type TabParamList = {
  'Trang chủ': undefined;
  'Tìm kiếm': undefined;
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
      <Tab.Screen name="Tìm kiếm" component={SearchScreen} />
      <Tab.Screen name="Tải về" component={DownloadsScreen} />
      <Tab.Screen name="Cá nhân" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;

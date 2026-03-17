import React from 'react';
import { View, Text } from 'react-native';
import { COLORS } from '@/constants/theme';

const ProfileScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-2xl font-bold text-text">Cá nhân</Text>
    </View>
  );
};

export default ProfileScreen;

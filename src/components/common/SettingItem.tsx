import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  isLast?: boolean;
}

export const SettingItem = ({ 
  icon, 
  label, 
  value, 
  onPress, 
  rightElement, 
  isLast 
}: SettingItemProps) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    className={`flex-row items-center py-4 px-4 ${!isLast ? 'border-b border-white/5' : ''}`}
  >
    <View className="w-10 h-10 rounded-xl bg-white/5 items-center justify-center mr-4">
      {icon}
    </View>
    <View className="flex-1">
      <Text className="text-white text-base font-semibold">{label}</Text>
      {value ? (
        <Text className="text-gray-400 text-xs mt-0.5">{value}</Text>
      ) : null}
    </View>
    {rightElement || (
      <ChevronRight color={COLORS.textMuted} size={18} />
    )}
  </TouchableOpacity>
);

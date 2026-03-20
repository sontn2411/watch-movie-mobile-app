import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

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
}: SettingItemProps) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className={`flex-row items-center py-4 px-4 ${!isLast ? 'border-b' : ''}`}
      style={!isLast ? { borderBottomColor: colors.border } : {}}
    >
      <View className="w-10 h-10 rounded-xl bg-surface-alt items-center justify-center mr-4">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-text text-base font-semibold">{label}</Text>
        {value ? (
          <Text className="text-muted text-xs mt-0.5">{value}</Text>
        ) : null}
      </View>
      {rightElement || (
        <ChevronRight color={colors.textMuted} size={18} />
      )}
    </TouchableOpacity>
  );
};

export default SettingItem;

import React from 'react';
import { View, Text } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface MetaPillProps {
  icon: LucideIcon;
  text: string | number;
  color?: string;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
}

const MetaPill = React.memo(({ 
  icon: Icon, 
  text, 
  color, 
  bgColor, 
  borderColor, 
  textColor 
}: MetaPillProps) => {
  const { colors, isDark } = useTheme();
  
  const activeColor = color || colors.primary;
  const activeBg = bgColor || (isDark ? 'bg-white/5' : 'bg-black/5');
  const activeBorder = borderColor || (isDark ? 'border-white/10' : 'border-black/5');
  const activeText = textColor || 'text-text';

  const isRating = typeof text === 'number' || (typeof text === 'string' && text.includes('.'));

  return (
    <View className={`flex-row items-center ${activeBg} border ${activeBorder} px-3 py-1.5 rounded-xl mr-2 mb-2`}>
      <Icon 
        color={activeColor} 
        size={14} 
        fill={activeColor === colors.primary && isRating ? activeColor : 'none'} 
      />
      <Text className={`${activeText} text-[11px] font-bold ml-1.5`}>{text}</Text>
    </View>
  );
});

export default MetaPill;

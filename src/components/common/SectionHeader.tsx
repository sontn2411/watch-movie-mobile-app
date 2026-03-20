import React from 'react';
import { Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface SectionHeaderProps {
  title: string;
}

export const SectionHeader = ({ title }: SectionHeaderProps) => {
  const { colors } = useTheme();
  return (
    <Text 
      className="text-xs font-black uppercase tracking-[2px] px-6 pt-8 pb-3"
      style={{ color: colors.textMuted }}
    >
      {title}
    </Text>
  );
};

export default SectionHeader;

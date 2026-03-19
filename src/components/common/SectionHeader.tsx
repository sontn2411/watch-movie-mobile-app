import React from 'react';
import { Text } from 'react-native';

interface SectionHeaderProps {
  title: string;
}

export const SectionHeader = ({ title }: SectionHeaderProps) => (
  <Text className="text-gray-500 text-xs font-black uppercase tracking-[2px] px-6 pt-8 pb-3">
    {title}
  </Text>
);

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { LucideIcon, Eye, EyeOff } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

interface AuthInputProps extends TextInputProps {
  icon: LucideIcon;
  isPassword?: boolean;
  isError?: boolean;
}

export const AuthInput = ({ 
  icon: Icon, 
  isPassword, 
  isError,
  value, 
  onChangeText, 
  placeholder, 
  ...props 
}: AuthInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputStyle = {
    borderColor: isError 
      ? '#EF4444' 
      : (isFocused ? COLORS.primary : 'rgba(255, 255, 255, 0.1)'),
    backgroundColor: isError
      ? 'rgba(239, 68, 68, 0.05)'
      : (isFocused ? 'rgba(225, 29, 72, 0.05)' : 'rgba(255, 255, 255, 0.05)'),
  };

  const iconColor = isError ? '#EF4444' : (isFocused ? COLORS.primary : COLORS.textMuted);


  return (
    <View 
      style={inputStyle}
      className="rounded-2xl px-4 py-4 flex-row items-center border mb-5"
    >
      <Icon
        color={iconColor}
        size={20}
        style={{ marginRight: 12 }}
      />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="rgba(148, 163, 184, 0.5)"
        className="flex-1 text-white text-base py-1"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={isPassword && !showPassword}
        autoCapitalize="none"
        {...props}
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <EyeOff color={iconColor} size={20} />
          ) : (
            <Eye color={iconColor} size={20} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

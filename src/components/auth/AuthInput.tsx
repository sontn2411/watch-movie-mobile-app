import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { LucideIcon, Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

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
  const { colors } = useTheme();

  const inputStyle = {
    borderColor: isError 
      ? '#EF4444' 
      : (isFocused ? colors.primary : colors.border),
    backgroundColor: isError
      ? 'rgba(239, 68, 68, 0.05)'
      : (isFocused ? `${colors.primary}10` : colors.surface),
  };

  const iconColor = isError ? '#EF4444' : (isFocused ? colors.primary : colors.textMuted);


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
        placeholderTextColor={colors.textMuted}
        className="flex-1 text-text text-base py-1"
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


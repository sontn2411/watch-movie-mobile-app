import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { User, Lock } from 'lucide-react-native';
import { AuthInput } from './AuthInput';
import { COLORS } from '@/constants/theme';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchMode: () => void;
}

export const LoginForm = ({ onSuccess, onSwitchMode }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!username && !email) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên đăng nhập hoặc email');
      return;
    }
    if (!password) {
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu');
      return;
    }
    onSuccess();
  };

  return (
    <View className="flex-1">
      <Animated.View entering={FadeInDown.delay(300).duration(800)}>
        <Text className="text-white text-4xl font-black mb-2 tracking-wider">
          ĐĂNG NHẬP
        </Text>
        <Text className="text-gray-400 mb-10 text-base leading-6">
          Chào mừng bạn trở lại! Hãy đăng nhập để tiếp tục khám phá.
        </Text>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.delay(500).duration(800)}
        className="space-y-4"
      >
        <AuthInput
          icon={User}
          placeholder="Tên đăng nhập hoặc Email"
          value={email || username}
          onChangeText={text => {
            if (text.includes('@')) setEmail(text);
            else setUsername(text);
          }}
        />

        <AuthInput
          icon={Lock}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          isPassword
        />
      </Animated.View>

      <TouchableOpacity className="items-end mb-8">
        <Text className="text-primary font-bold">Quên mật khẩu?</Text>
      </TouchableOpacity>

      <Animated.View entering={FadeInUp.delay(700).duration(800)}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSubmit}
          className="bg-primary py-4 rounded-2xl items-center shadow-lg mb-8"
          style={{
            backgroundColor: COLORS.primary,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          <Text className="text-white font-bold text-lg uppercase tracking-wider">
            Đăng Nhập
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center items-center">
          <Text className="text-gray-400 text-base">
            Chưa có tài khoản?{' '}
          </Text>
          <TouchableOpacity onPress={onSwitchMode}>
            <Text className="text-primary font-black text-base">
              Đăng ký ngay
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

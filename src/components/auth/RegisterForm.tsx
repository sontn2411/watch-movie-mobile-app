import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { User, Mail, Lock } from 'lucide-react-native';
import { AuthInput } from './AuthInput';
import { COLORS } from '@/constants/theme';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAppStore } from '@/store/useAppStore';

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchMode: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setUserToken = useAppStore(state => state.setUserToken);

  const handleSubmit = async () => {
    if (!email || !password || password !== confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin và đảm bảo mật khẩu khớp.');
      return;
    }
    setLoading(true);
    // Simulation: Save token and success
    setUserToken('user_token_demo');
    onSuccess();
    setLoading(false);
  };

  return (
    <View className="flex-1">
      <Animated.View entering={FadeInDown.delay(300).duration(800)}>
        <Text className="text-white text-4xl font-black mb-2 tracking-wider">
          ĐĂNG KÝ
        </Text>
        <Text className="text-gray-400 mb-10 text-base leading-6">
          Tạo tài khoản mới để trải nghiệm thế giới điện ảnh vô tận.
        </Text>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.delay(500).duration(800)}
        className="space-y-4"
      >
        <AuthInput
          icon={Mail}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <AuthInput
          icon={Lock}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          isPassword
        />

        <AuthInput
          icon={Lock}
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          isPassword
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(700).duration(800)} className="mt-8">
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
            Đăng Ký
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center items-center">
          <Text className="text-gray-400 text-base">
            Đã có tài khoản?{' '}
          </Text>
          <TouchableOpacity onPress={onSwitchMode}>
            <Text className="text-primary font-black text-base">
              Đăng nhập
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { User, Mail, Lock } from 'lucide-react-native';
import { AuthInput } from './AuthInput';
import { COLORS } from '@/constants/theme';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAppStore } from '@/store/useAppStore';
import authService from '@/services/auth';
import { useToastStore } from '@/store/useToastStore';

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchMode: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchMode }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const { setAuth } = useAppStore();

  const { showToast } = useToastStore();

  const handleTextChange = (field: string, text: string) => {
    switch (field) {
      case 'username': setUsername(text); break;
      case 'email': setEmail(text); break;
      case 'password': setPassword(text); break;
      case 'confirmPassword': setConfirmPassword(text); break;
    }
    setFieldErrors(prev => prev.filter(f => f !== field));
  };

  const handleSubmit = async () => {
    setFieldErrors([]);
    const errors: string[] = [];
    if (!username) errors.push('username');
    if (!email) errors.push('email');
    if (!password) errors.push('password');
    if (password !== confirmPassword) errors.push('confirmPassword');

    if (errors.length > 0) {
      setFieldErrors(errors);
      showToast({ 
        message: 'Vui lòng điền đầy đủ thông tin và đảm bảo mật khẩu khớp.', 
        type: 'error' 
      });
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFieldErrors(['email']);
      showToast({ message: 'Email không hợp lệ', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({
        username,
        email,
        password,
      });

      if (response.success || response.user) {
        showToast({ 
          message: response.message || 'Đăng ký thành công! Đang chuyển sang đăng nhập...', 
          type: 'success' 
        });
        setTimeout(() => {
          onSwitchMode();
        }, 1500);
      }
    } catch (error: any) {
      const data = error.response?.data;
      
      if (data?.error) {
        // Handle 422 Validation Error
        const errs = data.error.details?.map((d: any) => d.field) || [];
        setFieldErrors(errs);

        const details = data.error.details
          ?.map((d: any) => d.message)
          .join(', ');
        showToast({ 
          message: `${data.error.message}${details ? `: ${details}` : ''}`, 
          type: 'error' 
        });
      } else if (data?.message) {
        showToast({ message: data.message, type: 'error' });
        // Guess fields based on message
        const msg = data.message.toLowerCase();
        const guessed: string[] = [];
        if (msg.includes('username')) guessed.push('username');
        if (msg.includes('email')) guessed.push('email');
        if (msg.includes('password')) guessed.push('password');
        setFieldErrors(guessed);
      } else {
        showToast({ 
          message: error.message || 'Có lỗi xảy ra trong quá trình đăng ký', 
          type: 'error' 
        });
      }
    } finally {
      setLoading(false);
    }
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
          icon={User}
          placeholder="Tên đăng nhập"
          value={username}
          onChangeText={(text) => handleTextChange('username', text)}
          autoCapitalize="none"
          isError={fieldErrors.includes('username')}
        />

        <AuthInput
          icon={Mail}
          placeholder="Email"
          value={email}
          onChangeText={(text) => handleTextChange('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
          isError={fieldErrors.includes('email')}
        />

        <AuthInput
          icon={Lock}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={(text) => handleTextChange('password', text)}
          isPassword
          isError={fieldErrors.includes('password')}
        />

        <AuthInput
          icon={Lock}
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChangeText={(text) => handleTextChange('confirmPassword', text)}
          isPassword
          isError={fieldErrors.includes('confirmPassword')}
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(700).duration(800)} className="mt-8">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSubmit}
          disabled={loading}
          className="bg-primary py-4 rounded-2xl items-center shadow-lg mb-8"
          style={{
            backgroundColor: COLORS.primary,
            opacity: loading ? 0.7 : 1,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg uppercase tracking-wider">
              Đăng Ký
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center items-center">
          <Text className="text-gray-400 text-base">
            Đã có tài khoản?{' '}
          </Text>
          <TouchableOpacity onPress={onSwitchMode} disabled={loading}>
            <Text className="text-primary font-black text-base">
              Đăng nhập
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};


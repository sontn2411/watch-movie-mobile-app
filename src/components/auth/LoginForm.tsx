import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { User, Lock } from 'lucide-react-native';
import { AuthInput } from './AuthInput';
import { COLORS } from '@/constants/theme';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAppStore } from '@/store/useAppStore';
import authService from '@/services/auth';
import { ActivityIndicator } from 'react-native';
import { useToastStore } from '@/store/useToastStore';



interface LoginFormProps {
  onSuccess: () => void;
  onForgotPassword: () => void;
  onSwitchMode: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onForgotPassword, onSwitchMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const { setAuth } = useAppStore();

  const { showToast } = useToastStore();

  const handleTextChange = (field: string, text: string) => {
    if (field === 'email') setEmail(text);
    if (field === 'password') setPassword(text);
    // Clear error for this field when user starts typing
    setFieldErrors(prev => prev.filter(f => f !== (field === 'email' ? 'identity' : field)));
  };

  const handleSubmit = async () => {
    setFieldErrors([]);
    if (!email) {
      showToast({ message: 'Vui lòng nhập email', type: 'error' });
      setFieldErrors(['identity']);
      return;
    }
    if (!password) {
      showToast({ message: 'Vui lòng nhập mật khẩu', type: 'error' });
      setFieldErrors(['password']);
      return;
    }
    setLoading(true);
    try {
      const response = await authService.login({
        identity: email,
        password,
      });

      if (response.accessToken) {
        setAuth(response.accessToken, response.refreshToken || null, response.user);
        showToast({ message: 'Đăng nhập thành công!', type: 'success' });
        onSuccess();
      } else {
        showToast({ 
          message: response.message || 'Tài khoản hoặc mật khẩu không chính xác', 
          type: 'error' 
        });
      }
    } catch (error: any) {
      const data = error.response?.data;
      
      if (data?.error) {
        // Handle 422 Validation Error
        const errors = data.error.details?.map((d: any) => d.field) || [];
        setFieldErrors(errors);

        const details = data.error.details
          ?.map((d: any) => d.message)
          .join(', ');
        showToast({ 
          message: `${data.error.message}${details ? `: ${details}` : ''}`, 
          type: 'error' 
        });
      } else if (data?.message) {
        showToast({ message: data.message, type: 'error' });
        if (data.message.toLowerCase().includes('password') || data.message.toLowerCase().includes('username') || data.message.toLowerCase().includes('email')) {
           // If message contains keyword, highlight all for safety or try to guess
           setFieldErrors(['identity', 'password']);
        }
      } else {
        showToast({ 
          message: error.message || 'Có lỗi xảy ra trong quá trình đăng nhập', 
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
          placeholder="Email hoặc Tên đăng nhập"
          value={email}
          onChangeText={(text) => handleTextChange('email', text)}
          autoCapitalize="none"
          isError={fieldErrors.includes('identity')}
        />

        <AuthInput
          icon={Lock}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={(text) => handleTextChange('password', text)}
          isPassword
          isError={fieldErrors.includes('password')}
        />
      </Animated.View>

      <TouchableOpacity 
        onPress={onForgotPassword}
        disabled={loading}
        className="items-end mb-8"
      >
        <Text className="text-primary font-bold">Quên mật khẩu?</Text>
      </TouchableOpacity>

      <Animated.View entering={FadeInUp.delay(700).duration(800)}>
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
              Đăng Nhập
            </Text>
          )}
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

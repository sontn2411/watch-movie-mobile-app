import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { ChevronLeft } from 'lucide-react-native';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAppStore } from '@/store/useAppStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

type AuthMode = 'login' | 'register';

const AuthScreen = ({ navigation }: Props) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const setHasSeenWelcome = useAppStore(state => state.setHasSeenWelcome);

  const handleSuccess = () => {
    setHasSeenWelcome(true);
    navigation.replace('Main');
  };

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6">
          {/* Dynamic Spacer to push form lower */}
          <View style={{ height: isLandscape ? height * 0.3 : height * 0.3 }} />

          <Animated.View
            entering={FadeIn.delay(200)}
            className="flex-row items-center mb-8 mt-4"
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-10 h-10 items-center justify-center rounded-full bg-white/10 border border-white/10"
            >
              <ChevronLeft color="white" size={24} />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            className="flex-1 justify-center pb-12"
            layout={Layout.springify()}
          >
            {mode === 'login' ? (
              <LoginForm
                onSuccess={handleSuccess}
                onForgotPassword={() => Alert.alert('Thông báo', 'Tính năng đang được phát triển')}
                onSwitchMode={() => setMode('register')}
              />
            ) : (
              <RegisterForm
                onSuccess={handleSuccess}
                onSwitchMode={() => setMode('login')}
              />
            )}
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;

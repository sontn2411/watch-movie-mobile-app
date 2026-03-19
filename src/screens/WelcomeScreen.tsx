import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { COLORS } from '@/constants/theme';
import { createMMKV } from 'react-native-mmkv';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Orientation from 'react-native-orientation-locker';

// Optional: you can extract this somewhere else if you want to use it globally
export const storage = createMMKV();

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen = ({ navigation }: Props) => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  useEffect(() => {
    // Ensure orientation is unlocked on Welcome screen (especially for iPad)
    Orientation.unlockAllOrientations();
  }, []);

  const handleGuest = () => {
    // Save to MMKV so next time it skips Welcome
    storage.set('hasSeenWelcome', true);
    // Navigate to Home
    navigation.replace('Main');
  };

  const handleAuth = () => {
    navigation.navigate('Auth');
  };

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View className="flex-1 bg-transparent">
          {/* Dynamic spacer: smaller in landscape */}
          <View style={{ height: isLandscape ? height * 0.4 : height * 0.55 }} className="w-full" />

          <View
            style={{ marginTop: isLandscape ? -(height * 0.1) : -(height * 0.15) }}
            className="flex flex-col gap-6 justify-center w-full items-center px-8 pb-10"
          >
            <Animated.View 
              entering={FadeInDown.delay(300).duration(1000)}
              style={{
                width: isLandscape ? width * 0.15 : width * 0.25,
                height: isLandscape ? width * 0.15 : width * 0.25,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: isLandscape ? 8 : 16,
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 20,
                elevation: 10,
              }}
            >
              <Image
                source={require('../assets/images/logo-film-app.png')}
                resizeMode="contain"
                style={styles.logo}
              />
            </Animated.View>

            <Animated.View 
              entering={FadeInDown.delay(500).duration(1000)}
              className={`${isLandscape ? 'mb-4' : 'mb-10'} items-center`}
            >
              <Text
                className={`text-white ${isLandscape ? 'text-4xl' : 'text-5xl'} font-black tracking-[0.3em]`}
                style={{ 
                  textShadowColor: 'rgba(225, 29, 72, 0.4)',
                  textShadowOffset: { width: 0, height: 4 },
                  textShadowRadius: 10,
                }}
              >
                CINEMA
              </Text>
              <Text
                className={`text-gray-400 text-[10px] font-bold tracking-[0.6em] uppercase mt-4 opacity-80`}
              >
                Khám phá điện ảnh đỉnh cao
              </Text>
            </Animated.View>

            <Animated.View 
              entering={FadeInUp.delay(800).duration(1000)}
              className={`w-full flex flex-col ${isLandscape ? 'gap-4 max-w-lg' : 'gap-6'}`}
            >
              <Pressable
                onPress={handleAuth}
                className="bg-primary w-full h-[60px] items-center justify-center rounded-2xl shadow-xl active:scale-95"
                style={{
                  backgroundColor: COLORS.primary,
                  shadowColor: COLORS.primary,
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.3,
                  shadowRadius: 15,
                }}
              >
                <Text className="text-white text-lg font-bold uppercase tracking-wider">
                  Bắt đầu ngay
                </Text>
              </Pressable>

              <Pressable
                onPress={handleGuest}
                className="w-full h-[60px] items-center justify-center rounded-2xl border border-white/20 bg-white/5 active:scale-95"
              >
                <Text className="text-gray-300 text-base font-semibold">
                  Tiếp tục với khách
                </Text>
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: '100%',
    height: '100%',
  },
});

export default WelcomeScreen;

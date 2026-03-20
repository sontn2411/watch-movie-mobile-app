import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  useSharedValue,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react-native';
import { useToastStore, ToastType } from '@/store/useToastStore';

const TOAST_HEIGHT = 60;

const getIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return <CheckCircle color="#10B981" size={24} />;
    case 'error':
      return <AlertCircle color="#EF4444" size={24} />;
    case 'warning':
      return <AlertTriangle color="#F59E0B" size={24} />;
    case 'info':
    default:
      return <Info color="#3B82F6" size={24} />;
  }
};

const getBgColor = (type: ToastType) => {
  switch (type) {
    case 'success': return 'bg-[#121212] border-emerald-500/50';
    case 'error': return 'bg-[#121212] border-red-500/50';
    case 'warning': return 'bg-[#121212] border-amber-500/50';
    case 'info':
    default: return 'bg-[#121212] border-blue-500/50';
  }
};

export const ToastProvider = () => {
  const { visible, message, type, hideToast } = useToastStore();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(insets.top + 10, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withTiming(-100, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible, insets.top]);


  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible && opacity.value === 0) return null;

  return (
    <Animated.View 
      style={[
        animatedStyle,
        { 
          position: 'absolute', 
          top: 0, 
          left: 20, 
          right: 20, 
          zIndex: 9999,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 10,
        }
      ]}
    >
      <View 
        className={`flex-row items-center p-4 rounded-2xl border ${getBgColor(type)} backdrop-blur-md`}
      >
        <View className="mr-3">
          {getIcon(type)}
        </View>
        
        <View className="flex-1">
          <Text className="text-white text-sm font-bold leading-5" numberOfLines={3}>
            {message}
          </Text>
        </View>

        <TouchableOpacity 
          onPress={hideToast}
          className="ml-2 p-1 bg-white/5 rounded-full"
        >
          <X color="white" size={16} opacity={0.5} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

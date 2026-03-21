import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  StatusBar,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import {
  User,
  Bell,
  Shield,
  Download,
  Heart,
  LogOut,
  Moon,
  Globe,
  HelpCircle,
  Film,
  PlayCircle,
  Camera,
  Share2,
  LogIn,
  UserPlus,
  Info,
} from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useAppStore } from '@/store/useAppStore';
import { SectionHeader } from '@/components/common/SectionHeader';
import { SettingItem } from '@/components/common/SettingItem';
import { useToastStore } from '@/store/useToastStore';
import { useTheme } from '@/hooks/useTheme';
import { useDownloadStore } from '@/store/useDownloadStore';

const AVATAR_URL = 'https://api.dicebear.com/7.x/avataaars/png?seed=WatchMovie&backgroundColor=transparent';

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const { 
    userToken, 
    user,
    setAuth,
    logout, 
    theme, 
    setTheme, 
    language, 
    setLanguage,
    watchHistory,
    favorites
  } = useAppStore();

  const { tasks } = useDownloadStore();

  const [notifications, setNotifications] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const { showToast } = useToastStore();
  const { colors, isDark } = useTheme();
  const isLoggedIn = !!userToken;

  useEffect(() => {
    if (isLoggedIn) {
      fetchProfile();
    }
  }, [isLoggedIn]);

  const fetchProfile = async () => {
    try {
      const { default: authService } = await import('@/services/auth');
      const profileData = await authService.profile();
      if (profileData.user) {
        setAuth(userToken, useAppStore.getState().refreshToken, profileData.user);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn thoát khỏi tài khoản?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Đăng xuất", 
          onPress: () => {
            logout();
            showToast({ message: 'Đã đăng xuất thành công', type: 'info' });
          }, 
          style: "destructive" 
        }
      ]
    );
  };

  const renderGuestView = () => (
    <View className="flex-1 px-6">
      <Animated.View 
        entering={FadeInDown.duration(800)}
        className="items-center py-10"
      >
        <View className="w-24 h-24 bg-white/5 rounded-full items-center justify-center mb-6 border border-white/10">
          <User color={colors.textMuted} size={48} className="opacity-40" />
        </View>
        <Text className="text-text text-2xl font-black text-center mb-2">
          Tham gia cùng WatchMovie
        </Text>
        <Text className="text-muted text-center text-sm leading-5 mb-10 px-4">
          Đăng nhập để lưu phim yêu thích, xem tiếp lịch sử và nhận đề xuất cá nhân hóa dành riêng cho bạn.
        </Text>
        
        <View className="w-full gap-y-4">
          <TouchableOpacity 
            onPress={() => navigation.navigate('Auth')}
            activeOpacity={0.8}
            className="bg-primary flex-row items-center justify-center py-4 rounded-2xl shadow-lg shadow-primary/30"
          >
            <LogIn color="white" size={20} />
            <Text className="text-white font-bold text-lg ml-3">Đăng nhập ngay</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => navigation.navigate('Auth')}
            activeOpacity={0.7}
            className="bg-white/5 border border-white/10 flex-row items-center justify-center py-4 rounded-2xl"
          >
            <UserPlus color="white" size={20} />
            <Text className="text-white font-bold text-lg ml-3">Tạo tài khoản mới</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <SectionHeader title="Hoạt động" />
      <View className="rounded-3xl bg-surface border border-border overflow-hidden">
        <SettingItem 
          icon={<PlayCircle color={colors.primary} size={20} />} 
          label="Lịch sử xem phim" 
          value={`${watchHistory.length} bộ phim đã xem`}
          onPress={() => navigation.navigate('History')}
        />
        <SettingItem 
          icon={<Heart color="#EF4444" size={20} />} 
          label="Danh sách yêu thích" 
          value={`${favorites.length} bộ phim`}
          onPress={() => navigation.navigate('Favorites')}
        />
        <SettingItem 
          icon={<Download color={colors.accent} size={20} />} 
          label="Phim đã tải về" 
          value={`${tasks.length} bộ phim`}
          // @ts-ignore
          onPress={() => navigation.navigate('Tải về')}
          isLast
        />
      </View>

      <SectionHeader title="Cài đặt chung" />
      <View className="rounded-3xl bg-surface border border-border overflow-hidden">
        <SettingItem 
          icon={<Moon color="#818CF8" size={20} />} 
          label="Chế độ tối" 
          rightElement={
            <Switch 
              value={isDark}
              onValueChange={(val) => setTheme(val ? 'dark' : 'light')}
              trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
              thumbColor="white"
            />
          }
        />
        <SettingItem 
          icon={<Globe color={colors.secondary} size={20} />} 
          label="Ngôn ngữ" 
          value={language === 'vi' ? "Tiếng Việt (VN)" : "English (US)"}
          onPress={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
          isLast
        />
      </View>
      
      <SectionHeader title="Trợ giúp" />
      <View className="rounded-3xl bg-surface border border-border overflow-hidden">
        <SettingItem 
          icon={<Info color={colors.textMuted} size={20} />} 
          label="Về ứng dụng" 
          isLast
        />
      </View>
    </View>
  );

  const renderLoggedInView = () => (
    <View className="flex-1">
      {/* User Card */}
      <Animated.View 
        entering={FadeIn.duration(600)}
        className="mx-6 p-6 rounded-3xl bg-surface border border-border flex-row items-center"
      >
        <View className="relative">
          <View className="w-20 h-20 rounded-full border-2 border-primary p-1">
            <View className="w-full h-full rounded-full bg-surface-alt overflow-hidden">
              <Image
                source={{ uri: AVATAR_URL }}
                className="w-full h-full"
              />
            </View>
          </View>
          <TouchableOpacity className="absolute bottom-0 right-0 bg-primary w-6 h-6 rounded-full items-center justify-center border-2 border-background">
            <Camera color="white" size={12} />
          </TouchableOpacity>
        </View>
        
        <View className="ml-5 flex-1">
          <Text className="text-text text-xl font-bold">{user?.username || 'Người dùng'}</Text>
          <Text className="text-muted text-sm mt-1">{user?.email || 'Chưa cập nhật email'}</Text>
          <View className="flex-row items-center mt-3">
            <View className="bg-primary/20 px-3 py-1 rounded-full border border-primary/20">
              <Text className="text-primary text-[10px] font-black uppercase tracking-wider">
                Standard Account
              </Text>
            </View>
            <TouchableOpacity className="ml-3 p-1">
              <Share2 color={colors.textMuted} size={16} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Quick Stats */}
      <View className="flex-row px-6 mt-6 gap-3">
        {[
          { label: 'Phim đã xem', value: watchHistory.length.toString(), color: colors.primary },
          { label: 'Yêu thích', value: favorites.length.toString(), color: '#EF4444' },
          { label: 'Tải về', value: tasks.filter(t => t.status === 'completed').length.toString(), color: colors.accent },
        ].map((item, i) => (
          <TouchableOpacity 
            key={i}
            activeOpacity={0.8}
            className="flex-1 bg-surface border border-border rounded-2xl py-4 items-center"
          >
            <Text style={{ color: item.color }} className="text-xl font-black">{item.value}</Text>
            <Text className="text-gray-500 text-[10px] font-bold uppercase mt-1">{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Settings Sections */}
      <SectionHeader title="Hoạt động" />
      <View className="mx-6 rounded-3xl bg-surface border border-border overflow-hidden">
        <SettingItem 
          icon={<PlayCircle color={colors.primary} size={20} />} 
          label="Lịch sử xem phim" 
          value={`${watchHistory.length} bộ phim đã xem`}
          onPress={() => navigation.navigate('History')}
        />
        <SettingItem 
          icon={<Heart color="#EF4444" size={20} />} 
          label="Danh sách yêu thích" 
          value={`${favorites.length} bộ phim`}
          onPress={() => navigation.navigate('Favorites')}
        />
        <SettingItem 
          icon={<Download color={colors.accent} size={20} />} 
          label="Phim đã tải về" 
          value={`${tasks.length} bộ phim`}
          // @ts-ignore
          onPress={() => navigation.navigate('Tải về')}
          isLast
        />
      </View>

      <SectionHeader title="Tùy chọn hiển thị" />
      <View className="mx-6 rounded-3xl bg-surface border border-border overflow-hidden">
        <SettingItem 
          icon={<Bell color={colors.primary} size={20} />} 
          label="Thông báo đẩy" 
          rightElement={
            <Switch 
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: isDark ? '#2D3748' : '#D1D5DB', true: colors.primary }}
              thumbColor="white"
            />
          }
        />
        <SettingItem 
          icon={<Moon color="#818CF8" size={20} />} 
          label="Chế độ tối" 
          rightElement={
            <Switch 
              value={isDark}
              onValueChange={(val) => setTheme(val ? 'dark' : 'light')}
              trackColor={{ false: isDark ? '#2D3748' : '#D1D5DB', true: '#818CF8' }}
              thumbColor="white"
            />
          }
        />
        <SettingItem 
          icon={<Globe color={colors.secondary} size={20} />} 
          label="Ngôn ngữ" 
          value={language === 'vi' ? "Tiếng Việt (VN)" : "English (US)"}
          onPress={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
          isLast
        />
      </View>

      <SectionHeader title="Hệ hệ thống" />
      <View className="mx-6 rounded-3xl bg-surface border border-border overflow-hidden">
        <SettingItem 
          icon={<User color={colors.textMuted} size={20} />} 
          label="Hồ sơ người dùng" 
        />
        <SettingItem 
          icon={<Shield color={colors.textMuted} size={20} />} 
          label="Quyền riêng tư" 
        />
        <SettingItem 
          icon={<HelpCircle color={colors.textMuted} size={20} />} 
          label="Trợ giúp & Phản hồi" 
          isLast
        />
      </View>

      {/* Logout */}
      <View className="px-6 mt-10">
        <TouchableOpacity 
          onPress={handleLogout}
          activeOpacity={0.8}
          className="flex-row items-center justify-center py-4 rounded-2xl bg-red-500/10 border border-red-500/20"
        >
          <LogOut color="#EF4444" size={20} />
          <Text className="text-red-500 font-bold ml-3 text-base">Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingTop: insets.top + 10, 
          paddingBottom: insets.bottom + 100 
        }}
      >
        {/* Header Title */}
        <View className="px-6 mb-8">
          <Text className="text-text text-3xl font-black tracking-wider uppercase">
            CÁ NHÂN
          </Text>
        </View>

        {isLoggedIn ? renderLoggedInView() : renderGuestView()}

        {/* Footer */}
        <View className="items-center mt-8 opacity-20">
          <Film color={colors.text} size={24} />
          <Text className="text-text text-[10px] font-black tracking-[4px] mt-2 uppercase">
            WatchMovie v1.2.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

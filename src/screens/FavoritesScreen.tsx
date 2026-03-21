import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/hooks/useTheme';
import { useAppStore } from '@/store/useAppStore';
import { ChevronLeft, Trash2, Heart } from 'lucide-react-native';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const FavoritesScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, isDark } = useTheme();
  const { favorites, removeFavorite, clearFavorites } = useAppStore();

  const renderItem = ({ item }: { item: any }) => {
    const timeAgo = formatDistanceToNow(new Date(item.lastWatchedTime), {
      addSuffix: true,
      locale: vi,
    });

    return (
      <TouchableOpacity
        className="flex-row items-center p-4 mb-3 rounded-2xl bg-surface border border-border"
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate('Details', {
            id: item.slug,
            title: item.name,
          })
        }
      >
        <Image
          source={{
            uri: `https://phimimg.com/uploads/movies/${item.thumb_url}`,
          }}
          className="w-20 h-28 rounded-xl bg-slate-800"
          resizeMode="cover"
        />
        <View className="flex-1 ml-4 justify-center">
          <Text
            className="text-text font-bold text-base mb-1"
            numberOfLines={2}
          >
            {item.name}
          </Text>
          <Text className="text-muted text-[10px] mt-2">Đã lưu: {timeAgo}</Text>
        </View>
        <TouchableOpacity
          onPress={() => removeFavorite(item._id)}
          className="p-3 ml-2 bg-red-500/10 rounded-xl"
        >
          <Trash2 color="#ef4444" size={20} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View
        style={{ paddingTop: insets.top + 10 }}
        className="px-6 pb-4 flex-row items-center justify-between"
      >
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4 p-2 rounded-full bg-surface border border-border"
          >
            <ChevronLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <Text className="text-2xl font-black text-text">Phim yêu thích</Text>
        </View>
        {favorites.length > 0 && (
          <TouchableOpacity
            onPress={clearFavorites}
            className="p-2 rounded-full bg-surface border border-border"
          >
            <Trash2 color={colors.text} size={20} />
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-1 px-4">
        {favorites.length > 0 ? (
          // @ts-ignore
          <FlashList
            data={favorites}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex-1 items-center justify-center opacity-50">
            <Heart size={64} color={colors.text} strokeWidth={1} />
            <Text className="text-text font-medium mt-4">
              Chưa có phim yêu thích nào
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default FavoritesScreen;

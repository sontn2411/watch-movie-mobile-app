import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  useWindowDimensions,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Search, X, Film, Clock, Trash2 } from 'lucide-react-native';
import { FlashList } from '@shopify/flash-list';
import { COLORS } from '@/constants/theme';
import { useSearchMovies } from '@/hooks/useMovies';
import { MovieItem } from '@/types/movies';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BaseCard from '@/components/movie/common/BaseCard';
import { useAppStore } from '@/store/useAppStore';
import { SearchCardSkeleton } from '@/components/common/Skeleton';

type Props = NativeStackScreenProps<RootStackParamList, any>;

// Bypass for environment-specific FlashList property errors
const AnyFlashList = FlashList as any;

import { isPad } from '@/utils/device';

const SearchScreen = ({ navigation }: Props) => {
  const [keyword, setKeyword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const numColumns = isPad 
    ? (isLandscape ? 6 : 4) 
    : (isLandscape ? 5 : 3);

  const {
    searchHistory,
    addSearchKeyword,
    removeSearchHistoryItem,
    clearSearchHistory
  } = useAppStore();
  
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useSearchMovies(searchQuery);

  const results = data?.pages.flatMap((page) => page?.data?.items || []) || [];
  const imageDomain = data?.pages[0]?.data?.APP_DOMAIN_CDN_IMAGE || 'https://img.phimapi.com';

  const handleSearch = (textToSearch?: string) => {
    const finalKeyword = textToSearch || keyword;
    if (finalKeyword.trim()) {
      setSearchQuery(finalKeyword);
      addSearchKeyword(finalKeyword);
      if (textToSearch) setKeyword(textToSearch);
      setIsFocused(false);
      Keyboard.dismiss();
    }
  };

  const clearSearch = () => {
    setKeyword('');
    setSearchQuery('');
    Keyboard.dismiss();
  };

  const renderItem = ({ item, index }: { item: MovieItem; index: number }) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 50).duration(400)}
      style={{ width: (width - 48) / numColumns, margin: 4 }}
    >
      <BaseCard
        movie={item}
        imageDomain={imageDomain}
        width="100%"
        showEpisode={true}
        showQuality={true}
      />
    </Animated.View>
  );

  const renderHistory = () => (
    <Animated.View 
      entering={FadeIn.duration(300)}
      className="flex-1 px-4 mt-2"
    >
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-white text-lg font-bold">Lịch sử tìm kiếm</Text>
        <TouchableOpacity onPress={clearSearchHistory}>
          <Text className="text-primary font-semibold">Xóa tất cả</Text>
        </TouchableOpacity>
      </View>
      <AnyFlashList
        data={searchHistory}
        keyExtractor={(item: string) => item}
        estimatedItemSize={50}
        renderItem={({ item, index }: any) => (
          <Animated.View 
            entering={FadeInDown.delay(index * 50).duration(300)}
            className="flex-row items-center py-3 border-b border-white/5"
          >
            <Clock color={COLORS.textMuted} size={18} />
            <TouchableOpacity 
              className="flex-1 ml-3" 
              onPress={() => handleSearch(item)}
            >
              <Text className="text-gray-300 text-base">{item}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeSearchHistoryItem(item)} className="p-2">
              <Trash2 color={COLORS.textMuted} size={18} />
            </TouchableOpacity>
          </Animated.View>
        )}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </Animated.View>
  );

  const renderSkeleton = () => (
    <View className="flex-1 px-3 mt-2">
      <View className="flex-row flex-wrap">
        {Array.from({ length: isLandscape ? 10 : 6 }).map((_, i) => (
          <SearchCardSkeleton key={i} width={(width - 48) / numColumns} />
        ))}
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-6 items-center justify-center">
        <ActivityIndicator color={COLORS.primary} size="small" />
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <View 
        style={{ paddingTop: insets.top + 10 }}
        className="px-4 pb-4"
      >
        <Text className="text-white text-3xl font-black mb-6 tracking-wider">
          TÌM KIẾM
        </Text>
        
        <View 
          className="flex-row items-center bg-white/5 border rounded-2xl pl-4 pr-2 py-2"
          style={{
            borderColor: isFocused ? COLORS.primary : 'rgba(255, 255, 255, 0.1)',
            backgroundColor: isFocused ? 'rgba(225, 29, 72, 0.05)' : 'rgba(255, 255, 255, 0.05)',
          }}
        >
          <Search 
            color={isFocused ? COLORS.primary : COLORS.textMuted} 
            size={20} 
          />
          <TextInput
            placeholder="Tìm kiếm phim, diễn viên..."
            placeholderTextColor="rgba(148, 163, 184, 0.5)"
            className="flex-1 text-white text-base ml-3 py-2"
            value={keyword}
            onChangeText={setKeyword}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setTimeout(() => setIsFocused(false), 200);
            }}
            autoCapitalize="none"
            returnKeyType="search"
            onSubmitEditing={() => handleSearch()}
          />
          {keyword !== '' && (
            <TouchableOpacity onPress={clearSearch} className="p-2">
              <X color={COLORS.textMuted} size={20} />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            onPress={() => handleSearch()}
            className="bg-primary px-4 py-2 rounded-xl"
          >
            <Text className="text-white font-bold">Tìm</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isFocused && keyword === '' && searchHistory.length > 0 ? (
        renderHistory()
      ) : isLoading && !isFetchingNextPage ? (
        renderSkeleton()
      ) : results.length > 0 ? (
        <AnyFlashList
          data={results}
          keyExtractor={(item: MovieItem) => item._id}
          renderItem={renderItem}
          numColumns={numColumns}
          estimatedItemSize={200}
          contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      ) : searchQuery !== '' ? (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animated.View 
            entering={FadeIn.duration(500)}
            className="flex-1 items-center justify-center px-10"
          >
            <Film color={COLORS.textMuted} size={64} className="mb-4 opacity-20" />
            <Text className="text-gray-400 text-center text-lg">
              Không tìm thấy phim phù hợp với "{searchQuery}"
            </Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animated.View 
            entering={FadeIn.duration(800)}
            className="flex-1 items-center justify-center px-10"
          >
            <View className="w-20 h-20 bg-white/5 rounded-full items-center justify-center mb-6 border border-white/5">
              <Search color={COLORS.textMuted} size={40} className="opacity-40" />
            </View>
            <Text className="text-white text-xl font-bold mb-2">
              Khám phá điện ảnh
            </Text>
            <Text className="text-gray-400 text-center text-base leading-6">
              Tìm kiếm hàng ngàn bộ phim, chương trình truyền hình và hơn thế nữa.
            </Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

export default SearchScreen;

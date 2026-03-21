import React, { useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';
import {
  useInfiniteMovieList,
  useCategories,
  useCountries,
} from '@/hooks/useMovies';
import { FlashList } from '@shopify/flash-list';
import MovieCard from '@/components/movie/MovieCard';
import { COLORS } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MovieItem } from '@/types/movies';
import { ChevronDown, X, FilterX } from 'lucide-react-native';

const SeeMoreScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'SeeMore'>>();
  const { slug } = route.params;
  const insets = useSafeAreaInsets();

  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedCountry, setSelectedCountry] = useState<string>();
  const [selectedYear, setSelectedYear] = useState<string>();
  const [activeModal, setActiveModal] = useState<
    'category' | 'country' | 'year' | null
  >(null);

  const { data: categoriesData } = useCategories();
  const { data: countriesData } = useCountries();

  const categories = categoriesData?.data.items || [];
  const countries = countriesData?.data.items || [];
  const years = Array.from({ length: 15 }, (_, i) =>
    (new Date().getFullYear() - i).toString(),
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteMovieList(slug, 24, {
    category: selectedCategory,
    country: selectedCountry,
    year: selectedYear,
  });

  const movies = data?.pages.flatMap(page => page.data.items) || [];
  const imageDomain = data?.pages[0]?.data.APP_DOMAIN_CDN_IMAGE || '';

  const renderFilterButton = (
    label: string,
    value: string | undefined,
    type: 'category' | 'country' | 'year',
  ) => {
    const isActive = !!value;
    let displayValue = label;
    if (isActive) {
      if (type === 'category') {
        const cat = categories.find(c => c.slug === value);
        if (cat) displayValue = cat.name;
      } else if (type === 'country') {
        const cou = countries.find(c => c.slug === value);
        if (cou) displayValue = cou.name;
      } else {
        displayValue = value;
      }
    }

    return (
      <TouchableOpacity
        onPress={() => setActiveModal(type)}
        className={`flex-row items-center px-4 py-2 mr-3 rounded-full border ${
          isActive ? 'bg-primary/20 border-primary' : 'bg-surface border-border'
        }`}
      >
        <Text
          className={`text-[11px] font-bold mr-1 ${isActive ? 'text-primary' : 'text-text'}`}
        >
          {displayValue}
        </Text>
        <ChevronDown
          size={14}
          color={isActive ? COLORS.primary : COLORS.text}
        />
      </TouchableOpacity>
    );
  };

  const hasActiveFilters =
    !!selectedCategory || !!selectedCountry || !!selectedYear;

  const clearFilters = () => {
    setSelectedCategory(undefined);
    setSelectedCountry(undefined);
    setSelectedYear(undefined);
  };

  return (
    <View className="flex-1 bg-background">
      {/* Filter Bar */}
      <View className="pt-2 pb-1 border-b border-border bg-background">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
        >
          {hasActiveFilters && (
            <TouchableOpacity
              onPress={clearFilters}
              className="w-9 h-9 items-center justify-center bg-red-500/10 rounded-full mr-3 border border-red-500/20"
            >
              <FilterX size={16} color="#EF4444" />
            </TouchableOpacity>
          )}
          {renderFilterButton('Thể loại', selectedCategory, 'category')}
          {renderFilterButton('Quốc gia', selectedCountry, 'country')}
          {renderFilterButton('Năm', selectedYear, 'year')}
        </ScrollView>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-white text-center text-lg font-bold mb-2">
            Đã có lỗi xảy ra
          </Text>
          <Text className="text-textMuted text-center">
            Không thể tải danh sách phim. Vui lòng thử lại sau.
          </Text>
        </View>
      ) : (
        <FlashList
          data={movies}
          keyExtractor={(item: MovieItem, index) => `${item._id}-${index}`}
          renderItem={({ item }: { item: MovieItem }) => (
            <View
              style={{ flex: 1, paddingHorizontal: 5, paddingVertical: 10 }}
            >
              <MovieCard
                movie={item}
                imageDomain={imageDomain}
                width="100%"
                marginRight={0}
              />
            </View>
          )}
          numColumns={3}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={() => (
            <View className="py-20 items-center justify-center">
              <Text className="text-muted text-center font-medium">
                Không tìm thấy phim nào phù hợp với bộ lọc.
              </Text>
            </View>
          )}
          ListFooterComponent={() => (
            <View className="py-6">
              {isFetchingNextPage ? (
                <ActivityIndicator color={COLORS.primary} />
              ) : null}
            </View>
          )}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingTop: 10,
            paddingBottom: insets.bottom + 20,
          }}
        />
      )}

      {/* Modal Filter */}
      <Modal
        visible={!!activeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setActiveModal(null)}
          />
          <View
            className="bg-background rounded-t-[32px] p-6 border-t border-border"
            style={{ maxHeight: '70%', paddingBottom: insets.bottom + 24 }}
          >
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-text font-black text-xl">
                {activeModal === 'category'
                  ? 'Chọn Thể loại'
                  : activeModal === 'country'
                    ? 'Chọn Quốc gia'
                    : 'Chọn Năm'}
              </Text>
              <TouchableOpacity
                onPress={() => setActiveModal(null)}
                className="w-8 h-8 items-center justify-center rounded-full bg-surface"
              >
                <X color={COLORS.text} size={20} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                onPress={() => {
                  if (activeModal === 'category')
                    setSelectedCategory(undefined);
                  if (activeModal === 'country') setSelectedCountry(undefined);
                  if (activeModal === 'year') setSelectedYear(undefined);
                  setActiveModal(null);
                }}
                className="py-4 border-b border-border flex-row items-center justify-between"
              >
                <Text className="text-primary font-bold text-base">Tất cả</Text>
              </TouchableOpacity>

              {activeModal === 'category' &&
                categories.map(cat => (
                  <TouchableOpacity
                    key={cat._id}
                    onPress={() => {
                      setSelectedCategory(cat.slug);
                      setActiveModal(null);
                    }}
                    className="py-4 border-b border-border flex-row items-center justify-between"
                  >
                    <Text
                      className={`text-base font-bold ${selectedCategory === cat.slug ? 'text-primary' : 'text-text'}`}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}

              {activeModal === 'country' &&
                countries.map(cou => (
                  <TouchableOpacity
                    key={cou._id}
                    onPress={() => {
                      setSelectedCountry(cou.slug);
                      setActiveModal(null);
                    }}
                    className="py-4 border-b border-border flex-row items-center justify-between"
                  >
                    <Text
                      className={`text-base font-bold ${selectedCountry === cou.slug ? 'text-primary' : 'text-text'}`}
                    >
                      {cou.name}
                    </Text>
                  </TouchableOpacity>
                ))}

              {activeModal === 'year' &&
                years.map(year => (
                  <TouchableOpacity
                    key={year}
                    onPress={() => {
                      setSelectedYear(year);
                      setActiveModal(null);
                    }}
                    className="py-4 border-b border-border flex-row items-center justify-between"
                  >
                    <Text
                      className={`text-base font-bold ${selectedYear === year ? 'text-primary' : 'text-text'}`}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SeeMoreScreen;

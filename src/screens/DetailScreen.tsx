import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  StatusBar,
  Platform,
  Modal,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { COLORS } from '@/constants/theme';
import { useMovieDetails } from '@/hooks/useMovies';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import MetaPill from '@/components/common/MetaPill';
import Animated, {
  FadeInUp,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import {
  ChevronLeft,
  Play,
  Calendar,
  Clock,
  Star,
  Monitor,
  Info,
  Layers,
  Globe,
  ArrowDownAz,
  ArrowUpAz,
  User,
  Video,
  MapPin,
  ChevronDown,
  ChevronUp,
  Download,
  FileVideo,
  Heart,
} from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { useDownloadStore } from '@/store/useDownloadStore';
import { downloadService } from '../services/DownloadService';
import { DownloadTask } from '@/store/useDownloadStore';
import { FlashList } from '@shopify/flash-list';
import CircularProgress from '@/components/common/CircularProgress';
import { CheckCircle2 } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const BACKDROP_HEIGHT = height * 0.45;

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;
type TabType = 'info' | 'episodes';

// Memoized Metadata Pill removed - now using common MetaPill

const DetailScreen = ({ route, navigation }: Props) => {
  const { id } = route.params;
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError } = useMovieDetails(id);
  const { colors, isDark } = useTheme();

  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [activeServer, setActiveServer] = useState(0);
  const [isDesc, setIsDesc] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const { tasks } = useDownloadStore();
  const { isFavorite, addFavorite, removeFavorite } = useAppStore();

  const isFav = data?.data.item ? isFavorite(data.data.item._id) : false;

  const toggleFavorite = useCallback(() => {
    if (!data?.data.item) return;
    const item = data.data.item;
    if (isFav) {
      removeFavorite(item._id);
    } else {
      addFavorite({
        _id: item._id,
        name: item.name,
        slug: item.slug,
        thumb_url: item.thumb_url,
        poster_url: item.poster_url,
        lastWatchedTime: Date.now(),
      });
    }
  }, [isFav, data, addFavorite, removeFavorite]);

  // Scroll values for Parallax
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });

  const animatedBackdropStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-BACKDROP_HEIGHT, 0, BACKDROP_HEIGHT],
      [-BACKDROP_HEIGHT / 2, 0, BACKDROP_HEIGHT * 0.75],
    );
    const scale = interpolate(
      scrollY.value,
      [-BACKDROP_HEIGHT, 0],
      [2, 1],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const animatedHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, BACKDROP_HEIGHT * 0.5],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  // Animation values for Play Button
  const playButtonScale = useSharedValue(1);
  const animatedPlayButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playButtonScale.value }],
  }));

  const onPressIn = () => {
    playButtonScale.value = withSpring(0.95);
  };
  const onPressOut = () => {
    playButtonScale.value = withSpring(1);
  };

  // Memoized Sorted Episodes
  const sortedEpisodes = useMemo(() => {
    const episodes =
      data?.data.item.episodes?.[activeServer]?.server_data || [];
    if (!isDesc) return episodes;
    return [...episodes].reverse();
  }, [data, activeServer, isDesc]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text className="text-muted mt-4 font-bold tracking-widest">
          ĐANG TẢI PHIM...
        </Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-6">
        <Text className="text-white text-center text-lg font-bold mb-2">
          Đã có lỗi xảy ra
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-primary px-8 py-3 rounded-2xl mt-4"
        >
          <Text className="text-white font-bold">Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const movie = data.data.item;
  const imageDomain = data.data.APP_DOMAIN_CDN_IMAGE;

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        translucent
        backgroundColor="transparent"
      />

      {/* Sticky Top Header (Hidden initially) */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: insets.top + 56,
            zIndex: 20,
            backgroundColor: colors.background,
          },
          animatedHeaderStyle,
        ]}
      >
        <View
          style={{
            marginTop: insets.top,
            height: 56,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
        >
          <Text
            className="text-text font-black text-lg flex-1 mr-12"
            numberOfLines={1}
          >
            {movie.name}
          </Text>
        </View>
      </Animated.View>

      {/* Floating Back Button */}
      <View
        style={{
          position: 'absolute',
          top: insets.top + 10,
          left: 20,
          zIndex: 30,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {Platform.OS === 'ios' ? (
            <BlurView
              blurType={isDark ? 'dark' : 'light'}
              blurAmount={10}
              style={styles.headerIcon}
            >
              <ChevronLeft color={colors.text} size={24} />
            </BlurView>
          ) : (
            <View
              style={[
                styles.headerIcon,
                {
                  backgroundColor: isDark
                    ? 'rgba(0,0,0,0.5)'
                    : 'rgba(255,255,255,0.5)',
                },
              ]}
            >
              <ChevronLeft color={colors.text} size={24} />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        {/* Parallax Backdrop */}
        <Animated.View
          style={[{ height: BACKDROP_HEIGHT }, animatedBackdropStyle]}
        >
          <Image
            source={{
              uri: `${imageDomain}/uploads/movies/${movie.poster_url}`,
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={[
              'transparent',
              isDark ? 'rgba(11, 17, 32, 0.4)' : 'rgba(255, 255, 255, 0.2)',
              colors.background,
            ]}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Content Section */}
        <View className="px-6 -mt-32">
          {/* Poster & Basic Info */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(600)}
            className="flex-row items-end"
          >
            <View
              className="shadow-2xl shadow-black rounded-3xl overflow-hidden border border-white/20"
              style={{ width: 120, height: 180 }}
            >
              <Image
                source={{
                  uri: `${imageDomain}/uploads/movies/${movie.thumb_url}`,
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1 ml-5 mb-2">
              <Text
                className="text-text text-2xl font-black leading-tight mb-1"
                numberOfLines={2}
              >
                {movie.name}
              </Text>
              <Text
                className="text-muted text-sm italic font-medium"
                numberOfLines={1}
              >
                {movie.origin_name}
              </Text>
              <View className="mt-2 flex-row">
                <View className="bg-primary/20 border border-primary/30 px-2 py-0.5 rounded-md">
                  <Text className="text-primary text-[9px] font-black uppercase tracking-tighter">
                    {movie.status === 'completed' ? 'Hoàn thành' : 'Đang chiếu'}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Quick Meta Row */}
          <Animated.View
            entering={FadeInUp.delay(300).duration(600)}
            className="flex-row items-center mt-6 flex-wrap"
          >
            <MetaPill icon={Calendar} text={movie.year} />
            <MetaPill icon={Clock} text={movie.time || 'N/A'} />
            <MetaPill
              icon={Star}
              text={movie.tmdb?.vote_average || '7.5'}
              color={COLORS.primary}
              bgColor="bg-primary/10"
              borderColor="border-primary/20"
              textColor="text-primary"
            />
            <MetaPill icon={Monitor} text={movie.quality} />
          </Animated.View>

          {/* Play & Download CTA */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(600)}
            style={animatedPlayButtonStyle}
          >
            <View className="flex-row items-center mt-6">
              <TouchableOpacity
                activeOpacity={0.9}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                className="flex-1 mr-3"
                onPress={() => {
                  const firstEpisode = movie.episodes?.[0]?.server_data?.[0];
                  if (firstEpisode) {
                    navigation.navigate('Watch', {
                      url: firstEpisode.link_m3u8 || firstEpisode.link_embed,
                      title: movie.name,
                      currentEpisode: firstEpisode.name,
                      slug: movie.slug,
                      serverIndex: 0,
                    });
                  }
                }}
              >
                <LinearGradient
                  colors={[COLORS.primary, '#2563EB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.playButton}
                >
                  <Play color="white" size={24} fill="white" />
                  <Text className="text-white font-black ml-3 text-lg tracking-widest uppercase">
                    XEM NGAY
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={toggleFavorite}
                className="bg-white/10 w-16 h-16 rounded-2xl items-center justify-center border border-white/20 mr-3"
              >
                <Heart color={isFav ? '#EF4444' : 'white'} fill={isFav ? '#EF4444' : 'transparent'} size={24} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowDownloadModal(true)}
                className="bg-white/10 w-16 h-16 rounded-2xl items-center justify-center border border-white/20"
              >
                <Download color="white" size={24} />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Tabs */}
          <View className="mt-8 flex-row border-b border-border">
            <TouchableOpacity
              onPress={() => setActiveTab('info')}
              className={`pb-3 mr-8 border-b-2 ${activeTab === 'info' ? 'border-primary' : 'border-transparent'}`}
            >
              <Text
                className={`text-sm font-black ${activeTab === 'info' ? 'text-text' : 'text-muted'}`}
              >
                THÔNG TIN
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('episodes')}
              className={`pb-3 border-b-2 ${activeTab === 'episodes' ? 'border-primary' : 'border-transparent'}`}
            >
              <Text
                className={`text-sm font-black ${activeTab === 'episodes' ? 'text-text' : 'text-muted'}`}
              >
                TẬP PHIM
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View className="mt-6">
            {activeTab === 'info' ? (
              <Animated.View entering={FadeIn}>
                {/* Meta Extended */}
                <View className="mb-6 flex-row flex-wrap">
                  {movie.director?.map(
                    (d, i) => d && <MetaPill key={i} icon={Video} text={d} />,
                  )}
                  {movie.country?.map(
                    c =>
                      c && <MetaPill key={c.id} icon={MapPin} text={c.name} />,
                  )}
                </View>

                {/* Genres */}
                <View className="flex-row items-center mb-3">
                  <Layers color={colors.primary} size={18} />
                  <Text className="text-text text-lg font-bold ml-2">
                    Thể loại
                  </Text>
                </View>
                <View className="flex-row flex-wrap mb-6">
                  {movie.category?.map(cat => (
                    <View
                      key={cat.id}
                      className="bg-surface border border-white/10 px-4 py-2 rounded-2xl mr-2 mb-2"
                    >
                      <Text className="text-muted text-[11px] font-bold">
                        {cat.name}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Plot Summary */}
                <View className="flex-row items-center mb-3">
                  <Info color={colors.primary} size={18} />
                  <Text className="text-text text-lg font-bold ml-2">
                    Nội dung
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setIsExpanded(!isExpanded)}
                  className="bg-white/5 p-5 rounded-3xl"
                >
                  <Text
                    className="text-muted leading-7 text-[13px] text-justify font-medium"
                    numberOfLines={isExpanded ? undefined : 4}
                  >
                    {movie.content?.replace(/<[^>]*>?/gm, '')}
                  </Text>
                  <View className="flex-row items-center justify-center mt-3 border-t border-white/5 pt-3">
                    <Text className="text-primary text-[10px] font-black uppercase tracking-widest mr-2">
                      {isExpanded ? 'THU GỌN' : 'XEM THÊM'}
                    </Text>
                    {isExpanded ? (
                      <ChevronUp size={12} color={COLORS.primary} />
                    ) : (
                      <ChevronDown size={12} color={COLORS.primary} />
                    )}
                  </View>
                </TouchableOpacity>

                {/* Actors */}
                {movie.actor && movie.actor.length > 0 && (
                  <View className="mt-8">
                    <View className="flex-row items-center mb-4">
                      <User color={colors.primary} size={18} />
                      <Text className="text-text text-lg font-bold ml-2">
                        Diễn viên
                      </Text>
                    </View>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      {movie.actor.map((actor, idx) => (
                        <View
                          key={idx}
                          className="bg-surface px-5 py-3 rounded-2xl mr-3 border border-border"
                        >
                          <Text className="text-text text-xs font-bold">
                            {actor}
                          </Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </Animated.View>
            ) : (
              <Animated.View entering={FadeIn}>
                {/* Server Selection */}
                {movie.episodes && movie.episodes.length > 1 && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mb-6"
                  >
                    {movie.episodes.map((server, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => {
                          setActiveServer(idx);
                          setActiveTab('episodes');
                        }}
                        className={`px-6 py-2.5 rounded-2xl mr-3 border ${activeServer === idx ? 'bg-primary border-primary' : 'bg-surface border-border'}`}
                      >
                        <Text
                          className={`text-[11px] font-black uppercase tracking-widest ${activeServer === idx ? 'text-white' : 'text-muted'}`}
                        >
                          {server.server_name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}

                {/* Episodes Header with Sort */}
                <View className="flex-row items-center justify-between mb-6 px-1">
                  <View className="flex-row items-center">
                    <Globe color={colors.primary} size={16} />
                    <Text className="text-primary text-sm font-black ml-2 uppercase tracking-widest">
                      {movie.episodes?.[activeServer]?.server_name ||
                        'Tập phim'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setIsDesc(!isDesc)}
                    className="flex-row items-center bg-surface px-3 py-1.5 rounded-xl border border-border"
                  >
                    {isDesc ? (
                      <ArrowDownAz color={colors.primary} size={14} />
                    ) : (
                      <ArrowUpAz color={colors.primary} size={14} />
                    )}
                    <Text className="text-muted text-[10px] font-bold ml-2 uppercase">
                      {isDesc ? 'Mới nhất' : 'Cũ nhất'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-row flex-wrap items-center">
                  {sortedEpisodes.map((ep, eIdx) => {
                    const btnSize = (width - 48 - 40) / 5;
                    return (
                      <TouchableOpacity
                        key={eIdx}
                        style={{ width: btnSize, height: btnSize }}
                        className="bg-surface border border-border rounded-xl items-center justify-center m-[4px]"
                        activeOpacity={0.7}
                        onPress={() => {
                          navigation.navigate('Watch', {
                            url: ep.link_m3u8 || ep.link_embed,
                            title: movie.name,
                            currentEpisode: ep.name,
                            slug: movie.slug,
                            serverIndex: activeServer,
                          });
                        }}
                      >
                        <Text className="text-text text-[10px] font-black leading-none">
                          {ep.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {(!movie.episodes || movie.episodes.length === 0) && (
                  <View className="items-center py-10">
                    <Text className="text-muted italic">
                      Đang cập nhật tập phim...
                    </Text>
                  </View>
                )}
              </Animated.View>
            )}
          </View>
        </View>
      </Animated.ScrollView>

      {/* Download Modal */}
      <Modal
        visible={showDownloadModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDownloadModal(false)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setShowDownloadModal(false)}
          />
          <View
            className="bg-background rounded-t-[40px] px-6 pt-8 pb-10 border-t border-white/10"
            style={{ height: height * 0.8 }}
          >
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-1">
                <Text className="text-text text-xl font-black">Tải phim</Text>
                <Text className="text-muted text-xs font-medium mt-1">
                  Chọn tập phim muốn tải về máy
                </Text>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => setIsDesc(!isDesc)}
                  className="w-10 h-10 items-center justify-center rounded-full bg-white/5 mr-2"
                >
                  {isDesc ? (
                    <ArrowDownAz color={colors.primary} size={20} />
                  ) : (
                    <ArrowUpAz color={colors.primary} size={20} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowDownloadModal(false)}
                  className="w-10 h-10 items-center justify-center rounded-full bg-white/5"
                >
                  <ChevronDown color={colors.text} size={24} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ height: height * 0.65 }}>
              {/* @ts-ignore */}
              <FlashList
                data={sortedEpisodes}
                // @ts-ignore
                keyExtractor={item => item.name}
                renderItem={({ item }: { item: any }) => {
                  const taskId = `${movie.slug}-${item.name}`;
                  const task = tasks.find(t => t.id === taskId);
                  const isCompleted = task?.status === 'completed';
                  const isDownloading = task?.status === 'downloading';

                  return (
                    <View className="flex-row items-center justify-between py-4 border-b border-white/5">
                      <View className="flex-row items-center flex-1">
                        <View className={`w-12 h-12 rounded-2xl items-center justify-center mr-4 ${isCompleted ? 'bg-green-500/10' : 'bg-primary/10'}`}>
                          {isCompleted ? (
                             <CheckCircle2 size={22} color="#22C55E" />
                          ) : (
                             <FileVideo size={20} color={colors.primary} />
                          )}
                        </View>
                        <View className="flex-1">
                          <Text className={`text-text font-bold ${isCompleted ? 'text-green-500' : ''}`}>
                            Tập {item.name}
                          </Text>
                          <Text className="text-muted text-[10px] mt-0.5">
                            {isCompleted ? 'Đã tải xong • 100%' : isDownloading ? `Đang tải... ${Math.round((task?.progress || 0) * 100)}%` : 'Sẵn sàng tải xuống'}
                          </Text>
                        </View>
                      </View>
                      
                      <View className="items-center justify-center min-w-[80px]">
                        {isDownloading ? (
                           <CircularProgress 
                             progress={task?.progress || 0} 
                             size={36} 
                             showText 
                           />
                        ) : isCompleted ? (
                           <View className="bg-green-500/20 px-3 py-1.5 rounded-xl border border-green-500/30">
                              <Text className="text-green-500 text-[10px] font-black uppercase">Đã tải</Text>
                           </View>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              useDownloadStore.getState().addTask({
                                id: taskId,
                                movieName: movie.name,
                                movieSlug: movie.slug,
                                episodeName: item.name,
                                thumbUrl: `${imageDomain}/uploads/movies/${movie.thumb_url}`,
                                videoUrl: item.link_m3u8 || item.link_embed,
                              });
                              downloadService.startDownload(taskId);
                            }}
                            className="bg-primary px-4 py-2 rounded-xl"
                          >
                            <Text className="text-white text-[11px] font-black uppercase">Tải xuống</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                }}
                ListEmptyComponent={() => (
                  <View className="items-center py-10">
                    <Text className="text-muted italic">
                      Không có tập phim nào để tải
                    </Text>
                  </View>
                )}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  playButton: {
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});

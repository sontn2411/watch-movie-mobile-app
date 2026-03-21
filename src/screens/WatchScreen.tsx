import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableWithoutFeedback,
  useWindowDimensions,
  Alert,
} from 'react-native';
import Video, {
  VideoRef,
  ResizeMode,
  SelectedVideoTrackType,
} from 'react-native-video';
import Slider from '@react-native-community/slider';
import Orientation from 'react-native-orientation-locker';
import { WebView } from 'react-native-webview';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { COLORS } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import {
  ChevronLeft,
  Globe,
  ArrowDownAz,
  ArrowUpAz,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Maximize,
  Minimize,
  Settings,
  Check,
} from 'lucide-react-native';
import { useMovieDetails } from '@/hooks/useMovies';
import { useAppStore } from '@/store/useAppStore';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type Props = NativeStackScreenProps<RootStackParamList, 'Watch'>;

const WatchScreen = ({ route, navigation }: Props) => {
  const { width, height } = useWindowDimensions();
  const { url, title, currentEpisode, slug, serverIndex } = route.params;
  const insets = useSafeAreaInsets();
  const videoRef = useRef<VideoRef>(null);
  const { colors, isDark } = useTheme();
  const { addToHistory, watchHistory } = useAppStore();

  const { data, isLoading: isDetailsLoading } = useMovieDetails(slug);
  
  // Player States
  // ... (keeping existing states)
  const [activeUrl, setActiveUrl] = useState(url);
  const [activeEpName, setActiveEpName] = useState(currentEpisode);
  const [activeServer, setActiveServer] = useState(serverIndex || 0);
  const [playingServerIndex, setPlayingServerIndex] = useState(
    serverIndex || 0,
  );
  const [isDesc, setIsDesc] = useState(false);

  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [videoTracks, setVideoTracks] = useState<any[]>([]);
  const [selectedVideoTrack, setSelectedVideoTrack] = useState<{
    type: SelectedVideoTrackType;
    value?: number | string;
  }>({
    type: SelectedVideoTrackType.AUTO,
  });

  // ... (keeping existing effects/handlers)

  const currentTimeRef = useRef(0);
  const durationRef = useRef(0);
  const hasPromptedResume = useRef(false);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const onProgress = (data: { currentTime: number }) => {
    setCurrentTime(data.currentTime);
    currentTimeRef.current = data.currentTime;
  };

  const onLoad = (data: any) => {
    setDuration(data.duration);
    durationRef.current = data.duration;
    setIsBuffering(false);
    if (data.videoTracks) {
      setVideoTracks(data.videoTracks);
    }

    // Check resume playback
    if (!hasPromptedResume.current && !isEmbed) {
      hasPromptedResume.current = true;
      const historyItem = watchHistory.find(item => item._id === route.params.slug || item.slug === route.params.slug);
      
      if (historyItem && historyItem.currentTime && historyItem.duration && historyItem.episodeName === activeEpName) {
        // If they watched > 5 seconds and have more than 10 seconds left
        if (historyItem.currentTime > 5 && historyItem.duration - historyItem.currentTime > 10) {
          Alert.alert(
            'Tiếp tục xem?',
            `Bạn đang xem dở tập ${activeEpName} ở phút thứ ${formatTime(historyItem.currentTime)}. Bạn có muốn xem tiếp không?`,
            [
              { text: 'Từ đầu', style: 'cancel', onPress: () => videoRef.current?.seek(0) },
              { text: 'Xem tiếp', onPress: () => videoRef.current?.seek(historyItem.currentTime!) },
            ]
          );
        }
      }
    }
  };

  const onBuffer = ({ isBuffering }: { isBuffering: boolean }) => {
    setIsBuffering(isBuffering);
  };

  const seekForward = () => {
    videoRef.current?.seek(currentTime + 10);
  };

  const seekBackward = () => {
    videoRef.current?.seek(currentTime - 10);
  };

  // Memoized Sorted Episodes
  const sortedEpisodes = useMemo(() => {
    const episodes =
      data?.data.item.episodes?.[activeServer]?.server_data || [];
    if (!isDesc) return episodes;
    return [...episodes].reverse();
  }, [data, activeServer, isDesc]);

  const handleEpisodePress = (ep: any) => {
    setActiveUrl(ep.link_m3u8 || ep.link_embed);
    setActiveEpName(ep.name);
    setPlayingServerIndex(activeServer);
    setCurrentTime(0);
    currentTimeRef.current = 0;
    hasPromptedResume.current = false;
    setIsBuffering(true);
  };

  const videoHeight = isFullscreen ? height : (width * 9) / 16;
  const controlsOpacity = useSharedValue(1);

  useEffect(() => {
    let timer: any;
    if (showControls && !paused) {
      timer = setTimeout(() => {
        setShowControls(false);
        controlsOpacity.value = withTiming(0);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showControls, paused]);

  const toggleControls = () => {
    setShowControls(!showControls);
    if (!isEmbed) {
      controlsOpacity.value = withTiming(showControls ? 0 : 1);
    }
  };

  useEffect(() => {
    if (isFullscreen) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }
    return () => Orientation.lockToPortrait();
  }, [isFullscreen]);

  useEffect(() => {
    return () => {
      Orientation.lockToPortrait();
      Orientation.unlockAllOrientations();
    };
  }, []);

  useEffect(() => {
    if (data?.data.item && activeUrl) {
      const item = data.data.item;
      addToHistory({
        _id: item._id,
        name: item.name,
        slug: item.slug,
        thumb_url: item.thumb_url,
        poster_url: item.poster_url,
        lastWatchedTime: Date.now(),
        episodeName: activeEpName,
        serverName: data.data.item.episodes?.[activeServer]?.server_name,
      });
    }

    return () => {
      // Cleanup to save current time
      if (data?.data.item && currentTimeRef.current > 10 && durationRef.current > 0) {
        const item = data.data.item;
        addToHistory({
          _id: item._id,
          name: item.name,
          slug: item.slug,
          thumb_url: item.thumb_url,
          poster_url: item.poster_url,
          lastWatchedTime: Date.now(),
          episodeName: activeEpName,
          serverName: data.data.item.episodes?.[activeServer]?.server_name,
          currentTime: currentTimeRef.current,
          duration: durationRef.current,
        });
      }
    };
  }, [data, activeUrl, activeEpName, activeServer, addToHistory]);

  const isEmbed = useMemo(() => {
    return !activeUrl?.includes('.m3u8') || activeUrl?.includes('embed');
  }, [activeUrl]);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar hidden={isFullscreen} barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Video Player Section */}
      <View
        style={{
          height: isFullscreen ? height : videoHeight + insets.top,
          backgroundColor: '#000',
        }}
      >
        <TouchableWithoutFeedback onPress={toggleControls}>
          <View style={{ flex: 1, marginTop: isFullscreen ? 0 : insets.top }}>
            {isEmbed ? (
              <WebView
                source={{ uri: activeUrl }}
                style={{ flex: 1 }}
                allowsFullscreenVideo
                javaScriptEnabled
                domStorageEnabled
                startInLoadingState
                renderLoading={() => (
                  <View
                    style={StyleSheet.absoluteFill}
                    className="bg-black items-center justify-center"
                  >
                    <ActivityIndicator color={colors.primary} size="large" />
                  </View>
                )}
              />
            ) : (
              <Video
                ref={videoRef}
                source={{ uri: activeUrl }}
                style={StyleSheet.absoluteFill}
                resizeMode={ResizeMode.CONTAIN}
                paused={paused}
                onProgress={onProgress}
                onLoad={onLoad}
                onBuffer={onBuffer}
                repeat={false}
                selectedVideoTrack={selectedVideoTrack}
              />
            )}

            {/* Buffering Indicator */}
            {isBuffering && !isEmbed && (
              <View
                style={StyleSheet.absoluteFill}
                className="items-center justify-center bg-black/20"
              >
                <ActivityIndicator color={colors.primary} size="large" />
              </View>
            )}

            {/* Controls Overlay (Only for Native Player) */}
            {!isEmbed && showControls && (
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 10 },
                ]}
              >
                {/* Top Bar */}
                <View className="flex-row items-center px-6 py-4">
                  <TouchableOpacity
                    onPress={() =>
                      isFullscreen
                        ? setIsFullscreen(false)
                        : navigation.goBack()
                    }
                  >
                    <ChevronLeft color="white" size={28} />
                  </TouchableOpacity>
                  <View className="ml-4 flex-1">
                    <Text
                      className="text-white font-black text-base"
                      numberOfLines={1}
                    >
                      {title}
                    </Text>
                    <Text className="text-white/70 text-xs mt-0.5">
                      Tập {activeEpName}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setShowQualityMenu(true)}
                    className="p-2"
                  >
                    <Settings color="white" size={24} />
                  </TouchableOpacity>
                </View>

                {/* Middle Controls (Always White as player is dark) */}
                <View className="flex-1 flex-row items-center justify-evenly">
                  <TouchableOpacity onPress={seekBackward}>
                    <RotateCcw color="white" size={32} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setPaused(!paused)}
                    className="w-16 h-16 rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {paused ? (
                      <Play color="white" size={32} fill="white" />
                    ) : (
                      <Pause color="white" size={32} fill="white" />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity onPress={seekForward}>
                    <RotateCw color="white" size={32} />
                  </TouchableOpacity>
                </View>

                {/* Bottom Bar */}
                <View className="px-6 py-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-white text-[10px] font-bold">
                      {formatTime(currentTime)}
                    </Text>
                    <Text className="text-white text-[10px] font-bold">
                      {formatTime(duration)}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Slider
                      style={{ flex: 1, height: 40 }}
                      minimumValue={0}
                      maximumValue={duration}
                      value={currentTime}
                      minimumTrackTintColor={colors.primary}
                      maximumTrackTintColor="rgba(255,255,255,0.3)"
                      thumbTintColor={colors.primary}
                      onSlidingComplete={val => videoRef.current?.seek(val)}
                    />
                    <TouchableOpacity
                      onPress={() => setIsFullscreen(!isFullscreen)}
                      className="ml-4"
                    >
                      {isFullscreen ? (
                        <Minimize color="white" size={20} />
                      ) : (
                        <Maximize color="white" size={20} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            )}

            {isEmbed && showControls && (
              <View
                style={{ position: 'absolute', top: 0, left: 0, padding: 20 }}
              >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <ChevronLeft color="white" size={28} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>

        {/* Quality Selection Menu */}
        {showQualityMenu && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            className="absolute inset-0 z-[100] items-center justify-center bg-black/80"
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setShowQualityMenu(false)}
              style={StyleSheet.absoluteFill}
            />
            <View
              className="w-4/5 max-h-[70%] bg-[#1E293B] rounded-3xl overflow-hidden border border-white/10"
              style={{ elevation: 5 }}
            >
              <View className="p-5 border-b border-white/5 flex-row items-center justify-between">
                <Text className="text-white font-black text-lg">Chất lượng</Text>
                <TouchableOpacity onPress={() => setShowQualityMenu(false)}>
                  <Text className="text-primary font-bold">Xong</Text>
                </TouchableOpacity>
              </View>
              <ScrollView bounces={false}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedVideoTrack({ type: SelectedVideoTrackType.AUTO });
                    setShowQualityMenu(false);
                  }}
                  className="flex-row items-center justify-between p-5 border-b border-white/5"
                >
                  <Text
                    className={`text-base ${selectedVideoTrack.type === SelectedVideoTrackType.AUTO ? 'text-primary font-bold' : 'text-white/70'}`}
                  >
                    Tự động (Auto)
                  </Text>
                  {selectedVideoTrack.type === SelectedVideoTrackType.AUTO && (
                    <Check color={colors.primary} size={20} />
                  )}
                </TouchableOpacity>

                {videoTracks
                  .filter(track => track.height > 0)
                  .sort((a, b) => b.height - a.height)
                  .map((track, idx) => {
                    const isSelected =
                      selectedVideoTrack.type ===
                        SelectedVideoTrackType.RESOLUTION &&
                      selectedVideoTrack.value === track.height;
                    return (
                      <TouchableOpacity
                        key={track.trackId || idx}
                        onPress={() => {
                          setSelectedVideoTrack({
                            type: SelectedVideoTrackType.RESOLUTION,
                            value: track.height,
                          });
                          setShowQualityMenu(false);
                        }}
                        className="flex-row items-center justify-between p-5 border-b border-white/5"
                      >
                        <Text
                          className={`text-base ${isSelected ? 'text-primary font-bold' : 'text-white/70'}`}
                        >
                          {track.height}p
                          {track.bitrate
                            ? ` (${Math.round(track.bitrate / 1000)} kbps)`
                            : ''}
                        </Text>
                        {isSelected && (
                          <Check color={colors.primary} size={20} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
              </ScrollView>
            </View>
          </Animated.View>
        )}
      </View>

      {!isFullscreen && (
        <ScrollView
          className="flex-1 px-4 mt-6"
          showsVerticalScrollIndicator={false}
        >
          {isDetailsLoading ? (
            <ActivityIndicator color={colors.primary} className="mt-10" />
          ) : (
            <View>
              {/* Server Selection */}
              {data?.data.item.episodes &&
                data.data.item.episodes.length > 1 && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mb-6"
                  >
                    {data.data.item.episodes.map((server, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => setActiveServer(idx)}
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

              {/* Episodes Header */}
              <View className="flex-row items-center justify-between mb-4 px-1">
                <View className="flex-row items-center">
                  <Globe color={colors.primary} size={16} />
                  <Text className="text-text font-bold ml-2">
                    Danh sách tập
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
                  const btnWidth = (width - 32 - 32) / 4;
                  const isActive =
                    ep.name === activeEpName &&
                    activeServer === playingServerIndex;
                  return (
                    <TouchableOpacity
                      key={eIdx}
                      onPress={() => handleEpisodePress(ep)}
                      style={{ width: btnWidth, height: 40 }}
                      className={`border rounded-xl items-center justify-center m-[4px] ${
                        isActive
                          ? 'bg-primary border-primary'
                          : 'bg-surface border-border'
                      }`}
                      activeOpacity={0.7}
                    >
                      <Text
                        className={`text-xs font-bold ${isActive ? 'text-white' : 'text-muted'}`}
                      >
                        {ep.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};


export default WatchScreen;

const styles = StyleSheet.create({});

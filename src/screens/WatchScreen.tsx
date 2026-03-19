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
} from 'react-native';
import Video, { VideoRef, ResizeMode } from 'react-native-video';
import Slider from '@react-native-community/slider';
import Orientation from 'react-native-orientation-locker';
import { WebView } from 'react-native-webview';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { COLORS } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
} from 'lucide-react-native';
import { useMovieDetails } from '@/hooks/useMovies';
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

  const { data, isLoading: isDetailsLoading } = useMovieDetails(slug);

  // Player States
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

  const controlsOpacity = useSharedValue(1);

  const isEmbed = useMemo(() => {
    return !activeUrl?.includes('.m3u8') || activeUrl?.includes('embed');
  }, [activeUrl]);

  // Auto-hide controls
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
    if (isEmbed) {
      setShowControls(!showControls);
      return;
    }
    setShowControls(!showControls);
    controlsOpacity.value = withTiming(showControls ? 0 : 1);
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

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const onProgress = (data: { currentTime: number }) => {
    setCurrentTime(data.currentTime);
  };

  const onLoad = (data: { duration: number }) => {
    setDuration(data.duration);
    setIsBuffering(false);
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
    return [...episodes].sort((a, b) => {
      const idxA =
        data?.data.item.episodes?.[activeServer]?.server_data.indexOf(a) ?? 0;
      const idxB =
        data?.data.item.episodes?.[activeServer]?.server_data.indexOf(b) ?? 0;
      return isDesc ? idxB - idxA : idxA - idxB;
    });
  }, [data, activeServer, isDesc]);

  const handleEpisodePress = (ep: any) => {
    setActiveUrl(ep.link_m3u8 || ep.link_embed);
    setActiveEpName(ep.name);
    setPlayingServerIndex(activeServer);
    setCurrentTime(0);
    setIsBuffering(true);
  };

  const videoHeight = isFullscreen ? height : (width * 9) / 16;

  return (
    <View className="flex-1 bg-background">
      <StatusBar hidden={isFullscreen} barStyle="light-content" />

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
                    <ActivityIndicator color={COLORS.primary} size="large" />
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
              />
            )}

            {/* Buffering Indicator */}
            {isBuffering && !isEmbed && (
              <View
                style={StyleSheet.absoluteFill}
                className="items-center justify-center bg-black/20"
              >
                <ActivityIndicator color={COLORS.primary} size="large" />
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
                </View>

                {/* Middle Controls */}
                <View className="flex-1 flex-row items-center justify-evenly">
                  <TouchableOpacity onPress={seekBackward}>
                    <RotateCcw color="white" size={32} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setPaused(!paused)}
                    className="w-16 h-16 rounded-full bg-primary items-center justify-center"
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
                      minimumTrackTintColor={COLORS.primary}
                      maximumTrackTintColor="rgba(255,255,255,0.3)"
                      thumbTintColor={COLORS.primary}
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

            {/* Embed Mode Overlay (Minimal) */}
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
      </View>

      {/* Content Section (Only in portrait) */}
      {!isFullscreen && (
        <ScrollView
          className="flex-1 px-4 mt-6"
          showsVerticalScrollIndicator={false}
        >
          {isDetailsLoading ? (
            <ActivityIndicator color={COLORS.primary} className="mt-10" />
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
                        className={`px-6 py-2.5 rounded-2xl mr-3 border ${activeServer === idx ? 'bg-primary border-primary' : 'bg-white/5 border-white/10'}`}
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
                  <Globe color={COLORS.primary} size={16} />
                  <Text className="text-white font-bold ml-2">
                    Danh sách tập
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsDesc(!isDesc)}
                  className="flex-row items-center bg-white/5 px-3 py-1.5 rounded-xl border border-white/10"
                >
                  {isDesc ? (
                    <ArrowDownAz color={COLORS.primary} size={14} />
                  ) : (
                    <ArrowUpAz color={COLORS.primary} size={14} />
                  )}
                  <Text className="text-muted text-[10px] font-bold ml-2 uppercase">
                    {isDesc ? 'Mới nhất' : 'Cũ nhất'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Episode Grid */}
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
                          : 'bg-white/5 border-white/10'
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

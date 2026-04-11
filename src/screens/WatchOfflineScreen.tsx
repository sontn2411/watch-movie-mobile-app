import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  TouchableWithoutFeedback,
  useWindowDimensions,
  Alert,
} from 'react-native';
import Video, {
  VideoRef,
  ResizeMode,
} from 'react-native-video';
import Slider from '@react-native-community/slider';
import Orientation from 'react-native-orientation-locker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useDownloadStore, DownloadTask } from '@/store/useDownloadStore';
import { downloadService } from '@/services/DownloadService';
import { useAppStore } from '@/store/useAppStore';
import {
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Maximize,
  Minimize,
  Globe,
} from 'lucide-react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import { ScrollView } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'WatchOffline'>;

const WatchOfflineScreen = ({ route, navigation }: Props) => {
  const { width, height } = useWindowDimensions();
  const { url, title, episodeName, movieSlug } = route.params;
  const insets = useSafeAreaInsets();
  const videoRef = useRef<VideoRef>(null);
  const { colors, isDark } = useTheme();
  const { tasks } = useDownloadStore();
  const { watchHistory, addToHistory } = useAppStore();

  const [activeUrl, setActiveUrl] = useState(url);
  const [activeEpName, setActiveEpName] = useState(episodeName);
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentTimeRef = useRef(0);
  const durationRef = useRef(0);

  // Filter episodes for this movie
  const movieEpisodes = useMemo(() => {
    return tasks
      .filter(t => t.movieSlug === movieSlug && t.status === 'completed')
      .sort((a, b) => {
        // Simple numeric sort if possible
        const epA = parseInt(a.episodeName) || 0;
        const epB = parseInt(b.episodeName) || 0;
        return epA - epB;
      });
  }, [tasks, movieSlug]);

  const handleEpisodePress = (task: DownloadTask) => {
    const playbackUrl = downloadService.resolvePlaybackUrl(task);
    setActiveUrl(playbackUrl);
    setActiveEpName(task.episodeName);
    setCurrentTime(0);
    currentTimeRef.current = 0;
    setIsBuffering(true);
  };

  const formatTime = (timeInSeconds: number) => {
// ... (omitting formatTime to save space in replace)
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

  useEffect(() => {
    const currentTask = movieEpisodes.find((ep: DownloadTask) => ep.episodeName === activeEpName);
    if (currentTask && activeUrl) {
      addToHistory({
        _id: currentTask.movieSlug,
        name: currentTask.movieName,
        slug: currentTask.movieSlug,
        thumb_url: currentTask.thumbUrl,
        poster_url: '',
        lastWatchedTime: Date.now(),
        episodeName: activeEpName,
        serverName: 'Offline',
      });
    }

    return () => {
      if (currentTask && currentTimeRef.current > 5 && durationRef.current > 0) {
        addToHistory({
          _id: currentTask.movieSlug,
          name: currentTask.movieName,
          slug: currentTask.movieSlug,
          thumb_url: currentTask.thumbUrl,
          poster_url: '',
          lastWatchedTime: Date.now(),
          episodeName: activeEpName,
          serverName: 'Offline',
          currentTime: currentTimeRef.current,
          duration: durationRef.current,
        });
      }
    };
  }, [activeUrl, activeEpName, addToHistory, movieEpisodes]);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar hidden={isFullscreen} barStyle="light-content" />

        <View 
            style={{ 
                height: isFullscreen ? height : videoHeight + (isFullscreen ? 0 : insets.top),
                backgroundColor: '#000' 
            }}
        >
          <View style={{ flex: 1, marginTop: isFullscreen ? 0 : insets.top }}>
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

            {/* Touch catcher when hidden */}
            {!showControls && (
              <TouchableWithoutFeedback onPress={toggleControls}>
                <View style={StyleSheet.absoluteFill} />
              </TouchableWithoutFeedback>
            )}

            {/* Buffering Indicator */}
            {isBuffering && (
                <View
                pointerEvents="none"
                style={StyleSheet.absoluteFill}
                className="items-center justify-center z-10"
                >
                <ActivityIndicator color={colors.primary} size="large" />
                </View>
            )}

            {/* Controls Overlay */}
            {showControls && (
                <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                pointerEvents="box-none"
                style={[
                    StyleSheet.absoluteFill,
                    { zIndex: 10 },
                ]}
                >
                {/* Background overlay that dismisses controls */}
                <TouchableWithoutFeedback onPress={toggleControls}>
                  <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />
                </TouchableWithoutFeedback>

                <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
                  {/* Top Bar */}
                  <View 
                      pointerEvents="box-none"
                      className="flex-row items-center px-6 py-4"
                  >
                      <TouchableOpacity
                      onPress={() =>
                          isFullscreen
                          ? setIsFullscreen(false)
                          : navigation.goBack()
                      }
                      className="w-10 h-10 items-center justify-center rounded-full bg-white/10"
                      >
                      <ChevronLeft color="white" size={24} />
                      </TouchableOpacity>
                      <View className="ml-4 flex-1">
                      <Text
                          className="text-white font-black text-lg"
                          numberOfLines={1}
                      >
                          {title}
                      </Text>
                      {(() => {
                          const activeTask = tasks.find(t => t.movieSlug === movieSlug && t.episodeName === activeEpName);
                          return (
                            <Text className="text-white/70 text-xs mt-0.5 font-bold uppercase tracking-wider">
                                Tập {activeEpName} {activeTask?.serverName ? `• ${activeTask.serverName}` : '• Offline'}
                            </Text>
                          );
                      })()}
                      </View>
                  </View>

                  {/* Middle Controls */}
                  <View pointerEvents="box-none" className="flex-1 flex-row items-center justify-evenly">
                      <TouchableOpacity onPress={seekBackward} className="p-4">
                      <RotateCcw color="white" size={36} />
                      </TouchableOpacity>

                      <TouchableOpacity
                      onPress={() => setPaused(!paused)}
                      className="w-20 h-20 rounded-full items-center justify-center"
                      style={{ backgroundColor: colors.primary }}
                      >
                      {paused ? (
                          <Play color="white" size={40} fill="white" />
                      ) : (
                          <Pause color="white" size={40} fill="white" />
                      )}
                      </TouchableOpacity>

                      <TouchableOpacity onPress={seekForward} className="p-4">
                      <RotateCw color="white" size={36} />
                      </TouchableOpacity>
                  </View>

                  {/* Bottom Bar */}
                  <View 
                      pointerEvents="box-none"
                      style={{ paddingBottom: isFullscreen ? 30 : 20 }}
                      className="px-6 py-4"
                  >
                      <View className="flex-row items-center justify-between mb-4" pointerEvents="none">
                      <Text className="text-white text-xs font-bold tabular-nums">
                          {formatTime(currentTime)}
                      </Text>
                      <Text className="text-white/50 text-xs font-bold tabular-nums">
                          {formatTime(duration)}
                      </Text>
                      </View>

                      <View className="flex-row items-center" pointerEvents="box-none">
                      <Slider
                          style={{ flex: 1, height: 40 }}
                          minimumValue={0}
                          maximumValue={duration}
                          value={currentTime}
                          minimumTrackTintColor={colors.primary}
                          maximumTrackTintColor="rgba(255,255,255,0.2)"
                          thumbTintColor={colors.primary}
                          onSlidingComplete={val => videoRef.current?.seek(val)}
                      />
                      <TouchableOpacity
                          onPress={() => setIsFullscreen(!isFullscreen)}
                          className="ml-6 w-10 h-10 items-center justify-center rounded-full bg-white/10"
                      >
                          {isFullscreen ? (
                          <Minimize color="white" size={20} />
                          ) : (
                          <Maximize color="white" size={20} />
                          )}
                      </TouchableOpacity>
                      </View>
                  </View>
                </View>
                </Animated.View>
            )}
          </View>
        </View>

      {/* Episode Playlist Section */}
      {!isFullscreen && (
        <View className="flex-1 px-4 mt-6">
            <FlashList
                data={movieEpisodes}
                // @ts-ignore
                estimatedItemSize={48}
                numColumns={4}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
                ListHeaderComponent={
                    <View className="flex-row items-center mb-4 px-1">
                        <Globe color={colors.primary} size={16} />
                        <Text className="text-text font-bold ml-2">
                            Các tập đã tải
                        </Text>
                    </View>
                }
                renderItem={({ item, index }) => {
                    const isActive = item.episodeName === activeEpName;
                    return (
                        <View style={{ flex: 1, padding: 4 }}>
                            <TouchableOpacity
                                onPress={() => handleEpisodePress(item)}
                                style={{ height: 40 }}
                                className={`border rounded-xl items-center justify-center ${
                                    isActive
                                        ? 'bg-primary border-primary'
                                        : 'bg-surface border-border'
                                }`}
                                activeOpacity={0.7}
                            >
                                <Text
                                    className={`text-xs font-bold leading-none ${isActive ? 'text-white' : 'text-muted'}`}
                                >
                                    Tập {item.episodeName}
                                </Text>
                                {item.serverName && (
                                    <Text className={`text-[8px] mt-1 font-black uppercase tracking-widest ${isActive ? 'text-white/70' : 'text-muted/50'}`}>
                                        {item.serverName}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    );
                }}
                keyExtractor={(_, index) => index.toString()}
            />
        </View>
      )}
    </View>
  );
};

export default WatchOfflineScreen;

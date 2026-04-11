import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/hooks/useTheme';
import {
  ChevronLeft,
  Trash2,
  Play,
  Pause,
  Download,
  AlertCircle,
  FileVideo,
} from 'lucide-react-native';
import { useDownloadStore, DownloadTask } from '@/store/useDownloadStore';
import { downloadService } from '../services/DownloadService';

const DownloadsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, isDark } = useTheme();
  const { tasks, removeTask } = useDownloadStore();

  const groupedMovies = React.useMemo(() => {
    const groups: Record<string, {
      movieName: string;
      movieSlug: string;
      thumbUrl: string;
      episodes: DownloadTask[];
    }> = {};

    tasks.forEach(task => {
      if (!groups[task.movieSlug]) {
        groups[task.movieSlug] = {
          movieName: task.movieName,
          movieSlug: task.movieSlug,
          thumbUrl: task.thumbUrl,
          episodes: [],
        };
      }
      groups[task.movieSlug].episodes.push(task);
    });

    return Object.values(groups);
  }, [tasks]);

  const renderEpisodeItem = (task: DownloadTask) => {
    const isCompleted = task.status === 'completed';
    const progress = Math.round(task.progress * 100);

    return (
      <View 
        key={task.id}
        className="flex-row items-center p-4 mb-3 rounded-2xl bg-white/5 border border-white/5"
      >
        <View className="flex-1">
          <Text className="text-text text-base font-bold">
            Tập {task.episodeName} 
            {task.serverName ? <Text className="text-primary text-[10px] uppercase font-black tracking-widest"> • {task.serverName}</Text> : ''}
          </Text>
          <Text className="text-muted text-xs mt-1">
             {isCompleted ? 'Sẵn sàng để xem' : `Đang tải... ${progress}%`}
          </Text>
        </View>
        <View className="flex-row items-center">
            {isCompleted && (
                <TouchableOpacity
                    onPress={() => {
                        const playbackUrl = downloadService.resolvePlaybackUrl(task);
                        navigation.navigate('WatchOffline', {
                            url: playbackUrl,
                            title: task.movieName,
                            episodeName: task.episodeName,
                            movieSlug: task.movieSlug,
                        });
                    }}
                    className="w-10 h-10 items-center justify-center bg-primary/20 rounded-xl mr-3"
                >
                    <Play size={18} color={colors.primary} fill={colors.primary} />
                </TouchableOpacity>
            )}
            <TouchableOpacity
                onPress={() => removeTask(task.id)}
                className="w-10 h-10 items-center justify-center bg-red-500/10 rounded-xl"
            >
                <Trash2 size={18} color="#EF4444" />
            </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderMovieSection = ({ item }: { item: any }) => {
    return (
      <View className="mb-8">
        <View className="flex-row items-center mb-4">
          <Image
            source={{ uri: item.thumbUrl }}
            className="w-12 h-18 rounded-xl bg-slate-800"
            resizeMode="cover"
          />
          <View className="flex-1 ml-4 py-1">
            <Text
              className="text-text font-black text-xl mb-1"
              numberOfLines={1}
            >
              {item.movieName}
            </Text>
            <Text className="text-primary text-xs font-bold uppercase tracking-widest">
              {item.episodes.length} tập phim
            </Text>
          </View>
        </View>
        
        <View className="space-y-1">
          {item.episodes.map(renderEpisodeItem)}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View
        style={{ paddingTop: insets.top + 10 }}
        className="px-6 pb-4 flex-row items-center justify-between"
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center rounded-full bg-white/5"
        >
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text className="text-text text-xl font-black">Tải về</Text>
        <View className="w-10" />
      </View>

      <View className="flex-1 px-6">
        {groupedMovies.length > 0 ? (
          <FlashList
            data={groupedMovies}
            renderItem={renderMovieSection}
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            showsVerticalScrollIndicator={false}
            // @ts-ignore
            estimatedItemSize={120}
          />
        ) : (
          <View className="flex-1 items-center justify-center opacity-50">
            <FileVideo size={64} color={colors.text} strokeWidth={1} />
            <Text className="text-text font-medium mt-4">
              Chưa có video tải về
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default DownloadsScreen;

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, DimensionValue } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';
import LinearGradient from 'react-native-linear-gradient';
import { Play } from 'lucide-react-native';
import { MovieItem } from '@/types/movies';

interface BaseCardProps {
  movie: MovieItem;
  imageDomain: string;
  width?: DimensionValue;
  aspectRatio?: number;
  gradientHeight?: DimensionValue;
  showPlayButton?: boolean;
  showQuality?: boolean;
  showEpisode?: boolean;
  children?: React.ReactNode;
  activeOpacity?: number;
  style?: any;
}

const BaseCard: React.FC<BaseCardProps> = ({
  movie,
  imageDomain,
  width = '100%',
  aspectRatio = 2 / 3,
  gradientHeight = '40%',
  showPlayButton = false,
  showQuality = true,
  showEpisode = true,
  children,
  activeOpacity = 0.8,
  style,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={() =>
        navigation.navigate('Details', {
          id: movie.slug,
          title: movie.name,
        })
      }
      style={[{ width }, style]}
    >
      <View style={[styles.cardContainer, { aspectRatio }]} className="bg-surface border border-white/5">
        <Image
          source={{ uri: `${imageDomain}/uploads/movies/${movie.thumb_url}` }}
          className="w-full h-full"
          resizeMode="cover"
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(11, 17, 32, 0.9)']}
          style={[styles.gradient, { height: gradientHeight }]}
        />

        {showQuality && movie.quality && (
          <View className="absolute top-2 left-2 bg-primary/90 px-2 py-0.5 rounded-md">
            <Text className="text-[10px] font-black text-white uppercase tracking-tighter">
              {movie.quality}
            </Text>
          </View>
        )}

        <View className="absolute bottom-2 left-2 right-2 flex-row items-center justify-between">
          {showEpisode && (
            <Text className="text-[10px] text-slate-300 font-medium flex-1 mr-1" numberOfLines={1}>
              {movie.episode_current}
            </Text>
          )}
          {showPlayButton && (
            <View className="bg-white/20 p-1 rounded-full">
              <Play color="white" size={10} fill="white" />
            </View>
          )}
        </View>
        
        {children}
      </View>
      <Text className="text-white mt-2 text-xs font-semibold leading-tight" numberOfLines={2}>
        {movie.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default React.memo(BaseCard);

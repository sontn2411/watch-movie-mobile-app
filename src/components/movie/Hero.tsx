import React from 'react';
import { View, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Play, Plus, Info } from 'lucide-react-native';
import { MovieItem } from '@/types/movies';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/hooks/useTheme';

interface HeroProps {
  movie: MovieItem;
  imageDomain: string;
}

const Hero: React.FC<HeroProps> = ({ movie, imageDomain }) => {
  const { width, height } = useWindowDimensions();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, isDark } = useTheme();

  if (!movie) return null;

  return (
    <View style={{ width, height: height * 0.7 }} className="relative">
      <Image
        source={{ uri: `${imageDomain}/uploads/movies/${movie.poster_url}` }}
        className="w-full h-full bg-surface"
        resizeMode="cover"
        fadeDuration={0}
        progressiveRenderingEnabled={true}
      />

      {/* Cinematic Gradient Overlays */}
      <LinearGradient
        colors={[
          'transparent',
          isDark ? 'rgba(11, 17, 32, 0.4)' : 'rgba(255, 255, 255, 0.1)',
          isDark ? 'rgba(11, 17, 32, 0.8)' : 'rgba(255, 255, 255, 0.4)',
          colors.background,
        ]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <LinearGradient
        colors={['transparent', isDark ? 'rgba(11, 17, 32, 0.9)' : 'rgba(255, 255, 255, 0.6)', colors.background]}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
        }}
      />

      <View className="absolute bottom-0 left-0 right-0 px-6 pb-8 items-center">
        <Text
          className="text-text text-3xl font-black text-center mb-2"
        >
          {movie.name}
        </Text>

        <View className="flex-row items-center mb-6">
          <Text className="text-primary font-black text-xs uppercase mr-2 tracking-widest">
            {movie.quality}
          </Text>
          <View className="w-1 h-1 rounded-full bg-muted mx-2" />
          <Text className="text-muted text-xs font-bold">
            {movie.category
              ?.map(c => c.name)
              .slice(0, 2)
              .join(' • ')}
          </Text>
        </View>

        <View className="flex-row items-center justify-center space-x-4">
          <TouchableOpacity className="items-center px-4 py-2">
            <Plus color={colors.text} size={24} />
            <Text className="text-text text-[10px] font-bold mt-1">Danh sách</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Details', {
                id: movie.slug,
                title: movie.name,
              })
            }
            className="flex-row items-center bg-primary px-8 py-3 rounded-2xl shadow-lg"
          >
            <Play color="white" size={20} fill="white" />
            <Text className="text-white font-bold ml-2 uppercase tracking-widest">Phát</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() =>
              navigation.navigate('Details', {
                id: movie.slug,
                title: movie.name,
              })
            }
            className="items-center px-4 py-2"
          >
            <Info color={colors.text} size={24} />
            <Text className="text-text text-[10px] font-bold mt-1">Thông tin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Hero;

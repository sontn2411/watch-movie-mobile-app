import React from 'react';
import { View, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Play, Plus, Info } from 'lucide-react-native';
import { MovieItem } from '@/types/movies';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

interface HeroProps {
  movie: MovieItem;
  imageDomain: string;
}

const Hero: React.FC<HeroProps> = ({ movie, imageDomain }) => {
  const { width, height } = useWindowDimensions();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
          'rgba(11, 17, 32, 0.4)',
          'rgba(11, 17, 32, 0.8)',
          'rgba(11, 17, 32, 1)',
        ]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <LinearGradient
        colors={['transparent', 'rgba(11, 17, 32, 0.9)', 'rgba(11, 17, 32, 1)']}
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
          className="text-white text-3xl font-bold text-center mb-2"
          style={{ fontFamily: 'Righteous' }}
        >
          {movie.name}
        </Text>

        <View className="flex-row items-center mb-6">
          <Text className="text-accent font-bold text-xs uppercase mr-2">
            {movie.quality}
          </Text>
          <View className="w-1 h-1 rounded-full bg-slate-500 mr-2" />
          <Text className="text-slate-300 text-xs">
            {movie.category
              ?.map(c => c.name)
              .slice(0, 2)
              .join(' • ')}
          </Text>
        </View>

        <View className="flex-row items-center justify-center space-x-4">
          <TouchableOpacity className="items-center px-4 py-2">
            <Plus color="white" size={24} />
            <Text className="text-white text-[10px] mt-1">Danh sách</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Details', {
                id: movie.slug,
                title: movie.name,
              })
            }
            className="flex-row items-center bg-white px-6 py-2.5 rounded-full"
          >
            <Play color="#3B82F6" size={20} fill="#3B82F6" />
            <Text className="text-primary font-bold ml-2">Phát</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center px-4 py-2">
            <Info color="white" size={24} />
            <Text className="text-white text-[10px] mt-1">Thông tin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Hero;

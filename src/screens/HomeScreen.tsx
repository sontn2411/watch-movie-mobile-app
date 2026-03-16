import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '@/components/common/Button';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import styles from '@/styles/screens/Home.scss';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles['home-container'], { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.card}>
        <Text style={styles['card-title']}>
          SCSS is Working! 🎨
        </Text>
        <Text style={styles['card-text']}>
          You can use nested SCSS styles right here.
        </Text>
      </View>
      
      <View className="items-center mt-4">
        <Button 
          title="Go to Details" 
          onPress={() => navigation.navigate('Details', { id: 'MOVIE-001', title: 'Spider-Man: No Way Home' })} 
        />
      </View>
    </View>
  );
}


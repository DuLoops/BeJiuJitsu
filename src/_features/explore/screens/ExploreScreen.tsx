import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CustomHeader } from '@/src/components/ui/molecules/CustomHeader';
import { Avatar } from '@/src/components/ui/atoms/Avatar';
import { useFetchCurrentUserProfile } from '@/src/_features/profile/hooks/useProfileQueries';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import ThemedText from '@/src/components/ui/atoms/ThemedText';

const ExploreScreen = () => {
  const router = useRouter();
  const { data: profile } = useFetchCurrentUserProfile();
  const iconColor = useThemeColor({}, 'icon');

  const handleProfilePress = () => {
    if (profile?.id) {
      router.push(`/(protected)/profile/${profile.id}`);
    }
  };

  const handleSearchPress = () => {
    router.push('/(protected)/search');
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Explore"
        leftComponent={
          <Avatar
            source={profile?.avatar}
            size={32}
            onPress={handleProfilePress}
          />
        }
        rightComponent={
          <TouchableOpacity onPress={handleSearchPress}>
            <Ionicons name="search" size={24} color={iconColor} />
          </TouchableOpacity>
        }
      />
      <View style={styles.content}>
        <ThemedText>Explore Content</ThemedText>
      </View>
    </View>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
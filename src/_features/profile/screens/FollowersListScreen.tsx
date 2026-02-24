import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import { useAuthStore } from '@/src/stores/authStore';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import FollowButton from '../components/FollowButton';
import { getFollowersList, SearchedUserProfile } from '../services/socialService';
  
interface FollowersListScreenProps {
  userIdProp?: string;
}

export default function FollowersListScreen({ userIdProp }: FollowersListScreenProps) {
  const { session } = useAuthStore();
  const params = useLocalSearchParams<{ userId?: string }>();

  const userId = userIdProp || params.userId || session?.user?.id;

  const {
    data: followers,
    isLoading,
    isError,
  } = useQuery<SearchedUserProfile[], Error>({
    queryKey: ['followersList', userId],
    queryFn: () => getFollowersList(userId!),
    enabled: !!userId,
  });

  const navigateToProfile = (profileId: string) => {
    router.push(`/profile/${profileId}`);
  };

  const renderItem = ({ item }: { item: SearchedUserProfile }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => navigateToProfile(item.id)} style={styles.textContainer}>
        <ThemedText style={styles.username}>{item.username}</ThemedText>
      </TouchableOpacity>
      <FollowButton targetUserId={item.id} />
    </View>
  );

  if (isLoading) {
    return <ActivityIndicator style={styles.centered} />;
  }

  if (isError || !followers) {
    return (
      <ThemedCard style={styles.centered}>
        <ThemedText>Error loading followers.</ThemedText>
      </ThemedCard>
    );
  }

  return (
    <ThemedCard style={styles.container}>
      <FlatList
        data={followers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <ThemedCard style={styles.centered}>
            <ThemedText>No followers yet.</ThemedText>
          </ThemedCard>
        }
      />
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  textContainer: {
    flex: 1,
  },
  username: {
    fontSize: 16,
  },
});

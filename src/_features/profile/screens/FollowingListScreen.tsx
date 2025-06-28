import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import ThemedText from '../../../components/ui/atoms/ThemedText';
import ThemedView from '../../../components/ui/atoms/ThemedView';
import { useAuthStore } from '../../../store/authStore';
import FollowButton from '../components/FollowButton';
import { getFollowingList, SearchedUserProfile } from '../services/socialService';

interface FollowingListScreenProps {
  userIdProp?: string;
}

export default function FollowingListScreen({ userIdProp }: FollowingListScreenProps) {
  const { session } = useAuthStore();
  const params = useLocalSearchParams<{ userId?: string }>();

  const userId = userIdProp || params.userId || session?.user?.id;

  const {
    data: following,
    isLoading,
    isError,
  } = useQuery<SearchedUserProfile[], Error>({
    queryKey: ['followingList', userId],
    queryFn: () => getFollowingList(userId!),
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

  if (isError || !following) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Error loading following list.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={following}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <ThemedView style={styles.centered}>
            <ThemedText>Not following anyone yet.</ThemedText>
          </ThemedView>
        }
      />
    </ThemedView>
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

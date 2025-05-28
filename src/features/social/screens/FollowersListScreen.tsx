import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import FollowButton from '@/src/features/social/components/FollowButton';
import {
  getFollowersList,
  SearchedUserProfile, // Re-using this type for the list items
} from '@/src/features/social/services/socialService';
import { useAuthStore } from '@/src/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

interface FollowersListScreenProps {
  userIdProp?: string; 
}

export default function FollowersListScreen({ userIdProp }: FollowersListScreenProps) {
  const { session } = useAuthStore();
  const params = useLocalSearchParams<{ userId?: string }>();
  
  const userIdToFetch = userIdProp || params.userId || session?.user?.id;

  const {
    data: followersList,
    isLoading,
    error,
    refetch,
  } = useQuery<SearchedUserProfile[], Error>({
    queryKey: ['followersList', userIdToFetch],
    queryKeyHashFn: () => `followersList-${userIdToFetch}`,
    queryFn: () => getFollowersList(userIdToFetch!),
    enabled: !!userIdToFetch,
  });

  const handleProfileTap = (targetUserId: string) => {
    router.push(`/profile/${targetUserId}`);
  };

  const renderItem = ({ item }: { item: SearchedUserProfile }) => (
    <TouchableOpacity onPress={() => handleProfileTap(item.id)} style={styles.itemContainer}>
      <View style={styles.avatarPlaceholder}>
        <Ionicons name="person-circle-outline" size={40} color="#ccc" />
      </View>
      <View style={styles.userInfoContainer}>
        <ThemedText style={styles.username}>{item.username}</ThemedText>
        <ThemedText style={styles.fullName}>{item.full_name || 'N/A'}</ThemedText>
      </View>
      <View style={styles.actionsContainer}>
        {userIdToFetch && item.id !== session?.user?.id && <FollowButton targetUserId={item.id} />}
      </View>
    </TouchableOpacity>
  );
  
  if (!userIdToFetch) {
    return (
        <ThemedView style={styles.centeredContainer}>
            <ThemedText>User ID not provided.</ThemedText>
        </ThemedView>
    );
  }

  if (isLoading) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ActivityIndicator size="large" />
        <ThemedText>Loading followers list...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText style={styles.errorText}>Error: {error.message}</ThemedText>
      </ThemedView>
    );
  }

  if (!followersList || (followersList && followersList.length === 0)) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText>No followers yet.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={followersList || []}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        refreshing={isLoading}
        onRefresh={refetch}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    // borderBottomColor: '#eee', // Use theme color
    alignItems: 'center',
    // backgroundColor: 'white', // Use theme color
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userInfoContainer: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fullName: {
    fontSize: 14,
    color: 'gray',
  },
  actionsContainer: {
    // For FollowButton
  },
});

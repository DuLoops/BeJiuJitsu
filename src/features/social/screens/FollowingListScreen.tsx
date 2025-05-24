import React, { useContext } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '@/src/context/AuthContext';
import {
  getFollowingList,
  SearchedUserProfile, // Re-using this type for the list items
} from '@/src/features/social/services/socialService';
import FollowButton from '@/src/features/social/components/FollowButton';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { ThemedText } from '@/src/components/ui/atoms/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

interface FollowingListScreenProps {
  // If userId is passed as a prop directly (e.g. from a parent component not using router params)
  userIdProp?: string; 
}

export default function FollowingListScreen({ userIdProp }: FollowingListScreenProps) {
  const auth = useContext(AuthContext);
  const params = useLocalSearchParams<{ userId?: string }>();
  
  // Determine the userId: prioritize prop, then param, then current user (for own list)
  const userIdToFetch = userIdProp || params.userId || auth?.session?.user?.id;

  const {
    data: followingList,
    isLoading,
    error,
    refetch,
  } = useQuery<SearchedUserProfile[], Error>({
    queryKey: ['followingList', userIdToFetch],
    queryKeyHash: `followingList-${userIdToFetch}`,
    queryFn: () => getFollowingList(userIdToFetch!),
    enabled: !!userIdToFetch,
  });

  const handleProfileTap = (targetUserId: string) => {
    router.push({ pathname: `/(protected)/profile/${targetUserId}`, params: { userId: targetUserId } });
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
        {userIdToFetch && item.id !== auth?.session?.user?.id && <FollowButton targetUserId={item.id} />}
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
        <ThemedText>Loading following list...</ThemedText>
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

  if (!followingList || followingList.length === 0) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText>Not following anyone yet.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={followingList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        refreshing={isLoading} // For pull-to-refresh
        onRefresh={refetch}     // For pull-to-refresh
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

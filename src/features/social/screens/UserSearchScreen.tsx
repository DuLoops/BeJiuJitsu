import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
//Removed duplicate: import React, { useState, useContext, useEffect } from 'react'; 
import ThemedInput from '@/src/components/ui/atoms/ThemedInput';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import {
  SearchedUserProfile,
  searchProfiles,
} from '@/src/features/social/services/socialService';
import { useAuthStore } from '@/src/store/authStore'; // Import useAuthStore
// import ThemedText from '@/src/components/ui/atoms/ThemedText';
import FollowButton from '@/src/features/social/components/FollowButton';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; // Import router for navigation

export default function UserSearchScreen() {
  const { session } = useAuthStore(); // Use useAuthStore
  const currentUserId = session?.user?.id;

  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');

  // Debounce search text
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const {
    data: users,
    isLoading,
    error,
    isFetching, // To show loading indicator during refetch on text change
  } = useQuery<SearchedUserProfile[], Error>({
    queryKey: ['searchProfiles', debouncedSearchText, currentUserId],
    queryKeyHashFn: () => `searchProfiles-${debouncedSearchText}-${currentUserId}`,
    queryFn: () => searchProfiles(debouncedSearchText, currentUserId!),
    enabled: !!currentUserId && debouncedSearchText.trim().length > 0, // Only run if user is logged in and search text is not empty
  });

  const handleProfileTap = (userId: string) => {
    router.push(`/profile/${userId}`); // Corrected router.push path
  };

  const renderItem = ({ item }: { item: SearchedUserProfile }) => (
    <TouchableOpacity onPress={() => handleProfileTap(item.id)} style={styles.itemContainer}>
      {/* Placeholder for Avatar - <Image source={{ uri: item.avatar_url || undefined }} style={styles.avatar} /> */}
      <View style={styles.avatarPlaceholder}>
        <Ionicons name="person-circle-outline" size={40} color="#ccc" />
      </View>
      <View style={styles.userInfoContainer}>
        <ThemedText style={styles.username}>{item.username}</ThemedText>
        <ThemedText style={styles.fullName}>{item.full_name || 'N/A'}</ThemedText>
      </View>
      <View style={styles.actionsContainer}>
        {currentUserId && item.id !== currentUserId && <FollowButton targetUserId={item.id} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedInput
        placeholder="Search users by username..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
        // Icon can be added if ThemedInput supports it
      />
      {/* Optional: Explicit search button if not searching on text change 
        <ThemedButton title="Search" onPress={() => setDebouncedSearchText(searchText)} /> 
      */}

      {(isLoading || isFetching) && debouncedSearchText.trim().length > 0 && (
        <ActivityIndicator size="large" style={styles.loadingIndicator} />
      )}

      {error && (
        <ThemedText style={styles.errorText}>Error searching: {error.message}</ThemedText>
      )}

      {!isLoading && !isFetching && debouncedSearchText.trim().length > 0 && users?.length === 0 && (
        <ThemedText style={styles.noResultsText}>No users found.</ThemedText>
      )}

      {!isLoading && !isFetching && debouncedSearchText.trim().length === 0 && (
         <ThemedText style={styles.noResultsText}>Enter text to search for users.</ThemedText>
      )}

      {users && users.length > 0 && (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10, // ThemedView might have its own padding or use a style prop
  },
  searchInput: {
    margin: 15,
    paddingHorizontal: 10, // Ensure ThemedInput uses this or has its own padding
    // Styles for ThemedInput might be applied via its own props or a wrapper
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    // color: 'red', // Use theme.error
    marginTop: 10,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    // color: 'gray', // Use theme.secondary
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    // borderBottomColor: theme.border, 
    alignItems: 'center',
    // backgroundColor: theme.background, 
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    // backgroundColor: theme.placeholder, 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  // avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  userInfoContainer: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    // color: theme.text,
  },
  fullName: {
    fontSize: 14,
    // color: theme.secondary,
  },
  actionsContainer: {
    // For Follow/Unfollow buttons
  },
  // followButton and buttonText might not be needed here if FollowButton handles its own styling
});

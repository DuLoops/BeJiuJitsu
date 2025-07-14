import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ThemedText from '../../../components/ui/atoms/ThemedText';
import ThemedView from '../../../components/ui/atoms/ThemedView';
import { useAuthStore } from '../../../store/authStore';
import { SearchedUserProfile, searchProfiles } from '../../social/services/socialService';
import FollowButton from '../components/FollowButton';

export default function UserSearchScreen() {
  const [query, setQuery] = useState('');
  const { session } = useAuthStore();
  const currentUserId = session?.user?.id;

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery<SearchedUserProfile[], Error>({
    queryKey: ['userSearch', query],
    queryFn: () => (query.length > 2 ? searchProfiles(query, currentUserId || '') : []),
    enabled: query.length > 2,
  });

  const navigateToProfile = (profileId: string) => {
    router.push(`/profile/${profileId}`);
  };

  const renderItem = ({ item }: { item: SearchedUserProfile }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => navigateToProfile(item.id)} style={styles.textContainer}>
        <ThemedText style={styles.username}>{item.username}</ThemedText>
      </TouchableOpacity>
      {item.id !== currentUserId && <FollowButton targetUserId={item.id} />}
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for users..."
        placeholderTextColor="#888"
        value={query}
        onChangeText={setQuery}
      />
      {isLoading && <ActivityIndicator style={styles.centered} />}
      {isError && (
        <ThemedView style={styles.centered}>
          <ThemedText>Error searching for users.</ThemedText>
        </ThemedView>
      )}
      {!isLoading && !isError && (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            query.length > 2 ? (
              <ThemedView style={styles.centered}>
                <ThemedText>No users found.</ThemedText>
              </ThemedView>
            ) : null
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'white',
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

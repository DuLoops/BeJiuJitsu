import { supabase } from '@/src/lib/supabase';
import { Profile } from '@/src/types'; // Assuming Profile type is in src/types/index.ts or similar

export interface SearchedUserProfile extends Pick<Profile, 'id' | 'username' | 'full_name' | 'avatar_url'> {
  // Add any other specific fields needed for search results if different from main Profile type
}

export const searchProfiles = async (
  searchText: string,
  currentUserId: string
): Promise<SearchedUserProfile[]> => {
  if (!searchText.trim()) {
    return []; // Return empty if search text is blank
  }

  const { data, error } = await supabase
    .from('profiles') // Ensure this table name is correct
    .select('id, username, full_name, avatar_url')
    .ilike('username', `%${searchText}%`) // Case-insensitive partial match
    .not('id', 'eq', currentUserId) // Exclude current user
    .limit(10); // Limit results for performance, adjust as needed

  if (error) {
    console.error('Error searching profiles:', error);
    throw error;
  }

  return data as SearchedUserProfile[];
};

// --- Follow/Unfollow Services ---

export const followUser = async (followerId: string, followingId: string) => {
  if (followerId === followingId) {
    throw new Error("Cannot follow yourself.");
  }
  const { data, error } = await supabase
    .from('UserFollows') // Ensure this table name matches your Supabase schema
    .insert({ followerId, followingId })
    .select();

  if (error) {
    console.error('Error following user:', error);
    throw error;
  }
  return data;
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  const { error } = await supabase
    .from('UserFollows') // Ensure this table name matches your Supabase schema
    .delete()
    .eq('followerId', followerId)
    .eq('followingId', followingId);

  if (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
  return true; // Or return the result if needed
};

export const getFollowStatus = async (currentUserId: string, targetUserId: string): Promise<boolean> => {
  if (currentUserId === targetUserId) return false; // Cannot follow self

  const { data, error, count } = await supabase
    .from('UserFollows') // Ensure this table name matches your Supabase schema
    .select('*', { count: 'exact', head: true })
    .eq('followerId', currentUserId)
    .eq('followingId', targetUserId);

  if (error) {
    console.error('Error getting follow status:', error);
    // If the error is that the row doesn't exist (PGRST116), it's not really an "error" for this check.
    // However, for other errors, we should throw.
    if (error.code !== 'PGRST116') { // PGRST116: Row not found
        throw error;
    }
    return false; // Treat "not found" as not following if PGRST116
  }
  return (count || 0) > 0;
};

// --- Get Following/Followers Lists and Counts ---

export const getFollowingList = async (userId: string): Promise<SearchedUserProfile[]> => {
  const { data, error } = await supabase
    .from('UserFollows')
    .select('profile_being_followed:profiles!UserFollows_followingId_fkey(id, username, full_name, avatar_url)')
    .eq('followerId', userId);

  if (error) {
    console.error('Error getting following list:', error);
    throw error;
  }
  // The result is nested, so we need to map it
  return data?.map(item => item.profile_being_followed).filter(Boolean) as SearchedUserProfile[] || [];
};

export const getFollowersList = async (userId: string): Promise<SearchedUserProfile[]> => {
  const { data, error } = await supabase
    .from('UserFollows')
    .select('follower_profile:profiles!UserFollows_followerId_fkey(id, username, full_name, avatar_url)')
    .eq('followingId', userId);

  if (error) {
    console.error('Error getting followers list:', error);
    throw error;
  }
  // The result is nested, so we need to map it
  return data?.map(item => item.follower_profile).filter(Boolean) as SearchedUserProfile[] || [];
};

export interface FollowCounts {
  followingCount: number;
  followersCount: number;
}

export const getFollowCounts = async (userId: string): Promise<FollowCounts> => {
  const { count: followingCount, error: followingError } = await supabase
    .from('UserFollows')
    .select('*', { count: 'exact', head: true })
    .eq('followerId', userId);

  if (followingError) {
    console.error('Error getting following count:', followingError);
    throw followingError;
  }

  const { count: followersCount, error: followersError } = await supabase
    .from('UserFollows')
    .select('*', { count: 'exact', head: true })
    .eq('followingId', userId);

  if (followersError) {
    console.error('Error getting followers count:', followersError);
    throw followersError;
  }

  return {
    followingCount: followingCount || 0,
    followersCount: followersCount || 0,
  };
};

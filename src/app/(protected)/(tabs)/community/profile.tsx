
import { UserSkillWithDetails } from '@/src/features/skill/components/UserSkillList';
import { useAuthStore } from '@/src/store/authStore';
import { Tables } from '@/src/supabase/types';
import { CompetitionWithDetails } from '@/src/types/competition';
import { TrainingWithDetails } from '@/src/types/training';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { fetchCompetitionsForUser } from '@/src/features/competition/services/competitionService';
import { getProfile } from '@/src/features/profile/services/profileService';
import { fetchUserSkillsWithDetails } from '@/src/features/skill/services/skillService';
import { FollowCounts, getFollowCounts } from '@/src/features/social/services/socialService';
import { fetchTrainingsForUser } from '@/src/features/training/services/trainingService';

import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View } from 'react-native';

export default function ProfileTabScreen() {
  const { session } = useAuthStore();
  const userId = session?.user?.id;
  const themedIconColor = useThemeColor({}, 'icon');

  const { data: profile, isLoading: isLoadingProfile, error: errorProfile } = useQuery<Tables<"profiles"> | null, Error>({
    queryKey: ['profile', userId],
    queryFn: () => getProfile(userId!),
    enabled: !!userId,
  });

  const { data: followCounts, isLoading: isLoadingFollowCounts, error: errorFollowCounts } = useQuery<FollowCounts, Error>({
    queryKey: ['followCounts', userId],
    queryKeyHashFn: () => `followCounts-${userId}`,
    queryFn: () => getFollowCounts(userId!),
    enabled: !!userId,
  });

  const { data: userSkills, isLoading: isLoadingSkills, error: errorSkills } = useQuery<UserSkillWithDetails[], Error>({
    queryKey: ['userSkillsWithDetails', userId], // Using existing key from UserSkillList
    queryKeyHashFn: () => `userSkillsWithDetails-${userId}`,
    queryFn: () => fetchUserSkillsWithDetails(userId!),
    enabled: !!userId,
  });

  const { data: trainings, isLoading: isLoadingTrainings, error: errorTrainings } = useQuery<TrainingWithDetails[], Error>({
    queryKey: ['trainingsForUser', userId],
    queryKeyHashFn: () => `trainingsForUser-${userId}`,
    queryFn: () => fetchTrainingsForUser(userId!, true),
    enabled: !!userId,
  });
  
  const { data: competitions, isLoading: isLoadingCompetitions, error: errorCompetitions } = useQuery<CompetitionWithDetails[], Error>({
    queryKey: ['competitionsForUser', userId],
    queryKeyHashFn: () => `competitionsForUser-${userId}`,
    queryFn: () => fetchCompetitionsForUser(userId!),
    enabled: !!userId,
  });

  const navigateToEditProfile = () => {
    if (profile) {
      // The create-profile screen needs to be able to handle 'edit' mode.
      // This might involve passing the profile data as params.
      router.push({
        pathname: '/(protected)/create-profile',
        // params: { profile: JSON.stringify(profile) } // If create-profile handles this
      });
    }
  };

  const renderLoading = () => (
    <View style={styles.centered}>
      <ActivityIndicator size="large" />
      <ThemedText>Loading profile data...</ThemedText>
    </View>
  );

  const renderError = (error: Error | null) => (
    <View style={styles.centered}>
      <ThemedText style={styles.errorText}>Error loading data: {error?.message || 'Unknown error'}</ThemedText>
    </View>
  );
  
  if (isLoadingProfile || isLoadingFollowCounts || isLoadingSkills || isLoadingTrainings || isLoadingCompetitions) {
    // More granular loading states can be handled if desired
    return renderLoading();
  }

  // Prioritize profile error, as other data depends on it
  if (errorProfile) return renderError(errorProfile);
  // Handle follow counts error separately if needed, or group with general errors
  if (errorFollowCounts) console.error("Error fetching follow counts:", errorFollowCounts);


  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.innerContainer}>
        {/* Profile Details Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>My Profile</ThemedText>
            <ThemedButton 
              title="Edit Profile" 
              onPress={navigateToEditProfile} 
              icon={<Ionicons name="create-outline" size={16} color="white" />} // Example icon
              style={styles.editButton}
            />
          </View>
          {profile ? (
            <>
              {/* Avatar can be an <Image /> component if avatar_url is available */}
              <ThemedText style={styles.username}>{profile.username || 'N/A'}</ThemedText>
              <ThemedText style={styles.fullName}>{profile.full_name || 'N/A'}</ThemedText>
              <ThemedText style={styles.detailItem}>Belt: {profile.belt || 'N/A'} ({profile.stripes || 0} stripes)</ThemedText>
              <ThemedText style={styles.detailItem}>Weight: {profile.weight ? `${profile.weight} kg` : 'N/A'}</ThemedText>
              
              {/* Follow Counts */}
              <View style={styles.followCountsContainer}>
                <TouchableOpacity onPress={() => router.push({ pathname: '/(protected)/profile/following', params: { userId: profile.id, username: profile.username }})}>
                  <ThemedText style={styles.followText}>
                    {followCounts?.followingCount ?? <ActivityIndicator size="small"/>} Following
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push({ pathname: '/(protected)/profile/followers', params: { userId: profile.id, username: profile.username }})}>
                  <ThemedText style={styles.followText}>
                    {followCounts?.followersCount ?? <ActivityIndicator size="small"/>} Followers
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <ThemedText>No profile data found. Please create your profile.</ThemedText>
          )}
        </View>

        {/* User Skills Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>My Skills</ThemedText>
            <ThemedButton title="View All Skills" onPress={() => console.log('TODO: Navigate to all skills screen')} style={styles.viewAllButton} />
          </View>
          {errorSkills ? renderError(errorSkills) : userSkills && userSkills.length > 0 ? (
            <FlatList
              data={userSkills.slice(0, 3)} // Show a summary, e.g., first 3
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <ThemedView style={styles.listItem}>
                  <ThemedText style={styles.listItemTitle}>{item.skill.name}</ThemedText>
                  <ThemedText style={styles.listItemSubtitle}>Category: {item.skill.category.name}</ThemedText>
                </ThemedView>
              )}
              ListEmptyComponent={<ThemedText>No skills added yet.</ThemedText>}
            />
          ) : (
            <ThemedText>No skills recorded.</ThemedText>
          )}
        </View>

        {/* Training Sessions Section */}
        <View style={styles.sectionContainer}>
           <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>Recent Training</ThemedText>
                <ThemedButton 
                    title="Log New Training" 
                    onPress={() => router.push('/(protected)/(modal)/create/training')} 
                    style={styles.viewAllButton} 
                />
            </View>
          {errorTrainings ? renderError(errorTrainings) : trainings && trainings.length > 0 ? (
            <FlatList
              data={trainings.slice(0, 3)} // Summary of recent 3
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <ThemedView style={styles.listItem}>
                  <ThemedText style={styles.listItemTitle}>Date: {new Date(item.date).toLocaleDateString()}</ThemedText>
                  <ThemedText>Duration: {item.duration} mins</ThemedText>
                  <ThemedText>Type: {item.bjjType}, Intensity: {item.intensity}</ThemedText>
                  {item.user_skill_usages && item.user_skill_usages.length > 0 && (
                    <ThemedText style={styles.listItemSubtitle}>
                      Skills used: {item.user_skill_usages.map(usu => usu.user_skill?.skill.name).join(', ')}
                    </ThemedText>
                  )}
                </ThemedView>
              )}
              ListEmptyComponent={<ThemedText>No training sessions logged yet.</ThemedText>}
            />
          ) : (
            <ThemedText>No training sessions logged.</ThemedText>
          )}
        </View>

        {/* Competition Results Section */}
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>Competition Results</ThemedText>
                 <ThemedButton 
                    title="Log New Competition" 
                    onPress={() => router.push('/(protected)/(modal)/create/competition')} 
                    style={styles.viewAllButton} 
                />
            </View>
          {errorCompetitions ? renderError(errorCompetitions) : competitions && competitions.length > 0 ? (
            <FlatList
              data={competitions.slice(0, 3)} // Summary of recent 3
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <ThemedView style={styles.listItem}>
                  <ThemedText style={styles.listItemTitle}>{item.name} - {item.date ? new Date(item.date).toLocaleDateString() : 'Date N/A'}</ThemedText>
                  <ThemedText>Brand: {item.tournament_brand?.name || 'N/A'}</ThemedText>
                  {item.divisions?.map(div => (
                    <View key={div.id} style={styles.divisionSummary}>
                      <ThemedText style={styles.listItemSubtitle}>
                        {div.beltRank} {div.weightClass || ''} ({div.bjjType}): {div.overallResultInDivision || 'N/A'}
                      </ThemedText>
                      {div.matches?.slice(0,1).map(match => ( // Show first match as example
                         <ThemedText key={match.id} style={styles.matchSummaryText}>
                           Match 1: {match.result} vs {match.opponentName || 'Unknown'} by {match.endingMethodDetail || match.endingMethod}
                         </ThemedText>
                      ))}
                    </View>
                  ))}
                </ThemedView>
              )}
              ListEmptyComponent={<ThemedText>No competitions logged yet.</ThemedText>}
            />
          ) : (
            <ThemedText>No competitions logged.</ThemedText>
          )}
        </View>

      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 15,
  },
  username: { // Style for username if needed distinct from detailItem
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center', // Example styling
    marginBottom: 5,
  },
  fullName: { // Style for full name if needed
    fontSize: 16,
    color: 'gray', // Example styling
    textAlign: 'center',
    marginBottom: 10,
  },
  followCountsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 5,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    // borderColor: '#eee', // Use theme color
  },
  followText: {
    fontSize: 16,
    fontWeight: '500',
    // color: '#007bff' // Example link color, use theme
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 25,
    padding: 15,
    // backgroundColor: '#f9f9f9', // Use theme colors
    borderRadius: 8,
    borderWidth:1,
    // borderColor: '#eee', // Use theme colors
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailItem: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center', // Example: center profile details too
  },
  listItem: {
    padding: 12,
    marginBottom: 8,
    // backgroundColor: '#fff', // Use theme colors
    borderRadius: 6,
    borderWidth:1,
    // borderColor: '#eef', // Use theme colors
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  listItemSubtitle: {
    fontSize: 14,
    color: 'gray',
    marginTop: 2,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    // backgroundColor: '#007bff', // Example color
  },
  editButtonText: {
    fontSize: 14,
  },
  viewAllButton: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    // backgroundColor: '#6c757d', // Example color
  },
  viewAllButtonText: {
    fontSize: 13,
  },
  divisionSummary: {
    marginTop: 5,
    paddingLeft: 10,
    borderLeftWidth: 2,
    // borderLeftColor: '#ddd', // Use theme colors
  },
  matchSummaryText: {
    fontSize: 12,
    color: 'grey', // Use theme colors
    marginLeft: 5,
  }
});


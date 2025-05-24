import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '@/src/context/AuthContext';
import {
  fetchUserSkillsWithDetails, // To be created in service
  deleteUserSkill, // To be created in service
} from '@/src/features/skill/services/skillService';
import { UserSkill, SkillSequence, SequenceDetail, Category, Skill } from '@/src/types/skills'; // Assuming Category and Skill might be needed for display
import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import { ThemedText } from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Define a more detailed type for the items in the list
export interface UserSkillWithDetails extends UserSkill {
  skill: Skill & { category: Category }; // Assuming skill name and category name are needed
  sequences: (SkillSequence & { details: SequenceDetail[] })[];
}

interface UserSkillListItemProps {
  item: UserSkillWithDetails;
  onDelete: (id: string) => void;
  onEdit: (item: UserSkillWithDetails) => void;
}

const UserSkillListItem: React.FC<UserSkillListItemProps> = ({ item, onDelete, onEdit }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <ThemedView style={styles.itemContainer}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.itemHeader}>
        <View style={styles.itemTitleContainer}>
            <ThemedText style={styles.itemTitle}>{item.skill?.name || 'Unknown Skill'}</ThemedText>
            <ThemedText style={styles.itemSubtitle}>Category: {item.skill?.category?.name || 'N/A'}</ThemedText>
        </View>
        <Ionicons name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'} size={24} />
      </TouchableOpacity>

      {item.isFavorite && <Ionicons name="star" color="gold" size={20} style={styles.favoriteIcon} />}

      {expanded && (
        <View style={styles.detailsContainer}>
          <ThemedText style={styles.detailText}>Notes: {item.note || 'N/A'}</ThemedText>
          <ThemedText style={styles.detailText}>Source: {item.source || 'N/A'}</ThemedText>
          <ThemedText style={styles.detailText}>Video: {item.videoUrl || 'N/A'}</ThemedText>
          
          <ThemedText style={styles.sequencesTitle}>Sequences:</ThemedText>
          {item.sequences && item.sequences.length > 0 ? (
            item.sequences.map((seq, index) => (
              <View key={seq.id || index} style={styles.sequenceItem}>
                <ThemedText style={styles.sequenceStep}>Step {seq.stepNumber}: {seq.intention || 'No intention specified'}</ThemedText>
                {seq.details && seq.details.map((detail, dIndex) => (
                  <ThemedText key={detail.id || dIndex} style={styles.sequenceDetail}>- {detail.detail}</ThemedText>
                ))}
              </View>
            ))
          ) : (
            <ThemedText>No sequences defined for this skill.</ThemedText>
          )}
          <View style={styles.actionsContainer}>
            <ThemedButton title="Edit" onPress={() => onEdit(item)} style={styles.actionButton} />
            <ThemedButton title="Delete" onPress={() => onDelete(item.id)} style={[styles.actionButton, styles.deleteButton]} buttonColor="red" />
          </View>
        </View>
      )}
    </ThemedView>
  );
};

export default function UserSkillList() {
  const auth = useContext(AuthContext);
  const queryClient = useQueryClient();
  const userId = auth?.session?.user?.id;

  const { data: userSkills, isLoading, error, refetch } = useQuery<UserSkillWithDetails[], Error>({
    queryKey: ['userSkillsWithDetails', userId],
    queryKeyHash: `userSkillsWithDetails-${userId}`,
    queryFn: () => fetchUserSkillsWithDetails(userId!),
    enabled: !!userId,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUserSkill, // This service function needs to handle cascading deletes or be aware of them
    onSuccess: () => {
      Alert.alert('Success', 'Skill deleted.');
      queryClient.invalidateQueries({ queryKey: ['userSkillsWithDetails', userId] });
    },
    onError: (e: Error) => {
      Alert.alert('Error', `Failed to delete skill: ${e.message}`);
    },
  });

  const handleDelete = (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this skill and its sequences?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
    ]);
  };

  const handleEdit = (item: UserSkillWithDetails) => {
    // Navigate to the create/edit skill screen, passing item data as params
    // The 'create/skill' screen needs to be adapted to handle editing
    router.push({
      pathname: '/(protected)/(modal)/create/skill',
      params: { userSkill: JSON.stringify(item) }, // Pass the whole item for editing
    });
  };

  if (isLoading) return <View style={styles.centered}><Text>Loading skills...</Text></View>;
  if (error) return <View style={styles.centered}><Text>Error fetching skills: {error.message}</Text></View>;
  if (!userSkills || userSkills.length === 0) {
    return (
        <ThemedView style={styles.centered}>
            <ThemedText>No skills added yet.</ThemedText>
            <ThemedButton title="Add Your First Skill" onPress={() => router.push('/(protected)/(modal)/create/skill')} style={{marginTop: 20}} />
        </ThemedView>
    );
  }

  return (
    <FlatList
      data={userSkills}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <UserSkillListItem item={item} onDelete={handleDelete} onEdit={handleEdit} />}
      contentContainerStyle={styles.listContainer}
      refreshing={isLoading} // Show refresh indicator while refetching
      onRefresh={refetch} // Allow pull-to-refresh
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    backgroundColor: '#fff', // Adjust with ThemedView for dark mode compatibility
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitleContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 14,
    color: 'gray',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 40, // Adjusted to not overlap with chevron
  },
  detailsContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detailText: {
    fontSize: 14,
    marginBottom: 5,
  },
  sequencesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  sequenceItem: {
    marginLeft: 10,
    marginBottom: 8,
  },
  sequenceStep: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sequenceDetail: {
    fontSize: 13,
    marginLeft: 15,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  actionButton: {
    marginLeft: 10,
    // paddingHorizontal: 15, // Ensure ThemedButton handles this or adjust
  },
  deleteButton: {
    // Specific styles for delete button if needed, e.g., backgroundColor: 'red'
    // ThemedButton might take a color prop
  },
});



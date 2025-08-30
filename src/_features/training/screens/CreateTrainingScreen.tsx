import { Enums, Tables } from '@/src/supabase/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet
} from 'react-native';

import TrainingActivityCard, { TrainingActivityRecord } from '@/src/_features/training/components/TrainingActivityCard';
import TrainingActivityForm from '@/src/_features/training/components/TrainingActivityForm';
import {
  createTrainingSessionWithActivities,
} from '@/src/_features/training/services/trainingService';
import TitleAndDateInput from '@/src/components/layout/TitleAndDateInput';
import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedView from '@/src/components/ui/atoms/ThemedView';

import { useThemeColor } from '@/src/hooks/useThemeColor';
import { useAuthStore } from '@/src/stores/authStore';
import { Ionicons } from '@expo/vector-icons';

type Training = Tables<'trainings'>;
type TrainingActivity = Tables<'training_activities'>;
type TrainingType = Enums<'TrainingType'>;

const generateTempId = () => `temp_${Math.random().toString(36).substr(2, 9)}`;

const createInitialActivity = (): TrainingActivityRecord => ({
  id: generateTempId(),
  type: 'Gi',
  title: null,
  notes: null,
  video_url: null,
  activity_order: 1,
  isExpanded: true,
});

interface CreateTrainingScreenProps {
  onSave?: () => void;
}

export interface CreateTrainingScreenRef {
  handleSave: () => void;
  isValid: () => boolean;
  isSaving: () => boolean;
}

const CreateTrainingScreen = forwardRef<CreateTrainingScreenRef, CreateTrainingScreenProps>(({ onSave }, ref) => {
  const { session } = useAuthStore();
  const queryClient = useQueryClient();
  const userId = session?.user?.id;
  
  const iconColor = useThemeColor({}, 'icon');
  const backgroundColor = useThemeColor({}, 'background');

  // ScrollView ref for auto-scrolling to new activities
  const scrollViewRef = useRef<ScrollView>(null);

  // Training details
  const [title, setTitle] = useState('Training Session');
  const [date, setDate] = useState(new Date());

  // Activity records - initialize with first activity
  const [activities, setActivities] = useState<TrainingActivityRecord[]>([]);
  const [lastAddedActivityId, setLastAddedActivityId] = useState<string | null>(null);

  // Video recorder state (if needed later)
  const [showVideoRecorder, setShowVideoRecorder] = useState<string | null>(null);

  // Loading state for saving
  const [isSaving, setIsSaving] = useState(false);

  // Start with zero activities by default

  // Mutation for creating Training session with activities
  const mutation = useMutation({
    mutationFn: async (data: {
      trainingData: Omit<Training, 'id' | 'created_at' | 'updated_at'>;
      activitiesData: Omit<TrainingActivity, 'id' | 'created_at' | 'updated_at' | 'training_id'>[];
    }) => {
      return createTrainingSessionWithActivities({
        trainingData: data.trainingData,
        activitiesData: data.activitiesData
      });
    },
    onSuccess: () => {
      setIsSaving(false);
      Alert.alert('Success', 'Training session with activities logged!');
      queryClient.invalidateQueries({ queryKey: ['trainingsForUser', userId] });
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push('/(protected)/(tabs)');
      }
    },
    onError: (error: Error) => {
      setIsSaving(false);
      Alert.alert('Error', `Failed to log training: ${error.message}`);
    },
  });

  const handleDateChange = (selectedDate: Date) => {
    setDate(selectedDate);
  };

  const addActivity = () => {
    const newActivity = createInitialActivity();
    newActivity.activity_order = activities.length + 1;
    setActivities(prev => [...prev, newActivity]);
    setLastAddedActivityId(newActivity.id);

    // Scroll to the newly added activity with a small delay to ensure rendering
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const removeActivity = (activityId: string) => {
    const updatedActivities = activities
      .filter(a => a.id !== activityId)
      .map((a, idx) => ({ ...a, activity_order: idx + 1 }));
      setActivities(updatedActivities);


  };

  const updateActivity = (activityId: string, updates: Partial<TrainingActivityRecord>) => {
    setActivities(activities.map(a => a.id === activityId ? { ...a, ...updates } : a));
  };

  const toggleActivityExpansion = (activityId: string) => {
    setActivities(activities.map(a =>
      a.id === activityId ? { ...a, isExpanded: !a.isExpanded } : a
    ));
  };

  const handleAddVideo = (activityId: string) => {
    setShowVideoRecorder(activityId);
  };

  const isFormValid = () => {
    if (!userId) return false;
    if (!title.trim()) return false;
    return true; // Only require title and date - activities are optional
  };

  const handleSubmit = () => {
    if (!userId) {
      Alert.alert('Error', 'You must be logged in.');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a training title.');
      return;
    }

    // Filter valid activities (activities are optional now)
    const validActivities = activities.filter(activity =>
      activity.type
    );

    setIsSaving(true);

    const trainingDataPayload = {
      title: title.trim(),
      useId: userId,
    } as Omit<Training, 'id' | 'created_at' | 'updated_at'>;

    const activitiesDataPayload = validActivities.map((activity, index) => ({
      type: activity.type as any,
      activity_order: index + 1,
      notes: activity.notes,
      video_url: activity.video_url,
      training_values: activity.training_values?.map(tv => ({
        value: tv.value,
        unit: tv.unit,
        order: tv.order
      })) || [],
    }));

    mutation.mutate({ 
      trainingData: trainingDataPayload, 
      activitiesData: activitiesDataPayload
    });
  };

  useImperativeHandle(ref, () => ({
    handleSave: handleSubmit,
    isValid: isFormValid,
    isSaving: () => mutation.isPending || isSaving,
  }));

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.innerContainer}>
          {/* Title and Date Input */}
          <TitleAndDateInput
            title={title}
            onTitleChange={setTitle}
            titlePlaceholder="Training Session"
            date={date}
            onDateChange={handleDateChange}
          />

          {/* Activities Section */}
          {activities.map((activity, index) => (
            <TrainingActivityCard
              key={activity.id}
              activity={activity}
              index={index}
              onToggleExpansion={toggleActivityExpansion}
            >
              <TrainingActivityForm
                activity={activity}
                onUpdateActivity={updateActivity}
                onAddVideo={handleAddVideo}
                onDeleteActivity={removeActivity}
                autoOpenType={activity.id === lastAddedActivityId}
              />
            </TrainingActivityCard>
          ))}

          {/* Add Activity Button */}
          <ThemedButton
            title="Add Activity"
            variant="primary"
            onPress={addActivity}
            icon={<Ionicons name="add" size={20} color="white" />}
          />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
});

CreateTrainingScreen.displayName = 'CreateTrainingScreen';

export default CreateTrainingScreen;

const styles = StyleSheet.create({
  container: {  
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  innerContainer: {
    padding: 16,
    gap: 12
  },
});

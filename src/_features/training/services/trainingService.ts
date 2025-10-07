import { supabase } from '@/src/lib/supabase';
import { Tables, TablesInsert } from '@/src/supabase/types';
import { v4 as uuidv4 } from 'uuid';

// Generate a UUID using uuid library
const generateUUID = () => {
  return uuidv4();
};

type Training = Tables<'trainings'>;
type TrainingActivity = Tables<'training_activities'>;
type TrainingActivityValue = Tables<'training_activity_values'>;

// Fetch User Skills (adapted from skillService or assuming a similar function exists)
// This is primarily for the UI to list skills that can be linked to a training session.
export const fetchUserSkillsForSelection = async (userId: string): Promise<any[]> => {
  // This query should be similar to fetchUserSkillsWithDetails but might not need ALL details
  // if only name and id are needed for selection. For now, reusing the detailed one.
  const { data, error } = await supabase
    .from('user_skills') // Make sure this is the correct table name for UserSkill entries
    .select(`
      id,
      user_id,
      skill_id,
      skill:skills!inner(*, category)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user skills for selection:', error);
    throw error;
  }
  return data || []; 
};

// Create Training entry
export const createTraining = async (trainingData: { title: string; useId?: string | null }): Promise<Training> => {
  const insertData: TablesInsert<'trainings'> = {
    id: generateUUID(),
    title: trainingData.title,
    useId: trainingData.useId || null,
  };

  const { data, error } = await supabase
    .from('trainings')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('Error creating training:', error);
    throw error;
  }
  return data as Training;
};

// Note: UserSkillUsage functionality disabled until proper schema is implemented

// Create Training Activities (batch) with their values
export const createTrainingActivities = async (
  trainingId: string,
  activitiesData: (Omit<TrainingActivity, 'id' | 'created_at' | 'updated_at' | 'training_id'> & { 
    training_values?: { value: number; unit: string; order: number }[] 
  })[]
): Promise<TrainingActivity[]> => {
  const activitiesToInsert = activitiesData.map(activity => {
    const { training_values, ...activityData } = activity;
    return {
      ...activityData,
      training_id: trainingId,
    };
  }) as TablesInsert<'training_activities'>[];

  const { data, error } = await supabase
    .from('training_activities')
    .insert(activitiesToInsert)
    .select();

  if (error) {
    console.error('Error creating training activities:', error);
    throw error;
  }

  const createdActivities = data as TrainingActivity[];
  
  // Create training activity values for each activity
  for (let i = 0; i < createdActivities.length; i++) {
    const activity = createdActivities[i];
    const activityData = activitiesData[i];
    
    if (activityData.training_values && activityData.training_values.length > 0) {
      await createTrainingActivityValues(activity.id, activityData.training_values);
    }
  }
  
  return createdActivities;
};

// Create Training Activity Values (batch)
export const createTrainingActivityValues = async (
  trainingActivityId: string,
  valuesData: { value: number; unit: string; order: number }[]
): Promise<TrainingActivityValue[]> => {
  if (!valuesData || valuesData.length === 0) {
    return [];
  }

  const valuesToInsert = valuesData.map(valueData => ({
    id: generateUUID(),
    training_activity_id: trainingActivityId,
    value: valueData.value,
    unit: valueData.unit,
    value_order: valueData.order,
  })) as TablesInsert<'training_activity_values'>[];

  const { data, error } = await supabase
    .from('training_activity_values')
    .insert(valuesToInsert)
    .select();

  if (error) {
    console.error('Error creating training activity values:', error);
    throw error;
  }
  return data as TrainingActivityValue[];
};

// Combined function to create Training and associated Activities
export const createTrainingSessionWithActivities = async ({
  trainingData,
  activitiesData,
}: {
  trainingData: { title: string; useId?: string | null };
  activitiesData: (Omit<TrainingActivity, 'id' | 'created_at' | 'updated_at' | 'training_id'> & { 
    training_values?: { value: number; unit: string; order: number }[] 
  })[];
}): Promise<Training> => {
  const newTraining = await createTraining(trainingData);

  if (!newTraining || !newTraining.id) {
    throw new Error('Failed to create training session.');
  }

  if (activitiesData && activitiesData.length > 0) {
    await createTrainingActivities(newTraining.id, activitiesData);
  }

  return newTraining;
};

// Combined function to create Training and associated UserSkillUsages (legacy - keeping for backward compatibility)
export const createTrainingSessionWithSkillUsages = async ({
  trainingData,
  skillUsagesData,
}: {
  trainingData: { title: string; useId?: string | null };
  skillUsagesData: any[];
}): Promise<Training> => {
  // For now, just create the training without skill usages since the schema doesn't support it yet
  return await createTraining(trainingData);
};

// Fetch Training sessions for a user, optionally with linked Activities
export const fetchTrainingsForUser = async (userId: string, includeActivities: boolean = false) => {
  let selectQuery = includeActivities 
    ? '*, training_activities(*)'
    : '*';

  const { data, error } = await supabase
    .from('trainings')
    .select(selectQuery)
    .eq('useId', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching training sessions:', error);
    throw error;
  }
  return data;
};

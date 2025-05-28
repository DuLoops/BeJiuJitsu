import { UserSkillWithDetails } from '@/src/features/skill/components/UserSkillList'; // For fetching user skills
import { supabase } from '@/src/lib/supabase';
import { Training, TrainingWithDetails, UserSkillUsage } from '@/src/types/training';

// Fetch User Skills (adapted from skillService or assuming a similar function exists)
// This is primarily for the UI to list skills that can be linked to a training session.
export const fetchUserSkillsForSelection = async (userId: string): Promise<UserSkillWithDetails[]> => {
  // This query should be similar to fetchUserSkillsWithDetails but might not need ALL details
  // if only name and id are needed for selection. For now, reusing the detailed one.
  const { data, error } = await supabase
    .from('UserSkill') // Make sure this is the correct table name for UserSkill entries
    .select(`
      id,
      userId,
      skillId,
      note,
      source,
      isFavorite,
      videoUrl,
      skill:Skill!inner(*, category:Category!inner(*)),
      sequences:SkillSequence!left(*, details:SequenceDetail!left(*))
    `)
    .eq('userId', userId);

  if (error) {
    console.error('Error fetching user skills for selection:', error);
    throw error;
  }
  // Cast to UserSkillWithDetails[], ensure the fetched structure matches this type
  return data as UserSkillWithDetails[]; 
};

// Create Training entry
export const createTraining = async (trainingData: Omit<Training, 'id' | 'created_at' | 'updated_at'>): Promise<Training> => {
  const { data, error } = await supabase
    .from('Training') // Ensure this matches your Supabase table name for Training
    .insert([{ ...trainingData, updated_at: new Date() }])
    .select()
    .single();

  if (error) {
    console.error('Error creating training:', error);
    throw error;
  }
  return data as Training;
};

// Create UserSkillUsage entries (batch)
export const createUserSkillUsages = async (usagesData: Omit<UserSkillUsage, 'id' | 'created_at' | 'updated_at'>[]): Promise<UserSkillUsage[]> => {
  const usagesToInsert = usagesData.map(usage => ({ ...usage, updated_at: new Date() }));
  const { data, error } = await supabase
    .from('UserSkillUsage') // Ensure this matches your Supabase table name
    .insert(usagesToInsert)
    .select();

  if (error) {
    console.error('Error creating user skill usages:', error);
    throw error;
  }
  return data as UserSkillUsage[];
};

// Combined function to create Training and associated UserSkillUsages
export const createTrainingSessionWithSkillUsages = async ({
  trainingData,
  skillUsagesData,
}: {
  trainingData: Omit<Training, 'id' | 'created_at' | 'updated_at'>;
  skillUsagesData: Omit<UserSkillUsage, 'id' | 'trainingId' | 'created_at' | 'updated_at' | 'usageType'>[];
}): Promise<Training> => {
  const newTraining = await createTraining(trainingData);

  if (!newTraining || !newTraining.id) {
    throw new Error('Failed to create training session.');
  }

  if (skillUsagesData && skillUsagesData.length > 0) {
    const fullUsagesData = skillUsagesData.map(usage => ({
      ...usage,
      trainingId: newTraining.id,
      usageType: 'TRAINING' as 'TRAINING', // Set usageType for training context
    }));
    await createUserSkillUsages(fullUsagesData);
  }

  return newTraining;
};

// Fetch Training sessions for a user, optionally with linked UserSkillUsages
export const fetchTrainingsForUser = async (userId: string, includeSkillUsages: boolean = false) => {
  let query = supabase
    .from('Training')
    .select(includeSkillUsages ? 'UserSkillUsage(*, user_skill:UserSkill!inner(*))' : '*')
    .eq('userId', userId)
    .order('date', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching training sessions:', error);
    throw error;
  }
  return data as TrainingWithDetails[];
};

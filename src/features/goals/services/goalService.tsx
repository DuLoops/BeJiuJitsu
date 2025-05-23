import { supabase } from '@/src/lib/supabase';
import { Tables, TablesInsert, TablesUpdate } from '@/src/supabase/types';

// Type definitions for Goal related operations
export type Goal = Tables<'goals'>;
export type GoalInsert = TablesInsert<'goals'>;
export type GoalUpdate = TablesUpdate<'goals'>;

// Function to fetch goals for a given profile ID
export const fetchGoalsByProfileId = async (profileId: string): Promise<Goal[]> => {
  if (!profileId) {
    throw new Error('Profile ID is required to fetch goals.');
  }
  try {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching goals in service:', error);
      throw new Error(error.message || 'Failed to fetch goals.');
    }
    return data || [];
  } catch (err) {
    console.error('Catch block error in fetchGoalsByProfileId:', err);
    if (err instanceof Error) throw err;
    throw new Error('An unexpected error occurred while fetching goals.');
  }
};

// Data type for adding a goal, profile_id is now mandatory as it's not fetched internally
export interface AddSupabaseGoalParams extends Omit<GoalInsert, 'id' | 'created_at' | 'updated_at'> {
  profile_id: string; // Ensure profile_id is part of the input data for the service function
}

// Function to add a new goal to Supabase
export const addGoalToSupabase = async (goalData: AddSupabaseGoalParams): Promise<Goal> => {
  try {
    const goalToInsert: GoalInsert = {
      ...goalData,
      // Supabase handles id, created_at, updated_at by default for new inserts
    };
    const { data, error } = await supabase
      .from('goals')
      .insert(goalToInsert)
      .select()
      .single();

    if (error || !data) {
      console.error('Error adding goal in service:', error);
      throw new Error(error?.message || 'Failed to add goal. No data returned.');
    }
    return data;
  } catch (err) {
    console.error('Catch block error in addGoalToSupabase:', err);
    if (err instanceof Error) throw err;
    throw new Error('An unexpected error occurred while adding the goal.');
  }
};

// Data type for updating a goal
export interface UpdateSupabaseGoalParams {
  goalId: number;
  updates: Partial<GoalUpdate>; // Can include profile_id if you allow re-parenting, otherwise omit from GoalUpdate here
}

// Function to update an existing goal in Supabase
export const updateSupabaseGoal = async ({ goalId, updates }: UpdateSupabaseGoalParams): Promise<Goal> => {
  try {
    // Ensure required fields like profile_id aren't accidentally set to null if not partial
    const finalUpdates: Partial<GoalUpdate> = {
        ...updates,
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('goals')
      .update(finalUpdates)
      .eq('id', goalId)
      .select()
      .single();

    if (error || !data) {
      console.error('Error updating goal in service:', error);
      throw new Error(error?.message || 'Failed to update goal. No data returned.');
    }
    return data;
  } catch (err) {
    console.error('Catch block error in updateSupabaseGoal:', err);
    if (err instanceof Error) throw err;
    throw new Error('An unexpected error occurred while updating the goal.');
  }
};

// Function to delete a goal from Supabase
export const deleteSupabaseGoal = async (goalId: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId);

    if (error) {
      console.error('Error deleting goal in service:', error);
      throw new Error(error.message || 'Failed to delete goal.');
    }
  } catch (err) {
    console.error('Catch block error in deleteSupabaseGoal:', err);
    if (err instanceof Error) throw err;
    throw new Error('An unexpected error occurred while deleting the goal.');
  }
}; 
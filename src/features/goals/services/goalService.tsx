import { supabase } from '@/src/lib/supabase';
import { Tables, TablesInsert, TablesUpdate } from '@/src/supabase/types';
import { Alert } from 'react-native';

// Type definitions for Goal related operations
export type Goal = Tables<'goals'>;
export type GoalInsert = TablesInsert<'goals'>;
export type GoalUpdate = TablesUpdate<'goals'>;

export const useGoalService = () => {
  const getCurrentUserId = async (): Promise<string> => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      console.error('Error fetching user for goal operation:', error);
      Alert.alert('Error', 'Could not fetch user session. Please try again.');
      throw new Error('User not authenticated for goal operation');
    }
    return user.id;
  };

  const addGoal = async (goalData: {
    description: string;
    due_date?: string;
    completed?: boolean;
  }): Promise<Goal | null> => {
    try {
      const userId = await getCurrentUserId();
      const goalToInsert: GoalInsert = {
        profile_id: userId,
        description: goalData.description,
        due_date: goalData.due_date,
        completed: goalData.completed || false,
      };
      const { data, error } = await supabase
        .from('goals')
        .insert(goalToInsert)
        .select()
        .single();

      if (error) {
        console.error('Error adding goal:', error);
        Alert.alert('Error', `Failed to add goal: ${error.message}`);
        return null;
      }
      return data;
    } catch (err) {
      console.error(err);
      if (!(err instanceof Error && err.message.includes('User not authenticated'))) {
        Alert.alert('Error', 'An unexpected error occurred while adding the goal.');
      }
      return null;
    }
  };

  const getGoals = async (): Promise<Goal[] | null> => {
    try {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('profile_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching goals:', error);
        Alert.alert('Error', `Failed to fetch goals: ${error.message}`);
        return null;
      }
      return data;
    } catch (err) {
      console.error(err);
      if (!(err instanceof Error && err.message.includes('User not authenticated'))) {
        Alert.alert('Error', 'An unexpected error occurred while fetching goals.');
      }
      return null;
    }
  };

  const updateGoal = async (
    goalId: number,
    updates: Partial<GoalUpdate>
  ): Promise<Goal | null> => {
    try {
      await getCurrentUserId();
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', goalId)
        .select()
        .single();

      if (error) {
        console.error('Error updating goal:', error);
        Alert.alert('Error', `Failed to update goal: ${error.message}`);
        return null;
      }
      return data;
    } catch (err) {
      console.error(err);
       if (!(err instanceof Error && err.message.includes('User not authenticated'))) {
        Alert.alert('Error', 'An unexpected error occurred while updating the goal.');
      }
      return null;
    }
  };

  const deleteGoal = async (goalId: number): Promise<boolean> => {
    try {
      await getCurrentUserId();
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId);

      if (error) {
        console.error('Error deleting goal:', error);
        Alert.alert('Error', `Failed to delete goal: ${error.message}`);
        return false;
      }
      return true;
    } catch (err) {
      console.error(err);
      if (!(err instanceof Error && err.message.includes('User not authenticated'))) {
        Alert.alert('Error', 'An unexpected error occurred while deleting the goal.');
      }
      return false;
    }
  };

  return { 
    addGoal,
    getGoals,
    updateGoal,
    deleteGoal
  };
}; 
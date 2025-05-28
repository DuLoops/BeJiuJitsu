import { Tables } from '@/src/supabase/types';
import { Category, Skill, UserSkill } from './skills'; // Assuming these are still needed for UserSkillUsageWithDetails

// Base types from Supabase
export type Training = Tables<'Training'>;
export type UserSkillUsage = Tables<'UserSkillUsage'>;

// For displaying training sessions with details about skills used
export interface UserSkillUsageWithDetails extends UserSkillUsage {
  user_skill?: UserSkill & { // Supabase join alias often uses table name
    skill: Skill & { category: Category };
  };
}

export interface TrainingWithDetails extends Training {
  user_skill_usages?: UserSkillUsageWithDetails[]; // Made optional as it's joined data
}

// For form handling
export interface UserSkillUsageFormData {
  userSkillId: string; // Corresponds to UserSkill.id
  userSkillName?: string; // For display in the form
  quantity: string; // Input as string, convert to number on submit
  success: boolean;
  // removed usageType as it will be contextually 'TRAINING' for this form
}

// If you have a specific Training form, define it here, e.g.:
export interface TrainingFormData extends Omit<Training, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'user_skill_usages'> {
  // Ensure all necessary fields for creating/updating a training session are here
  // Example: user_skill_usages might be handled differently, e.g. an array of UserSkillUsageFormData
  skillUsages: UserSkillUsageFormData[]; 
}


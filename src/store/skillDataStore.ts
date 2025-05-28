import { supabase } from '@/src/lib/supabase'; // Assuming supabase client is here
import { Skill } from '@/src/types/skills';
import { create } from 'zustand';

// Function to fetch all relevant skills (public OR user-specific)
// This function might be moved to skillService.ts later but defined here for store logic clarity
const fetchSkillsForStore = async (userId?: string): Promise<Skill[]> => {
  let query = supabase.from('Skill').select('*');
  if (userId) {
    query = query.or(`isPublic.eq.true,creatorId.eq.${userId}`);
  } else {
    query = query.eq('isPublic', true); // Fallback for no user ID
  }
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching all relevant skills:', error);
    throw error;
  }
  return data as Skill[];
};

interface SkillDataState {
  allSkills: Skill[];
  isLoadingAllSkills: boolean;
  errorAllSkills: Error | null;
  fetchAllSkills: (userId?: string) => Promise<void>;
  // Potentially add a way to manually add a new skill to this store after user creates one
  // to avoid immediate re-fetch, though React Query invalidation on UserSkill creation might handle this better
  // if this store's data is also tied to a useQuery hook elsewhere.
}

export const useSkillDataStore = create<SkillDataState>((set) => ({
  allSkills: [],
  isLoadingAllSkills: false,
  errorAllSkills: null,
  fetchAllSkills: async (userId?: string) => {
    set({ isLoadingAllSkills: true, errorAllSkills: null });
    try {
      const skills = await fetchSkillsForStore(userId);
      set({ allSkills: skills, isLoadingAllSkills: false });
    } catch (error) {
      set({ errorAllSkills: error as Error, isLoadingAllSkills: false });
      console.error("Failed to fetch all skills for store:", error);
    }
  },
})); 
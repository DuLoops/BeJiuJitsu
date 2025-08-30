import { UserSkillWithDetails } from '@/src/_features/skill/components/UserSkillList'; // For fetching user skills
import { supabase } from '@/src/lib/supabase';
import { Database } from '@/src/supabase/types';
import {
    Competition,
    CompetitionDivision,
    CompetitionFormData,
    CompetitionMatch,
    CompetitionWithDetails,
    TournamentBrand,
} from '@/src/types/competition';
import { UserSkillUsage, UserSkillUsageFormData } from '@/src/types/training';

// Fetch Tournament Brands
export const fetchTournamentBrands = async (): Promise<TournamentBrand[]> => {
  const { data, error } = await supabase.from('tournament_brands').select('*');
  if (error) {
    console.error('Error fetching tournament brands:', error);
    throw error;
  }
  return data as TournamentBrand[];
};

// Re-using from trainingService or assuming a similar one exists for fetching user skills for selection
export const fetchUserSkillsForCompetitionSelection = async (userId: string): Promise<UserSkillWithDetails[]> => {
  const { data, error } = await supabase
    .from('user_skills')
    .select(`
      id,
      skill:skills!inner(id, name, category)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user skills for selection:', error);
    throw error;
  }
  return data as UserSkillWithDetails[];
};

// Create Competition entry
const createCompetition = async (competitionData: Database['public']['Tables']['competitions']['Insert']): Promise<Competition> => {
  const { data, error } = await supabase
    .from('competitions')
    .insert([{ ...competitionData, updated_at: new Date().toISOString() }])
    .select()
    .single();
  if (error) throw error;
  return data as Competition;
};

// Batch create CompetitionDivision entries
const createCompetitionDivisions = async (divisionsData: Database['public']['Tables']['competition_divisions']['Insert'][]): Promise<CompetitionDivision[]> => {
  const divisionsToInsert = divisionsData.map(div => ({...div, updated_at: new Date().toISOString()}));
  const { data, error } = await supabase
    .from('competition_divisions')
    .insert(divisionsToInsert)
    .select();
  if (error) throw error;
  return data as CompetitionDivision[];
};

// Batch create CompetitionMatch entries
const createCompetitionMatches = async (matchesData: Database['public']['Tables']['competition_matches']['Insert'][]): Promise<CompetitionMatch[]> => {
  const matchesToInsert = matchesData.map(match => ({...match, updated_at: new Date().toISOString()}));
  const { data, error } = await supabase
    .from('competition_matches')
    .insert(matchesToInsert)
    .select();
  if (error) throw error;
  return data as CompetitionMatch[];
};

// NOTE: UserSkillUsage functionality disabled - table doesn't exist in current schema
// Use user_skill_notes or user_skill_videos instead for linking skills to matches

// Comprehensive function to create Competition with all nested data
export const createFullCompetitionEntry = async (
  userId: string,
  competitionFormData: CompetitionFormData
): Promise<Competition> => {
  // 1. Create Competition
  const newCompetition = await createCompetition({
    user_id: userId,
    title: competitionFormData.title,
    tournament_brand_id: competitionFormData.tournamentBrandId || null,
    date: competitionFormData.date,
    location: competitionFormData.location || null,
    notes: competitionFormData.notes || null,
  });

  if (!newCompetition || !newCompetition.id) throw new Error('Failed to create competition entry.');

  // 2. Process Matches directly (skip divisions for now)
  for (const divisionFormData of competitionFormData.divisions) {
    for (const matchFormData of divisionFormData.competitionMatches) {
      const newCompetitionMatch = await createCompetitionMatches([{
        competition_id: newCompetition.id, // Link directly to competition
        competition_division_id: null, // Skip division for now
        match_order: matchFormData.matchOrder || 1,
        name: matchFormData.name,
        opponent_name: matchFormData.opponentName || null,
        outcome: matchFormData.outcome,
        outcome_method: matchFormData.outcomeMethod || null,
        my_score: matchFormData.myScore || null,
        opponent_score: matchFormData.opponentScore || null,
        note: matchFormData.note || null,
        video_url: matchFormData.videoUrl || null,
      }]);

      if (!newCompetitionMatch || newCompetitionMatch.length === 0 || !newCompetitionMatch[0].id) throw new Error('Failed to create competition match entry.');
      
      // NOTE: Skill usage tracking disabled - use user_skill_notes or user_skill_videos instead
      // if (matchFormData.skillUsages && matchFormData.skillUsages.length > 0) {
      //   // Create user_skill_notes or user_skill_videos entries here
      // }
    }
  }

  return newCompetition;
};

// Fetch Competitions for a user with all related details
export const fetchCompetitionsForUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('competitions') 
    .select(`
      *,
      tournament_brand:tournament_brands(*),
      competition_divisions:competition_divisions(*, competition_matches:competition_matches(*))
    `)
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching competitions for user:', error);
    throw error;
  }
  return data as CompetitionWithDetails[]; 
};

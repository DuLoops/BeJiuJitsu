import { UserSkillWithDetails } from '@/src/features/skill/components/UserSkillList'; // For fetching user skills
import { supabase } from '@/src/lib/supabase';
import {
  Competition,
  CompetitionDivision,
  CompetitionFormData,
  CompetitionWithDetails,
  Match,
  TournamentBrand,
} from '@/src/types/competition';
import { UserSkillUsage } from '@/src/types/training';

// Fetch Tournament Brands
export const fetchTournamentBrands = async (): Promise<TournamentBrand[]> => {
  const { data, error } = await supabase.from('TournamentBrand').select('*'); // Ensure table name matches Supabase
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
      skill:skills!inner(id, name, category:categories!inner(id, name))
      // Add other fields if needed by the selection UI, but keep it light
    `)
    .eq('userId', userId);

  if (error) {
    console.error('Error fetching user skills for selection:', error);
    throw error;
  }
  return data as UserSkillWithDetails[];
};

// Create Competition entry
const createCompetition = async (competitionData: Omit<Competition, 'id' | 'created_at' | 'updated_at'>): Promise<Competition> => {
  const { data, error } = await supabase
    .from('Competition') // Ensure table name matches Supabase
    .insert([{ ...competitionData, updated_at: new Date() }])
    .select()
    .single();
  if (error) throw error;
  return data as Competition;
};

// Batch create CompetitionDivision entries
const createCompetitionDivisions = async (divisionsData: Omit<CompetitionDivision, 'id' | 'matches'>[]): Promise<CompetitionDivision[]> => {
  const divisionsToInsert = divisionsData.map(div => ({...div, updated_at: new Date()})); // matches are handled separately
  const { data, error } = await supabase
    .from('CompetitionDivision') // Ensure table name matches Supabase
    .insert(divisionsToInsert)
    .select();
  if (error) throw error;
  return data as CompetitionDivision[];
};

// Batch create Match entries
const createMatches = async (matchesData: Omit<Match, 'id' | 'skillUsages'>[]): Promise<Match[]> => {
  const matchesToInsert = matchesData.map(match => ({...match, updated_at: new Date()})); // skillUsages are handled separately
  const { data, error } = await supabase
    .from('Match') // Ensure table name matches Supabase
    .insert(matchesToInsert)
    .select();
  if (error) throw error;
  return data as Match[];
};

// Batch create UserSkillUsage entries
const createUserSkillUsagesForCompetition = async (usagesData: Omit<UserSkillUsage, 'id' | 'created_at' | 'updated_at'>[]): Promise<UserSkillUsage[]> => {
  const usagesToInsert = usagesData.map(usage => ({ ...usage, usageType: 'COMPETITION', updated_at: new Date() }));
  const { data, error } = await supabase
    .from('UserSkillUsage') // Ensure table name matches Supabase
    .insert(usagesToInsert)
    .select();
  if (error) throw error;
  return data as UserSkillUsage[];
};

// Comprehensive function to create Competition with all nested data
export const createFullCompetitionEntry = async (
  userId: string,
  competitionFormData: CompetitionFormData
): Promise<Competition> => {
  // 1. Create Competition
  const newCompetition = await createCompetition({
    userId,
    name: competitionFormData.name,
    tournamentBrandId: competitionFormData.tournamentBrandId,
    date: competitionFormData.date,
    location: competitionFormData.location,
    notes: competitionFormData.notes,
  });

  if (!newCompetition || !newCompetition.id) throw new Error('Failed to create competition entry.');

  const allSkillUsagesToCreate: Omit<UserSkillUsage, 'id' | 'created_at' | 'updated_at'>[] = [];

  // 2. Process Divisions and their Matches
  for (const divisionFormData of competitionFormData.divisions) {
    const newDivision = await createCompetitionDivisions([{
      competitionId: newCompetition.id,
      beltRank: divisionFormData.beltRank,
      weightClass: divisionFormData.weightClass,
      ageCategory: divisionFormData.ageCategory,
      bjjType: divisionFormData.bjjType,
      overallResultInDivision: divisionFormData.overallResultInDivision,
    }]);
    
    if (!newDivision || newDivision.length === 0 || !newDivision[0].id) throw new Error('Failed to create competition division.');
    const createdDivisionId = newDivision[0].id;

    for (const matchFormData of divisionFormData.matches) {
      const newMatch = await createMatches([{
        competitionDivisionId: createdDivisionId,
        matchOrder: matchFormData.matchOrder,
        opponentName: matchFormData.opponentName,
        result: matchFormData.result,
        endingMethod: matchFormData.endingMethod,
        endingMethodDetail: matchFormData.endingMethodDetail,
        notes: matchFormData.notes,
        videoUrl: matchFormData.videoUrl,
      }]);

      if (!newMatch || newMatch.length === 0 || !newMatch[0].id) throw new Error('Failed to create match entry.');
      const createdMatchId = newMatch[0].id;

      // Prepare UserSkillUsage entries for this match
      if (matchFormData.skillUsages && matchFormData.skillUsages.length > 0) {
        matchFormData.skillUsages.forEach(usage => {
          allSkillUsagesToCreate.push({
            userSkillId: usage.userSkillId,
            quantity: parseInt(usage.quantity, 10) || 1, // Ensure quantity is a number
            success: usage.success,
            usageType: 'COMPETITION',
            competitionId: newCompetition.id, // Link to parent competition
            matchId: createdMatchId, // Link to this specific match
            trainingId: null, // Not a training usage
          });
        });
      }
    }
  }

  // 3. Batch create all UserSkillUsages
  if (allSkillUsagesToCreate.length > 0) {
    await createUserSkillUsagesForCompetition(allSkillUsagesToCreate);
  }

  return newCompetition;
};

// Fetch Competitions for a user with all related details
export const fetchCompetitionsForUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('Competition') 
    .select(`
      *,
      tournament_brand:TournamentBrand(*),
      divisions:CompetitionDivision(*, matches:Match(*, UserSkillUsage(*, user_skill:UserSkill!inner(skill:skills!inner(name)))))
    `)
    .eq('userId', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching competitions for user:', error);
    throw error;
  }
  return data as CompetitionWithDetails[]; 
};

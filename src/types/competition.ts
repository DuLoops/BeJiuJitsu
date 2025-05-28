import { Enums, Tables } from '@/src/supabase/types';
import { UserSkillUsageFormData, UserSkillUsageWithDetails } from './training';

// Base types from Supabase
export type TournamentBrand = Tables<'TournamentBrand'>;
export type Competition = Tables<'Competition'>;
export type CompetitionDivision = Tables<'CompetitionDivision'>;
export type Match = Tables<'Match'>;

// Detailed types for fetched data with joins
export interface MatchWithSkillUsages extends Match {
  UserSkillUsage?: UserSkillUsageWithDetails[];
}

export interface CompetitionDivisionWithMatches extends CompetitionDivision {
  matches?: MatchWithSkillUsages[];
}

export interface CompetitionWithDetails extends Competition {
  tournament_brand?: TournamentBrand;
  divisions?: CompetitionDivisionWithMatches[];
}

// Helper types for form data structure
export interface MatchFormData {
  tempId: string; 
  skillUsages: UserSkillUsageFormData[];
  opponentName?: string | null;
  result: Enums<"MatchOutcomeType">; 
  endingMethod?: Enums<"MatchMethodType"> | null; 
  endingMethodDetail?: string | null;
  notes?: string | null;
  videoUrl?: string | null;
  matchOrder?: number | null;
}

export interface CompetitionDivisionFormData {
  tempId: string; 
  matches: MatchFormData[];
  beltRank: Enums<"Belts">; 
  bjjType: Enums<"BjjType">; 
  weightClass?: string | null;
  ageCategory?: string | null;
  overallResultInDivision?: string | null;
}

export interface CompetitionFormData {
  divisions: CompetitionDivisionFormData[];
  name: string; 
  tournamentBrandId?: string | null;
  date: string; 
  location?: string | null;
  notes?: string | null;
}

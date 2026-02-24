import { Enums, Tables } from '@/src/supabase/types';
import { UserSkillUsageFormData, UserSkillUsageWithDetails } from './training';

// Base types from Supabase
export type TournamentBrand = Tables<'tournament_brands'>;
export type Competition = Tables<'competitions'>;
export type CompetitionDivision = Tables<'competition_divisions'>;
export type CompetitionMatch = Tables<'competition_matches'>;
export type CompetitionResult = Tables<'competition_results'>;

// Detailed types for fetched data with joins
export interface CompetitionMatchWithSkillUsages extends CompetitionMatch {
  user_skill_usages?: UserSkillUsageWithDetails[];
}

export interface CompetitionDivisionWithMatches extends CompetitionDivision {
  competition_matches?: CompetitionMatchWithSkillUsages[];
}

export interface CompetitionWithDetails extends Competition {
  tournament_brand?: TournamentBrand;
  competition_divisions?: CompetitionDivisionWithMatches[];
}

// Helper types for form data structure
export interface CompetitionMatchFormData {
  tempId: string;
  skillUsages: UserSkillUsageFormData[];
  name: string;
  opponentName?: string | null;
  outcome: Enums<"MatchOutcome">;
  outcomeMethod?: Enums<"MatchOutcomeMethod"> | null;
  myScore?: number | null;
  opponentScore?: number | null;
  note?: string | null;
  videoUrl?: string | null;
  matchOrder?: number | null;
}

export interface CompetitionDivisionFormData {
  tempId: string;
  competitionMatches: CompetitionMatchFormData[];
  beltRank: Enums<"Belts">;
  bjjType: Enums<"BjjType">;
  divisionWeightUnit?: number | null;
  divisionWeightType?: Enums<"division_weight_type"> | null;
  weightClassUnderKg?: number | null;
  ageCategory?: string | null;
  overallResultInDivision?: number | null;
  outcome?: string | null;
}

export interface CompetitionFormData {
  divisions: CompetitionDivisionFormData[];
  title: string;
  tournamentBrandId?: string | null;
  date: string;
  location?: string | null;
  notes?: string | null;
}

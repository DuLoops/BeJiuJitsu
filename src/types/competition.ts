import { BjjType, Belts, MatchMethodType, MatchOutcomeType } from '@/src/supabase/types';
import { UserSkillUsageFormData, UserSkillUsage } from './training'; 
import { UserSkill, Skill, Category } from './skills';

export interface TournamentBrand {
  id: string; // UUID
  name: string;
  isPredefined: boolean;
  creatorUserId?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface Competition {
  id: string; // UUID
  userId: string; // Foreign key to auth.users.id
  name: string;
  tournamentBrandId?: string | null; // Foreign key to TournamentBrand.id
  date: string; // ISO date string (e.g., "2023-10-27")
  location?: string | null;
  notes?: string | null;
  created_at?: Date;
  updated_at?: Date;
  // For joined data
  tournament_brand?: TournamentBrand; // Supabase alias for join
  divisions?: CompetitionDivisionWithMatches[];
}

export interface CompetitionDivision {
  id: string; // UUID
  competitionId?: string; 
  beltRank: Belts;
  weightClass?: string | null; 
  ageCategory?: string | null; 
  bjjType: BjjType;
  overallResultInDivision?: string | null; 
  created_at?: Date; // Assuming these might exist from DB schema
  updated_at?: Date;
}

export interface Match {
  id: string; // UUID
  competitionDivisionId?: string; 
  matchOrder?: number | null;
  opponentName?: string | null;
  result: MatchOutcomeType;
  endingMethod?: MatchMethodType | null;
  endingMethodDetail?: string | null; 
  notes?: string | null;
  videoUrl?: string | null;
  created_at?: Date; // Assuming these might exist
  updated_at?: Date;
}

// Detailed types for fetched data with joins
export interface UserSkillUsageInMatch extends UserSkillUsage {
  user_skill?: UserSkill & { // Supabase join alias often uses table name
    skill: Skill & { category: Category };
  };
}
export interface MatchWithSkillUsages extends Match {
  skill_usages: UserSkillUsageInMatch[]; // Supabase alias for join
}

export interface CompetitionDivisionWithMatches extends CompetitionDivision {
  matches: MatchWithSkillUsages[]; // Supabase alias for join
}

export interface CompetitionWithDetails extends Competition {
  tournament_brand?: TournamentBrand;
  divisions: CompetitionDivisionWithMatches[];
}

// Helper types for form data structure
export interface MatchFormData extends Omit<Match, 'id' | 'competitionDivisionId' | 'created_at' | 'updated_at' > {
  tempId: string; 
  skillUsages: UserSkillUsageFormData[];
}

export interface CompetitionDivisionFormData extends Omit<CompetitionDivision, 'id' | 'competitionId' | 'created_at' | 'updated_at'> {
  tempId: string; 
  matches: MatchFormData[];
}

export interface CompetitionFormData extends Omit<Competition, 'id' | 'userId' | 'created_at' | 'updated_at' | 'tournament_brand' | 'divisions'> {
  divisions: CompetitionDivisionFormData[];
  // Include fields from Competition that are part of the form
  name: string;
  tournamentBrandId?: string | null;
  date: string;
  location?: string | null;
  notes?: string | null;
}

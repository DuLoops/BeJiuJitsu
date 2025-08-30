import { UserSkillWithDetails } from '@/src/_features/skill/components/UserSkillList';
import { Enums } from '@/src/supabase/types';

export interface MatchRecord {
  id: string;
  bjjType: Enums<'BjjType'>;
  outcome: Enums<'MatchOutcome'>;
  outcomeMethod: Enums<'MatchOutcomeMethod'> | null;
  name: string;
  opponentName?: string | null;
  myScore?: number | null;
  opponentScore?: number | null;
  note: string | null;
  videoUrl: string | null;
  skillUsages: UserSkillWithDetails[];
  isExpanded: boolean;
  divisionTempId?: string | null;
} 
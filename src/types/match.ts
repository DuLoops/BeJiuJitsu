import { UserSkillWithDetails } from '@/src/_features/progress/skill/components/UserSkillList';

export interface MatchRecord {
  id: string;
  bjjType: string;
  outcome: string;
  method: string;
  myScore?: number;
  opponentScore?: number;
  note: string | null;
  videoUrl: string;
  skillUsages: UserSkillWithDetails[];
  isExpanded: boolean;
} 
export interface SkillType {
  id: string;
  creatorId: string;
  isPublic: boolean;
  name: string;
  categoryId: string;
  category: CategoryType;
  createdAt: string;
}

export interface CategoryType {
  id: string;
  userId: string | null;
  name: string;
  isPredefined: boolean;
  predefined: boolean;
  skills?: SkillType[];
  createdAt: string;
  updatedAt: string;
}

export enum PredefinedCategory {
  TAKEDOWN = 'TAKEDOWN',
  PASS = 'PASS',
  CONTROL = 'CONTROL',
  SUBMISSION = 'SUBMISSION',
  ESCAPE = 'ESCAPE',
  GUARD = 'GUARD',
  SWEEP = 'SWEEP',
  SYSTEM = 'SYSTEM'
}

export interface UserSkillType {
  id: string;
  userId: string;
  skillId: string;
  skill: SkillType;
  note: string | null;
  videoUrl: string | null;
  sequence: SequenceStep[];
  usages: SkillUsageType[];
  createdAt: string;
  updatedAt: string;
}

export interface SequenceStep {
  stepNumber: number;
  intention: string;
  details: string[];
}

export interface SkillUsageType {
  id: string;
  skillId: string;
  trainingId: string | null;
  competitionId: string | null;
  usageType: 'TRAINING' | 'COMPETITION';
  quantity: number;
  success: boolean;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

// Types for enums from the backend
export type BjjType = 'GI' | 'NOGI' | 'BOTH';
export type TrainingIntensity = 'LIGHT' | 'MEDIUM' | 'HARD';
export type UsageType = 'TRAINING' | 'COMPETITION';

export interface NewUserSkillDataType {
  skill: {
    name: string;
    categoryId: string;
    id: string;
  };
  userSkill: {
    note: string;
    videoUrl: string | null;
    sequence: SequenceStep[];
  };
}

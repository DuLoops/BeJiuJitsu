export interface SkillType {
  id: string;
  name: string;
  category: string;
  note: string;
  video: string | null;
  sequence: SequenceStep[];
}

export interface SkillInput {
  note: string;
  video: string | null;
  sequence: SequenceStep[];
  selectedCategory: string | null;
  selectedSkill: string;
}

export interface SequenceStep {
  stepNumber: number;
  intention: string;
  details: string[];
}

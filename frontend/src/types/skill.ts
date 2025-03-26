export interface SkillType {
  id: string;
  name: string;
  category: {id:string, name:string} | null;
  note: string;
  video: string | null;
  sequence: SequenceStep[];
}



export interface SequenceStep {
  stepNumber: number;
  intention: string;
  details: string[];
}

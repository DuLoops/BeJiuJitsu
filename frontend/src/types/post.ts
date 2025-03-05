// src/types/post.ts
export type BasePost = {
    id: string;
    title: string;
    createdAt: Date;
  };
  
  export type TrainingPost = BasePost & {
    type: 'training';
    trainingDate: Date;
    duration: number; // in minutes
    bjjForm: 'gi' | 'nogi';
    note?: string;
  };
  
  export type CompetitionPost = BasePost & {
    type: 'competition';
    competitionDate: Date;
    location: string;
    division: string;
    result: string;
  };
  
  export type RegularPost = BasePost & {
    type: 'post';
    tags?: string[];
  };
  
  export type Post = TrainingPost | CompetitionPost | RegularPost;T
// Enums
export enum CategoryEnum {
  GUARD = "Guard",
  PASSING = "Passing",
  SWEEPS = "Sweeps",
  SUBMISSIONS = "Submissions",
  ESCAPES = "Escapes",
  TAKEDOWNS = "Takedowns",
  THROWS = "Throws",
  OTHER = "Other", // For user-defined categories
}

// This would ideally be populated from a predefined list or allow dynamic creation
// For now, let's list a few common ones as examples, users can add more.
export enum SkillNameEnum {
  // Guard
  CLOSED_GUARD = "Closed Guard",
  OPEN_GUARD = "Open Guard",
  HALF_GUARD = "Half Guard",
  SPIDER_GUARD = "Spider Guard",
  DE_LA_RIVA_GUARD = "De La Riva Guard",
  BUTTERFLY_GUARD = "Butterfly Guard",
  // Passing
  TORREANDO_PASS = "Torreando Pass",
  KNEE_CUT_PASS = "Knee Cut Pass",
  X_PASS = "X-Pass",
  // Sweeps
  SCISSOR_SWEEP = "Scissor Sweep",
  PENDULUM_SWEEP = "Pendulum Sweep",
  // Submissions
  REAR_NAKED_CHOKE = "Rear Naked Choke",
  GUILLOTINE = "Guillotine",
  ARMBAR = "Armbar",
  KIMURA = "Kimura",
  TRIANGLE_CHOKE = "Triangle Choke",
  // Escapes
  SHRIMPING = "Shrimping (Hip Escape)",
  BRIDGE_AND_ROLL = "Bridge and Roll",
  // Takedowns
  DOUBLE_LEG_TAKEDOWN = "Double Leg Takedown",
  SINGLE_LEG_TAKEDOWN = "Single Leg Takedown",
  // Throws
  IPPON_SEOINAGE = "Ippon Seoinage",
  OSOTO_GARI = "Osoto Gari",
  // Other for user-defined skills
  OTHER = "Other",
}

export enum UserSkillSourceEnum {
  SEMINAR = "Seminar",
  INSTRUCTIONAL = "Instructional",
  CLASS = "Class",
  COMPETITION = "Competition",
  SPARRING = "Sparring",
  OTHER = "Other",
}

// Interfaces
export interface Category {
  id: string; // UUID
  name: CategoryEnum | string; // Allow custom string for user-defined categories
  isPredefined: boolean;
  userId?: string | null; // Link to user if not predefined
  created_at?: Date;
  updated_at?: Date;
}

// For Skill Sequences
export interface SkillSequence {
  id: string; // UUID
  userSkillId: string; // Foreign key to UserSkill.id
  stepNumber: number;
  intention?: string | null; // What the user wants to achieve with this step
  // Note: 'detail' from the original requirement seems more appropriate for SequenceDetail
  created_at?: Date;
  updated_at?: Date;
}

export interface SequenceDetail {
  id: string; // UUID
  skillSequenceId: string; // Foreign key to SkillSequence.id
  detail: string; // Specific instructions or notes for this step
  // video_timestamp_start?: number; // Optional: For linking to specific part of a video
  // video_timestamp_end?: number; // Optional
  created_at?: Date;
  updated_at?: Date;
}

export interface Skill {
  id: string; // UUID
  name: SkillNameEnum | string; // Allow custom string for user-defined skills
  categoryId: string; // Foreign key to Category.id
  isPublic: boolean; // True if predefined or shared, false if user-specific base skill
  creatorId?: string | null; // Link to user if they created this base skill and it's not public by default
  created_at?: Date;
  updated_at?: Date;
}

export interface UserSkill {
  id: string; // UUID
  userId: string; // Foreign key to auth.users.id
  skillId: string; // Foreign key to Skill.id
  note?: string | null;
  source?: UserSkillSourceEnum | string | null;
  isFavorite?: boolean;
  videoUrl?: string | null;
  // proficiencyLevel?: number; // Example: 1-5 scale, for future enhancement
  // lastPracticed?: Date; // For future enhancement
  created_at?: Date;
  updated_at?: Date;
}

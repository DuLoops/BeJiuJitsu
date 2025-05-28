import { Enums } from '@/src/supabase/types';

// Type alias for the Belt enum from supabase.types.ts
export type BeltEnum = Enums<"Belts">;
// Type alias for the BjjType enum
export type BjjTypeEnum = Enums<"BjjType">;
// Type alias for the TrainingIntensity enum
export type TrainingIntensityEnum = Enums<"TrainingIntensity">;
// Type alias for MatchOutcomeType enum
export type MatchOutcomeTypeEnum = Enums<"MatchOutcomeType">;
// Type alias for MatchMethodType enum
export type MatchMethodTypeEnum = Enums<"MatchMethodType">;
// Type alias for UsageType enum
export type UsageTypeEnum = Enums<"UsageType">;

// Export the Belts array
export const BeltsArray: readonly BeltEnum[] = [
  "WHITE", "BLUE", "PURPLE", "BROWN", "BLACK", "GRAY", "YELLOW", "ORANGE", "GREEN"
];

// Export the BjjTypes array
export const BjjTypesArray: readonly BjjTypeEnum[] = ["GI", "NOGI", "BOTH"];

// Export the TrainingIntensities array
export const TrainingIntensitiesArray: readonly TrainingIntensityEnum[] = ["LIGHT", "MEDIUM", "HARD"];

// Export the MatchOutcomeTypes array - Corrected to match Supabase enum
export const MatchOutcomeTypesArray: readonly MatchOutcomeTypeEnum[] = ["WIN", "LOSE", "DRAW"];

// Export the MatchMethodTypes array - Corrected to match Supabase enum
export const MatchMethodTypesArray: readonly MatchMethodTypeEnum[] = ["SUBMISSION", "POINTS", "REFEREE_DECISION", "DISQUALIFICATION", "FORFEIT", "OTHER"];

// Export the UsageTypes array
export const UsageTypesArray: readonly UsageTypeEnum[] = ["TRAINING", "COMPETITION"];
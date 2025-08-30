import { Enums } from '@/src/supabase/types';

// Type alias for the Belt enum from supabase.types.ts
export type BeltEnum = Enums<"Belts">;
// Type alias for the BjjType enum
export type BjjTypeEnum = Enums<"BjjType">;
// Type alias for MatchOutcome enum
export type MatchOutcomeEnum = Enums<"MatchOutcome">;
// Type alias for MatchOutcomeMethod enum
export type MatchOutcomeMethodEnum = Enums<"MatchOutcomeMethod">;
// Type alias for UsageType enum
export type UsageTypeEnum = Enums<"UsageType">;

// Export the Belts array
export const BeltsArray: readonly BeltEnum[] = [
  "WHITE", "BLUE", "PURPLE", "BROWN", "BLACK", "GRAY", "YELLOW", "ORANGE", "GREEN"
];

// Export the BjjTypes array
export const BjjTypesArray: readonly BjjTypeEnum[] = ["GI", "NOGI", "BOTH"];

// Export the MatchOutcome array
export const MatchOutcomeArray: readonly MatchOutcomeEnum[] = ["WIN", "LOSE", "DRAW"];

// Export the MatchOutcomeMethod array
export const MatchOutcomeMethodArray: readonly MatchOutcomeMethodEnum[] = ["SUBMISSION", "POINTS", "REFEREE_DECISION", "DISQUALIFICATION", "FORFEIT", "OTHER"];

// Export the UsageTypes array
export const UsageTypesArray: readonly UsageTypeEnum[] = ["TRAINING", "COMPETITION"];
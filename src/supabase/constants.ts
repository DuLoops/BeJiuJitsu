import { Constants, Enums } from '@/src/supabase/types';

// Type alias for the Belt enum from supabase.types.ts
export type Belt = Enums<"Belts">;

// Export the Belts array from supabase.types.ts
export const Belts: readonly Belt[] = Constants.public.Enums.Belts;
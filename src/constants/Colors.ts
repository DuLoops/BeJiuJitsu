/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const themeColors = {
  // Main theme colors
  black: '#030712',      // black
  white: '#F9FAFB',     // white
  blue: '#2563EB',     // blue
  red: '#B91C1C',    // red
  lightBlue: '#93C5FD',     // light blue
  lightRed: '#EF4444',    // light red
};

export const PALETTE = {
  light: {
    cardShadow: '#2B2B2B', // Sumi Charcoal
  },
  dark: {
    textPrimary: '#F0EFE7', // Vellum White
  },
  common: {
    accent: '#B73225', // Vermilion Stamp
    success: '#3B704E',
  }
};

export const Colors = {
  light: {
    text: '#2B2B2B',      // Sumi Charcoal
    background: '#FAF3DD', // Aged Vellum
    tint: '#B73225',      // Vermilion Stamp (Accent)
    icon: '#405059',      // Slate Indigo (Secondary)
    tabIconDefault: '#405059',
    tabIconSelected: '#B73225',
    success: '#3B704E',
    border: '#405059',    // Secondary UI
    card: '#FFFFFF',      // Pure White
    shadow: '#2B2B2B',    // Hard Shadow color
    // Additional Semantic Colors
    secondaryText: '#405059',
  },
  dark: {
    text: '#F0EFE7',      // Vellum White
    background: '#0F1419', // Sumi Wash
    tint: '#B73225',      // Vermilion Stamp
    icon: '#849BAA',      // Faded Slate
    tabIconDefault: '#849BAA',
    tabIconSelected: '#B73225',
    success: '#3B704E',
    border: '#849BAA',    // Faded Slate
    card: '#1E2833',      // Deep Indigo
    shadow: '#000000',    // Dark Shadow (kept black for depth on dark)
    // Additional Semantic Colors
    secondaryText: '#849BAA',
  },
};

// Category color palette and helpers (global)
// Using theme-compliant muted tones instead of pastels
export const categoryColorPalette = [
  '#405059', // Slate Indigo
  '#B73225', // Vermilion
  '#2B2B2B', // Charcoal
  '#3B704E', // Success Green
  '#849BAA', // Faded Slate
  '#1E2833', // Deep Indigo
] as const;

function hashToIndex(input?: string | null): number {
  if (!input) return 0;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % categoryColorPalette.length;
}

export function getCategoryColor(categoryId?: string | null): string {
  return categoryColorPalette[hashToIndex(categoryId)];
}

// Belt colors (stronger visibility)
export const BeltColors: Record<string, string> = {
  WHITE: '#FFFFFF',
  BLUE: '#3B82F6',
  PURPLE: '#8B5CF6',
  BROWN: '#A16207',
  BLACK: '#374151',
  GRAY: '#6B7280',
  YELLOW: '#EAB308',
  ORANGE: '#EA580C',
  GREEN: '#16A34A',
};

export function getBeltColor(belt?: string | null): string {
  if (!belt) return '#F3F4F6';
  return BeltColors[belt] || '#F3F4F6';
}

// Activity type colors (global - use these consistently throughout the app)
// Mapped to "Shou Sugi Ban & Indigo" palette
export const ActivityColors = {
  all: '#405059',        // Slate Indigo (Secondary UI)
  training: '#405059',   // Slate Indigo (Foundational)
  footage: '#2B2B2B',    // Sumi Charcoal (Ink/Media)
  competition: '#B73225', // Vermilion Stamp (Action/High Stakes)
};

export function getActivityColor(activityType: 'all' | 'training' | 'footage' | 'competition'): string {
  return ActivityColors[activityType] || ActivityColors.all;
}

export const MedalColors = {
  GOLD: '#FFD700',
  SILVER: '#C0C0C0',
  BRONZE: '#CD7F32',
};

export function getMedalColor(rank?: number): string | undefined {
  if (rank === 1) return MedalColors.GOLD;
  if (rank === 2) return MedalColors.SILVER;
  if (rank === 3) return MedalColors.BRONZE;
  return undefined;
}

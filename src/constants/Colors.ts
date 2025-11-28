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

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    success: '#28a745',
    border: '#E5E7EB',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    success: '#28a745',
    border: '#374151',
  },
};

// Category color palette and helpers (global)
export const categoryColorPalette = [
  '#E3F2FD', // blue-50
  '#E8F5E9', // green-50
  '#FFF3E0', // orange-50
  '#FCE4EC', // pink-50
  '#EDE7F6', // purple-50
  '#E0F2F1', // teal-50
  '#F3E5F5', // violet-50
  '#FFFDE7', // yellow-50
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
export const ActivityColors = {
  all: '#2563EB',        // Blue
  training: '#8B5CF6',   // Purple
  footage: '#A16207',    // Brown
  competition: '#374151', // Black/Dark Gray
};

export function getActivityColor(activityType: 'all' | 'training' | 'footage' | 'competition'): string {
  return ActivityColors[activityType] || ActivityColors.all;
}

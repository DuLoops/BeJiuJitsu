# BeJiuJitsu Frontend Development Guidelines

## Overview

This document provides guidelines and best practices for frontend development of the BeJiuJitsu mobile application. Following these guidelines ensures consistency, maintainability, and a high-quality user experience.

## Project Structure

```
/frontend
├── /src
│   ├── /app                    # Expo Router app directory
│   │   ├── /(auth)             # Authentication screens
│   │   ├── /(onboarding)       # Onboarding screens
│   │   ├── /(tabs)             # Main tab navigation
│   │   │   ├── _layout.tsx     # Tab navigation layout
│   │   │   ├── index.tsx       # Home screen (feed)
│   │   │   ├── Create.tsx      # Create screen (placeholder)
│   │   │   └── Profile.tsx     # Profile screen
│   │   ├── /create             # Create form screens
│   │   │   ├── _layout.tsx     # Create navigation layout
│   │   │   ├── CreateSkillScreen.tsx
│   │   │   ├── CreateTrainingScreen.tsx
│   │   │   └── CreateCompetitionScreen.tsx
│   │   ├── /profile            # Profile-related screens
│   │   └── _layout.tsx         # Root layout
│   ├── /components             # Reusable components
│   │   ├── /ui                 # UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Text.tsx
│   │   │   └── ...
│   │   ├── /create             # Create flow components
│   │   │   ├── /skill
│   │   │   ├── /training
│   │   │   └── /competition
│   │   ├── /profile            # Profile components
│   │   └── /feed               # Feed components
│   ├── /context                # React Context providers
│   │   ├── AuthContext.tsx     # Authentication context
│   │   ├── ThemeContext.tsx    # Theme context
│   │   └── SkillContext.tsx    # Skill management context
│   ├── /hooks                  # Custom React hooks
│   │   ├── useApi.ts
│   │   ├── useProtectedRoute.ts
│   │   └── ...
│   ├── /services               # API service functions
│   │   ├── skillService.ts
│   │   ├── trainingService.ts
│   │   └── ...
│   ├── /types                  # TypeScript type definitions
│   │   ├── skill.ts
│   │   ├── user.ts
│   │   └── ...
│   ├── /utils                  # Utility functions
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   └── ...
│   ├── /constants              # App constants
│   │   ├── Colors.ts
│   │   ├── Skills.ts
│   │   └── ...
│   ├── /theme                  # Theming
│   │   └── theme.ts
│   └── /config                 # App configuration
│       ├── env.ts
│       └── ...
└── ...
```

## File Naming Conventions

- **Component Files**: PascalCase (e.g., `Button.tsx`, `SkillCard.tsx`)
- **Hook Files**: camelCase prefixed with "use" (e.g., `useApi.ts`, `useAuth.ts`)
- **Utility Files**: camelCase (e.g., `validation.ts`, `formatDate.ts`)
- **Context Files**: PascalCase with "Context" suffix (e.g., `AuthContext.tsx`)
- **Type Files**: camelCase (e.g., `skill.ts`, `user.ts`)

## Component Guidelines

### Component Structure

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';

interface ComponentProps {
  // Props definitions
  title: string;
  onPress?: () => void;
}

export const Component: React.FC<ComponentProps> = ({ 
  title, 
  onPress 
}) => {
  // Component logic

  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Styles
  },
});
```

### UI Component Library

The application uses a custom UI component library to ensure consistency:

- **Button**: For all button interactions
- **Text**: For all text elements with consistent styling
- **Input**: For text inputs
- **Card**: For content cards
- **SegmentedControl**: For option selection
- **Accordion**: For expandable sections

All custom components should be in the `/components/ui` directory and should accept standard props plus custom props as needed.

## Styling Guidelines

### Theme System

The app uses a theme system that supports both light and dark mode:

```typescript
import { useTheme } from '@/src/context/ThemeContext';

const MyComponent = () => {
  const { activeTheme } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: activeTheme.background.default,
    },
    text: {
      color: activeTheme.text.primary,
    },
  });
  
  // ...
};
```

### Color Palette

The primary color palette consists of:

- **Dark**: #030712 (Black)
- **Light**: #F9FAFB (White)
- **Accent (Red)**: #B91C1C
- **Secondary (Blue)**: #2563EB

Always use the theme system to access colors rather than hardcoding values.

### Typography

Typography should be consistent across the app:

- Use the `Text` component for all text elements
- Typography options:
  - Size: xs, sm, md, lg, xl, xxl, xxxl
  - Weight: normal, medium, semibold, bold
  - Variant: primary, secondary, muted, accent

Example:
```typescript
<Text 
  size="md" 
  weight="bold" 
  variant="primary"
>
  Content
</Text>
```

### Spacing and Layout

- Use a consistent spacing system
- Avoid hardcoded margins/paddings
- Use flexbox for layouts

## State Management

### Authentication State

Use the `AuthContext` for managing user authentication:

```typescript
import { useAuth } from '@/src/context/AuthContext';

const Component = () => {
  const { user, signIn, signOut } = useAuth();
  
  // Component logic using auth state
};
```

### API Data Fetching

Use React Query for data fetching, caching, and state management:

```typescript
import { useSkills } from '@/src/services/skillService';

const Component = () => {
  const { data: skills, isLoading, error } = useSkills();
  
  if (isLoading) return <LoadingIndicator />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    // Render skills
  );
};
```

### Form State

Use React Hook Form for form state management:

```typescript
import { useForm } from 'react-hook-form';

const Component = () => {
  const { register, handleSubmit, errors } = useForm();
  
  const onSubmit = (data) => {
    // Submit form
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
};
```

## Navigation

The app uses Expo Router for navigation:

```typescript
import { router } from 'expo-router';

// Navigate to a screen
router.push('/create/CreateSkillScreen');

// Replace current screen
router.replace('/(tabs)');

// Go back
router.back();
```

## Performance Considerations

- Use `memo` for components that re-render frequently
- Use `useCallback` for functions passed as props
- Use `useMemo` for expensive calculations
- Use `FlatList` or `SectionList` for long lists
- Optimize images before displaying
- Lazy load components when possible

## Accessibility

- Use semantic components
- Provide meaningful accessibility labels
- Ensure sufficient color contrast
- Support dynamic text sizes
- Test with screen readers

## Testing

- Write unit tests for components and hooks
- Write integration tests for screens
- Use Mock Service Worker for API mocking
- Test both success and error states
- Test with different theme modes

## Error Handling

- Use try/catch blocks for API calls
- Display user-friendly error messages
- Log errors for debugging
- Provide recovery options when possible

## Code Style and Linting

- Use ESLint for code linting
- Use Prettier for code formatting
- Follow TypeScript best practices
- Document complex logic with comments
- Use meaningful variable and function names

## Submission Guidelines

- Create feature branches for new features
- Write descriptive commit messages
- Create pull requests for code review
- Ensure all tests pass before merging
- Resolve all code review comments
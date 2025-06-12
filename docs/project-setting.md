# Project Settings and Architecture Guidelines

This document outlines the core technical stack, component usage, and directory structure for our project. Adhering to these guidelines will promote consistency, reduce redundancy, and streamline development.

## 🚀 Tech Stack

* **Frontend**: Expo React Native
* **Backend**: Supabase
* **State Manager**: React Query (Backend), Zustand (Frontend)
* **Styling**: Themed Components (leveraging `useThemeColor` for dynamic theming)

## Supabase Management
For tasks requiring direct interaction with our backend services—such as database inspection, running test queries, managing storage, or viewing API logs—you can use the Supabase Management Console.

Project ID: ejzgwpqhsrnazpckndkb

## 🎨 Design System & Component Usage Guidelines

Our goal is to build a robust and maintainable UI. Please follow these principles when creating new features and components:

* **Single Source of Truth for Theming**:
    * **Colors**: All color definitions MUST be centralized in `src/constants/Colors.ts`. Avoid hardcoding color values directly in components.
    * **Themed Components**: Utilize the provided `ThemedText.tsx`, `ThemedView.tsx`, and `ThemedButton.tsx` for standard UI elements. These components are pre-configured to adapt to our light/dark theme.
    * **Custom Theming**: For any custom component requiring theme-aware styling, always use the `useThemeColor.ts` hook. This hook, in conjunction with `Colors.ts`, ensures consistent adaptation to theme changes.

* **Component Reusability & Structure**:
    * **Atomic Design Principles**: Strive to break down UI into smaller, reusable pieces.
        * **Atoms (`components/ui/atoms`)**: Smallest, indivisible UI elements (e.g., a simple button, a text input, an icon). These should be highly reusable and independent.
        * **Molecules (`components/ui/molecules`)**: Combinations of atoms that function together as a unit (e.g., a search bar, a navigation item with an icon and text).
    * **Layout Components (`components/layout`)**: Components specifically designed for structural layout (e.g., `ScreenContainer`, `FlexRow`, `Spacer`). These help maintain consistent spacing and alignment across the application.
    * **Avoid Duplication**: Before creating a new component, thoroughly check existing components in the `/components` directory. If a similar component exists, extend or reuse it rather than creating a duplicate.
* **Authentication Flow**:
    * **Centralized Authentication Logic**: All authentication-related logic and state management should be handled through `src/hooks/useAuth.tsx`. Avoid scattered authentication checks or direct Supabase calls within UI components.

## 🗃️ Data & Constants

* **Single Source of Truth**:
    * **Supabase Types & Constants**: Always import types and constants directly from `src/supabase/types.ts` and `src/supabase/constants.ts` respectively. This ensures data consistency and reduces errors related to schema mismatches.

## 📂 Directory Structure (`src`)

src
├── app
│   ├── (auth)                     # Authentication related screens (e.g., sign-in, sign-up)
│   ├── (protected)                # Screens requiring authentication
│   │   ├── (modal)                # Modal screens (e.g., create competition, skill, training)
│   │   │   └── create
│   │   │       ├── competition.tsx
│   │   │       ├── skill.tsx
│   │   │       └── training.tsx
│   │   ├── (tabs)                 # Tabbed navigation screens
│   │   │   ├── _layout.tsx        # Layout for tab navigation
│   │   │   ├── index.tsx          # Home screen (default tab)
│   │   │   └── profile            # User profile screen
│   │   ├── _layout.tsx            # Layout for protected routes
│   │   └── create-profile.tsx     # Screen for initial user profile creation
│   ├── +not-found.tsx             # 404 Not Found screen
│   └── _layout.tsx                # Main app layout (e.g., for global navigation, providers)
├── assets                         # Static assets (images, fonts, etc.)
├── components                     # Reusable UI components (our design system)
│   ├── layout                     # Components for overall page structure and spacing
│   │   └── ThemedView.tsx         # Themed container view
│   ├── ui                         # Atomic design system components
│   │   ├── atoms                  # Smallest, reusable UI elements (e.g., ThemedText, ThemedButton)
│   │   │   ├── ThemedButton.tsx   # Themed button component
│   │   │   └── ThemedText.tsx     # Themed text component
│   │   └── molecules              # Combinations of atoms (e.g., form inputs, navigation items)
├── constants                      # Application-wide constants
│   ├── Colors.ts                  # Centralized color definitions for theming
│   └── Skills.ts                  # Application-specific skill constants
├── context                        # React Context providers (e.g., AuthContext)
│   └── AuthContext.tsx
├── features                       # Domain-specific modules (e.g., 'user-management', 'competitions')
│   └── 'feature name'             # Encapsulates related components, screens, services, and utils
│       ├── components             # Feature-specific components
│       ├── screens                # Feature-specific screens
│       ├── services               # API calls related to the feature
│       └── utils                  # Utility functions specific to the feature
├── hooks                          # Custom React Hooks
│   └── useAuth.tsx                # Authentication hook
│   └── useThemeColor.ts           # Hook for dynamic theme-aware colors
├── lib                            # Third-party library configurations/initializations
│   └── supabase.ts                # Supabase client initialization
├── services                       # General API services (not tied to a specific feature)
├── store/                #Zustand stores
└── supabase                       # Supabase related configurations and definitions
    └── constants.ts               # Supabase-specific constants
    └── types.ts               # Supabase-specific types
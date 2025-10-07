# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npx expo start

# Platform-specific development
npx expo start --android    # Android development
npx expo start --ios        # iOS development  
npx expo start --web 

# Code quality
npm run lint       # Run ESLint

# Testing
maestro test maestro/flows/                    # Run all E2E tests
maestro test maestro/flows/01-app-launch.yaml  # Run specific test

# Reset project (clean setup)
npm run reset-project
```

## Tech Stack & Architecture

**Frontend**: Expo React Native with TypeScript  
**Backend**: Supabase (PostgreSQL)  
**State Management**: React Query for server state, Zustand for client state  
**Navigation**: Expo Router with file-based routing  
**Styling**: Custom themed components with light/dark mode support

## Project Structure

Uses feature-based organization in `src/_features/` with domain-specific modules:

- **auth/**: Authentication and profile creation
- **competition/**: Competition tracking and match recording
- **explore/**: Social feed and community features  
- **profile/**: User profiles, following, and social features
- **skill/**: Skill tracking and categorization
- **training/**: Training session logging

Each feature contains:
- `components/`: Feature-specific UI components
- `screens/`: Screen components
- `services/`: API calls and data fetching
- `hooks/`: Feature-specific React hooks

## Key Conventions

**Import Paths**: Use `@/src` alias for all imports from src directory

**Component Architecture**: 
- Atoms in `src/components/ui/atoms/` (ThemedText, ThemedButton, ThemedView)
- Molecules in `src/components/ui/molecules/` (complex components)
- Layout components in `src/components/layout/`

**Theming**:
- All colors defined in `src/constants/Colors.ts`
- Use `useThemeColor` hook for theme-aware styling
- Prefer themed components (ThemedText, ThemedView, ThemedButton)

**Supabase Integration**:
- Types auto-generated in `src/supabase/types.ts` - do not modify manually
- Update types with: `npx supabase gen types typescript --linked > src/supabase/types.ts`
- Constants and enums in `src/supabase/constants.ts`
- Client configured in `src/lib/supabase.ts`
- Utilize default Supabase features such as auto UUID

**State Management**:
- Zustand stores in `src/stores/` for client-side state
- React Query for server state management and caching

## Navigation Structure

File-based routing with Expo Router:
- `(auth)/`: Unauthenticated routes (login, signup)
- `(protected)/`: Authenticated routes
  - `(tabs)/`: Main tab navigation
  - `(modal)/`: Modal screens for creation flows
  - `profile/`: Dynamic profile routes

## Testing & Test-Driven Development

Uses Maestro for React Native E2E testing. **See `maestro/CLAUDE.md` for comprehensive testing guidance.**

### TestID-First Development

**ALWAYS** add testIDs to interactive components during development:

```tsx
// ✅ Required for all buttons
<ThemedButton
  title="Save"
  onPress={handleSave}
  testID="save-training-button"  // for testing
/>

// ✅ Required for all form inputs
<TextInput
  placeholder="Enter title"
  value={title}
  onChangeText={setTitle}
  testID="title-input"  // for testing
/>

```

### TestID Naming Convention
- Use `kebab-case`: `add-activity-button`, `title-input`
- Be descriptive: `{action}-{target}-{type}`
- Follow patterns in `maestro/CLAUDE.md`

## Visual Development

### Design Principles
- Comprehensive design checklist in `docs/design-principles.md`
- Brand style guide in `docs/style-guide.md`
- When making visual (front-end, UI/UX) changes, always refer to these files for guidance

### Quick Visual Check
IMMEDIATELY after implementing any front-end change:
1. **Identify what changed** - Review the modified components/pages
2. **Navigate to affected pages** - Use Maestro MCP tools to navigate and test changed views
3. **Verify design compliance** - Compare against `docs/design-principles.md` and `docs/style-guide.md`
4. **Validate feature implementation** - Ensure the change fulfills the user's specific request
5. **Check acceptance criteria** - Review any provided context files or requirements
6. **Capture evidence** - Take full page screenshot of each changed view
7. **Check for errors** - Use `mcp__maestro__inspect_view_hierarchy` and console output

This verification ensures changes meet design standards and user requirements.

### Comprehensive Design Review
Invoke the `design-review` agent for thorough design validation when:
- Completing significant UI/UX features
- Before finalizing PRs with visual changes
- Needing comprehensive accessibility and responsiveness testing

### Maestro Testing Integration
When implementing new features or fixing bugs:
1. **Run existing tests** - Ensure `maestro test maestro/flows/` passes
2. **Create new tests** - Add test coverage for new functionality
3. **Update test documentation** - Keep `maestro/README.md` current

## Database Schema

BJJ-focused schema with:
- User profiles with belt ranks and BJJ type preferences
- Skills and categories for technique tracking  
- Training sessions and competition matches
- Social features (following, posts)

## Documents
- PRD and other relevant documents are located at `docs/`
- Create and update the document as necessary and notify me

## GitHub Repository
- Repository: `DuLoops/BeJiuJitsu`
- Current branch: `sprint2`
- Use GitHub CLI (`gh`) for repository operations
- use uuid from react-native-get-random-values package
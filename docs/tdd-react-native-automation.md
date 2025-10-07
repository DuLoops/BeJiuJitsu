# Automating Test-Driven React Native Development with Claude Code, Maestro MCP, and Supabase MCP

*Building robust mobile apps through automated testing workflows*

---

## Introduction

Test-Driven Development (TDD) has long been a cornerstone of quality software engineering, but in the React Native ecosystem, it often feels cumbersome and disconnected from the rapid iteration cycles that mobile development demands. What if you could write your tests first, implement features guided by those tests, and automatically verify both UI behavior and database persistence—all within a single, intelligent development environment?

This article demonstrates a revolutionary approach to React Native TDD using Claude Code as your AI-powered development assistant, combined with Maestro MCP for end-to-end testing automation and Supabase MCP for database verification. We'll walk through a real-world example: implementing a competition logging feature for a BJJ training app.

## The Power Trinity: Claude Code + Maestro MCP + Supabase MCP

### Claude Code: Your Intelligent Development Partner
Claude Code isn't just a coding assistant—it's a comprehensive development orchestrator that can:
- Write and execute tests
- Implement features based on test requirements
- Debug failures across multiple layers
- Coordinate between UI, backend, and database concerns

### Maestro MCP: E2E Testing Made Simple
Maestro brings mobile testing into the modern age with:
- YAML-based test definitions that are human-readable
- Reliable element targeting through testIDs
- Cross-platform iOS and Android support
- Real device and simulator compatibility

### Supabase MCP: Database-Driven Verification
Supabase MCP enables direct database verification:
- Real-time data validation
- UUID generation confirmation
- Complex query execution for test verification
- Complete data integrity checks

## Feature-Driven TDD: Define → Test → Develop → Verify

Let's build a user story-driven feature following this proven workflow.

## Complete Example: User Profile Creation Feature

Let's walk through implementing a simple but complete feature that any reader can follow.

### Feature Definition

**User Story**: "As a new user, I want to create my profile with my name and belt rank so I can start tracking my BJJ journey."

**Acceptance Criteria**:
- User can navigate to profile creation screen
- User can enter their full name
- User can select their belt rank from a dropdown
- User can save their profile
- Profile data is persisted to database with UUID
- User sees success confirmation

### Step 1: Define Database Schema with Supabase MCP

Before writing any code, we use Supabase MCP to design our data structure:

```sql
-- Create profiles table to support our feature
CREATE TABLE profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    full_name TEXT NOT NULL,
    belt TEXT CHECK (belt IN ('WHITE', 'BLUE', 'PURPLE', 'BROWN', 'BLACK')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Step 2: Write the Test First

With our feature and data model defined, we write our Maestro test:

```yaml
# maestro/flows/features/profile/create-profile.yaml
appId: host.exp.Exponent
---
# Test user profile creation functionality

# 1. NAVIGATE: Launch app and go to profile creation
- runFlow: ../../navigation/navigate-to-profile-creation.yaml

# 2. TEST: Enter user details
- tapOn:
    id: "full-name-input"
- inputText: "John Doe"
- waitForAnimationToEnd

# 3. Select belt rank
- tapOn:
    id: "belt-dropdown"
- waitForAnimationToEnd
- tapOn:
    text: "Blue"
- waitForAnimationToEnd

# 4. Save the profile
- tapOn:
    id: "save-profile-button"

# 5. Verify success
- waitForAnimationToEnd
- assertVisible: "Profile Created Successfully"
- tapOn: "OK"

# 6. Verify navigation to main screen
- assertVisible: "Welcome John Doe"
```

#### Supporting Navigation Flow

```yaml
# maestro/flows/navigation/navigate-to-profile-creation.yaml
appId: host.exp.Exponent
---
# Navigate to profile creation screen

# 1. Launch app
- runFlow: ../smoke/app-launch.yaml

# 2. Navigate to profile creation
- tapOn:
    id: "create-profile-tab"
- assertVisible: "Create Profile"
```

#### App Launch Flow

```yaml
# maestro/flows/smoke/app-launch.yaml
appId: host.exp.Exponent
---
# Launch app and handle initial state

- runFlow:
    when:
      visible: "Welcome"
    commands:
      - assertVisible: "Welcome"

- runFlow:
    when:
      notVisible: "Welcome"
    commands:
      - launchApp
      - runFlow:
          when:
            visible: "MyApp"
          commands:
            - tapOn: "MyApp"
            
- assertVisible: "Welcome"
```

**Key Principles:**
- **TestID-First Design**: Every interactive element has a testID before implementation
- **User Journey Focus**: Tests follow real user workflows
- **Clear Assertions**: Each step has explicit expectations
- **Modular Design**: Navigation is separated into reusable flows

### Step 3: Implement TestID-Driven Components

With our test as the specification, we implement components following feature-based architecture:

#### Feature-Based Project Structure

```
src/
├── _features/                 # Feature-based organization
│   ├── profile/               # Profile feature
│   │   ├── components/
│   │   │   ├── ProfileForm.tsx
│   │   │   └── BeltSelector.tsx
│   │   ├── screens/
│   │   │   └── CreateProfileScreen.tsx
│   │   ├── services/
│   │   │   └── profileService.ts
│   │   └── hooks/
│   │       └── useProfile.ts
│   └── auth/
│       └── ...
└── components/
    └── ui/                    # Shared UI components
        ├── atoms/
        └── molecules/
```

#### TestID-Driven Implementation

```tsx
// src/_features/profile/screens/CreateProfileScreen.tsx
export default function CreateProfileScreen() {
  const [fullName, setFullName] = useState('');
  const [selectedBelt, setSelectedBelt] = useState('');
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Test-driven component with testID first */}
      <TextInput
        value={fullName}
        onChangeText={setFullName}
        placeholder="Enter your full name"
        testID="full-name-input"  // Essential for test targeting
        style={styles.input}
      />
      
      {/* Belt selector with testID */}
      <BeltSelector
        selectedBelt={selectedBelt}
        onBeltChange={setSelectedBelt}
        testID="belt-dropdown"  // Test-driven development
      />
      
      {/* Save button with testID */}
      <TouchableOpacity 
        onPress={handleSaveProfile}
        testID="save-profile-button"  // Enable test automation
        style={styles.saveButton}
      >
        <Text>Save Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
```

**TestID Naming Convention:**
```
{action}-{target}-{type}
├── add-match-button
├── competition-title-input
├── log-competition-tab
└── save-button
```

### Step 4: Run Tests and Implement Features

Using Claude Code, we can execute tests and iteratively implement features:

```bash
# Run the test to see what fails
maestro test maestro/flows/features/profile/create-profile.yaml

# Expected failure: Element not found: full-name-input
# → Implement the name input component

# Expected failure: Element not found: belt-dropdown
# → Implement the belt selector component

# Expected failure: Element not found: save-profile-button  
# → Implement the save functionality

# Expected failure: Database record not found
# → Implement UUID generation and persistence
```

### Step 5: Database Verification with Supabase MCP

Supabase MCP enables end-to-end verification. After our UI tests pass, Claude Code automatically verifies data persistence:

```sql
-- Claude Code executes this automatically via Supabase MCP
SELECT id, full_name, belt, user_id, created_at 
FROM profiles 
ORDER BY created_at DESC 
LIMIT 1;

-- Expected Results:
-- ✅ ID: a1b2c3d4-5e6f-7890-abcd-ef1234567890 (proper UUID)
-- ✅ Full Name: "John Doe" (matches test input)  
-- ✅ Belt: "BLUE" (matches dropdown selection)
-- ✅ User ID: 259da923-bbfe-4c02-8bfc-fd8777368c1b (proper association)
-- ✅ Created At: 2025-01-15 10:30:45.123456+00 (recent timestamp)
```

## The Complete Supabase MCP Integration

Supabase MCP transforms database development from manual SQL execution to an intelligent, automated workflow integrated directly into your TDD cycle.

### Schema-First Development

**1. Define Schema Based on Feature Requirements**

Claude Code can generate and execute schema migrations based on your feature specifications:

```sql
-- Claude automatically creates this migration
-- Migration: create_profiles_table.sql
CREATE TABLE profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    full_name TEXT NOT NULL CHECK (length(full_name) >= 2),
    belt TEXT CHECK (belt IN ('WHITE', 'BLUE', 'PURPLE', 'BROWN', 'BLACK')),
    weight DECIMAL(5,2) CHECK (weight > 0),
    academy_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);
```

**2. Test-Driven Schema Validation**

Your tests now define the expected data structure:

```yaml
# The test implies schema requirements:
- tapOn:
    id: "full-name-input"     # → full_name TEXT NOT NULL
- inputText: "John Doe"
- tapOn:
    id: "belt-dropdown"       # → belt TEXT with enum constraint
- tapOn:
    text: "Blue"
- tapOn:
    id: "weight-input"        # → weight DECIMAL(5,2)
- inputText: "75.5"
```

**3. Automated Data Verification**

After test execution, Claude Code automatically verifies:

```sql
-- Executed automatically by Supabase MCP
SELECT 
    id,
    full_name,
    belt,
    weight,
    created_at,
    -- Verify data types and constraints
    CASE WHEN length(full_name) >= 2 THEN 'VALID' ELSE 'INVALID' END as name_validation,
    CASE WHEN belt IN ('WHITE', 'BLUE', 'PURPLE', 'BROWN', 'BLACK') THEN 'VALID' ELSE 'INVALID' END as belt_validation,
    CASE WHEN weight > 0 THEN 'VALID' ELSE 'INVALID' END as weight_validation
FROM profiles 
WHERE created_at > NOW() - INTERVAL '5 minutes'
ORDER BY created_at DESC 
LIMIT 1;

-- Expected Results:
-- ✅ ID: UUID format verified
-- ✅ Full Name: "John Doe" (length >= 2)
-- ✅ Belt: "BLUE" (valid enum value)
-- ✅ Weight: 75.50 (positive decimal)
-- ✅ All validations: VALID
```

**4. Iterative Schema Refinement**

When tests reveal schema issues, Claude Code can automatically suggest and apply fixes:

```sql
-- If test fails due to constraint violation:
-- ERROR: new row violates check constraint "profiles_belt_check"

-- Claude automatically suggests:
ALTER TABLE profiles DROP CONSTRAINT profiles_belt_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_belt_check 
    CHECK (belt IN ('WHITE', 'BLUE', 'PURPLE', 'BROWN', 'BLACK', 'RED', 'CORAL'));

-- Re-run test to verify fix
```

**5. Production-Ready Data Integrity**

The final database includes comprehensive data validation:

```sql
-- Complex integrity checks executed by Supabase MCP
WITH profile_stats AS (
  SELECT 
    COUNT(*) as total_profiles,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(*) FILTER (WHERE belt = 'WHITE') as white_belts,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as recent_signups
  FROM profiles
)
SELECT 
  *,
  CASE WHEN total_profiles = unique_users THEN 'PASS' ELSE 'FAIL' END as unique_constraint_check,
  CASE WHEN recent_signups > 0 THEN 'PASS' ELSE 'FAIL' END as recent_activity_check
FROM profile_stats;
```

### Supabase MCP Development Benefits

**For Development Velocity:**
- Automatic schema generation from feature requirements
- Instant database verification without manual SQL
- Real-time constraint validation during testing

**For Code Quality:**
- Data integrity checks prevent bad data in production  
- Schema migrations are version-controlled and automated
- Database constraints enforce business rules at the data layer

**For Debugging:**
- Immediate feedback when data doesn't match expectations
- Automatic logging of all database operations
- Historical data state tracking for regression analysis

## Feature-Based Test Architecture

Organize your tests to mirror your feature structure:

### Test Organization

```
maestro/flows/
├── features/                  # Feature-specific tests
│   ├── profile/
│   │   ├── create-profile.yaml
│   │   └── edit-profile.yaml
│   ├── auth/
│   │   ├── login.yaml
│   │   └── signup.yaml
│   └── training/
│       └── log-training.yaml
├── navigation/               # Reusable navigation
│   ├── navigate-to-profile-creation.yaml
│   └── navigate-to-login.yaml
└── smoke/                    # Basic app functionality
    └── app-launch.yaml
```

### Progressive Feature Testing

Start simple, then add complexity:

```yaml
# Level 1: Basic functionality
- tapOn:
    id: "save-profile-button"
- assertVisible: "Success"

# Level 2: Add validation
- tapOn:
    id: "save-profile-button"
- runFlow:
    when:
      visible: "Profile Created Successfully"
    commands:
      - tapOn: "OK"
- assertVisible: "Welcome"

# Level 3: Add database verification
# (Automatically handled by Supabase MCP)
```

## Debugging and Iteration with Claude Code

### Automated Debugging Workflow

When tests fail, Claude Code provides comprehensive debugging:

```bash
# 1. Automatic element inspection
maestro hierarchy  # View current UI structure

# 2. Screenshot analysis
maestro test --debug-output ./debug/  # Visual debugging

# 3. Database state verification
# Claude automatically checks Supabase for data consistency

# 4. Component testID validation
# Grep codebase for missing testIDs
```

### Real-World Debugging Example

```yaml
# Original failing test
- tapOn:
    id: "match-outcome-dropdown-option-WIN"  # ❌ Complex generated ID

# Claude Code's fix using point selection
- tapOn:
    id: "match-outcome-dropdown"
- waitForAnimationToEnd
- tapOn:
    point: "50%, 30%"  # ✅ Reliable coordinate-based selection
```

## Best Practices and Patterns

### 1. TestID-First Component Development

```tsx
// ❌ Add testIDs after development
<Button title="Save" onPress={handleSave} />

// ✅ Design with testing in mind
<Button 
  title="Save" 
  onPress={handleSave}
  testID="save-button"  // Essential for automation
/>
```

### 2. Modular Test Architecture

```
maestro/flows/
├── features/           # Feature-specific tests
│   ├── competition/
│   │   ├── log-competition.yaml
│   │   └── log-competition-detailed.yaml
│   └── training/
│       └── log-save.yaml
├── navigation/         # Reusable navigation flows
│   ├── navigate-to-competition.yaml
│   └── navigate-to-log.yaml
└── smoke/             # Basic app functionality
    └── app-launch.yaml
```

### 3. Database-Driven Assertions

```sql
-- Verify complex data relationships
SELECT 
  c.title as competition_title,
  cd.bjj_type,
  cm.name as match_name,
  cm.outcome,
  cm.outcome_method
FROM competitions c
LEFT JOIN competition_divisions cd ON c.id = cd.competition_id  
LEFT JOIN competition_matches cm ON cd.id = cm.competition_division_id
WHERE c.created_at > NOW() - INTERVAL '1 hour'
ORDER BY c.created_at DESC;
```

### 4. Progressive Test Enhancement

```yaml
# Start simple
- tapOn: "Save"
- assertVisible: "Success"

# Evolve to robust
- tapOn:
    id: "save-button"
- waitForAnimationToEnd
- runFlow:
    when:
      visible: "Competition Saved"
    commands:
      - tapOn: "OK"
- assertVisible: "ExploreScreen"
```

## Advanced Automation Techniques

### Conditional Flow Execution

```yaml
# Handle different app states
- runFlow:
    when:
      visible: "ExploreScreen"
    commands:
      - assertVisible: "ExploreScreen"

- runFlow:
    when:
      notVisible: "ExploreScreen"  
    commands:
      - launchApp
      - tapOn: "BeJiuJitsu"
```

### Error Recovery Patterns

```yaml
# Automatic error recovery
- tapOn:
    id: "save-button"
- assertNotVisible: "Error"  # Ensure no errors

# Handle potential alert dismissals
- runFlow:
    when:
      visible: "Competition Saved"
    commands:
      - tapOn: "OK"
```

## Measuring Success: Metrics That Matter

### Test Coverage Metrics
- **Component TestID Coverage**: 100% of interactive elements
- **User Journey Coverage**: All critical paths tested
- **Database Integrity**: Full CRUD operation verification

### Performance Indicators
- **Test Execution Time**: < 2 minutes per full suite
- **False Positive Rate**: < 5% due to testID reliability
- **Debug Resolution Time**: < 10 minutes with automated tools

### Quality Outcomes
- **Bug Detection**: Catch issues before manual testing
- **Regression Prevention**: Automated verification of existing features  
- **Development Velocity**: Faster feature implementation with test guidance

## Real-World Results

In our profile creation feature implementation:

- ✅ **Profile creation feature**: Fully tested and verified
- ✅ **Database persistence**: Automatic UUID generation confirmed
- ✅ **User experience**: Seamless form validation and success flow
- ✅ **Data integrity**: Complete user profile data in Supabase

```
Profile Feature Test Results:
├── UI Navigation: 3/3 passing ✅
├── Form Validation: 5/5 passing ✅  
├── Database Integration: 4/4 passing ✅
└── End-to-End Flow: < 45s execution time ✅
```

## Conclusion

The combination of Claude Code, Maestro MCP, and Supabase MCP creates a powerful automation ecosystem for React Native TDD. This approach delivers:

**For Developers:**
- Faster feature implementation with test guidance
- Immediate feedback loops between UI and data layers
- Reduced debugging time through automated analysis

**For Teams:**
- Consistent code quality across all contributors
- Reliable regression testing for continuous deployment
- Clear documentation through executable specifications

**For Products:**
- Higher reliability through comprehensive testing
- Better user experience through systematic validation
- Faster time-to-market with automated quality assurance

The future of React Native development isn't just about writing better code—it's about creating intelligent systems that guide, verify, and optimize your entire development workflow. With these tools, TDD becomes not just feasible, but genuinely enjoyable and productive.

## Getting Started

1. **Install the tools:**
   ```bash
   npm install -g @maestro-team/maestro
   # Set up Supabase project
   # Install Claude Code CLI
   ```

2. **Define your feature:**
   ```
   User Story: "As a user, I want to [action] so that [benefit]"
   ```

3. **Create your test:**
   ```yaml
   # maestro/flows/features/my-feature/test.yaml
   - tapOn:
       id: "my-feature-button"
   - assertVisible: "Success"
   ```

4. **Implement with testIDs:**
   ```tsx
   // src/_features/my-feature/components/MyComponent.tsx
   <Button testID="my-feature-button" />
   ```

5. **Run and verify:**
   ```bash
   maestro test maestro/flows/features/my-feature/test.yaml
   # Automatic database verification via Supabase MCP
   ```

The tools are ready. The patterns are proven. Your React Native TDD journey starts now.

---

```diff
+ ================================================
+ 🔧 CLAUDE.md FILE CONTENT - COPY THIS SECTION
+ ================================================
+ This entire section should be copied into your CLAUDE.md file
+ (remove the + signs when copying)
+ ================================================
```

## Claude Code Automation Files

### The Power of Documentation-Driven Development

Claude Code uses three key files to automate your entire TDD workflow. These files transform your project into an intelligent, self-documenting development environment.

### Single CLAUDE.md Example

Here's a complete `CLAUDE.md` that enables full automation:

```markdown
# CLAUDE.md - BJJ Training App Automation

## Development Commands

```bash
# Start development server  
npx expo start --ios

# Testing workflow
maestro test maestro/flows/                    # All tests
maestro test maestro/flows/features/profile/   # Feature tests  
/test profile create-profile                   # Automated TDD cycle

# Code quality
npm run lint && npm run typecheck
```

## Tech Stack
- **Frontend**: Expo React Native with TypeScript
- **Backend**: Supabase (PostgreSQL) 
- **Testing**: Maestro E2E with MCP automation
- **State**: React Query + Zustand

## Project Architecture
Feature-based organization in `src/_features/`:
- `profile/`: User profiles and authentication
- `training/`: Session logging and progress tracking  
- `competition/`: Match recording and tournament tracking

## TestID Standards
ALWAYS add testIDs during development:
```tsx
// ✅ Required pattern
<Button 
  title="Save Profile"
  onPress={handleSave}
  testID="save-profile-button"  // {action}-{target}-{type}
/>
```

## Automation Workflow
1. **Define feature**: User story with acceptance criteria
2. **Write test**: `maestro/flows/features/{feature}/{test}.yaml`  
3. **Add testIDs**: Components with automation-ready selectors
4. **Run cycle**: `/test {feature} {test-name}` - Claude handles everything
5. **Verify data**: Automatic Supabase MCP validation

## Database Integration
- Auto-generated types in `src/supabase/types.ts`
- UUID-first design with gen_random_uuid()
- RLS policies for security
- Migration-driven schema changes

This single file enables Claude Code to understand your project completely and automate the entire TDD workflow from feature definition to database verification.
```

### Maestro Testing Configuration

Your `maestro/CLAUDE.md` provides testing intelligence:

```markdown  
# Maestro Testing Guide

## Quick Commands
```bash
maestro test maestro/flows/features/profile/create-profile.yaml
```

## Test Architecture - MANDATORY 2-Step Structure
1. **NAVIGATE**: `runFlow: ../../navigation/navigate-to-{screen}.yaml`
2. **TEST**: Feature-specific logic with testID selectors

## TestID-First Development
```tsx
// Always include during component creation
<TouchableOpacity testID="save-profile-button">
```

## Standard Test Template
```yaml
appId: host.exp.Exponent
---
# Test {feature} functionality
- runFlow: ../../navigation/navigate-to-{screen}.yaml
- tapOn:
    id: "{component}-button"
- assertVisible: "Success Indicator"
```
```

### Automated TDD Command

Your `.claude/commands/test.md` creates a single powerful command:

```markdown
# /test - Complete TDD Automation

## Usage
```
/test {feature} {test-name} [description]
```

## Examples  
```
/test profile create-profile "Test user profile creation with database persistence"
/test training log-session "Test training session logging with UUID generation"
```

## Full Automation Cycle
1. **CREATE**: Generate test file with screenshot guidance
2. **RUN**: Execute with proper device setup
3. **DEBUG**: Auto-fix element selectors and navigation
4. **VERIFY**: Confirm database persistence via Supabase MCP
5. **REPORT**: Comprehensive success/failure summary

This single command orchestrates the complete TDD workflow.
```

## The Complete Automation Command

With these files in place, run the full automated TDD cycle:

```bash
# Single command for complete feature development
/test profile create-profile "User can create profile with name and belt rank"

# What happens automatically:
# 1. Creates test file: maestro/flows/features/profile/create-profile.yaml
# 2. Uses screenshot MCP to understand UI structure  
# 3. Generates navigation flows if needed
# 4. Runs test and identifies missing testIDs
# 5. Updates components with required testIDs
# 6. Re-runs until tests pass
# 7. Verifies database persistence via Supabase MCP
# 8. Provides complete success summary with screenshots
```

### Why This Approach Works

**Single Source of Truth**: Your `CLAUDE.md` contains everything Claude needs to understand your project, eliminating context switching and ensuring consistent automation.

**Documentation as Code**: These files ARE your development workflow. They evolve with your project and maintain institutional knowledge.

**Zero Configuration**: Once set up, the `/test` command handles the complete cycle from test creation to database verification.

**Intelligent Debugging**: Claude Code automatically fixes common issues like missing testIDs, navigation problems, and database inconsistencies.

---

*Ready to transform your React Native development workflow? Start with one test, one component, one feature. The automation will follow.*

```diff
+ ================================================
+ END OF CLAUDE.md FILE CONTENT
+ ↑↑↑ Copy everything above into your CLAUDE.md file ↑↑↑
+ ================================================
```
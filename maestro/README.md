# Maestro E2E Tests

This directory contains Maestro end-to-end tests for the BeJiuJitsu React Native app.

## Prerequisites

1. Install Maestro CLI: `curl -Ls "https://get.maestro.dev" | bash`
2. Start your Expo development server: `npx expo start`
3. Have a simulator/emulator running or connected device

## Running Tests

### Run All Tests
```bash
maestro test maestro/flows/
```

### Run Test Categories
```bash
# Run all smoke tests
maestro test maestro/flows/smoke/

# Run all feature tests
maestro test maestro/flows/features/

# Run specific feature tests
maestro test maestro/flows/features/auth/
maestro test maestro/flows/features/training/
```

### Run Individual Tests
```bash
maestro test maestro/flows/smoke/01-app-launch.yaml
maestro test maestro/flows/features/navigation/02-navigate-progress.yaml
maestro test maestro/flows/features/training/training-log-save.yaml
```

### Run with Specific Device
```bash
maestro test --device="iPhone 16 Pro" maestro/flows/
```

## Test Architecture

**All tests must follow this 2-step order of operations:**

1. **NAVIGATE**: Launch app and navigate to required screens within the app  
2. **TEST**: Execute actual test logic for the feature

## Test Organization

### Smoke Tests (`smoke/`)
- **app-launch.yaml**: Launches Expo Go, handles BeJiuJitsu selection, verifies Home screen

### Navigation Flows (`navigation/`)
Navigation utilities that use smoke/app-launch first:
- **navigate-to-log.yaml**: Launch app and navigate to Log screen
- **navigate-to-progress.yaml**: Launch app and navigate to Progress screen  
- **navigate-to-explore.yaml**: Launch app and navigate to Explore screen

### Feature Tests (`features/`)

#### Training (`features/training/`)
- **log-save.yaml**: Test training log creation and saving (includes UUID generation)

#### Competition (`features/competition/`)
- Competition-related test flows

#### Authentication (`features/auth/`)
- **login.yaml**: Login flow testing
- **signup.yaml**: User registration testing
- **profile-creation.yaml**: Profile setup testing

#### Profile (`features/profile/`)
- **view-profile.yaml**: Profile viewing functionality
- **edit-profile.yaml**: Profile editing functionality
- **social-features.yaml**: Following/followers functionality

## Naming Convention

**File Names**: Use kebab-case with descriptive action-based names
- ✅ `log-save.yaml` (action-based)
- ❌ `training-log-save.yaml` (redundant with folder structure)
- ✅ `navigate-to-log.yaml` (specific navigation action)
- ✅ `app-launch.yaml` (clear purpose)

**Structure**: `{action}-{target}.yaml` or `{feature}.yaml`
- Navigation: `navigate-to-{screen}.yaml`
- Tests: `{action}.yaml` or `{feature}.yaml`
- Smoke: `{purpose}.yaml`

## Using Test Flows

**Standard 2-step pattern for all feature tests:**

```yaml
appId: host.exp.Exponent
---
# 1. NAVIGATE: Launch app and go to required screens
- runFlow: ../../navigation/navigate-to-log.yaml

# 2. TEST: Execute feature-specific logic
- tapOn:
    id: "add-activity-button"
- assertVisible: "Wrestling"
```

## Writing New Tests

1. Create new `.yaml` files in the appropriate feature directory:
   - `maestro/flows/navigation/` for navigation utilities
   - `maestro/flows/features/{feature-name}/` for feature-specific tests
2. Start with app configuration:
   ```yaml
   appId: host.exp.Exponent
   ---
   ```
3. Use `maestro --help` for command reference
4. Test on actual device/simulator before committing

## TestID Best Practices

For reliable and maintainable tests, use testIDs instead of text selectors:

### Component Development
- Add `testID` prop to all interactive components (buttons, inputs, dropdowns)
- Use `kebab-case` format: `add-activity-button`, `create-tab`, `training-type-dropdown`
- Ensure ThemedButton and other custom components support testID prop

### Test Writing
```yaml
# ✅ Preferred - Reliable testID selector
- tapOn:
    id: "add-activity-button"

# ❌ Avoid - Text can change and break tests  
- tapOn: "Add Activity"
```

### Common TestID Patterns
- Buttons: `{action}-{target}-button` (e.g., `save-training-button`)
- Tabs: `{screen}-tab` (e.g., `explore-tab`, `create-tab`)
- Inputs: `{field}-input` (e.g., `title-input`, `notes-input`) 
- Dropdowns: `{field}-dropdown` (e.g., `training-type-dropdown`)

## Tips

- Always test on the target platform (iOS/Android)
- Use descriptive test names and comments
- Add assertions to verify expected UI state
- Keep tests focused and atomic when possible
- Prefer testID selectors over text for element targeting
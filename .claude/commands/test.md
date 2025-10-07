# Test Command

Create, run, and debug Maestro E2E tests for any feature/function. This single command handles the complete testing workflow.

## Usage

```
/test {feature} {test_name} [description]
```

**Parameters:**
- `{feature}`: Feature directory (auth, training, competition, profile, etc.)
- `{test_name}`: Test name in kebab-case (login, log-save, edit-profile, etc.)
- `[description]`: Optional description of what the test should do

## Examples

```
/test training log-save "Test training log creation with UUID generation"
/test auth login "Test user login flow with valid credentials" 
/test profile edit-profile "Test profile editing functionality"
/test competition match-record "Test competition match recording"
```

## What this command does

### 1. **CREATE** (if test doesn't exist)
- Generates new test file
- Utilize screenshot mcp in maestro to generate test step-by-step
- Uses unified naming convention (kebab-case)
- Places in correct feature directory: `maestro/flows/features/{feature}/{test_name}.yaml`
- Follows mandatory test architecture

### 2. **RUN**
- Ensures iOS simulator and Maestro are ready
- Executes test using proper device connection
- Monitors test execution and captures results

### 3. **DEBUG** (if test fails)
- **Element Issues**: Inspects view hierarchy to find correct selectors
- **Navigation Issues**: Verifies screen flow and updates navigation paths
- **App Launch Issues**: Checks Expo server and BeJiuJitsu app state
- **Assertion Failures**: Compares expected vs actual UI state
- **UUID/Crypto Issues**: Fixes database and service layer problems

### 4. **FIX & RETRY**
- Applies necessary fixes to test files
- Updates navigation flows if needed
- Re-runs test until it passes or identifies blocking issues

### 5. **REPORT**
- Provides clear success/failure summary
- Captures screenshots for visual verification
- Updates documentation if new test was created

## Debugging Features

- **Smart Element Detection**: Uses `mcp__maestro__inspect_view_hierarchy` for accurate selectors
- **Visual Debugging**: Screenshots at failure points
- **Service Layer Fixes**: Handles UUID generation and database issues
- **Auto-correction**: Fixes common test patterns and retries automatically
- **Architecture Compliance**: Ensures all tests follow the 3-step structure

## File Locations

- **Tests**: `maestro/flows/features/{feature}/{test_name}.yaml`
- **Navigation**: `maestro/flows/navigation/navigate-to-{screen}.yaml`
- **Smoke**: `maestro/flows/smoke/app-launch.yaml`

This command streamlines the entire testing workflow into a single, powerful tool that handles everything from creation to successful execution.
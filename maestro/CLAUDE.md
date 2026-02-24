# Maestro Testing Guide for DoJits

This file provides comprehensive testing guidance for Claude Code when working with Maestro E2E tests.

## Quick Commands

```bash
# Testing
maestro test maestro/flows/                    # Run all E2E tests
maestro test maestro/flows/features/training/  # Run training tests
maestro test maestro/flows/features/training/log-save.yaml  # Run specific test

# Development Server (required for testing)
npx expo start --ios        # iOS testing
npx expo start --android    # Android testing
```

## Test Architecture

**All tests must follow this 2-step order of operations:**

1. **NAVIGATE**: `../../navigation/{flow}.yaml` - Launch app and navigate to required screens
2. **TEST**: Actual test logic for the feature

### Test Flow Components

- **Smoke test**: `smoke/app-launch.yaml` - Handles Expo Go launcher, DoJits selection, and Home screen verification
- **Navigation flows**: `navigation/` - utilities that use smoke/app-launch first
  - `navigate-to-log.yaml`: Launch app and navigate to Log screen
  - `navigate-to-progress.yaml`: Launch app and navigate to Progress screen
  - `navigate-to-explore.yaml`: Launch app and navigate to Explore screen

### Test Standards

- **2-step structure**: Every feature test must include navigate, then test steps
- **Clear separation**: Navigation handles app launch and page flow, Tests handle feature logic
- **Feature-based organization**: Tests go in `maestro/flows/features/{feature-name}/`
- **TestID-first approach**: Always use testIDs for element targeting

## TestID-Driven Development

### For Component Development

When creating or modifying components, **ALWAYS** add testIDs to interactive elements:

#### Buttons
```tsx
<ThemedButton
  title="Add Activity"
  onPress={handleAddActivity}
  testID="add-activity-button"  // Required!
/>
```

#### Form Inputs
```tsx
<TextInput
  placeholder="Enter title"
  value={title}
  onChangeText={setTitle}
  testID="title-input"  // Required!
/>
```

#### Dropdowns/Selectors
```tsx
<DropdownPicker
  options={options}
  selectedValue={value}
  onValueChange={onChange}
  testID="training-type-dropdown"  // Required!
/>
```

#### Tab Navigation
```tsx
<Tabs.Screen
  name="explore"
  options={{
    tabBarIcon: ({ focused }) => (
      <Icon name="explore" testID="explore-tab" />  // Required!
    ),
  }}
/>
```

### TestID Naming Conventions

Use `kebab-case` with descriptive patterns:

- **Buttons**: `{action}-{target}-button`
  - `add-activity-button`, `save-training-button`, `delete-activity-button`
- **Inputs**: `{field}-input`
  - `title-input`, `notes-input`, `duration-input`
- **Dropdowns**: `{field}-dropdown`
  - `training-type-dropdown`, `skill-category-dropdown`
- **Tabs**: `{screen}-tab`
  - `explore-tab`, `create-tab`, `progress-tab`
- **Navigation**: `{action}-{target}-link`
  - `view-profile-link`, `edit-settings-link`

### Test Writing with TestIDs

Always prefer testID selectors over text for reliability:

```yaml
#  PREFERRED - Reliable testID selector
- tapOn:
    id: "add-activity-button"

#  PREFERRED - Form input with testID
- tapOn:
    id: "title-input"
- inputText: "Wrestling Session"

# L AVOID - Text selectors are fragile
- tapOn: "Add Activity"
- tapOn: "Enter title here..."
```



## Test-Driven Development Workflow

### 1. Write Test First (TDD)
```yaml
# Create test file: maestro/flows/features/training/log-save.yaml
- runFlow: ../../navigation/navigate-to-log.yaml
- tapOn:
    id: "add-activity-button"  # Will fail initially
- tapOn:
    id: "wrestling-option"
- assertVisible: "Training Records"
```

### 2. Add TestIDs to Components
```tsx
// Add testID to component
<ThemedButton
  title="Add Activity" 
  onPress={addActivity}
  testID="add-activity-button"  // Makes test pass
/>
```

### 3. Run and Iterate
```bash
maestro test maestro/flows/features/training/log-save.yaml
```

## Standard Test Template

```yaml
appId: host.exp.Exponent
---
# Test {feature} {action} functionality
# {description}

# 1. NAVIGATE: Launch app and go to required screens
- runFlow: ../../navigation/navigate-to-{screen}.yaml

# 2. TEST: Execute feature-specific logic
- tapOn:
    id: "{component}-button"
- assertVisible: "Expected Result"
- tapOn:
    id: "{field}-input" 
- inputText: "Test Data"
- tapOn:
    id: "save-button"
- assertNotVisible: "Error Message"
- assertVisible: "Success Indicator"
```

- Utilize point selection for dropdown.
```yaml
- tapOn:
    point: "50%, 50%" # Adjust the coordinates as needed
```

## Component TestID Checklist

When creating/modifying components, ensure:

- [ ] **TestIDs follow naming conventions** (kebab-case)
- [ ] **TestIDs are descriptive** and action-oriented

## Testing Integration Points

### Navigation Testing  
```yaml
- tapOn:
    id: "explore-tab"
- assertVisible: "ExploreScreen"
- tapOn:
    id: "create-tab" 
- tapOn:
    id: "log-option"
- assertVisible: "Log"
```

## Debugging Failed Tests

### Common Issues & Solutions

1. **Element not found by testID**
   - Verify testID exists in component
   - Check testID spelling/casing
   - Ensure component is rendered

2. **Text assertions failing**
   - Use `inspect_view_hierarchy` to see actual text
   - Check for dynamic content
   - Verify screen state

3. **Navigation issues**
   - Ensure smoke test passes first
   - Check navigation flow order
   - Verify screen mounting

### Debug Commands
```bash
# View current screen hierarchy
maestro hierarchy

# Take screenshot for visual debugging  
maestro screenshot debug.png

# Run with verbose output
maestro test --verbose {test-file}
```

## Best Practices

1. **TestID First**: Add testIDs during component development, not after
2. **Descriptive IDs**: Make testIDs self-documenting
3. **Consistent Patterns**: Follow naming conventions religiously  
4. **Test Early**: Write tests alongside feature development
5. **Atomic Tests**: Keep tests focused on single functionality
6. **Reliable Assertions**: Use stable, predictable assertions

This approach enables true test-driven development where tests guide component structure and ensure long-term maintainability.
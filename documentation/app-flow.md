# BeJiuJitsu App Flow Document

## Application Flow Overview

This document outlines the primary user flows in the BeJiuJitsu app, a platform for tracking and sharing Brazilian Jiu-Jitsu progress.

### User Journey Map

```
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  Onboarding   │────▶│  Home Feed    │────▶│     Create    │
└───────────────┘     └───────────────┘     └───────────────┘
                             │                     │
                             ▼                     ▼
                      ┌───────────────┐     ┌───────────────┐
                      │    Profile    │◀───▶│  Skill Detail │
                      └───────────────┘     └───────────────┘
```

## 1. Authentication & Onboarding

### First-Time User Flow
1. Landing screen with app introduction
2. Sign up options (email/password, Google, Apple)
3. Create account form
4. Profile creation:
   - Username selection
   - Belt rank selection
   - Goals definition (optional)
   - Academy information (optional)
5. Redirect to Home Feed

### Returning User Flow
1. Sign in screen
2. Authentication
3. Redirect to Home Feed

## 2. Home Feed Flow

The Home Feed is the primary entry point for users to view skill-related content from the community.

### Feed Content
- Skill posts from followed users
- Trending techniques
- Recently added community skills
- Training and competition highlights

### Interactions
- Skill card displays:
  - Technique name and category
  - Creator username and belt rank
  - Preview of sequence steps or notes
  - Success metrics if shared
- Pressing a skill card navigates to the Skill Detail screen
- Pull to refresh for new content
- Filter button to sort by categories, popularity, or recency
- Search button for finding specific skills or users

### Navigation
- Bottom tab bar with Home, Create, and Profile options
- Header with app logo and search icon

## 3. Create Flow

The Create flow allows users to log new entries in three categories: Skills, Training, or Competition.

### Create Menu
1. User taps "+" icon in tab bar
2. Modal menu appears with three options:
   - Create Skill
   - Log Training
   - Record Competition

### Create Skill Flow
1. Choose skill category or create new one
2. Select predefined skill or enter custom skill name
3. Add notes about the technique
4. Create sequence steps:
   - Add step intention (what you're trying to accomplish)
   - Add detailed steps for execution
   - Option to add more steps
5. Video upload (future implementation)
6. Save skill to personal collection
7. Option to share with community

### Log Training Flow
1. Date selection (defaults to current date)
2. Duration input
3. Type selection (Gi/No-Gi)
4. Intensity selection
5. Skills used during training (select from collection)
6. Notes field for additional information
7. Save training record

### Record Competition Flow
1. Competition details:
   - Name
   - Date
   - Location
   - Division/Weight class
2. Match results:
   - Win/Loss count
   - Submission/Points/Decision details
3. Techniques used (select from collection)
4. Notes and reflections
5. Save competition record

## 4. Profile Flow

The Profile screen is where users can track their BJJ journey and manage their content.

### Profile Overview
- User stats section:
  - Username and belt rank
  - Training frequency
  - Competition record
  - Following/Followers count
- Calendar view of training activity
- Goals section with progress indicators
- Tabs for:
  - My Skills
  - Training Log
  - Competition Record

### My Skills Tab
- Grid/List view of all saved skills
- Filter by categories
- Sort by usage frequency, success rate, or recency
- Edit or delete skills

### Training Log Tab
- List of training sessions by date
- Statistics view (total hours, frequency, etc.)
- Filter by time period or type
- Edit or delete training records

### Competition Record Tab
- List of competitions
- Performance metrics
- Filter by results or time period
- Edit or delete competition records

### Edit Profile
- Access via settings icon
- Update personal information
- Adjust privacy settings
- Manage notification preferences

## 5. Skill Detail Flow

The Skill Detail screen provides comprehensive information about a specific technique.

### Viewing Own Skill
- Complete technique breakdown
- Sequence steps with detail
- Usage statistics
- Training/Competition instances where used
- Edit button
- Option to share

### Viewing Community Skill
- Technique breakdown
- Creator information
- Option to save to personal collection
- Comment section
- Like/share options

### Skill Experience Tracking
- Record usage instances
- Update success rate
- Add additional notes
- Edit previous data

## Social Interactions

### Follow Functionality
- Follow/unfollow users from profile or skill screens
- View followers/following lists
- Discover suggested practitioners

### Commenting
- Comment on shared skills
- Reply to comments
- Like comments

### Search Functionality
- Search by:
  - Skill name or category
  - Username
  - Academy
  - Tags

## Error Handling & Edge Cases

### Connectivity Issues
- Offline mode for viewing saved content
- Queue updates for sync when connection restored
- Clear error messaging

### Content Creation Failures
- Auto-save drafts
- Recovery options
- Validation feedback

### Authentication Failures
- Password reset flow
- Account recovery options
- Session expiration handling
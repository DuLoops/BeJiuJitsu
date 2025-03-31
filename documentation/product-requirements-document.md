# BeJiuJitsu - BJJ Progress Tracker PRD

## Overview
BeJiuJitsu is a mobile application designed to help Brazilian Jiu-Jitsu practitioners track their training progress, manage their skills repertoire, record competition results, and connect with the BJJ community. The app aims to create a comprehensive ecosystem for BJJ enthusiasts to improve their practice through data-driven insights and social learning.

## Target Users
- BJJ practitioners of all levels (white belt to black belt)
- BJJ instructors
- BJJ competition participants
- BJJ academies and teams

## Core Features

### 1. User Authentication & Profile Management
- Email/password authentication
- Social authentication (Google, Apple)
- User profile with:
  - Username
  - Belt rank & stripes
  - Academy affiliation
  - Weight class
  - Training goals
  - Profile picture

### 2. Skill Management
- Browse predefined BJJ skills organized by categories:
  - Takedowns
  - Passes
  - Controls
  - Submissions
  - Escapes
  - Guards
  - Sweeps
  - Systems/Concepts
- Add skills to personal collection with:
  - Notes
  - Sequence steps (detailed breakdown of technique)
  - Success metrics
  - Video reference (future implementation with Cloudinary)
- Create custom skills when needed

### 3. Training Logs
- Record training sessions with:
  - Date and duration
  - Gi or No-Gi
  - Intensity level
  - Skills practiced
  - Notes
- Calendar view of training history
- Training statistics and trends

### 4. Competition Tracking
- Log competition results:
  - Event details
  - Match records (wins/losses)
  - Performance metrics
  - Techniques used
  - Notes and reflections
- Competition statistics and performance analysis

### 5. Progress Visualization
- Calendar view of training frequency
- Skill usage and success rate visualization
- Belt progression timeline
- Custom goals tracking

### 6. Social & Community Features
- Follow other practitioners
- Activity feed with skill-related content
- Comment on shared techniques
- Search functionality by technique or practitioner
- Skill sharing capabilities

## Future Enhancements
- Video uploads for technique demonstrations via Cloudinary
- Live training partner finding
- Academy/gym finder
- Private coach-student communication
- Tournament notifications and registration
- Technique video analysis tools

## User Experience Requirements
- Intuitive navigation with minimal learning curve
- Quick entry of training sessions (<1 min)
- Seamless skill browsing and filtering
- Clean data visualization
- Smooth social interactions
- Offline functionality for core features

## Technical Considerations
- Mobile-first approach using React Native with Expo
- Backend using Node.js, Express, and Prisma with PostgreSQL
- Cloud storage for media files (Cloudinary)
- Responsive design for different device sizes
- Performance optimization for media-heavy content
- Secure authentication and data privacy

## Success Metrics
- User retention rate (30-day)
- Average weekly active sessions per user
- Number of techniques logged per user
- Session logging completion rate
- Social engagement metrics (follows, comments)
- User-reported improvement in BJJ progression
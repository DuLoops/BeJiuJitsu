## DoJits: Product Features & App Blueprint

## Overview
DoJits is a mobile application designed to help Brazilian Jiu-Jitsu practitioners track their training progress, manage their skills repertoire, record competition results, and connect with the BJJ community. The app aims to create a comprehensive ecosystem for BJJ enthusiasts to improve their practice through data-driven insights and social learning.

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


## User Personas

We are designing for four key user archetypes within the BJJ community.

### Paul, The Enthusiast 🥋
- **Belt**: White Belt
- **Bio**: 18 years old; highly enthusiastic and motivated; learns best through visual content like videos and photos rather than long texts.
- **Goal**: Learn fundamental techniques and training methods to build a solid foundation in BJJ.

### Chloe, The Social Connector 🤝
- **Belt**: Blue Belt
- **Bio**: 30 years old; socially motivated and loves being part of the BJJ community; enjoys sharing progress, connecting with training partners, and discussing techniques.
- **Goal**: Stay connected with her gym community, share her BJJ journey, and learn from peers.

### Evan, The Competitor 🥇
- **Belt**: Purple Belt
- **Bio**: 25 years old; methodical and analytical; competes frequently; dedicated to reviewing training and competition footage to improve.
- **Goal**: Use data and video analysis to track performance, identify weaknesses, and prepare strategically for competitions.

### John, The Coach 🧑‍🏫
- **Belt**: Black Belt
- **Bio**: 40 years old and a gym owner; focused on growing his gym, coaching students, and building an online community; shares instructional content and promotes events.
- **Goal**: Promote the gym, provide value to students through online resources, and create new revenue opportunities.

## App Blueprint & Navigation

The app uses a simple and intuitive bottom tab navigation system for quick access to core functions.

### Main Navigation (Bottom Tab Bar)
- **Explore**: Main content discovery screen.
- **+ Create**: Central action button to open a creation modal.
- **Progress**: User’s personal dashboard for tracking their journey.

### Screen Blueprints

#### Explore Screen
- **Layout**: Vertically-scrolling feed (similar to YouTube or Instagram Reels) featuring video and photo content.
- **Content**: Posts from followed users, gyms, and recommended content based on user interests.
- **Filtering**: Scrollable filter tags such as `Hot`, `Following`, `Fundamentals`, `Rolls`, `Mindset`, `Discussion`.
- **Interaction**: Users can like, comment, and share; tapping a user’s avatar navigates to their profile.

#### Create Modal
- **Activation**: Tapping the central “+ Create” button opens a modal overlay.
- **Actions**:
  - Record/Upload Roll
  - Post on Social
  - Log Training
  - Log Competition
  - Create/Edit Skill

#### Progress Screen
- Divided into two tabs at the top: **Log** and **Skill**.
  - **Log (default)**:
    - Training Calendar: Month view with dots indicating days with logs. Tapping a day reveals a summary.
    - Recent Activity: Chronological list of recent logs (training sessions, competition results, saved rolls).
  - **Skill**:
    - Filterable list or grid of all skills the user has created/saved/is tracking.
    - Users can view/edit skills and see associated content like notes and video clips.

## Core Epics & Features

- **Explore & Learn**: Content feed, filtering, skill library.
- **Social & Community**: User profiles, following system, posting, likes/comments.
- **Roll Recorder & Analyzer**: Video recording, live tagging, post-roll analysis, clipping.
- **Training & Progress Log**: Logging for training/competition, data visualization, skill matrix.
- **Gym & Event Management**: Gym accounts, content management, event promotion.

## User Stories

### Paul (The Enthusiast)
- As Paul, I want to browse a “Fundamentals” category so that I can easily find and learn the core techniques of BJJ.
- As Paul, I want to watch curated instructional videos and see photo sequences so that I can learn visually without reading long articles.

### Chloe (The Social Connector)
- As Chloe, I want to follow the profiles of my gym and training partners so that I can stay connected and see their updates on my Explore feed.
- As Chloe, I want to see posts from my coach about what was taught in class so that I can review material if I missed a session.
- As Chloe, I want to share videos or notes about a new skill using the “Post” action so that I can share my progress with my community.

### Evan (The Competitor)
- As Evan, I want to use the “Record Roll” feature so that I can capture my training for later analysis on my Progress screen.
- As Evan, I want to review my recorded rolls and link specific video clips to the skills I used so that I can build a personal library of techniques in action under the “Skill” tab.
- As Evan, I want to view all my clipped footage filtered by skill so that I can analyze patterns and identify areas for improvement.
- As Evan, I want to view my training and competition logs on the Log tab’s calendar so that I can track consistency and intensity over time.

### John (The Coach)
- As John, I want to manage a dedicated profile page for my gym so that I can build our brand and create a central online hub for my community.
- As John, I want to post instructional videos for my students so that they can learn and review techniques on the Explore screen.
- As John, I want to create a post to announce and promote a tournament so that I can generate buzz and attract participants from the wider app community.

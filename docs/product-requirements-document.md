## BeJiuJitsu: Product Features & App Blueprint

This document outlines the user personas, application structure, core features, and user stories for the BeJiuJitsu mobile app. It serves as a concise roadmap for design and development.

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

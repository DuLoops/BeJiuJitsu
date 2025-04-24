# BeJiuJitsu: Train, Learn, Compete, Connect

BeJiuJitsu is a comprehensive mobile application designed specifically for Brazilian Jiu-Jitsu practitioners of all levels. This app seamlessly integrates training management, skill progression tracking, competition results, and community engagement into one intuitive platform.

## Features

### Training Management
- Log and track your training sessions with detailed information
- Record techniques practiced during each session
- Monitor training frequency, duration, and intensity
- Set training goals and receive progress updates
- Injury tracking and recovery management

### Skill Development
- Create personalized skill trees for different BJJ positions and techniques
- Track your progress on specific techniques and movements
- Access skill assessment tools to identify strengths and areas for improvement
- Set skill-focused goals with achievement tracking
- Visual progression system to celebrate milestones

### Competition Tracker
- Record and store your competition match results
- Track detailed information about each match (opponent, weight class, division)
- Log specific techniques used during matches
- Document submission types or points scored
- Keep notes on performance strengths and areas for improvement

### Community Feed
- Share training insights, techniques, and accomplishments
- Post questions and receive feedback from the community
- Follow other BJJ practitioners for inspiration and knowledge exchange
- Discover local training partners and events
- Access community-created content and instructional material

## Tech Stack

### Frontend
- React Native with Expo
- TypeScript
- Custom UI components
- AsyncStorage for local data persistence
- React Navigation for routing

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL database
- JWT Authentication
- RESTful API architecture

## Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn
- PostgreSQL
- Expo CLI (`npm install -g expo-cli`)

### Setup
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/bejiujitsu.git
   cd bejiujitsu
   ```

2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```

3. Configure environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and other settings
   ```

4. Run database migrations
   ```bash
   npx prisma migrate dev
   ```

5. Install frontend dependencies
   ```bash
   cd ../frontend
   npm install
   ```

6. Start the development servers
   
   Backend:
   ```bash
   cd backend
   npm run dev
   ```
   
   Frontend:
   ```bash
   cd frontend
   npm start
   ```

## Project Structure
```
bejiujitsu/
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── assets/
    ├── src/
    │   ├── components/
    │   ├── navigation/
    │   ├── screens/
    │   ├── services/
    │   ├── types/
    │   └── App.tsx
    ├── app.json
    ├── package.json
    └── tsconfig.json
```


## Why BeJiuJitsu?

BeJiuJitsu combines practical training management tools with social features to create a holistic platform for your jiu-jitsu journey. Whether you're a beginner looking to establish consistent training habits, an intermediate practitioner focused on expanding your technical repertoire, or a competitor preparing for tournaments, BeJiuJitsu provides the structure and support to help you achieve your goals while connecting with the broader BJJ community.

Built by practitioners for practitioners, BeJiuJitsu understands the unique needs and challenges of the Brazilian Jiu-Jitsu lifestyle and offers thoughtful solutions to enhance your development both on and off the mats.

*Track. Learn. Compete. Connect. Your complete BJJ companion.*


---

© 2025 BeJiuJitsu. All rights reserved.

# BeJiuJitsu: Learn, Journal, Engage

Unlock your full potential on the mats with BeJiuJitsu, the all-in-one app designed to elevate your Brazilian Jiu-Jitsu journey.

Whether you're stepping onto the mat for the first time or you're a seasoned black belt, BeJiuJitsu provides the tools you need to succeed.

* **LEARN THE ART:** Dive into an ever-growing library of techniques, concepts, and instructional content. From fundamental movements to advanced submissions, our resources are designed to sharpen your skills and deepen your understanding of the gentle art.
* **JOURNAL YOUR JOURNEY:** Your BJJ path is unique. Log every training session, track your attendance, note the techniques you've drilled, and journal your breakthroughs. Visualize your progress over time and see how far you've come.
* **ENGAGE THE COMMUNITY:** Jiu-Jitsu is about connection. Engage with a passionate community of practitioners from around the world. Share your progress, ask questions, discuss competition footage, and find training partners in your area.

Stop just doing Jiu-Jitsu. It's time to **BeJiuJitsu**.
# DoJits: Train, Learn, Compete, Connect

DoJits is a comprehensive mobile application designed specifically for Brazilian Jiu-Jitsu practitioners of all levels. This app seamlessly integrates training management, skill progression tracking, competition results, and community engagement into one intuitive platform.

## Features

### Learn
- **Technique Library:** Learn from an ever-growing library of techniques, concepts, and instructional content.
- **Community Knowledge:** Share techniques, ask questions, and learn from the collective experience of the community.
- **Structured Content:** Access curated content to guide your learning from white belt to black belt.

### Journal
- **Training Log:** Document every training session, including mat time, drilling partners, and specific notes.
- **Technique & Competition Tracker:** Log the techniques you're working on and record detailed competition results to analyze your performance.
- **Visual Skill Tree:** Expand your personal skill tree with a comprehensive UI that helps you visualize your strengths and identify areas for improvement.

### Engage
- **Community Feed:** Share your progress, ask questions, and discuss competition footage with practitioners worldwide.
- **Connect & Collaborate:** Find training partners in your area and exchange knowledge with a passionate BJJ community.
- **Follow & Inspire:** Follow other practitioners to stay motivated and inspired on your own Jiu-Jitsu journey.

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
   git clone https://github.com/yourusername/dojits.git
   cd dojits
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
dojits/
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


## Why DoJits?

DoJits combines practical training management tools with social features to create a holistic platform for your jiu-jitsu journey. Whether you're a beginner looking to establish consistent training habits, an intermediate practitioner focused on expanding your technical repertoire, or a competitor preparing for tournaments, DoJits provides the structure and support to help you achieve your goals while connecting with the broader BJJ community.

Built by practitioners for practitioners, DoJits understands the unique needs and challenges of the Brazilian Jiu-Jitsu lifestyle and offers thoughtful solutions to enhance your development both on and off the mats.

*Track. Learn. Compete. Connect. Your complete BJJ companion.*

---

© 2025 DoJits. All rights reserved.

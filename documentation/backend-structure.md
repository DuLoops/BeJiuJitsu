# BeJiuJitsu Backend Structure Document

## Overview

This document outlines the backend architecture and implementation details for the BeJiuJitsu application. The backend serves as the API and data management layer for the mobile application, handling user authentication, data persistence, and business logic.

## Directory Structure

```
/backend
├── /prisma               # Database ORM
│   ├── schema.prisma     # Database schema
│   ├── migrations        # Database migrations
│   └── seed.ts           # Seed data
├── /src
│   ├── /controllers      # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── profile.controller.ts
│   │   ├── skill.controller.ts
│   │   ├── training.controller.ts
│   │   └── ...
│   ├── /routes           # API routes
│   │   ├── auth.routes.ts
│   │   ├── profile.routes.ts
│   │   ├── skill.routes.ts
│   │   └── ...
│   ├── /middleware       # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── ...
│   ├── /services         # Business logic
│   │   ├── skill.service.ts
│   │   ├── profile.service.ts
│   │   └── ...
│   ├── /dto              # Data Transfer Objects
│   │   ├── skill.dto.ts
│   │   ├── user.dto.ts
│   │   └── ...
│   ├── /utils            # Utility functions
│   │   ├── logger.ts
│   │   ├── validation.ts
│   │   └── ...
│   ├── /types            # TypeScript type definitions
│   │   ├── express/index.d.ts
│   │   └── ...
│   ├── /config           # Configuration
│   │   ├── database.ts
│   │   ├── auth.ts
│   │   └── ...
│   ├── app.ts            # Express application setup
│   └── server.ts         # Server entry point
├── .env                  # Environment variables
├── package.json          # Project dependencies
└── tsconfig.json         # TypeScript configuration
```

## Database Schema

The database schema is defined using Prisma and includes the following main entities:

### User

Stores user authentication information.

```prisma
model User {
  id           String       @id @default(uuid())
  email        String       @unique
  password     String
  profile      Profile?
  trainings    Training[]
  skills       UserSkill[]
  competitions Competition[]
  category     Category[]
  isVerified   Boolean      @default(false)
  role         UserRole     @default(PRACTITIONER)
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}
```

### Profile

Stores user profile information.

```prisma
model Profile {
  id         String    @id @default(uuid())
  userId     String    @unique
  user       User      @relation(fields: [userId], references: [id])
  userName   String    @unique
  belt       Belt
  stripes    Int       @default(0)
  weight     Float?
  academy    String?
  avatar     String?
  goals      Goal[]
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
}
```

### Skill

Represents BJJ techniques and skills.

```prisma
model Skill {
  id          String      @id @default(uuid())
  creatorId   String
  isPublic    Boolean     @default(false)
  name        String      @unique
  categoryId  String
  category    Category    @relation(fields: [categoryId], references: [id])
  userSkills  UserSkill[]
  createdAt   DateTime    @default(now())
}
```

### UserSkill

Represents a user's personal collection of skills with customizations.

```prisma
model UserSkill {
  id         String          @id @default(uuid())
  userId     String
  user       User            @relation(fields: [userId], references: [id])
  skillId    String
  skill      Skill           @relation(fields: [skillId], references: [id])
  note       String?
  videoUrl   String?
  sequences  SkillSequence[]
  usages     SkillUsage[]
  createdAt  DateTime        @default(now())
  updatedAt  DateTime        @updatedAt
}
```

### Training

Records training sessions.

```prisma
model Training {
  id          String            @id @default(uuid())
  userId      String
  user        User              @relation(fields: [userId], references: [id])
  date        DateTime
  duration    Int
  bjjType     BjjType
  note        String?
  skillIds    Int[]
  skillUsages SkillUsage[]
  intensity   TrainingIntensity @default(MEDIUM)
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
}
```

### Competition

Records competition events and results.

```prisma
model Competition {
  id          String              @id @default(uuid())
  userId      String
  user        User                @relation(fields: [userId], references: [id])
  name        String
  date        DateTime
  location    String?
  type        BjjType
  weightClass String
  matchCount  Int
  winCount    Int
  loseCount   Int
  skillUsages SkillUsage[]
  details     CompetitionDetail[]
  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt
}
```

## API Endpoints

### Authentication Endpoints

```
POST /api/auth/signup         - Create a new user account
POST /api/auth/login          - Authenticate a user
POST /api/auth/logout         - Log out a user
POST /api/auth/refresh-token  - Refresh an access token
```

### Profile Endpoints

```
GET  /api/profile/check-username  - Check username availability
POST /api/profile                 - Create a user profile
PUT  /api/profile/:userId         - Update a user profile
PATCH /api/profile/goals/:goalId  - Update a user goal
```

### Skill Endpoints

```
POST   /api/skills        - Create a new skill
GET    /api/skills        - Get all skills
PUT    /api/skills/:id    - Update a skill
DELETE /api/skills/:id    - Delete a skill
```

### Training Endpoints

```
POST   /api/trainings           - Log a training session
GET    /api/trainings           - Get all training sessions
GET    /api/trainings/:id       - Get a specific training session
PUT    /api/trainings/:id       - Update a training session
DELETE /api/trainings/:id       - Delete a training
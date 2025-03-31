# BeJiuJitsu Technical Stack Document

## Overview

This document outlines the technical architecture and development stack for the BeJiuJitsu application, a mobile platform for Brazilian Jiu-Jitsu practitioners to track their training progress, manage skills, and engage with the community.

## Architecture Overview

The application follows a client-server architecture with the following components:

```
┌─────────────────────┐         ┌─────────────────────┐
│     Mobile App      │         │    Backend API      │
│  (React Native)     │◀────────▶   (Node.js/Express) │
└─────────────────────┘         └──────────┬──────────┘
                                           │
                                           ▼
                               ┌─────────────────────┐
                               │    PostgreSQL       │
                               │    Database         │
                               └──────────┬──────────┘
                                          │
                                          ▼
                               ┌─────────────────────┐
                               │     Cloudinary      │
                               │  (Media Storage)    │
                               └─────────────────────┘
```

## Frontend Stack

### Core Technologies
- **React Native**: Cross-platform mobile framework
- **Expo**: Development toolchain for React Native
- **TypeScript**: Type-safe JavaScript
- **Expo Router**: Navigation and routing

### State Management
- **React Context API**: App-wide state management
- **React Query**: Data fetching, caching, and state management for API calls

### UI Components
- **Custom UI components**: Custom Button, Text, etc.
- **React Native Gesture Handler**: Touch gestures
- **React Native Reanimated**: Animations

### Data Visualization
- **React Native SVG**: SVG rendering
- **Victory Native**: Charting and data visualization

### Authentication
- **AsyncStorage**: Local token storage
- **JWT**: Authentication tokens

### Form Handling
- **React Hook Form**: Form state management
- **Yup**: Form validation

### Utility Libraries
- **date-fns**: Date manipulation
- **lodash**: Utility functions

## Backend Stack

### Core Technologies
- **Node.js**: JavaScript runtime
- **Express**: Web application framework
- **TypeScript**: Type-safe JavaScript

### Database
- **PostgreSQL**: Relational database
- **Prisma**: ORM for database operations

### API Design
- **RESTful API**: HTTP-based API design
- **JSON**: Data interchange format

### Authentication & Security
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing
- **cors**: Cross-Origin Resource Sharing
- **helmet**: HTTP header security

### Validation
- **express-validator**: Request validation
- **zod**: Runtime type checking

### Testing
- **Jest**: Testing framework
- **Supertest**: HTTP assertions

## Database Schema

The database is designed with the following primary entities:

- **User**: User account information
- **Profile**: User profile details
- **Skill**: BJJ techniques and skills
- **UserSkill**: User's personal collection of skills
- **Training**: Training session records
- **Competition**: Competition records
- **SkillUsage**: Usage of skills in training/competition
- **SkillSequence**: Detailed steps for executing a skill
- **Goal**: User's personal goals

## Authentication Flow

1. User signs up/logs in via email/password or OAuth
2. Server validates credentials
3. Server generates JWT access token and refresh token
4. Client stores tokens securely
5. Access token used for authenticated requests
6. Refresh token used to obtain new access tokens
7. Token validation middleware on protected endpoints

## API Structure

The API follows a RESTful design with the following main endpoints:

- **/api/auth**: Authentication endpoints
- **/api/profile**: User profile management
- **/api/skills**: Skill management
- **/api/training**: Training log endpoints
- **/api/competition**: Competition record endpoints
- **/api/social**: Social feature endpoints

## Media Storage

- **Cloudinary**: Cloud storage for video uploads and media content
- Integration for:
  - Technique demonstration videos
  - Profile photos
  - Competition highlights

## Deployment Strategy

### Mobile App
- **Expo Application Services (EAS)**: Build and submission
- **App Store** (iOS) and **Google Play Store** (Android) distribution
- **OTA Updates** via Expo for minor updates

### Backend
- **Docker**: Containerization
- **AWS/DigitalOcean**: Cloud hosting
- **CI/CD Pipeline**: Automated testing and deployment
- **Nginx**: Reverse proxy

## Development Workflow

### Version Control
- **Git**: Source code management
- **GitHub**: Repository hosting and collaboration
- **Feature branch workflow**: Branch per feature/fix

### Environment Setup
- **Development**: Local development with hot reloading
- **Staging**: Testing environment with mock data
- **Production**: Live environment with real data

### Testing Strategy
- **Unit Tests**: Individual function/component testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user flow testing
- **Manual QA**: User experience verification

## Performance Considerations

### Mobile App
- **Code splitting**: Reduce bundle size
- **Image optimization**: Efficient media loading
- **Memoization**: Prevent unnecessary re-renders
- **Virtualized lists**: Efficient rendering of long lists

### Backend
- **Connection pooling**: Efficient database connections
- **Caching**: Redis for frequently accessed data
- **Rate limiting**: Prevent API abuse
- **Pagination**: Limit data transfer size

## Security Measures

- **HTTPS**: Secure data transmission
- **Input validation**: Prevent injection attacks
- **Rate limiting**: Protect against brute force
- **CORS policy**: Restrict access to API
- **Data encryption**: Sensitive information protection
- **Authentication**: Secure user identity verification

## Monitoring and Analytics

- **Sentry**: Error tracking
- **Firebase Analytics**: User behavior analytics
- **Server monitoring**: Performance and health metrics
- **Logging**: Comprehensive event logging

## Third-Party Services

- **Cloudinary**: Media storage and processing
- **SendGrid/Mailgun**: Email notifications
- **Stripe** (future): Payment processing for premium features

## Future Technical Considerations

- **WebRTC**: Potential for live video analysis
- **Web Sockets**: Real-time notifications and chat
- **Machine Learning**: Technique recognition from video
- **GraphQL**: More efficient data querying
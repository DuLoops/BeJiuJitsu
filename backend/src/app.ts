import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { initializePassport } from './config/passport.config';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import userSkillRoutes from './routes/userSkill.routes';
// import trainingRoutes from './routes/training.routes';
import skillRoutes from './routes/skill.routes';
// import competitionRoutes from './routes/competition.routes';
import { isAuthenticated, hasProfile } from './middleware/auth.middleware';

const app: Application = express();

const corsOptions: cors.CorsOptions = {
    origin: process.env.NODE_ENV === 'production'
      ? 'https://your-production-domain.com'
      : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
}));

// Initialize passport and session handling
app.use(passport.initialize());
app.use(passport.session());

// Auth routes (both custom and OAuth)
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/profile', isAuthenticated, profileRoutes);
// app.use('/api/trainings', [isAuthenticated, hasProfile], trainingRoutes);
app.use('/api/skills', [isAuthenticated, hasProfile], skillRoutes);
// app.use('/api/competitions', [isAuthenticated, hasProfile], competitionRoutes);
app.use('/api/user-skills', [isAuthenticated, hasProfile], userSkillRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Initialize passport configuration
initializePassport();

export default app;
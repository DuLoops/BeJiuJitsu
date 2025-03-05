import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
// import userSkillRoutes from './routes/userSkill.routes';
// import trainingRoutes from './routes/training.routes';
import skillRoutes from './routes/skill.routes';
// import competitionRoutes from './routes/competition.routes';
import { authenticateJWT, hasProfile } from './middleware/auth.middleware';

const app: Application = express();

const corsOptions: cors.CorsOptions = {
    origin: process.env.NODE_ENV === 'production'
      ? 'https://your-production-domain.com'
      : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']

};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Auth routes (both custom and OAuth)
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/profile', profileRoutes);
// app.use('/api/trainings', [authenticateJWT, hasProfile], trainingRoutes);
app.use('/api/skills', authenticateJWT, skillRoutes);
// app.use('/api/competitions', [authenticateJWT, hasProfile], competitionRoutes);
// app.use('/api/user-skills', [authenticateJWT, hasProfile], userSkillRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;
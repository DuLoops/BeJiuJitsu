import { Router, Request, Response, NextFunction } from 'express';
import { login, signup, logout, refreshToken } from '../controllers/auth.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { PrismaClient, User, UserRole } from '@prisma/client';
import '../types/auth.types';

const router = Router();
const prisma = new PrismaClient();

// Custom auth routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authenticateJWT, logout);
router.post('/refresh-token', refreshToken);

router.get('/success', (req, res) => {
  res.json({ user: req.user });
});

router.get('/failure', (req, res) => {
  res.status(401).json({ error: 'Authentication failed' });
});

// Add new route to get all users (dev only)
router.get('/getUsers', async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' + error });
  }
});

export default router;
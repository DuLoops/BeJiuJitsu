import { Router, Request, Response } from 'express';
import passport from 'passport';
import { validateSignup, validateLogin } from '../middleware/validation.middleware';
import { login, signup, logout, refreshToken } from '../controllers/auth.controller';
import { isAuthenticated } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Custom auth routes
router.post('/signup', ...validateSignup, signup);
router.post('/login', ...validateLogin, login);
router.post('/logout', isAuthenticated, logout);
router.post('/refresh-token', refreshToken);

// OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.id) {
      res.redirect('/login');
      return;
    }

    const hasProfile = await prisma.profile.findUnique({
      where: { userId: req.user.id }
    });

    if (!hasProfile) {
      res.redirect('/create-profile');
    } else {
      res.redirect('/dashboard');
    }
  }
);

router.get('/success', (req, res) => {
  res.json({ user: req.user });
});

router.get('/failure', (req, res) => {
  res.status(401).json({ error: 'Authentication failed' });
});

export default router;
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

export const hasProfile = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: req.user.id }
  });

  if (!profile) {
    return res.status(403).json({ 
      message: 'Profile required',
      code: 'PROFILE_REQUIRED'
    });
  }

  next();
};
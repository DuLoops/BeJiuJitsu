import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { firstName, lastName, belt, weight, academy, avatar } = req.body;

    const existingProfile = await prisma.profile.findUnique({
      where: { userId }
    });

    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    const profile = await prisma.profile.create({
      data: {
        userId,
        firstName,
        lastName,
        belt: belt || 'WHITE',
        stripes: 0,
        weight,
        academy,
        avatar,
        startedBJJ: new Date()
      }
    });

    return res.status(201).json({ profile });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating profile' });
  }
};

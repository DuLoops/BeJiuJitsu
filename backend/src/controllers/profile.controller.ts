import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface GoalInput {
  title: string;
  description?: string;
  targetDate?: Date;
}

interface CreateProfileInput {
  userName: string;
  belt?: 'WHITE' | 'BLUE' | 'PURPLE' | 'BROWN' | 'BLACK';
  weight?: number;
  academy?: string;
  avatar?: string; 
  goals?: GoalInput[];
}

interface UpdateGoalInput {
  title?: string;
  description?: string;
  targetDate?: Date;
  isCompleted?: boolean;
}

const checkUserName = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userName } = req.query;

    if (!userName || typeof userName !== 'string') {
      res.status(400).json({ message: 'Username is required' });
      return;
    }

    const existingProfile = await prisma.profile.findFirst({
      where: { userName }
    });

    res.json({ isAvailable: !existingProfile });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error checking username availability', error});
  }
};

const createProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized - User ID is required' });
      return;
    }

    const { userName, belt, weight, academy, avatar, goals = [] } = req.body as CreateProfileInput;
    // Validate goals
    if (goals.some(goal => !goal.title)) {
      res.status(400).json({ message: 'All goals must have a title' });
      return;
    }

    const existingProfile = await prisma.profile.findUnique({
      where: { userId }
    });

    if (existingProfile) {
      res.status(400).json({ message: 'Profile already exists' });
      return;
    }

    const existingUserName = await prisma.profile.findFirst({
      where: { userName }
    });

    if (existingUserName) {
      res.status(400).json({ message: 'Username is already taken' });
      return;
    }

    // Use transaction to create profile and goals
    const profile = await prisma.$transaction(async (tx) => {
      const newProfile = await tx.profile.create({
        data: {
          user: {
            connect: {
              id: userId
            }
          },
          userName,
          belt: belt || 'WHITE',
          stripes: 0,
          weight,
          academy,
          avatar,
          goals: {
            create: goals.map(goal => ({
              title: goal.title,
              description: goal.description,
              targetDate: goal.targetDate,
              isCompleted: false
            }))
          }
        },
        include: {
          goals: true
        }
      });
      
      return newProfile;
    });

    res.status(201).json({ profile });
  } catch (error) {
    console.error('Profile creation error:', error);
    res.status(500).json({ message: 'Error creating profile' });
  }
};

const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const updateData = req.body;
    
    // If username is being updated, validate it
    if (updateData.userName) {
      // Check if new username is already taken by another user
      const existingUserName = await prisma.profile.findFirst({
        where: { 
          userName: updateData.userName,
          userId: { not: userId }
        }
      });

      if (existingUserName) {
        res.status(400).json({ message: 'Username is already taken' });
        return;
      }
    }

    const profile = await prisma.profile.update({
      where: { userId },
      data: updateData
    });

    res.json({ profile });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};

const updateGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const goalId = req.params.goalId;
    const updateData: UpdateGoalInput = req.body;

    // Validate goal title if it's being updated
    if (updateData.title && !updateData.title.trim()) {
      res.status(400).json({ message: 'Goal title cannot be empty' });
      return;
    }

    // First verify the goal belongs to the user's profile
    const goal = await prisma.$transaction(async (tx) => {
      const profile = await tx.profile.findUnique({
        where: { userId }
      });

      if (!profile) {
        throw new Error('Profile not found');
      }

      const existingGoal = await tx.goal.findFirst({
        where: {
          id: goalId,
          profileId: profile.id
        }
      });

      if (!existingGoal) {
        throw new Error('Goal not found or unauthorized');
      }

      // If marking as completed, set completedAt
      const data = {
        ...updateData,
        ...(updateData.isCompleted && !existingGoal.isCompleted
          ? { completedAt: new Date() }
          : {}),
        ...(updateData.isCompleted === false
          ? { completedAt: null }
          : {})
      };

      return tx.goal.update({
        where: { id: goalId },
        data
      });
    });

    res.json({ goal });
  } catch (error) {
    console.error('Goal update error:', error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error updating goal' });
    }
  }
};

// Export as an object containing all controller methods
export const profileController = {
  checkUserName,
  createProfile,
  updateProfile,
  updateGoal
};

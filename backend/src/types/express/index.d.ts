import { User } from '@prisma/client';

declare global {
  namespace Express {
    // Extend Request interface to include user property
    interface Request {
      user?: User;
    }
  }
}

export {};
import { Request } from 'express';
import { User as PrismaUser } from '@prisma/client';

declare global {
  namespace Express {
    interface User extends PrismaUser {}
  }
}

export interface AuthenticatedRequest extends Request {
  user: PrismaUser;
}

// types/auth.ts
export enum UserRole {
  PRACTITIONER = 'PRACTITIONER',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN'
}

export enum Belt {
  WHITE = 'WHITE',
  BLUE = 'BLUE',
  PURPLE = 'PURPLE',
  BROWN = 'BROWN',
  BLACK = 'BLACK'
}

export interface User {
  id: number;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: number;
  userId: number;
  userName: string;
  belt: Belt;
  stripes: number;
  weight?: number;
  academy?: string;
  avatar?: string;
  startDate?: string;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
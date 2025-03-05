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
    StartDate?: string;
  }

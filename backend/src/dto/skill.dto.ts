import { Skill, Category, UserSkill } from '@prisma/client';

// Use partial Prisma types for input DTOs
export interface CreateSkillDto {
        name: string;
        categoryId: string;
        id?: string;
    }
 

export interface UpdateSkillDto {
    name?: string;
    categoryId?: string;
    isPublic?: boolean;
    note?: string;
    videoUrl?: string | null;
}

// Response DTO that extends the Prisma Skill type with additional properties
export interface SkillResponseDto extends Skill {
    categoryName: string;
    userSkill?: UserSkill | null;
}

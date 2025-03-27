import { Skill, Category, UserSkill } from '@prisma/client';

// Use partial Prisma types for input DTOs
export interface CreateSkillDto {
    isNewSkill: boolean;
    skill: {
        name: string;
        categoryId: string;
        id?: string;
    }
    userSkill: {
        note: string;
        videoUrl: string | null;
        sequence: SequenceStep[];
    },
    creatorId: string;

}

export interface SequenceStep {
    stepNumber: number;
    intention: string;
    details: string[];
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

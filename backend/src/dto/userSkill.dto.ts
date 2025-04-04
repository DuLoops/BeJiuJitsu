

export interface CreateUserSkillDto {
    skill: {
        name: string;
        categoryId: string;
        id?: string;
    }
    userSkill: {
        note: string;
        videoUrl: string | null;
        sequences: SequenceStep[];
    },
    creatorId: string;
}

export interface UpdateUserSkillDto {
    note?: string;
    videoUrl?: string;
    sequences?: SequenceStep[];
}

export interface SequenceStep {
    stepNumber: number;
    intention: string;
    details: string[];
}

export class UpdateUserSkilUsagelDto {
    note?: string;
    videoUrl?: string;
}
export class CreateUserSkillUsageDto {
    usageType!: 'TRAINING' | 'COMPETITION';
    trainingId?: string;
    competitionId?: string;
    quantity!: number;
    success!: boolean;
    note?: string;
}

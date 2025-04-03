

export interface CreateUserSkillDto {
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

export class UpdateUserSkillDto {
    note?: string;
    videoUrl?: string;
}


export interface SequenceStep {
    stepNumber: number;
    intention: string;
    details: string[];
}

export class CreateSkillUsageDto {
    usageType!: 'TRAINING' | 'COMPETITION';
    trainingId?: string;
    competitionId?: string;
    quantity!: number;
    success!: boolean;
    note?: string;
}

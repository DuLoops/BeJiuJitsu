export class CreateUserSkillDto {
    skillId!: number;
    note?: string;
    videoUrl?: string;
    sequences?: {
        stepNumber: number;
        intention: string;
        details: string[];
    }[];
}

export class UpdateUserSkillDto {
    note?: string;
    videoUrl?: string;
}

export class CreateSkillUsageDto {
    usageType!: 'TRAINING' | 'COMPETITION';
    trainingId?: number;
    competitionId?: number;
    quantity!: number;
    success!: boolean;
    note?: string;
}

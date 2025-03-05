export class CreateUserSkillDto {
    skillId!: string;
    note?: string;  // Make sure note is optional
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
    trainingId?: string;
    competitionId?: string;
    quantity!: number;
    success!: boolean;
    note?: string;
}

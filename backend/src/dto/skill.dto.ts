export class CreateSkillDto {
    name!: string;
    categoryId!: number;
    isPublic!: boolean;
}

export class UpdateSkillDto {
    name?: string;
    categoryId?: number;
    isPublic?: boolean;
}

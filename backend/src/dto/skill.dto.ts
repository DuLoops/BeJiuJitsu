export interface CreateSkillDto {
    name: string;
    categoryId: string;
    isPublic?: boolean;
}

export interface UpdateSkillDto {
    name?: string;
    categoryId?: string;
    isPublic?: boolean;
}

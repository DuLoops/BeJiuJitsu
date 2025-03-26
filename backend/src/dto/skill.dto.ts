export interface CreateSkillDto {
    id: string;
    name: string;
    category: {id:string, name:string} | null;
    note: string;
    video: string | null;
    sequence: SequenceStep[];
  
}

export interface SequenceStep {
    stepNumber: number;
    intention: string;
    details: string[];
  }
  

export interface UpdateSkillDto {
    name?: string;       // Display name of the skill
    categoryId?: string; // Category ID in kebab-case format
    isPublic?: boolean;  // Whether skill is publicly available
}

// Additional DTO for frontend integration
export interface SkillResponseDto {
    id: string;         // Skill ID in kebab-case format (category-name)
    name: string;       // Display name of the skill
    categoryId: string; // Category ID
    categoryName: string; // Category name for display
    isPublic: boolean;  // Whether skill is publicly available
    creatorId: string;  // ID of the user who created the skill
}

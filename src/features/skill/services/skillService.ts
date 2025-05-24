import { supabase } from '@/src/lib/supabase';
import { Category, Skill, UserSkill, CategoryEnum, SkillNameEnum, SkillSequence, SequenceDetail } from '@/src/types/skills';

// Fetch Functions
export const fetchCategories = async () => {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) throw error;
  return data as Category[];
};

export const fetchSkills = async (categoryId?: string) => {
  let query = supabase.from('skills').select('*');
  if (categoryId) {
    query = query.eq('categoryId', categoryId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data as Skill[];
};

// Fetches UserSkills with all related details (Skill, Category, Sequences, SequenceDetails)
export const fetchUserSkillsWithDetails = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_skills')
    .select(`
      *,
      skill:skills!inner(*, category:categories!inner(*)),
      sequences:skill_sequences!left(*, details:sequence_details!left(*))
    `)
    .eq('userId', userId);

  if (error) {
    console.error('Error fetching user skills with details:', error);
    throw error;
  }
  return data as any[]; // Adjust type based on UserSkillWithDetails from component
};


export const fetchUserSkills = async (userId: string) => {
  const { data, error } = await supabase.from('user_skills').select('*').eq('userId', userId);
  if (error) throw error;
  return data as UserSkill[];
};

// Create Functions
export const createCategory = async (categoryData: Partial<Category>, currentUserId: string) => {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ ...categoryData, isPredefined: false, userId: currentUserId, updated_at: new Date() }])
    .select()
    .single();
  if (error) throw error;
  return data as Category;
};

export const createSkill = async (skillData: Partial<Skill>, currentUserId: string) => {
  const { data, error } = await supabase
    .from('skills')
    .insert([{ ...skillData, isPublic: false, creatorId: currentUserId, updated_at: new Date() }])
    .select()
    .single();
  if (error) throw error;
  return data as Skill;
};

export const createUserSkill = async (userSkillData: Partial<UserSkill>, userId: string) => {
  const { data, error } = await supabase
    .from('user_skills')
    .insert([{ ...userSkillData, userId, updated_at: new Date() }])
    .select()
    .single();
  if (error) throw error;
  return data as UserSkill;
};

// Combined function to handle skill creation (new or existing) and user skill entry
export const addOrUpdateUserSkill = async ({
  userId,
  skillName,
  categoryId,
  categoryName, // For creating new category
  note,
  source,
  isFavorite,
  videoUrl,
}: {
  userId: string;
  skillName: SkillNameEnum | string;
  categoryId?: string | null; // Provided if selecting existing category
  categoryName?: CategoryEnum | string; // Provided if creating new category
  note?: string;
  source?: string;
  isFavorite?: boolean;
  videoUrl?: string;
}) => {
  let finalCategoryId = categoryId;
  let finalSkillId: string | undefined;

  // 1. Find or Create Category
  if (!finalCategoryId && categoryName) {
    // Check if a user-defined category with this name already exists for this user
    const { data: existingUserCategories, error: existingCatError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', categoryName)
      .eq('userId', userId)
      .single();

    if (existingCatError && existingCatError.code !== 'PGRST116') throw existingCatError;

    if (existingUserCategories) {
      finalCategoryId = existingUserCategories.id;
    } else {
      // Check for predefined category by name (less likely to be an exact match if user is typing, but good for enum selections)
      const { data: predefinedCategories, error: predefinedCatError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', categoryName)
        .eq('isPredefined', true)
        .single();
      if (predefinedCatError && predefinedCatError.code !== 'PGRST116') throw predefinedCatError;

      if (predefinedCategories) {
        finalCategoryId = predefinedCategories.id;
      } else {
        const newCategory = await createCategory({ name: categoryName }, userId);
        finalCategoryId = newCategory.id;
      }
    }
  } else if (!finalCategoryId) {
    throw new Error("Category information is required to create a skill.");
  }

  // 2. Find or Create Skill
  // Check if skill already exists (public or user-created for this category)
  const { data: existingSkills, error: existingSkillError } = await supabase
    .from('skills')
    .select('id, creatorId, isPublic')
    .eq('name', skillName)
    .eq('categoryId', finalCategoryId!)
    // .or(`isPublic.eq.true,creatorId.eq.${userId}`) // More complex query if needed
    .limit(1);

  if (existingSkillError) throw existingSkillError;

  let skillToLink: Skill | null = null;
  if (existingSkills && existingSkills.length > 0) {
    // Prioritize public skills, then user's own skills
    skillToLink = existingSkills.find(s => s.isPublic) || existingSkills.find(s => s.creatorId === userId) || existingSkills[0];
  }

  if (skillToLink) {
    finalSkillId = skillToLink.id;
  } else {
    // Create new base skill
    const newSkill = await createSkill({ name: skillName, categoryId: finalCategoryId! }, userId);
    finalSkillId = newSkill.id;
  }

  if (!finalSkillId) {
    throw new Error("Could not find or create a skill.");
  }

  // 3. Create UserSkill entry
  const userSkill = await createUserSkill(
    {
      skillId: finalSkillId,
      note,
      source,
      isFavorite,
      videoUrl,
    },
    userId
  );

  return userSkill;
};

// Create SkillSequence and SequenceDetail entries
export const createSkillSequences = async (sequences: Partial<SkillSequence>[]) => {
  const { data, error } = await supabase.from('skill_sequences').insert(sequences).select();
  if (error) throw error;
  return data as SkillSequence[];
};

export const createSequenceDetails = async (details: Partial<SequenceDetail>[]) => {
  const { data, error } = await supabase.from('sequence_details').insert(details).select();
  if (error) throw error;
  return data as SequenceDetail[];
};

// Combined function to add a UserSkill with its sequences and details
export const addUserSkillWithSequences = async ({
  userId,
  skillName,
  categoryId,
  categoryName,
  note,
  source,
  isFavorite,
  videoUrl,
  sequences: sequenceInputs, // Array of { intention: string, details: string[] }
}: {
  userId: string;
  skillName: SkillNameEnum | string;
  categoryId?: string | null;
  categoryName?: CategoryEnum | string;
  note?: string;
  source?: string;
  isFavorite?: boolean;
  videoUrl?: string;
  sequences?: Array<{ intention?: string | null; detailsArray: Array<{ detail: string }> }>;
}) => {
  // First, create the UserSkill using the existing function
  const userSkill = await addOrUpdateUserSkill({
    userId,
    skillName,
    categoryId,
    categoryName,
    note,
    source,
    isFavorite,
    videoUrl,
  });

  if (!userSkill || !userSkill.id) {
    throw new Error("Failed to create UserSkill.");
  }

  // If sequences are provided, create them
  if (sequenceInputs && sequenceInputs.length > 0) {
    const skillSequenceEntries: Partial<SkillSequence>[] = sequenceInputs.map((seq, index) => ({
      userSkillId: userSkill.id, // Link to the created UserSkill
      stepNumber: index + 1,
      intention: seq.intention,
      // 'detail' from original requirement is now in SequenceDetail
    }));

    const createdSequences = await createSkillSequences(skillSequenceEntries);

    // Now create SequenceDetail entries for each SkillSequence
    let allSequenceDetails: Partial<SequenceDetail>[] = [];
    createdSequences.forEach((cs, i) => {
      const detailsForSequence = sequenceInputs[i].detailsArray.map(d => ({
        skillSequenceId: cs.id, // Link to the created SkillSequence
        detail: d.detail,
      }));
      allSequenceDetails = allSequenceDetails.concat(detailsForSequence);
    });

    if (allSequenceDetails.length > 0) {
      await createSequenceDetails(allSequenceDetails);
    }
  }

  return userSkill; // Return the main UserSkill object
};

// Delete UserSkill and related sequences/details (DB should handle cascade, but explicit calls can be added if not)
export const deleteUserSkill = async (userSkillId: string) => {
  // 1. Delete SequenceDetails (if DB doesn't cascade)
  // const { data: sequences } = await supabase.from('skill_sequences').select('id').eq('userSkillId', userSkillId);
  // if (sequences) {
  //   for (const seq of sequences) {
  //     await supabase.from('sequence_details').delete().eq('skillSequenceId', seq.id);
  //   }
  // }
  // 2. Delete SkillSequences (if DB doesn't cascade)
  // await supabase.from('skill_sequences').delete().eq('userSkillId', userSkillId);
  
  // 3. Delete UserSkill
  const { error } = await supabase.from('user_skills').delete().eq('id', userSkillId);
  if (error) throw error;
  return true;
};

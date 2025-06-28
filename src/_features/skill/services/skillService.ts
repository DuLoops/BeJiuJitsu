import { supabase } from '@/src/lib/supabase';
import { Database } from '@/src/supabase/types';
import { Category, CategoryEnum, SequenceDetail, Skill, SkillNameEnum, SkillSequence, UserSkill } from '@/src/types/skills';

// Fetch Functions
export const fetchCategories = async () => {
  const { data, error } = await supabase.from('Category').select('*');
  if (error) throw error;
  return data as Category[];
};

export const fetchSkills = async (categoryId?: string) => {
  let query = supabase.from('Skill').select('*');
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
    .from('UserSkill')
    .select(`
      *,
      skill:Skill!inner(*, category:Category!inner(*)),
      sequences:SkillSequence!left(*, details:SequenceDetail!left(*))
    `)
    .eq('userId', userId);

  if (error) {
    console.error('Error fetching user skills with details:', error);
    throw error;
  }
  return data as any[]; // Adjust type based on UserSkillWithDetails from component
};


export const fetchUserSkills = async (userId: string) => {
  const { data, error } = await supabase.from('UserSkill').select('*').eq('userId', userId);
  if (error) throw error;
  return data as UserSkill[];
};

// Create Functions
export const createCategory = async (categoryData: Pick<Category, 'name'> & Partial<Omit<Category, 'name'>>, currentUserId: string) => {
  const { data, error } = await supabase
    .from('Category')
    .insert([{ ...categoryData, isPredefined: false, userId: currentUserId, updatedAt: new Date().toISOString() }])
    .select()
    .single();
  if (error) throw error;
  return data as Category;
};

export const createSkill = async (skillData: Pick<Skill, 'name' | 'categoryId'> & Partial<Omit<Skill, 'name' | 'categoryId'>>, currentUserId: string) => {
  const { data, error } = await supabase
    .from('Skill')
    .insert([{ ...skillData, isPublic: false, creatorId: currentUserId, updatedAt: new Date().toISOString() }])
    .select()
    .single();
  if (error) throw error;
  return data as Skill;
};

export const createUserSkill = async (userSkillData: Pick<UserSkill, 'skillId'> & Partial<Omit<UserSkill, 'skillId'>>, userId: string) => {
  console.log('userSkillData', userSkillData);
  const { data, error } = await supabase
    .from('UserSkill')
    .insert([{ 
      ...userSkillData, 
      source: userSkillData.source as Database["public"]["Enums"]["SkillSource"],
      userId, 
      updatedAt: new Date().toISOString() 
    }])
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
      .from('Category')
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
        .from('Category')
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
    .from('Skill')
    .select('id, name, categoryId, creatorId, isPublic')
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
export const createSkillSequences = async (sequences: Array<Pick<SkillSequence, 'skillId' | 'stepNumber' | 'intention'>>) => {
  const { data, error } = await supabase.from('SkillSequence').insert(sequences).select();
  if (error) throw error;
  return data as SkillSequence[];
};

export const createSequenceDetails = async (details: Array<Pick<SequenceDetail, 'sequenceId' | 'detail'>>) => {
  const { data, error } = await supabase.from('SequenceDetail').insert(details).select();
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
    const skillSequenceEntries: Array<Pick<SkillSequence, 'skillId' | 'stepNumber' | 'intention'> & Partial<SkillSequence>> = sequenceInputs.map((seq, index) => ({
      skillId: userSkill.id, // Link to the created UserSkill
      stepNumber: index + 1,
      intention: seq.intention || '', // Ensure intention is a string
      // 'detail' from original requirement is now in SequenceDetail
    }));

    const createdSequences = await createSkillSequences(skillSequenceEntries as Array<Pick<SkillSequence, 'skillId' | 'stepNumber' | 'intention'>>); // Cast to satisfy createSkillSequences, though ideally types align better

    // Now create SequenceDetail entries for each SkillSequence
    const allSequenceDetails: Array<Pick<SequenceDetail, 'sequenceId' | 'detail'>> = [];
    createdSequences.forEach((cs, i) => {
      const detailsForSequence: Array<Pick<SequenceDetail, 'sequenceId' | 'detail'>> = 
        sequenceInputs[i].detailsArray.map(d => ({
          sequenceId: cs.id, 
          detail: d.detail, // Assuming d.detail is always a string from sequenceInputs type
      }));
      allSequenceDetails.push(...detailsForSequence); // Use push with spread operator
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
  // const { data: sequences } = await supabase.from('SkillSequence').select('id').eq('userSkillId', userSkillId);
  // if (sequences) {
  //   for (const seq of sequences) {
  //     await supabase.from('SequenceDetail').delete().eq('skillSequenceId', seq.id);
  //   }
  // }
  // 2. Delete SkillSequences (if DB doesn't cascade)
  // await supabase.from('SkillSequence').delete().eq('userSkillId', userSkillId);
  
  // 3. Delete UserSkill
  const { error } = await supabase.from('UserSkill').delete().eq('id', userSkillId);
  if (error) throw error;
  return true;
};

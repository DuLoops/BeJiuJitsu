import { supabase } from '@/src/lib/supabase';
import { Database, Tables } from '@/src/supabase/types';

// Fetch Functions

export const fetchSkills = async (category?: Database['public']['Enums']['Category']) => {
  let query = supabase.from('skills').select('*');
  if (category) {
    query = query.eq('category', category);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data as Tables<'skills'>[];
};

// Fetch all skills (public OR user-specific) for skill picker
export const fetchAllSkills = async (userId?: string) => {
  let query = supabase.from('skills').select('*');
  if (userId) {
    query = query.or(`is_public.eq.true,creator_id.eq.${userId}`);
  } else {
    query = query.eq('is_public', true);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data as Tables<'skills'>[];
};

// Fetches UserSkills with all related details (Skill, Category, Sequences, SequenceDetails)
export const fetchUserSkillsWithDetails = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_skills')
    .select(`*, skill:skills(*)`)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user skills with details:', error);
    throw error;
  }
  return data as any[];
};

export const fetchUserSkills = async (userId: string) => {
  const { data, error } = await supabase.from('user_skills').select('*').eq('user_id', userId);
  if (error) throw error;
  return data as Tables<'user_skills'>[];
};

// Fetch notes for a specific user_skill
export const fetchUserSkillNotes = async (userSkillId: string) => {
  const { data, error } = await supabase
    .from('user_skill_notes')
    .select('*')
    .eq('user_skill_id', userSkillId)
    .order('note_order', { ascending: true });
  if (error) throw error;
  return data as Tables<'user_skill_notes'>[];
};

// Fetch videos for a specific user_skill
export const fetchUserSkillVideos = async (userSkillId: string) => {
  const { data, error } = await supabase
    .from('user_skill_videos')
    .select('*')
    .eq('user_skill_id', userSkillId)
    .order('video_order', { ascending: true });
  if (error) throw error;
  return data as Tables<'user_skill_videos'>[];
};

// Replace notes and videos for an existing user_skill
export const replaceUserSkillNotesAndVideos = async ({
  userSkillId,
  notes = [],
  videoUrls = [],
  source,
  trainingActivityId,
  matchId,
}: {
  userSkillId: string;
  notes?: string[];
  videoUrls?: string[];
  source?: Database['public']['Enums']['SkillSource'] | string;
  trainingActivityId?: string;
  matchId?: string;
}) => {
  // Delete existing rows to fully replace (ensures removed entries are cleaned up)
  const { error: notesDelError } = await supabase.from('user_skill_notes').delete().eq('user_skill_id', userSkillId);
  if (notesDelError) throw notesDelError;
  const { error: videosDelError } = await supabase.from('user_skill_videos').delete().eq('user_skill_id', userSkillId);
  if (videosDelError) throw videosDelError;

  // Insert new notes
  if (notes.length > 0) {
    const baseOrder = Date.now();
    const noteRows = notes
      .filter((n) => n && n.trim().length > 0)
      .map((n, idx) => ({
        user_skill_id: userSkillId,
        note: n.trim(),
        note_order: baseOrder + idx, // ensure global uniqueness to avoid conflicts
        source: (source as any) || 'INDEPENDENT',
        training_activity_id: trainingActivityId || null,
        match_id: matchId || null,
      } as Tables<'user_skill_notes'>));
    const { error } = await supabase
      .from('user_skill_notes')
      .insert(noteRows);
    if (error) throw error;
  }

  // Insert new videos
  if (videoUrls.length > 0) {
    const baseOrder = Date.now();
    const videoRows = videoUrls
      .filter((v) => v && v.trim().length > 0)
      .map((v, idx) => ({
        user_skill_id: userSkillId,
        video_url: v.trim(),
        video_order: baseOrder + idx, // ensure global uniqueness to avoid conflicts
        source: (source as any) || 'INDEPENDENT',
        training_activity_id: trainingActivityId || null,
        match_id: matchId || null,
        note: null,
      } as Tables<'user_skill_videos'>));
    const { error } = await supabase
      .from('user_skill_videos')
      .insert(videoRows);
    if (error) throw error;
  }

  return true;
};

// Create Functions
export const createSkill = async (
  skillData: Pick<Tables<'skills'>, 'name' | 'category'> & Partial<Omit<Tables<'skills'>, 'name' | 'category'>>,
  currentUserId: string
) => {
  const { data, error } = await supabase
    .from('skills')
    .insert([{ ...skillData, is_public: false, creator_id: currentUserId, created_at: new Date().toISOString() }])
    .select()
    .single();
  if (error) throw error;
  return data as Tables<'skills'>;
};

export const createUserSkill = async (userSkillData: Pick<Tables<'user_skills'>, 'skill_id'> & Partial<Omit<Tables<'user_skills'>, 'skill_id'>>, userId: string) => {
  const { data, error } = await supabase
    .from('user_skills')
    .insert([
      {
        ...userSkillData,
        user_id: userId,
        updated_at: new Date().toISOString(),
      } as Tables<'user_skills'>,
    ])
    .select()
    .single();
  if (error) throw error;
  return data as Tables<'user_skills'>;
};

// Combined function to handle skill creation (new or existing) and user skill entry
export const addOrUpdateUserSkill = async ({
  userId,
  skillName,
  category,
}: {
  userId: string;
  skillName: string;
  category: Database['public']['Enums']['Category'];
}) => {
  let finalSkillId: string | undefined;

  // Check if skill already exists (public or user-created for this category)
  const { data: existingSkills, error: existingSkillError } = await supabase
    .from('skills')
    .select('id, name, category, creator_id, is_public, created_at')
    .eq('name', skillName)
    .eq('category', category)
    .limit(1);

  if (existingSkillError) throw existingSkillError;

  let skillToLink: Tables<'skills'> | null = null;
  if (existingSkills && existingSkills.length > 0) {
    // Prioritize public skills, then user's own skills
    skillToLink = existingSkills.find(s => s.is_public) || existingSkills.find(s => s.creator_id === userId) || existingSkills[0];
  }

  if (skillToLink) {
    finalSkillId = skillToLink.id;
  } else {
    // Create new base skill
    const newSkill = await createSkill({ name: skillName, category }, userId);
    finalSkillId = newSkill.id;
  }

  if (!finalSkillId) {
    throw new Error("Could not find or create a skill.");
  }

  // 3. Check if UserSkill already exists
  const { data: existingUserSkillRows, error: existingUserSkillError } = await supabase
    .from('user_skills')
    .select('id')
    .eq('user_id', userId)
    .eq('skill_id', finalSkillId)
    .limit(1);

  if (existingUserSkillError) {
    throw existingUserSkillError;
  }

  const existingUserSkill = (existingUserSkillRows as Array<Pick<Tables<'user_skills'>, 'id'>> | null)?.[0] || null;
  if (existingUserSkill) return existingUserSkill as Tables<'user_skills'>;

  // 4. Create UserSkill entry
  const userSkill = await createUserSkill(
    {
      skill_id: finalSkillId,
    },
    userId
  );

  return userSkill;
};

// Create SkillSequence and SequenceDetail entries
// Removed sequence-related functions to match current schema

// Combined function to add a UserSkill with its sequences and details
// Removed addUserSkillWithSequences to match current schema

// Add a UserSkill, then optionally attach multiple notes and videos
export const addUserSkillWithNotesAndVideos = async ({
  userId,
  skillName,
  category,
  source,
  trainingActivityId,
  matchId,
  notes = [],
  videoUrls = [],
}: {
  userId: string;
  skillName: string;
  category: Database['public']['Enums']['Category'];
  source?: Database['public']['Enums']['SkillSource'] | string;
  trainingActivityId?: string;
  matchId?: string;
  notes?: string[];
  videoUrls?: string[];
}) => {
  const userSkill = await addOrUpdateUserSkill({
    userId,
    skillName,
    category,
  });

  if (!userSkill || !userSkill.id) throw new Error('Failed to create UserSkill');
  // Always replace to avoid conflicts when userSkill already exists
  await replaceUserSkillNotesAndVideos({
    userSkillId: userSkill.id,
    notes,
    videoUrls,
    source,
    trainingActivityId,
    matchId,
  });

  return userSkill;
};

// Delete UserSkill
export const deleteUserSkill = async (userSkillId: string) => {
  const { error } = await supabase.from('user_skills').delete().eq('id', userSkillId);
  if (error) throw error;
  return true;
};

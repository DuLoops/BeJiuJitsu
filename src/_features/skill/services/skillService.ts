import { supabase } from '@/src/lib/supabase';
import { Database, Tables } from '@/src/supabase/types';

// Fetch Functions

// Fetch categories as predefined list from Category enum
export const fetchCategories = async (): Promise<Array<{ id: string; name: string }>> => {
  // Return the Category enum values as a list
  const categories: Database['public']['Enums']['Category'][] = [
    'Submission',
    'Takedown',
    'Pass',
    'Control',
    'Escape',
    'Guard',
    'Sweep',
    'System',
  ];
  return categories.map(cat => ({ id: cat, name: cat }));
};

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
  postId,
}: {
  userSkillId: string;
  notes?: string[];
  videoUrls?: string[];
  source?: Database['public']['Enums']['SkillSource'] | string;
  trainingActivityId?: string;
  matchId?: string;
  postId?: string;
}) => {
  // Delete existing rows to fully replace (ensures removed entries are cleaned up)
  const { error: notesDelError } = await supabase.from('user_skill_notes').delete().eq('user_skill_id', userSkillId);
  if (notesDelError) throw notesDelError;
  const { error: videosDelError } = await supabase.from('user_skill_videos').delete().eq('user_skill_id', userSkillId);
  if (videosDelError) throw videosDelError;

  // Insert new notes
  if (notes.length > 0) {
    const noteRows = notes
      .filter((n) => n && n.trim().length > 0)
      .map((n, idx) => ({
        user_skill_id: userSkillId,
        note: n.trim(),
        note_order: idx,
        source: (source as any) || 'INDEPENDENT',
      }));

    const { data: insertedNotes, error: notesError } = await supabase
      .from('user_skill_notes')
      .insert(noteRows)
      .select('id');
    if (notesError) throw notesError;

    // Create junction table entries if parent entity is specified
    if (insertedNotes && (trainingActivityId || matchId || postId)) {
      const linkRows = insertedNotes.map(note => {
        const link: any = { user_skill_note_id: note.id };
        if (trainingActivityId) link.training_activity_id = trainingActivityId;
        if (matchId) link.match_id = matchId;
        if (postId) link.post_id = postId;
        return link;
      });
      const { error: linkError } = await supabase.from('skill_content_links').insert(linkRows);
      if (linkError) throw linkError;
    }
  }

  // Insert new videos
  if (videoUrls.length > 0) {
    const videoRows = videoUrls
      .filter((v) => v && v.trim().length > 0)
      .map((v, idx) => ({
        user_skill_id: userSkillId,
        video_url: v.trim(),
        video_order: idx,
        source: (source as any) || 'INDEPENDENT',
        note: null,
      }));

    const { data: insertedVideos, error: videosError } = await supabase
      .from('user_skill_videos')
      .insert(videoRows)
      .select('id');
    if (videosError) throw videosError;

    // Create junction table entries if parent entity is specified
    if (insertedVideos && (trainingActivityId || matchId || postId)) {
      const linkRows = insertedVideos.map(video => {
        const link: any = { user_skill_video_id: video.id };
        if (trainingActivityId) link.training_activity_id = trainingActivityId;
        if (matchId) link.match_id = matchId;
        if (postId) link.post_id = postId;
        return link;
      });
      const { error: linkError } = await supabase.from('skill_content_links').insert(linkRows);
      if (linkError) throw linkError;
    }
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
  postId,
  notes = [],
  videoUrls = [],
}: {
  userId: string;
  skillName: string;
  category: Database['public']['Enums']['Category'];
  source?: Database['public']['Enums']['SkillSource'] | string;
  trainingActivityId?: string;
  matchId?: string;
  postId?: string;
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
    postId,
  });

  return userSkill;
};

// Delete UserSkill
export const deleteUserSkill = async (userSkillId: string) => {
  const { error } = await supabase.from('user_skills').delete().eq('id', userSkillId);
  if (error) throw error;
  return true;
};

// Add or update UserSkill with sequences (sequences are currently not stored)
export const addUserSkillWithSequences = async ({
  userId,
  userSkillId,
  skillName,
  categoryId,
  categoryName,
  note,
  source,
  isFavorite,
  videoUrl,
  sequences,
  trainingActivityId,
  matchId,
  postId,
}: {
  userId: string;
  userSkillId?: string | null;
  skillName: string;
  categoryId?: string | null;
  categoryName?: string;
  note?: string;
  source?: Database['public']['Enums']['SkillSource'] | string;
  isFavorite?: boolean;
  videoUrl?: string;
  sequences?: any[];
  trainingActivityId?: string;
  matchId?: string;
  postId?: string;
}) => {
  // Determine the category to use
  let finalCategory: Database['public']['Enums']['Category'];

  if (categoryId) {
    finalCategory = categoryId as Database['public']['Enums']['Category'];
  } else if (categoryName) {
    finalCategory = categoryName as Database['public']['Enums']['Category'];
  } else {
    throw new Error('Category is required');
  }

  // If editing, we don't use userSkillId yet - we just create/link the skill
  const userSkill = await addOrUpdateUserSkill({
    userId,
    skillName,
    category: finalCategory,
  });

  // Store note and videoUrl as notes and videos
  const notes = note ? [note] : [];
  const videoUrls = videoUrl ? [videoUrl] : [];

  await replaceUserSkillNotesAndVideos({
    userSkillId: userSkill.id,
    notes,
    videoUrls,
    source: source as Database['public']['Enums']['SkillSource'],
    trainingActivityId,
    matchId,
    postId,
  });

  return userSkill;
};

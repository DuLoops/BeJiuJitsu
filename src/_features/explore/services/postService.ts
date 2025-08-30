import { supabase } from '@/src/lib/supabase';
import { Tables, TablesInsert } from '@/src/supabase/types';

export type PostCategory = 'Training' | 'Technique' | 'Competition' | 'General' | 'Achievement' | 'Question';

export interface CreatePostData {
  content?: string;
  category: PostCategory;
  imageFile?: {
    uri: string;
    name: string;
    type: string;
  };
}

export interface Post extends Tables<'posts'> {
  profiles: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar: string | null;
  } | null;
}

export const uploadPostImage = async (imageFile: { uri: string; name: string; type: string }, userId: string): Promise<string> => {
  try {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    // Convert URI to blob for upload
    const response = await fetch(imageFile.uri);
    const blob = await response.blob();
    
    const { data, error } = await supabase.storage
      .from('post-images')
      .upload(fileName, blob, {
        contentType: imageFile.type,
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('post-images')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadPostImage:', error);
    throw error;
  }
};

export const createPost = async (postData: CreatePostData, userId: string): Promise<Post> => {
  try {
    let imageUrl: string | undefined;
    
    // Upload image if provided
    if (postData.imageFile) {
      imageUrl = await uploadPostImage(postData.imageFile, userId);
    }

    // Create post record
    const postInsert: TablesInsert<'posts'> = {
      user_id: userId,
      content: postData.content || null,
      image_url: imageUrl || null,
      category: postData.category
    };

    const { data, error } = await supabase
      .from('posts')
      .insert(postInsert)
      .select(`
        *,
        profiles (
          id,
          username,
          full_name,
          avatar
        )
      `)
      .single();

    if (error) {
      console.error('Error creating post:', error);
      throw error;
    }

    return data as Post;
  } catch (error) {
    console.error('Error in createPost:', error);
    throw error;
  }
};

export const validatePost = (content?: string, hasImage?: boolean): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Either content or image is required
  if (!content?.trim() && !hasImage) {
    errors.push('Post must have either text content or an image');
  }
  
  // Content length validation
  if (content && content.length > 500) {
    errors.push('Post content must be 500 characters or less');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const deletePost = async (postId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deletePost:', error);
    throw error;
  }
};
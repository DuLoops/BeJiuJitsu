import { supabase } from '@/src/lib/supabase';
import { Database } from '@/src/supabase/types';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { v4 as uuidv4 } from 'uuid';

type VisibilityType = Database['public']['Enums']['visibility_type'];

interface UploadVideoParams {
    fileUri: string;
    userId: string;
    entityType: 'training' | 'competition';
    entityId: string;
    visibility: VisibilityType;
    note?: string;
}

export const VideoUploadService = {
    async uploadVideo({
        fileUri,
        userId,
        entityType,
        entityId,
        visibility,
        note,
    }: UploadVideoParams) {
        try {
            // 1. Bucket Selection
            const bucketName =
                visibility === 'public' ? 'public_videos' : 'secure_videos';

            // 2. Path Generation
            const fileExt = fileUri.split('.').pop() || 'mp4';
            const fileName = `${uuidv4()}.${fileExt}`;
            const storagePath = `${userId}/${entityType}/${fileName}`;

            // 3. Prepare File for Upload
            // For React Native/Expo, we often need to read as base64 or blob.
            // Supabase supports FormData too, but let's stick to arrayBuffer if possible or FormData.
            // Using FormData is often more reliable for large files in RN.

            const formData = new FormData();
            formData.append('file', {
                uri: fileUri,
                name: fileName,
                type: `video/${fileExt}`,
            } as any);

            // 4. Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(storagePath, formData, {
                    contentType: `video/${fileExt}`,
                    upsert: false,
                });

            if (uploadError) {
                throw new Error(`Storage upload failed: ${uploadError.message}`);
            }

            // 5. DB Record Insertion
            const videoUrl =
                visibility === 'public'
                    ? supabase.storage.from(bucketName).getPublicUrl(storagePath).data.publicUrl
                    : storagePath; // For secure videos, we'll store the path and sign it on demand

            if (entityType === 'training') {
                const { error: dbError } = await supabase
                    .from('training_videos')
                    .insert({
                        training_activity_id: entityId,
                        video_url: videoUrl,
                        bucket_id: bucketName,
                        visibility: visibility,
                        storage_path: storagePath,
                        note: note,
                    });
                if (dbError) throw new Error(`DB insert failed: ${dbError.message}`);
            } else {
                const { error: dbError } = await supabase
                    .from('competition_videos')
                    .insert({
                        competition_match_id: entityId, // Make sure column name matches DB
                        video_url: videoUrl,
                        bucket_id: bucketName,
                        visibility: visibility,
                        storage_path: storagePath,
                        note: note,
                    });
                if (dbError) throw new Error(`DB insert failed: ${dbError.message}`);
            }

            return { success: true, path: storagePath };
        } catch (error) {
            console.error('Video Upload Error:', error);
            throw error;
        }
    },
};

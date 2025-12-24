import { supabase } from '../lib/supabase';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export interface UploadContentData {
  title: string;
  type: 'movie' | 'series' | 'podcast';
  genre: string[];
  description: string;
  duration?: string;
  language?: string[];
  videoFile?: string; // local file URI
}

export async function uploadVideo(
  fileUri: string,
  userId: string
): Promise<{ data: string | null; error: string | null }> {
  try {
    const fileExt = fileUri.split('.').pop();
    const fileName = `${userId}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    let fileData: ArrayBuffer;

    if (Platform.OS === 'web') {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      fileData = await blob.arrayBuffer();
    } else {
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      fileData = bytes.buffer;
    }

    const { data, error } = await supabase.storage
      .from('videos')
      .upload(filePath, fileData, {
        contentType: `video/${fileExt}`,
        upsert: false,
      });

    if (error) {
      return { data: null, error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath);

    return { data: publicUrlData.publicUrl, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Upload failed' };
  }
}

export async function uploadThumbnail(
  fileUri: string,
  userId: string
): Promise<{ data: string | null; error: string | null }> {
  try {
    const fileExt = fileUri.split('.').pop();
    const fileName = `thumb_${userId}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    let fileData: ArrayBuffer;

    if (Platform.OS === 'web') {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      fileData = await blob.arrayBuffer();
    } else {
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      fileData = bytes.buffer;
    }

    const { data, error } = await supabase.storage
      .from('videos')
      .upload(filePath, fileData, {
        contentType: `image/${fileExt}`,
        upsert: false,
      });

    if (error) {
      return { data: null, error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath);

    return { data: publicUrlData.publicUrl, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Thumbnail upload failed' };
  }
}

export async function createContent(
  contentData: UploadContentData,
  userId: string,
  videoUrl: string,
  thumbnailUrl: string
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.from('content').insert({
      title: contentData.title,
      type: contentData.type,
      genre: contentData.genre,
      description: contentData.description,
      duration: contentData.duration,
      language: contentData.language || ['English'],
      video_url: videoUrl,
      thumbnail: thumbnailUrl,
      uploaded_by: userId,
      featured: false,
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to create content' };
  }
}

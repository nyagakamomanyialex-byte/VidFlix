import { supabase } from '../lib/supabase';
import { Content } from './contentService';

export async function getFavorites(userId: string): Promise<{ data: Content[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('content_id, content(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    const favorites = data?.map((item: any) => item.content as Content) || [];
    return { data: favorites, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch favorites' };
  }
}

export async function addFavorite(userId: string, contentId: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, content_id: contentId });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to add favorite' };
  }
}

export async function removeFavorite(userId: string, contentId: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('content_id', contentId);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to remove favorite' };
  }
}

export async function isFavorite(userId: string, contentId: string): Promise<{ data: boolean; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('content_id', contentId)
      .maybeSingle();

    if (error) {
      return { data: false, error: error.message };
    }

    return { data: !!data, error: null };
  } catch (err) {
    return { data: false, error: err instanceof Error ? err.message : 'Failed to check favorite status' };
  }
}

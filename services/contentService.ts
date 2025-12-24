import { supabase } from '../lib/supabase';

export interface Content {
  id: string;
  title: string;
  type: 'movie' | 'series' | 'podcast' | 'live';
  genre: string[];
  thumbnail: string;
  description: string;
  duration?: string;
  rating?: number;
  year?: number;
  featured?: boolean;
  language?: string[];
  video_url?: string;
  created_at?: string;
  updated_at?: string;
}

export async function getAllContent(): Promise<{ data: Content[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Content[], error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch content' };
  }
}

export async function getFeaturedContent(): Promise<{ data: Content[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Content[], error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch featured content' };
  }
}

export async function getContentByGenre(genre: string): Promise<{ data: Content[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .contains('genre', [genre])
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Content[], error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch content by genre' };
  }
}

export async function getContentByType(type: 'movie' | 'series' | 'podcast' | 'live'): Promise<{ data: Content[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Content[], error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch content by type' };
  }
}

export async function searchContent(query: string): Promise<{ data: Content[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Content[], error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to search content' };
  }
}

export async function getContentById(id: string): Promise<{ data: Content | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Content, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch content' };
  }
}

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import * as contentService from '../services/contentService';
import { Content } from '../services/contentService';

export const genres = [
  { id: '0', name: 'Live', color: '#EF4444' },
  { id: '1', name: 'Action', color: '#0EA5E9' },
  { id: '2', name: 'Adventure', color: '#EF4444' },
  { id: '3', name: 'Comedy', color: '#F59E0B' },
  { id: '4', name: 'Drama', color: '#10B981' },
  { id: '5', name: 'Horror', color: '#8B5CF6' },
  { id: '6', name: 'Sci-Fi', color: '#06B6D4' },
];

export function useStreaming() {
  const [allContent, setAllContent] = useState<Content[]>([]);
  const [featuredContent, setFeaturedContent] = useState<Content[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setIsLoading(true);
    setError(null);

    const [allContentResult, featuredResult] = await Promise.all([
      contentService.getAllContent(),
      contentService.getFeaturedContent(),
    ]);

    if (allContentResult.error) {
      setError(allContentResult.error);
    } else {
      setAllContent(allContentResult.data || []);
    }

    if (featuredResult.error) {
      setError(featuredResult.error);
    } else {
      setFeaturedContent(featuredResult.data || []);
    }

    setIsLoading(false);
  };

  const filterByGenre = (genre: string) => {
    setSelectedGenre(genre);
  };

  const getFilteredContent = (): Content[] => {
    if (selectedGenre === 'All') return allContent;
    if (selectedGenre === 'Live') return allContent.filter((item) => item.type === 'live');
    return allContent.filter((item) => item.genre.includes(selectedGenre));
  };

  const toggleFavorite = (contentId: string) => {
    setFavorites((prev) =>
      prev.includes(contentId)
        ? prev.filter((id) => id !== contentId)
        : [...prev, contentId]
    );
  };

  const isFavorite = (contentId: string): boolean => {
    return favorites.includes(contentId);
  };

  const getFavorites = (): Content[] => {
    return allContent.filter((item) => favorites.includes(item.id));
  };

  const searchContent = (query: string): Content[] => {
    const lowercaseQuery = query.toLowerCase();
    return allContent.filter((c) =>
      c.title.toLowerCase().includes(lowercaseQuery) ||
      c.description.toLowerCase().includes(lowercaseQuery) ||
      c.genre.some((g) => g.toLowerCase().includes(lowercaseQuery))
    );
  };

  const getContentByType = (type: 'movie' | 'series' | 'podcast' | 'live'): Content[] => {
    return allContent.filter((c) => c.type === type);
  };

  return {
    allContent,
    featuredContent,
    selectedGenre,
    genres,
    isLoading,
    error,
    filterByGenre,
    getFilteredContent,
    toggleFavorite,
    isFavorite,
    getFavorites,
    getContentByType,
    searchContent,
    refreshContent: loadContent,
  };
}

import { useState, useEffect } from 'react';
import { 
  Content, 
  mockContent, 
  getFeaturedContent, 
  getContentByGenre,
  getContentByType,
  searchContent,
  genres 
} from '../services/mockStreamingService';

export function useStreaming() {
  const [allContent, setAllContent] = useState<Content[]>([]);
  const [featuredContent, setFeaturedContent] = useState<Content[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = () => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setAllContent(mockContent);
      setFeaturedContent(getFeaturedContent());
      setIsLoading(false);
    }, 500);
  };

  const filterByGenre = (genre: string) => {
    setSelectedGenre(genre);
  };

  const getFilteredContent = (): Content[] => {
    return getContentByGenre(selectedGenre);
  };

  const toggleFavorite = (contentId: string) => {
    setFavorites(prev => 
      prev.includes(contentId) 
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  const isFavorite = (contentId: string): boolean => {
    return favorites.includes(contentId);
  };

  const getFavorites = (): Content[] => {
    return allContent.filter(c => favorites.includes(c.id));
  };

  return {
    allContent,
    featuredContent,
    selectedGenre,
    genres,
    isLoading,
    filterByGenre,
    getFilteredContent,
    toggleFavorite,
    isFavorite,
    getFavorites,
    getContentByType,
    searchContent,
  };
}

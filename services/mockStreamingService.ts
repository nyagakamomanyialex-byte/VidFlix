export interface Content {
  id: string;
  title: string;
  type: 'movie' | 'series' | 'podcast';
  genre: string[];
  thumbnail: string;
  description: string;
  duration?: string;
  rating?: number;
  year?: number;
  featured?: boolean;
  language?: string[];
}

export const mockContent: Content[] = [
  // Featured content
  {
    id: '1',
    title: 'Maleficent: Mistress of Evil',
    type: 'movie',
    genre: ['Adventure', 'Fantasy'],
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=400&fit=crop',
    description: 'A powerful fairy and her goddaughter face new challenges.',
    duration: '2h 15m',
    rating: 7.5,
    year: 2019,
    featured: true,
    language: ['English', 'Hindi'],
  },
  {
    id: '2',
    title: 'The Dark Knight',
    type: 'movie',
    genre: ['Action', 'Drama'],
    thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800&h=400&fit=crop',
    description: 'Batman faces his greatest challenge against the Joker.',
    duration: '2h 32m',
    rating: 9.0,
    year: 2008,
    featured: true,
    language: ['English'],
  },
  {
    id: '3',
    title: 'Inception',
    type: 'movie',
    genre: ['Sci-Fi', 'Action'],
    thumbnail: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=400&fit=crop',
    description: 'A thief who steals secrets through dream-sharing technology.',
    duration: '2h 28m',
    rating: 8.8,
    year: 2010,
    featured: true,
    language: ['English'],
  },
  
  // Action movies
  {
    id: '4',
    title: 'Mad Max: Fury Road',
    type: 'movie',
    genre: ['Action', 'Adventure'],
    thumbnail: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
    description: 'A post-apocalyptic action adventure.',
    duration: '2h 0m',
    rating: 8.1,
    year: 2015,
    language: ['English'],
  },
  {
    id: '5',
    title: 'John Wick',
    type: 'movie',
    genre: ['Action', 'Thriller'],
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
    description: 'An ex-hitman seeks vengeance.',
    duration: '1h 41m',
    rating: 7.4,
    year: 2014,
    language: ['English'],
  },
  {
    id: '6',
    title: 'Mission: Impossible',
    type: 'movie',
    genre: ['Action', 'Adventure'],
    thumbnail: 'https://images.unsplash.com/photo-1574267432644-f248f5be0b96?w=400&h=600&fit=crop',
    description: 'Ethan Hunt and his team tackle impossible missions.',
    duration: '2h 27m',
    rating: 7.7,
    year: 2018,
    language: ['English'],
  },
  
  // Comedy
  {
    id: '7',
    title: 'The Grand Budapest Hotel',
    type: 'movie',
    genre: ['Comedy', 'Drama'],
    thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop',
    description: 'Adventures of a legendary concierge.',
    duration: '1h 40m',
    rating: 8.1,
    year: 2014,
    language: ['English'],
  },
  {
    id: '8',
    title: 'Superbad',
    type: 'movie',
    genre: ['Comedy'],
    thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
    description: 'Two high school friends on an adventure.',
    duration: '1h 53m',
    rating: 7.6,
    year: 2007,
    language: ['English'],
  },
  
  // Drama
  {
    id: '9',
    title: 'The Shawshank Redemption',
    type: 'movie',
    genre: ['Drama'],
    thumbnail: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=600&fit=crop',
    description: 'Two imprisoned men bond over years.',
    duration: '2h 22m',
    rating: 9.3,
    year: 1994,
    language: ['English'],
  },
  {
    id: '10',
    title: 'Forrest Gump',
    type: 'movie',
    genre: ['Drama', 'Romance'],
    thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=600&fit=crop',
    description: 'The extraordinary life of an ordinary man.',
    duration: '2h 22m',
    rating: 8.8,
    year: 1994,
    language: ['English'],
  },
  
  // Podcasts
  {
    id: '11',
    title: 'Tech Talk Daily',
    type: 'podcast',
    genre: ['Technology'],
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=600&fit=crop',
    description: 'Latest news and trends in technology.',
    duration: '45m',
    rating: 4.5,
    language: ['English'],
  },
  {
    id: '12',
    title: 'True Crime Stories',
    type: 'podcast',
    genre: ['Crime', 'Documentary'],
    thumbnail: 'https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?w=400&h=600&fit=crop',
    description: 'Deep dives into real crime cases.',
    duration: '1h 10m',
    rating: 4.8,
    language: ['English'],
  },
];

export const genres = [
  { id: '1', name: 'Action', color: '#0EA5E9' },
  { id: '2', name: 'Adventure', color: '#EF4444' },
  { id: '3', name: 'Comedy', color: '#F59E0B' },
  { id: '4', name: 'Drama', color: '#10B981' },
  { id: '5', name: 'Horror', color: '#8B5CF6' },
  { id: '6', name: 'Sci-Fi', color: '#06B6D4' },
];

export function getFeaturedContent(): Content[] {
  return mockContent.filter(c => c.featured);
}

export function getContentByGenre(genre: string): Content[] {
  if (genre === 'All') return mockContent;
  return mockContent.filter(c => c.genre.includes(genre));
}

export function getContentByType(type: 'movie' | 'series' | 'podcast'): Content[] {
  return mockContent.filter(c => c.type === type);
}

export function searchContent(query: string): Content[] {
  const lowercaseQuery = query.toLowerCase();
  return mockContent.filter(c => 
    c.title.toLowerCase().includes(lowercaseQuery) ||
    c.description.toLowerCase().includes(lowercaseQuery) ||
    c.genre.some(g => g.toLowerCase().includes(lowercaseQuery))
  );
}

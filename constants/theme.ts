export const colors = {
  // Dark theme
  background: '#000000',
  surface: '#1a1a1a',
  surfaceLight: '#2a2a2a',
  
  // Brand colors
  primary: '#E50914',
  primaryDark: '#B20710',
  
  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textMuted: '#808080',
  
  // Genre colors
  genreAction: '#0EA5E9',
  genreAdventure: '#EF4444',
  genreComedy: '#F59E0B',
  genreDrama: '#10B981',
  genreHorror: '#8B5CF6',
  genreSciFi: '#06B6D4',
  
  // UI elements
  border: '#333333',
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // Status
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  // Font sizes
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,
  
  // Font weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const layout = {
  cardWidth: 140,
  cardHeight: 200,
  heroHeight: 400,
};

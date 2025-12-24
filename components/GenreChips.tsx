import React from 'react';
import { View, ScrollView, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

interface Genre {
  id: string;
  name: string;
  color: string;
}

interface GenreChipsProps {
  genres: Genre[];
  selectedGenre: string;
  onGenreSelect: (genre: string) => void;
}

export function GenreChips({ genres, selectedGenre, onGenreSelect }: GenreChipsProps) {
  const allGenres = [{ id: '0', name: 'All', color: colors.primary }, ...genres];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {allGenres.map((genre) => {
          const isSelected = selectedGenre === genre.name;
          return (
            <Pressable
              key={genre.id}
              onPress={() => onGenreSelect(genre.name)}
              style={({ pressed }) => [
                styles.chip,
                isSelected && { backgroundColor: genre.color },
                pressed && styles.chipPressed,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                ]}
              >
                {genre.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 60,
    paddingVertical: spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    alignItems: 'center',
  },
  chip: {
    height: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipPressed: {
    opacity: 0.7,
  },
  chipText: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.textPrimary,
  },
});

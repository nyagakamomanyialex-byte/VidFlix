import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { HeroCarousel } from '../../components/HeroCarousel';
import { GenreChips } from '../../components/GenreChips';
import { ContentSection } from '../../components/ContentSection';
import { useStreaming } from '../../hooks/useStreaming';
import { colors, spacing, typography } from '../../constants/theme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    featuredContent,
    genres,
    selectedGenre,
    filterByGenre,
    getFilteredContent,
    toggleFavorite,
    isFavorite,
    getContentByType,
  } = useStreaming();

  const filteredContent = getFilteredContent();
  const movies = getContentByType('movie').slice(0, 6);
  const podcasts = getContentByType('podcast');

  const handleContentPress = (content: any) => {
    router.push({
      pathname: '/player',
      params: { id: content.id, title: content.title },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.logo}>VidFlix</Text>
        <Pressable hitSlop={8}>
          <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <HeroCarousel
          items={featuredContent}
          onItemPress={handleContentPress}
        />

        <View style={styles.genreSection}>
          <Text style={styles.sectionTitle}>Explore by Genre</Text>
          <GenreChips
            genres={genres}
            selectedGenre={selectedGenre}
            onGenreSelect={filterByGenre}
          />
        </View>

        <ContentSection
          title="Specials & Latest Movies"
          items={filteredContent.slice(0, 6)}
          onItemPress={handleContentPress}
          onFavoritePress={toggleFavorite}
          isFavorite={isFavorite}
          showMore
        />

        <ContentSection
          title="Multiplex Movies"
          items={movies}
          onItemPress={handleContentPress}
          onFavoritePress={toggleFavorite}
          isFavorite={isFavorite}
          showMore
        />

        {podcasts.length > 0 && (
          <ContentSection
            title="Popular Podcasts"
            items={podcasts}
            onItemPress={handleContentPress}
            onFavoritePress={toggleFavorite}
            isFavorite={isFavorite}
          />
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  logo: {
    fontSize: typography.h2,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  genreSection: {
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.h3,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});

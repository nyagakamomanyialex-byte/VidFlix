import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { HeroCarousel } from '../../components/HeroCarousel';
import { GenreChips } from '../../components/GenreChips';
import { ContentSection } from '../../components/ContentSection';
import { useStreaming } from '../../hooks/useStreaming';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const {
    featuredContent,
    genres,
    selectedGenre,
    filterByGenre,
    getFilteredContent,
    toggleFavorite,
    isFavorite,
    getContentByType,
    isLoading,
  } = useStreaming();

  const filteredContent = getFilteredContent();
  const movies = getContentByType('movie').slice(0, 6);
  const podcasts = getContentByType('podcast');
  const liveStreams = getContentByType('live');

  const handleContentPress = (content: any) => {
    router.push({
      pathname: '/player',
      params: { id: content.id, title: content.title },
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading content...</Text>
      </View>
    );
  }

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

        {liveStreams.length > 0 && (
          <ContentSection
            title="🔴 Live Now"
            items={liveStreams}
            onItemPress={handleContentPress}
            onFavoritePress={toggleFavorite}
            isFavorite={isFavorite}
          />
        )}

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

      {user && (
        <Pressable
          style={({ pressed }) => [
            styles.fab,
            { bottom: insets.bottom + 80 },
            pressed && styles.fabPressed,
          ]}
          onPress={() => router.push('/upload')}
        >
          <Ionicons name="add" size={28} color={colors.textPrimary} />
        </Pressable>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});

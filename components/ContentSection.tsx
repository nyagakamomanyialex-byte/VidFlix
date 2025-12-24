import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Content } from '../services/mockStreamingService';
import { ContentCard } from './ContentCard';
import { colors, spacing, typography } from '../constants/theme';

interface ContentSectionProps {
  title: string;
  items: Content[];
  onItemPress?: (item: Content) => void;
  onFavoritePress?: (itemId: string) => void;
  isFavorite?: (itemId: string) => boolean;
  showMore?: boolean;
  onShowMore?: () => void;
}

export function ContentSection({
  title,
  items,
  onItemPress,
  onFavoritePress,
  isFavorite,
  showMore,
  onShowMore,
}: ContentSectionProps) {
  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {showMore && (
          <Pressable onPress={onShowMore} hitSlop={8}>
            <Text style={styles.moreButton}>MORE</Text>
          </Pressable>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            isFavorite={isFavorite?.(item.id)}
            onPress={() => onItemPress?.(item)}
            onFavoritePress={() => onFavoritePress?.(item.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.h3,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  moreButton: {
    fontSize: typography.bodySmall,
    fontWeight: typography.bold,
    color: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
});

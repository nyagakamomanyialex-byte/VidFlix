import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Dimensions, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Content } from '../services/mockStreamingService';
import { colors, spacing, layout } from '../constants/theme';

interface HeroCarouselProps {
  items: Content[];
  onItemPress?: (item: Content) => void;
}

export function HeroCarousel({ items, onItemPress }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get('window');

  useEffect(() => {
    if (items.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % items.length;
      setActiveIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, items.length, width]);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setActiveIndex(index);
  };

  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {items.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => onItemPress?.(item)}
            style={[styles.slide, { width }]}
          >
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.image}
              contentFit="cover"
            />
            <LinearGradient
              colors={['transparent', colors.background]}
              style={styles.gradient}
            />
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {items.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: layout.heroHeight,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    height: layout.heroHeight,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  pagination: {
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textMuted,
    opacity: 0.5,
  },
  activeDot: {
    backgroundColor: colors.primary,
    opacity: 1,
    width: 24,
  },
});

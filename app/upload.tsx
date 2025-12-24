import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../hooks/useAuth';
import { uploadVideo, uploadThumbnail, createContent } from '../services/uploadService';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

const CONTENT_TYPES = ['movie', 'series', 'podcast'] as const;
const GENRES = ['Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Documentary'];

export default function UploadScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'movie' | 'series' | 'podcast'>('movie');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [duration, setDuration] = useState('');
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['video/*', 'audio/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setVideoFile(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Error picking video:', err);
    }
  };

  const pickThumbnail = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setThumbnailFile(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Error picking thumbnail:', err);
    }
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  const handleUpload = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to upload content');
      return;
    }

    if (!title || !description || !videoFile || !thumbnailFile || selectedGenres.length === 0) {
      Alert.alert('Missing Fields', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    setUploadProgress('Uploading video...');

    const { data: videoUrl, error: videoError } = await uploadVideo(videoFile, user.id);

    if (videoError || !videoUrl) {
      setLoading(false);
      setUploadProgress('');
      Alert.alert('Upload Failed', videoError || 'Failed to upload video');
      return;
    }

    setUploadProgress('Uploading thumbnail...');

    const { data: thumbnailUrl, error: thumbnailError } = await uploadThumbnail(
      thumbnailFile,
      user.id
    );

    if (thumbnailError || !thumbnailUrl) {
      setLoading(false);
      setUploadProgress('');
      Alert.alert('Upload Failed', thumbnailError || 'Failed to upload thumbnail');
      return;
    }

    setUploadProgress('Creating content...');

    const { error: contentError } = await createContent(
      {
        title,
        type,
        genre: selectedGenres,
        description,
        duration,
      },
      user.id,
      videoUrl,
      thumbnailUrl
    );

    setLoading(false);
    setUploadProgress('');

    if (contentError) {
      Alert.alert('Error', contentError);
    } else {
      Alert.alert('Success', 'Content uploaded successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Upload Content',
          headerTintColor: colors.textPrimary,
          headerStyle: { backgroundColor: colors.background },
        }}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter content title"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
            editable={!loading}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your content"
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!loading}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Content Type *</Text>
          <View style={styles.typeContainer}>
            {CONTENT_TYPES.map((contentType) => (
              <Pressable
                key={contentType}
                style={[
                  styles.typeButton,
                  type === contentType && styles.typeButtonActive,
                ]}
                onPress={() => setType(contentType)}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    type === contentType && styles.typeButtonTextActive,
                  ]}
                >
                  {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Genres * (Select multiple)</Text>
          <View style={styles.genreGrid}>
            {GENRES.map((genre) => (
              <Pressable
                key={genre}
                style={[
                  styles.genreChip,
                  selectedGenres.includes(genre) && styles.genreChipActive,
                ]}
                onPress={() => toggleGenre(genre)}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.genreChipText,
                    selectedGenres.includes(genre) && styles.genreChipTextActive,
                  ]}
                >
                  {genre}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Duration (e.g., 2h 15m)</Text>
          <TextInput
            style={styles.input}
            placeholder="1h 30m"
            placeholderTextColor={colors.textMuted}
            value={duration}
            onChangeText={setDuration}
            editable={!loading}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Video/Audio File *</Text>
          <Pressable
            style={({ pressed }) => [
              styles.fileButton,
              pressed && styles.fileButtonPressed,
            ]}
            onPress={pickVideo}
            disabled={loading}
          >
            <Ionicons name="cloud-upload-outline" size={24} color={colors.primary} />
            <Text style={styles.fileButtonText}>
              {videoFile ? 'File selected' : 'Choose video or audio file'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Thumbnail Image *</Text>
          <Pressable
            style={({ pressed }) => [
              styles.fileButton,
              pressed && styles.fileButtonPressed,
            ]}
            onPress={pickThumbnail}
            disabled={loading}
          >
            <Ionicons name="image-outline" size={24} color={colors.primary} />
            <Text style={styles.fileButtonText}>
              {thumbnailFile ? 'Thumbnail selected' : 'Choose thumbnail image'}
            </Text>
          </Pressable>
        </View>

        {uploadProgress ? (
          <View style={styles.progressContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.progressText}>{uploadProgress}</Text>
          </View>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            styles.uploadButton,
            pressed && styles.uploadButtonPressed,
            loading && styles.uploadButtonDisabled,
          ]}
          onPress={handleUpload}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.textPrimary} />
          ) : (
            <>
              <Ionicons name="cloud-upload" size={20} color={colors.textPrimary} />
              <Text style={styles.uploadButtonText}>Upload Content</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.bodySmall,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    fontSize: typography.body,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 100,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
  typeButtonTextActive: {
    color: colors.textPrimary,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  genreChip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  genreChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genreChipText: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
  },
  genreChipTextActive: {
    color: colors.textPrimary,
  },
  fileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    backgroundColor: colors.surface,
  },
  fileButtonPressed: {
    opacity: 0.7,
  },
  fileButtonText: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  progressText: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    minHeight: 50,
  },
  uploadButtonPressed: {
    opacity: 0.8,
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    fontSize: typography.body,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
});

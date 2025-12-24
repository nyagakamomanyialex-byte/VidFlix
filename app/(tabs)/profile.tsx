import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface MenuItemProps {
  icon: string;
  title: string;
  onPress: () => void;
  showArrow?: boolean;
}

function MenuItem({ icon, title, onPress, showArrow = true }: MenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon as any} size={24} color={colors.textPrimary} />
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      )}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            setLoggingOut(true);
            const { error } = await signOut();
            setLoggingOut(false);
            if (error) {
              Alert.alert('Error', error);
            } else {
              router.replace('/login');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color={colors.textPrimary} />
          </View>
          <Text style={styles.userName}>
            {user?.user_metadata?.username || user?.email?.split('@')[0] || 'Guest User'}
          </Text>
          <Text style={styles.userEmail}>{user?.email || 'Not logged in'}</Text>
          {!user && (
            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.loginButtonPressed,
              ]}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.loginButtonText}>Sign In</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon="person-outline"
              title="Edit Profile"
              onPress={() => {}}
            />
            <MenuItem
              icon="card-outline"
              title="Subscription"
              onPress={() => {}}
            />
            <MenuItem
              icon="notifications-outline"
              title="Notifications"
              onPress={() => {}}
            />
            <MenuItem
              icon="language-outline"
              title="Language"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content</Text>
          <View style={styles.menuGroup}>
            {user && (
              <MenuItem
                icon="cloud-upload-outline"
                title="Upload Content"
                onPress={() => router.push('/upload')}
              />
            )}
            <MenuItem
              icon="download-outline"
              title="Downloads"
              onPress={() => {}}
            />
            <MenuItem
              icon="time-outline"
              title="Watch History"
              onPress={() => {}}
            />
            <MenuItem
              icon="settings-outline"
              title="Playback Settings"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon="help-circle-outline"
              title="Help & Support"
              onPress={() => {}}
            />
            <MenuItem
              icon="document-text-outline"
              title="Terms of Service"
              onPress={() => {}}
            />
            <MenuItem
              icon="shield-checkmark-outline"
              title="Privacy Policy"
              onPress={() => {}}
            />
            <MenuItem
              icon="information-circle-outline"
              title="About"
              onPress={() => {}}
            />
          </View>
        </View>

        {user && (
          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.logoutButtonPressed,
              loggingOut && styles.logoutButtonDisabled,
            ]}
            onPress={handleLogout}
            disabled={loggingOut}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.primary} />
            <Text style={styles.logoutText}>
              {loggingOut ? 'Logging out...' : 'Log Out'}
            </Text>
          </Pressable>
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: typography.h2,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  userName: {
    fontSize: typography.h3,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.bodySmall,
    fontWeight: typography.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  menuGroup: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    minHeight: 56,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemPressed: {
    backgroundColor: colors.surfaceLight,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuItemText: {
    fontSize: typography.body,
    color: colors.textPrimary,
    fontWeight: typography.medium,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  logoutButtonPressed: {
    backgroundColor: colors.surface,
  },
  logoutText: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
    color: colors.primary,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  loginButtonPressed: {
    opacity: 0.8,
  },
  loginButtonText: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  bottomSpacing: {
    height: spacing.xxl,
  },
});

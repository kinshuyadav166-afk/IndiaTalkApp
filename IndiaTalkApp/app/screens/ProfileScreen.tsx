/**
 * ProfileScreen - User Profile & Settings
 * View user profile and manage account settings
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/contexts/AuthContext';
import { useColors } from '@/hooks/use-colors';
import { apiService } from '@/services/api';
import { User } from '@/types';

export default function ProfileScreen() {
  const colors = useColors();
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            setIsLoading(true);
            await signOut();
          } catch (error) {
            Alert.alert('Error', 'Failed to logout');
          } finally {
            setIsLoading(false);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const MenuItem = ({
    icon,
    label,
    onPress,
  }: {
    icon: string;
    label: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center gap-3 bg-surface rounded-lg p-4 mb-2 border border-border active:opacity-70"
    >
      <Text className="text-2xl">{icon}</Text>
      <Text className="text-base font-semibold text-foreground flex-1">{label}</Text>
      <Text className="text-lg text-muted">›</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Profile Header */}
        <View className="items-center py-6 border-b border-border mb-6">
          <Image
            source={{ uri: user?.avatar }}
            className="w-24 h-24 rounded-full mb-4"
          />
          <Text className="text-2xl font-bold text-foreground mb-1">{user?.name}</Text>
          <Text className="text-sm text-muted mb-3">{user?.email}</Text>
          {user?.bio && (
            <Text className="text-sm text-muted text-center px-4">{user.bio}</Text>
          )}

          {/* Languages */}
          {user?.languages && user.languages.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mt-3 justify-center">
              {user.languages.map(lang => (
                <View key={lang} className="bg-primary/10 rounded-full px-3 py-1">
                  <Text className="text-xs font-semibold text-primary">🌐 {lang}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Location */}
          {user?.location && (
            <Text className="text-xs text-muted mt-3">
              📍 {user.location.district || user.location.state}
            </Text>
          )}
        </View>

        {/* Menu Items */}
        <View className="mb-6">
          <Text className="text-xs font-bold text-muted uppercase tracking-wider mb-3 px-1">
            Account
          </Text>
          <MenuItem icon="📝" label="My Posts" onPress={() => {}} />
          <MenuItem icon="💼" label="Applications" onPress={() => {}} />
          <MenuItem icon="⭐" label="Saved" onPress={() => {}} />
        </View>

        <View className="mb-6">
          <Text className="text-xs font-bold text-muted uppercase tracking-wider mb-3 px-1">
            Settings
          </Text>
          <MenuItem icon="🔔" label="Notifications" onPress={() => {}} />
          <MenuItem icon="⚙️" label="Settings" onPress={() => {}} />
          <MenuItem icon="📞" label="Help & Support" onPress={() => {}} />
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          disabled={isLoading}
          className="w-full py-4 rounded-lg items-center border border-error mb-6"
          style={{ opacity: isLoading ? 0.6 : 1 }}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.error} size="small" />
          ) : (
            <Text className="text-base font-bold text-error">Logout</Text>
          )}
        </TouchableOpacity>

        {/* App Version */}
        <View className="items-center pb-6">
          <Text className="text-xs text-muted">IndiaTalk v1.0.0</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

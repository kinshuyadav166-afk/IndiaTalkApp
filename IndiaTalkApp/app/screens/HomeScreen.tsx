/**
 * HomeScreen - Language-First Feed
 * Main feed with posts filtered by language and location
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Pressable,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '@/components/screen-container';
import { PostCard } from '@/components/PostCard';
import { useColors } from '@/hooks/use-colors';
import { apiService } from '@/services/api';
import { Post, LANGUAGES, INDIAN_STATES } from '@/types';
import { cn } from '@/lib/utils';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const colors = useColors();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(undefined);
  const [selectedState, setSelectedState] = useState<string | undefined>(undefined);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);

  useEffect(() => {
    loadPosts();
  }, [selectedLanguage, selectedState]);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getPosts({
        language: selectedLanguage,
        location: selectedState ? { state: selectedState } : undefined,
      });
      setPosts(response.items);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadPosts();
    setIsRefreshing(false);
  };

  const handlePostPress = (postId: string) => {
    navigation.navigate('PostDetail', { postId });
  };

  const handleLike = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
      if (post.isLiked) {
        await apiService.unlikePost(postId);
      } else {
        await apiService.likePost(postId);
      }
      // Update local state
      setPosts(
        posts.map(p =>
          p.id === postId
            ? {
                ...p,
                isLiked: !p.isLiked,
                likes: p.isLiked ? p.likes - 1 : p.likes + 1,
              }
            : p
        )
      );
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  return (
    <ScreenContainer className="flex-1">
      {/* Header */}
      <View className="pb-4 border-b border-border">
        <Text className="text-2xl font-bold text-foreground mb-4">IndiaTalk</Text>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row gap-2"
        >
          {/* Language Filter */}
          <Pressable
            onPress={() => {
              setShowLanguageMenu(!showLanguageMenu);
              setShowLocationMenu(false);
            }}
            className={cn(
              'px-4 py-2 rounded-full border',
              selectedLanguage
                ? 'bg-primary border-primary'
                : 'bg-surface border-border'
            )}
          >
            <Text
              className={cn(
                'text-sm font-semibold',
                selectedLanguage ? 'text-white' : 'text-foreground'
              )}
            >
              {selectedLanguage || '🌐 Language'}
            </Text>
          </Pressable>

          {/* Location Filter */}
          <Pressable
            onPress={() => {
              setShowLocationMenu(!showLocationMenu);
              setShowLanguageMenu(false);
            }}
            className={cn(
              'px-4 py-2 rounded-full border',
              selectedState
                ? 'bg-secondary border-secondary'
                : 'bg-surface border-border'
            )}
          >
            <Text
              className={cn(
                'text-sm font-semibold',
                selectedState ? 'text-white' : 'text-foreground'
              )}
            >
              {selectedState || '📍 Location'}
            </Text>
          </Pressable>

          {/* Clear Filters */}
          {(selectedLanguage || selectedState) && (
            <Pressable
              onPress={() => {
                setSelectedLanguage(undefined);
                setSelectedState(undefined);
              }}
              className="px-3 py-2 rounded-full bg-error/10 border border-error"
            >
              <Text className="text-xs font-semibold text-error">Clear</Text>
            </Pressable>
          )}
        </ScrollView>
      </View>

      {/* Language Menu */}
      {showLanguageMenu && (
        <View className="bg-surface border-b border-border p-3 max-h-40">
          <ScrollView showsVerticalScrollIndicator={false}>
            {LANGUAGES.map(lang => (
              <Pressable
                key={lang}
                onPress={() => {
                  setSelectedLanguage(selectedLanguage === lang ? undefined : lang);
                  setShowLanguageMenu(false);
                }}
                className="py-2 px-3"
              >
                <Text
                  className={cn(
                    'text-sm',
                    selectedLanguage === lang
                      ? 'font-bold text-primary'
                      : 'text-foreground'
                  )}
                >
                  {lang}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Location Menu */}
      {showLocationMenu && (
        <View className="bg-surface border-b border-border p-3 max-h-40">
          <ScrollView showsVerticalScrollIndicator={false}>
            {INDIAN_STATES.map(state => (
              <Pressable
                key={state}
                onPress={() => {
                  setSelectedState(selectedState === state ? undefined : state);
                  setShowLocationMenu(false);
                }}
                className="py-2 px-3"
              >
                <Text
                  className={cn(
                    'text-sm',
                    selectedState === state
                      ? 'font-bold text-secondary'
                      : 'text-foreground'
                  )}
                >
                  {state}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Posts Feed */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : posts.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-2xl mb-2">📭</Text>
          <Text className="text-lg font-semibold text-foreground mb-1">No Posts Available</Text>
          <Text className="text-sm text-muted text-center">
            Try adjusting your filters or check back later
          </Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onPress={() => handlePostPress(item.id)}
              onLike={() => handleLike(item.id)}
            />
          )}
          contentContainerStyle={{ paddingVertical: 12 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenContainer>
  );
}

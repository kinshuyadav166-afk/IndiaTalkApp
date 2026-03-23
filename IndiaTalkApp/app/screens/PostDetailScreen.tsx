/**
 * PostDetailScreen - Individual Post View
 * Full view of a single post with comments and interactions
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Pressable,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { apiService } from '@/services/api';
import { Post } from '@/types';
import { cn } from '@/lib/utils';

export default function PostDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const colors = useColors();
  const { postId } = route.params;

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    try {
      setIsLoading(true);
      const postData = await apiService.getPostDetail(postId);
      setPost(postData);
    } catch (error) {
      console.error('Failed to load post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;

    try {
      if (post.isLiked) {
        await apiService.unlikePost(post.id);
      } else {
        await apiService.likePost(post.id);
      }

      setPost({
        ...post,
        isLiked: !post.isLiked,
        likes: post.isLiked ? post.likes - 1 : post.likes + 1,
      });
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;

    try {
      setIsSubmitting(true);
      // In a real app, this would send the comment to the API
      setComment('');
      // Show success feedback
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (!post) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <Text className="text-lg text-foreground">Post not found</Text>
      </ScreenContainer>
    );
  }

  const formatTime = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now.getTime() - postDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return postDate.toLocaleDateString();
  };

  return (
    <ScreenContainer className="flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-between pb-4 border-b border-border">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-foreground">Post</Text>
        <View className="w-6" />
      </View>

      {/* Post Content */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="bg-surface rounded-xl p-4 mt-4 border border-border">
          {/* Author Info */}
          <View className="flex-row items-center mb-4">
            <Image
              source={{ uri: post.author.avatar }}
              className="w-14 h-14 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className="text-base font-semibold text-foreground">{post.author.name}</Text>
              <View className="flex-row items-center gap-1">
                <Text className="text-xs text-muted">
                  📍 {post.location.district || post.location.state}
                </Text>
                <Text className="text-xs text-muted">•</Text>
                <Text className="text-xs text-muted">{formatTime(post.createdAt)}</Text>
              </View>
            </View>
            <View className="bg-surface border border-border rounded-full px-3 py-1">
              <Text className="text-xs font-semibold text-primary">{post.language}</Text>
            </View>
          </View>

          {/* Post Content */}
          <Text className="text-base text-foreground leading-6 mb-4">{post.content}</Text>

          {/* Action Stats */}
          <View className="flex-row justify-between py-3 border-t border-b border-border">
            <View className="flex-1 items-center">
              <Text className="text-xs text-muted font-semibold">{post.likes}</Text>
              <Text className="text-xs text-muted">Likes</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-xs text-muted font-semibold">{post.comments}</Text>
              <Text className="text-xs text-muted">Comments</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-xs text-muted font-semibold">{post.shares}</Text>
              <Text className="text-xs text-muted">Shares</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-between pt-3">
            <TouchableOpacity
              onPress={handleLike}
              className="flex-row items-center gap-2 flex-1 justify-center py-2"
            >
              <Text className={cn('text-2xl', post.isLiked ? 'text-primary' : 'text-muted')}>
                {post.isLiked ? '❤️' : '🤍'}
              </Text>
              <Text className="text-sm font-semibold text-muted">Like</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center gap-2 flex-1 justify-center py-2">
              <Text className="text-2xl text-muted">💬</Text>
              <Text className="text-sm font-semibold text-muted">Comment</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center gap-2 flex-1 justify-center py-2">
              <Text className="text-2xl text-muted">↗️</Text>
              <Text className="text-sm font-semibold text-muted">Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments Section */}
        <View className="mt-6 mb-4">
          <Text className="text-lg font-bold text-foreground mb-4">Comments</Text>

          {/* Sample Comments */}
          <View className="bg-surface rounded-lg p-3 mb-3 border border-border">
            <View className="flex-row items-center mb-2">
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=5' }}
                className="w-8 h-8 rounded-full mr-2"
              />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground">Amit Kumar</Text>
                <Text className="text-xs text-muted">2h ago</Text>
              </View>
            </View>
            <Text className="text-sm text-foreground">Great post! Really helpful information.</Text>
          </View>

          <View className="bg-surface rounded-lg p-3 mb-3 border border-border">
            <View className="flex-row items-center mb-2">
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=6' }}
                className="w-8 h-8 rounded-full mr-2"
              />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground">Sneha Patel</Text>
                <Text className="text-xs text-muted">1h ago</Text>
              </View>
            </View>
            <Text className="text-sm text-foreground">Thanks for sharing! Will definitely try this.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Comment Input */}
      <View className="flex-row gap-2 pt-4 border-t border-border">
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=0' }}
          className="w-8 h-8 rounded-full"
        />
        <View className="flex-1 flex-row items-center bg-surface border border-border rounded-full px-3">
          <TextInput
            placeholder="Add a comment..."
            value={comment}
            onChangeText={setComment}
            editable={!isSubmitting}
            placeholderTextColor={colors.muted}
            className="flex-1 py-2 text-sm text-foreground"
          />
          <Pressable
            onPress={handleSubmitComment}
            disabled={!comment.trim() || isSubmitting}
            className="p-2"
          >
            <Text className={cn('text-lg', comment.trim() ? 'text-primary' : 'text-muted')}>
              ↗️
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}

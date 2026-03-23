/**
 * PostCard Component
 * Reusable component for displaying posts in the feed
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import { Post } from '@/types';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  onPress?: () => void;
  onLike?: () => void;
}

export function PostCard({ post, onPress, onLike }: PostCardProps) {
  const colors = useColors();

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
    <Pressable
      onPress={onPress}
      className="bg-surface rounded-xl p-4 mb-3 border border-border"
      style={{ opacity: 1 }}
    >
      {/* Header: Avatar, Name, Location, Timestamp */}
      <View className="flex-row items-center mb-3">
        <Image
          source={{ uri: post.author.avatar }}
          className="w-12 h-12 rounded-full mr-3"
        />
        <View className="flex-1">
          <Text className="text-sm font-semibold text-foreground">{post.author.name}</Text>
          <View className="flex-row items-center gap-1">
            <Text className="text-xs text-muted">📍 {post.location.district || post.location.state}</Text>
            <Text className="text-xs text-muted">•</Text>
            <Text className="text-xs text-muted">{formatTime(post.createdAt)}</Text>
          </View>
        </View>
        {/* Language Badge */}
        <View className="bg-surface border border-border rounded-full px-2 py-1">
          <Text className="text-xs font-semibold text-primary">{post.language}</Text>
        </View>
      </View>

      {/* Content */}
      <Text className="text-sm text-foreground leading-5 mb-3">{post.content}</Text>

      {/* Action Buttons */}
      <View className="flex-row justify-between items-center pt-3 border-t border-border">
        <TouchableOpacity
          onPress={onLike}
          className="flex-row items-center gap-1 flex-1 justify-center py-2"
        >
          <Text className={cn('text-lg', post.isLiked ? 'text-primary' : 'text-muted')}>
            {post.isLiked ? '❤️' : '🤍'}
          </Text>
          <Text className="text-xs text-muted font-semibold">{post.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center gap-1 flex-1 justify-center py-2">
          <Text className="text-lg text-muted">💬</Text>
          <Text className="text-xs text-muted font-semibold">{post.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center gap-1 flex-1 justify-center py-2">
          <Text className="text-lg text-muted">↗️</Text>
          <Text className="text-xs text-muted font-semibold">{post.shares}</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

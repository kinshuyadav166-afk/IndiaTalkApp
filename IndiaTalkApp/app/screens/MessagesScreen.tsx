/**
 * MessagesScreen - Conversations List
 * View and manage conversations with other users
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { apiService } from '@/services/api';
import { Conversation } from '@/types';

export default function MessagesScreen() {
  const colors = useColors();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: string | undefined) => {
    if (!date) return '';
    const now = new Date();
    const msgDate = new Date(date);
    const diffMs = now.getTime() - msgDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return msgDate.toLocaleDateString();
  };

  const ConversationItem = ({ conversation }: { conversation: Conversation }) => {
    const otherUser = conversation.participants.find(p => p.id !== 'user-current');

    return (
      <Pressable
        className="flex-row items-center gap-3 bg-surface rounded-lg p-3 mb-2 border border-border active:opacity-70"
      >
        {/* Avatar */}
        <View className="relative">
          <Image
            source={{ uri: otherUser?.avatar }}
            className="w-14 h-14 rounded-full"
          />
          {conversation.unreadCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-primary rounded-full w-6 h-6 items-center justify-center">
              <Text className="text-xs font-bold text-white">{conversation.unreadCount}</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground mb-1">
            {otherUser?.name}
          </Text>
          <Text
            className="text-sm text-muted"
            numberOfLines={1}
          >
            {conversation.lastMessage?.text || 'No messages yet'}
          </Text>
        </View>

        {/* Time & Unread Indicator */}
        <View className="items-end gap-1">
          <Text className="text-xs text-muted">
            {formatTime(conversation.lastMessageAt)}
          </Text>
          {conversation.unreadCount > 0 && (
            <View className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <ScreenContainer className="flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-between pb-4 border-b border-border mb-4">
        <Text className="text-2xl font-bold text-foreground">Messages</Text>
        <TouchableOpacity className="p-2">
          <Text className="text-2xl">✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Conversations List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : conversations.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-2xl mb-2">💬</Text>
          <Text className="text-lg font-semibold text-foreground mb-1">No Conversations</Text>
          <Text className="text-sm text-muted text-center">
            Start a conversation with someone to see it here
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ConversationItem conversation={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenContainer>
  );
}

/**
 * GuidesScreen - Local Guides Directory
 * Browse and book local guides by language and expertise
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { apiService } from '@/services/api';
import { Guide, LANGUAGES } from '@/types';
import { cn } from '@/lib/utils';

export default function GuidesScreen() {
  const colors = useColors();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(undefined);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadGuides();
  }, [selectedLanguage, minRating]);

  const loadGuides = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getGuides({
        language: selectedLanguage,
        minRating,
      });
      setGuides(response.items);
    } catch (error) {
      console.error('Failed to load guides:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredGuides = guides.filter(guide =>
    guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.expertise.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Text key={i} className="text-sm">
          {i < Math.floor(rating) ? '⭐' : '☆'}
        </Text>
      );
    }
    return stars;
  };

  const GuideCard = ({ guide }: { guide: Guide }) => (
    <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
      <View className="flex-row gap-3">
        {/* Avatar */}
        <Image
          source={{ uri: guide.avatar }}
          className="w-16 h-16 rounded-lg"
        />

        {/* Info */}
        <View className="flex-1">
          <Text className="text-base font-bold text-foreground mb-1">{guide.name}</Text>
          <Text className="text-xs text-muted mb-2">{guide.expertise}</Text>

          {/* Rating */}
          <View className="flex-row items-center gap-1 mb-2">
            <View className="flex-row gap-0.5">{renderStars(guide.rating)}</View>
            <Text className="text-xs font-semibold text-foreground ml-1">
              {guide.rating}
            </Text>
            <Text className="text-xs text-muted">({guide.reviewCount})</Text>
          </View>

          {/* Languages */}
          <View className="flex-row flex-wrap gap-1 mb-2">
            {guide.languages.slice(0, 2).map(lang => (
              <View key={lang} className="bg-primary/10 rounded px-2 py-0.5">
                <Text className="text-xs font-semibold text-primary">🌐 {lang}</Text>
              </View>
            ))}
            {guide.languages.length > 2 && (
              <View className="bg-primary/10 rounded px-2 py-0.5">
                <Text className="text-xs font-semibold text-primary">+{guide.languages.length - 2}</Text>
              </View>
            )}
          </View>

          {/* Price & Book */}
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-bold text-primary">₹{guide.pricePerHour}/hr</Text>
            <TouchableOpacity
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-white font-semibold text-sm">Book</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="flex-1">
      {/* Header */}
      <View className="pb-4 border-b border-border mb-4">
        <Text className="text-2xl font-bold text-foreground mb-4">Local Guides</Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-surface border border-border rounded-lg px-3 py-2 mb-3">
          <Text className="text-lg mr-2">🔍</Text>
          <TextInput
            placeholder="Search guides..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.muted}
            className="flex-1 text-foreground text-sm"
          />
        </View>

        {/* Filter Toggle */}
        <TouchableOpacity
          onPress={() => setShowFilters(!showFilters)}
          className="flex-row items-center justify-between bg-surface border border-border rounded-lg px-3 py-2"
        >
          <Text className="text-sm font-semibold text-foreground">🔽 Filters</Text>
          <Text className="text-lg">{showFilters ? '▲' : '▼'}</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <View className="bg-surface border border-border rounded-lg p-4 mb-4">
          {/* Language Filter */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Language</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
              <Pressable
                onPress={() => setSelectedLanguage(undefined)}
                className={cn(
                  'px-3 py-2 rounded-full border',
                  !selectedLanguage ? 'bg-primary border-primary' : 'bg-surface border-border'
                )}
              >
                <Text
                  className={cn(
                    'text-xs font-semibold',
                    !selectedLanguage ? 'text-white' : 'text-foreground'
                  )}
                >
                  All
                </Text>
              </Pressable>
              {LANGUAGES.map(lang => (
                <Pressable
                  key={lang}
                  onPress={() => setSelectedLanguage(selectedLanguage === lang ? undefined : lang)}
                  className={cn(
                    'px-3 py-2 rounded-full border',
                    selectedLanguage === lang ? 'bg-primary border-primary' : 'bg-surface border-border'
                  )}
                >
                  <Text
                    className={cn(
                      'text-xs font-semibold',
                      selectedLanguage === lang ? 'text-white' : 'text-foreground'
                    )}
                  >
                    {lang}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Rating Filter */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">Minimum Rating</Text>
            <View className="flex-row gap-2">
              {[3, 4, 4.5, 5].map(rating => (
                <Pressable
                  key={rating}
                  onPress={() => setMinRating(minRating === rating ? undefined : rating)}
                  className={cn(
                    'px-3 py-2 rounded-lg border',
                    minRating === rating ? 'bg-secondary border-secondary' : 'bg-surface border-border'
                  )}
                >
                  <Text
                    className={cn(
                      'text-xs font-semibold',
                      minRating === rating ? 'text-white' : 'text-foreground'
                    )}
                  >
                    ⭐ {rating}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Guides List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredGuides.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-2xl mb-2">🔍</Text>
          <Text className="text-lg font-semibold text-foreground mb-1">No Guides Found</Text>
          <Text className="text-sm text-muted text-center">
            Try adjusting your search or filters
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredGuides}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <GuideCard guide={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenContainer>
  );
}

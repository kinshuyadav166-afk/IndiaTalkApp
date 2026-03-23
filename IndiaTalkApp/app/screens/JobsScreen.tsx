/**
 * JobsScreen - Job Listings
 * Browse job opportunities across India
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { apiService } from '@/services/api';
import { Job, INDIAN_STATES } from '@/types';
import { cn } from '@/lib/utils';

export default function JobsScreen() {
  const colors = useColors();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobType, setSelectedJobType] = useState<string | undefined>(undefined);
  const [selectedState, setSelectedState] = useState<string | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadJobs();
  }, [selectedJobType, selectedState]);

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getJobs({
        jobType: selectedJobType as any,
        location: selectedState ? { state: selectedState } : undefined,
      });
      setJobs(response.items);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const JobCard = ({ job }: { job: Job }) => (
    <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
      {/* Company & Title */}
      <View className="mb-3">
        <Text className="text-xs text-muted font-semibold mb-1">{job.company.name}</Text>
        <Text className="text-base font-bold text-foreground mb-2">{job.title}</Text>

        {/* Location & Type */}
        <View className="flex-row items-center gap-2 mb-2">
          <View className="bg-primary/10 rounded px-2 py-1">
            <Text className="text-xs font-semibold text-primary capitalize">{job.jobType}</Text>
          </View>
          <Text className="text-xs text-muted">
            📍 {job.location.district || job.location.state}
            {job.location.remote && ' (Remote)'}
          </Text>
        </View>
      </View>

      {/* Salary & Languages */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-base font-bold text-primary">
          ₹{job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}
        </Text>
        <View className="flex-row gap-1">
          {job.languages.slice(0, 2).map(lang => (
            <View key={lang} className="bg-secondary/10 rounded px-2 py-0.5">
              <Text className="text-xs font-semibold text-secondary">{lang}</Text>
            </View>
          ))}
          {job.languages.length > 2 && (
            <View className="bg-secondary/10 rounded px-2 py-0.5">
              <Text className="text-xs font-semibold text-secondary">+{job.languages.length - 2}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Apply Button */}
      <TouchableOpacity
        className="w-full py-3 rounded-lg items-center"
        style={{ backgroundColor: colors.primary }}
      >
        <Text className="text-white font-semibold">Apply Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenContainer className="flex-1">
      {/* Header */}
      <View className="pb-4 border-b border-border mb-4">
        <Text className="text-2xl font-bold text-foreground mb-4">Opportunities</Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-surface border border-border rounded-lg px-3 py-2 mb-3">
          <Text className="text-lg mr-2">🔍</Text>
          <TextInput
            placeholder="Search jobs..."
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
          {/* Job Type Filter */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Job Type</Text>
            <View className="flex-row flex-wrap gap-2">
              {['full-time', 'part-time', 'contract', 'freelance'].map(type => (
                <Pressable
                  key={type}
                  onPress={() => setSelectedJobType(selectedJobType === type ? undefined : type)}
                  className={cn(
                    'px-3 py-2 rounded-full border',
                    selectedJobType === type ? 'bg-primary border-primary' : 'bg-surface border-border'
                  )}
                >
                  <Text
                    className={cn(
                      'text-xs font-semibold capitalize',
                      selectedJobType === type ? 'text-white' : 'text-foreground'
                    )}
                  >
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Location Filter */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">Location</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
              <Pressable
                onPress={() => setSelectedState(undefined)}
                className={cn(
                  'px-3 py-2 rounded-full border',
                  !selectedState ? 'bg-secondary border-secondary' : 'bg-surface border-border'
                )}
              >
                <Text
                  className={cn(
                    'text-xs font-semibold',
                    !selectedState ? 'text-white' : 'text-foreground'
                  )}
                >
                  All
                </Text>
              </Pressable>
              {INDIAN_STATES.slice(0, 8).map(state => (
                <Pressable
                  key={state}
                  onPress={() => setSelectedState(selectedState === state ? undefined : state)}
                  className={cn(
                    'px-3 py-2 rounded-full border',
                    selectedState === state ? 'bg-secondary border-secondary' : 'bg-surface border-border'
                  )}
                >
                  <Text
                    className={cn(
                      'text-xs font-semibold',
                      selectedState === state ? 'text-white' : 'text-foreground'
                    )}
                  >
                    {state.split(' ')[0]}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Jobs List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredJobs.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-2xl mb-2">💼</Text>
          <Text className="text-lg font-semibold text-foreground mb-1">No Jobs Found</Text>
          <Text className="text-sm text-muted text-center">
            Try adjusting your search or filters
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <JobCard job={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenContainer>
  );
}

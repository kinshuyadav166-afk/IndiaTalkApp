/**
 * IndiaTalk App Entry Point
 * Manages navigation based on authentication state
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { RootStackParamList, HomeTabsParamList } from '@/types';

// Screens
import AuthScreen from '@/app/screens/AuthScreen';
import HomeScreen from '@/app/screens/HomeScreen';
import GuidesScreen from '@/app/screens/GuidesScreen';
import JobsScreen from '@/app/screens/JobsScreen';
import MessagesScreen from '@/app/screens/MessagesScreen';
import ProfileScreen from '@/app/screens/ProfileScreen';
import PostDetailScreen from '@/app/screens/PostDetailScreen';

// Components
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<HomeTabsParamList>();

/**
 * Home Tabs Navigator
 * Displays the main tab-based navigation
 */
function HomeTabs() {
  const colors = useColors();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />
      <Tab.Screen
        name="Guides"
        component={GuidesScreen}
        options={{
          title: 'Guides',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.fill" color={color} />,
        }}
      />
      <Tab.Screen
        name="Jobs"
        component={JobsScreen}
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="briefcase.fill" color={color} />,
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="message.fill" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.circle.fill" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * Root Navigator
 * Manages navigation between Auth and Home stacks based on authentication state
 */
function RootNavigator() {
  const { isLoading, isAuthenticated } = useAuth();
  const colors = useColors();

  type RootStackParamListKeys = keyof RootStackParamList;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen
            name="HomeTabs"
            component={HomeTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PostDetail"
            component={PostDetailScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}

/**
 * Main App Component
 */
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

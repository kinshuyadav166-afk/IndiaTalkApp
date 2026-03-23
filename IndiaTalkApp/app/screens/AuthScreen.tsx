/**
 * AuthScreen - Login/Signup
 * User authentication entry point with email/password
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Pressable,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/contexts/AuthContext';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

type AuthMode = 'login' | 'signup';

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const colors = useColors();

  const handleAuth = async () => {
    try {
      setIsLoading(true);

      if (mode === 'login') {
        if (!email || !password) {
          Alert.alert('Error', 'Please fill in all fields');
          return;
        }
        await signIn({ email, password });
      } else {
        if (!email || !password || !name) {
          Alert.alert('Error', 'Please fill in all fields');
          return;
        }
        await signUp({ email, password, name });
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6 py-8">
          {/* Logo & Title */}
          <View className="items-center mb-8">
            <Text className="text-5xl font-bold text-primary mb-2">🇮🇳</Text>
            <Text className="text-3xl font-bold text-foreground mb-2">IndiaTalk</Text>
            <Text className="text-base text-muted text-center">
              Language-First Social Platform
            </Text>
          </View>

          {/* Tab Selector */}
          <View className="flex-row bg-surface rounded-lg p-1 mb-8">
            <Pressable
              onPress={() => setMode('login')}
              className={cn(
                'flex-1 py-3 rounded-md items-center',
                mode === 'login' && 'bg-primary'
              )}
            >
              <Text
                className={cn(
                  'font-semibold text-base',
                  mode === 'login' ? 'text-white' : 'text-muted'
                )}
              >
                Login
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setMode('signup')}
              className={cn(
                'flex-1 py-3 rounded-md items-center',
                mode === 'signup' && 'bg-primary'
              )}
            >
              <Text
                className={cn(
                  'font-semibold text-base',
                  mode === 'signup' ? 'text-white' : 'text-muted'
                )}
              >
                Sign Up
              </Text>
            </Pressable>
          </View>

          {/* Form Fields */}
          <View className="gap-4 mb-6">
            {mode === 'signup' && (
              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">Full Name</Text>
                <TextInput
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                  editable={!isLoading}
                  placeholderTextColor={colors.muted}
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                />
              </View>
            )}

            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Email</Text>
              <TextInput
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                editable={!isLoading}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.muted}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>

            <View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm font-semibold text-foreground">Password</Text>
                {mode === 'login' && (
                  <TouchableOpacity>
                    <Text className="text-sm text-primary font-semibold">Forgot?</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TextInput
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
                secureTextEntry
                placeholderTextColor={colors.muted}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>
          </View>

          {/* CTA Button */}
          <Pressable
            onPress={handleAuth}
            disabled={isLoading}
            className={cn(
              'py-4 rounded-lg items-center justify-center mb-6',
              isLoading ? 'opacity-60' : 'active:opacity-90'
            )}
            style={{ backgroundColor: colors.primary }}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="text-white font-bold text-base">
                {mode === 'login' ? 'Login' : 'Sign Up'}
              </Text>
            )}
          </Pressable>

          {/* Toggle Mode Text */}
          <View className="flex-row justify-center gap-1">
            <Text className="text-muted text-sm">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            </Text>
            <TouchableOpacity onPress={toggleMode} disabled={isLoading}>
              <Text className="text-primary font-semibold text-sm">
                {mode === 'login' ? 'Sign Up' : 'Login'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Demo Credentials */}
          <View className="mt-8 p-4 bg-surface rounded-lg border border-border">
            <Text className="text-xs font-semibold text-muted mb-2">DEMO CREDENTIALS</Text>
            <Text className="text-xs text-muted mb-1">Email: demo@indiatalk.in</Text>
            <Text className="text-xs text-muted">Password: demo123</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

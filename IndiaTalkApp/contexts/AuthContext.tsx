/**
 * Auth Context
 * Manages authentication state and user session across the app
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthCredentials } from '@/types';
import { apiService } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignout: boolean;
  signIn: (credentials: AuthCredentials) => Promise<void>;
  signUp: (credentials: AuthCredentials & { name: string }) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(
    (prevState: any, action: any) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.payload,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.payload.token,
            user: action.payload.user,
          };
        case 'SIGN_UP':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.payload.token,
            user: action.payload.user,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            user: null,
          };
        case 'SET_USER':
          return {
            ...prevState,
            user: action.payload,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      user: null,
    }
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        await apiService.initialize();
        const token = await AsyncStorage.getItem('authToken');
        dispatch({ type: 'RESTORE_TOKEN', payload: token });

        if (token) {
          const user = await apiService.getCurrentUser();
          if (user) {
            dispatch({ type: 'SET_USER', payload: user });
          }
        }
      } catch (e) {
        console.error('Failed to restore token:', e);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext: AuthContextType = {
    user: state.user,
    isLoading: state.isLoading,
    isSignout: state.isSignout,
    isAuthenticated: !!state.userToken,
    signIn: async (credentials: AuthCredentials) => {
      try {
        const response = await apiService.login(credentials);
        dispatch({ type: 'SIGN_IN', payload: response });
      } catch (error) {
        throw error;
      }
    },
    signUp: async (credentials: AuthCredentials & { name: string }) => {
      try {
        const response = await apiService.signup(credentials);
        dispatch({ type: 'SIGN_UP', payload: response });
      } catch (error) {
        throw error;
      }
    },
    signOut: async () => {
      try {
        await apiService.logout();
        dispatch({ type: 'SIGN_OUT' });
      } catch (error) {
        throw error;
      }
    },
  };

  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

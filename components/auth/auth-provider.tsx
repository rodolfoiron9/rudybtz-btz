'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, type User, type AuthState } from '@/lib/auth-service';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  signUp: (email: string, password: string, displayName?: string) => Promise<User>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateProfile: (updates: { displayName?: string; photoURL?: string }) => Promise<void>;
  isAdmin: () => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChange((user) => {
      setAuthState(prev => ({
        ...prev,
        user,
        loading: false
      }));
    });

    return unsubscribe;
  }, []);

  const handleAuthAction = async <T,>(
    action: () => Promise<T>,
    successMessage?: string
  ): Promise<T> => {
    try {
      setAuthState(prev => ({ ...prev, error: null, loading: true }));
      const result = await action();
      setAuthState(prev => ({ ...prev, loading: false }));
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setAuthState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        loading: false 
      }));
      throw error;
    }
  };

  const signIn = async (email: string, password: string): Promise<User> => {
    return handleAuthAction(() => authService.signInWithEmail(email, password));
  };

  const signInWithGoogle = async (): Promise<User> => {
    return handleAuthAction(() => authService.signInWithGoogle());
  };

  const signUp = async (email: string, password: string, displayName?: string): Promise<User> => {
    return handleAuthAction(() => authService.createUser(email, password, displayName));
  };

  const signOut = async (): Promise<void> => {
    return handleAuthAction(() => authService.signOut());
  };

  const resetPassword = async (email: string): Promise<void> => {
    return handleAuthAction(() => authService.resetPassword(email));
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    return handleAuthAction(() => authService.updateUserPassword(currentPassword, newPassword));
  };

  const updateProfile = async (updates: { displayName?: string; photoURL?: string }): Promise<void> => {
    return handleAuthAction(() => authService.updateUserProfile(updates));
  };

  const isAdmin = async (): Promise<boolean> => {
    return authService.isAdmin();
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const contextValue: AuthContextType = {
    ...authState,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    isAdmin,
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;
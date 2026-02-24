import { supabase } from '@/src/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { SplashScreen, router } from 'expo-router';
import { AppState } from 'react-native';
import { create } from 'zustand';

SplashScreen.preventAutoHideAsync();

interface AuthState {
  session: Session | null;
  loading: boolean;
  isInitialized: boolean; // To track if initial session load and listener setup is done
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initializeAuth: () => void; // New action to explicitly initialize
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  loading: true,
  isInitialized: false,
  initializeAuth: () => {
    if (get().isInitialized) return; // Prevent re-initialization

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session, loading: false, isInitialized: true });

      // Developer auto-login - only if no session exists in dev mode
      if (__DEV__ && !session) {
        console.log('No session found in dev mode, attempting auto-login...');
        get().signInWithEmail('test@test.com', 'testing')
          .then(() => {
            console.log('Dev auto-login successful');
          })
          .catch(error => {
            console.error('Dev auto-login failed:', error);
            // Still hide splash even if auto-login fails
            if (get().isInitialized) {
              SplashScreen.hideAsync();
            }
          });
      } else {
        if (session) {
          SplashScreen.hideAsync();
        } else if (get().isInitialized) {
          SplashScreen.hideAsync();
        }
      }
    }).catch(() => {
      set({ loading: false, isInitialized: true });
      SplashScreen.hideAsync();
    });

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session });
      if (session) {
        SplashScreen.hideAsync();
      } else if (get().isInitialized) {
         SplashScreen.hideAsync();
      }
    });

    // Listen for AppState changes
    const appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });
    


    // Cleanup function
    return () => {
      authListener?.subscription.unsubscribe();
      appStateSubscription.remove();
    };
  },
  signInWithEmail: async (email, password) => {
    set({ loading: true });
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    set({ loading: false });
    if (error) throw error;
    // Session state will be updated by onAuthStateChange
  },
  signUpWithEmail: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signUp({ email, password });
    set({ loading: false });
    if (error) throw error;
    // Session state will be updated by onAuthStateChange
  },
  signOut: async () => {
    set({ loading: true });
    const { error } = await supabase.auth.signOut();
    set({ loading: false });
    if (error) throw error;
    // Session state will be updated by onAuthStateChange
    router.replace('/(auth)/login'); // Redirect after sign out
  },
}));

// Initialize auth listeners when the store is first imported/used.
// This ensures listeners are active as early as possible.
useAuthStore.getState().initializeAuth();

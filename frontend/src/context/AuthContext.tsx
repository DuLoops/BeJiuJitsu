import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Profile } from '@/src/types/user';
import { API_URL } from '@/src/config/env';
import { set } from 'lodash';
import { router } from 'expo-router';
import { Platform } from 'react-native';
interface TokenData {
  accessToken: string;
  expiresIn: number;
}

interface AuthState {
  user: User | null;
  profile: Profile | null; 
  isLoading: boolean;
  token: TokenData | null;  // renamed from tokens to token
}

export function isTokenExpired(expiresIn: number): boolean {
  const currentTime = Date.now();
  return currentTime >= expiresIn;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<boolean>;
  signOut: () => Promise<void>;
  getAuthenticatedRequest: (endpoint: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const REFRESH_TOKEN_KEY = '@BJJApp:refreshToken';

async function storeRefreshToken(refreshToken: string) {
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

async function getStoredRefreshToken(): Promise<string | null> {
  return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
}

async function removeRefreshToken() {
  await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    token: null,  // renamed from tokens to token
  });

  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    try {
      // Check if we're running in web mode
      const isWebMode = Platform.OS === 'web' || process.env.WEB_MODE === 'true';
      console.log('Loading stored auth in', isWebMode ? 'web mode' : 'native mode');
      
      let newToken = null;
      
      // Only try to refresh token in native mode
      // if (!isWebMode) {
        newToken = await refreshAuthToken();  
        
        if (!newToken) {
          console.log("No new token");
          await clearAuthData();
          return;
        }
        
        // Load user and profile data
        const [userString, profileString] = await Promise.all([
          AsyncStorage.getItem('@BJJApp:user'),
          AsyncStorage.getItem('@BJJApp:profile'),
        ]);
    
        if (!userString) {
          await clearAuthData();
          return;
        }
    
        // Parse user data
        const user = JSON.parse(userString);
        const profile = profileString ? JSON.parse(profileString) : null;
        
        // Update auth state
        setAuthState({
          user,
          profile,
          token: newToken,
          isLoading: false,
        });
        
        // Redirect based on whether the user has a profile
        if (profile != null) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(onboarding)/CreateProfile');
        }
      // }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      await clearAuthData();
    }
  }

  async function clearAuthData() {
    console.log("Clear auth data");
    await Promise.all([
      AsyncStorage.removeItem('@BJJApp:user'),
      AsyncStorage.removeItem('@BJJApp:profile'),
      removeRefreshToken()
    ]);

    setAuthState({
      user: null,
      profile: null,
      token: null,
      isLoading: false,
    });
  }

  async function refreshAuthToken(): Promise<TokenData | null> {
    try {
      const storedRefreshToken = await getStoredRefreshToken();
      
      if (!storedRefreshToken) {
        clearAuthData();
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_URL}/api/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `refreshToken=${storedRefreshToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      // Store new refresh token if provided in cookies
      const cookies = response.headers.get('set-cookie');
      if (cookies) {
        const newRefreshToken = cookies.split(';')[0].split('=')[1];
        await storeRefreshToken(newRefreshToken);
      }
      console.log("refresh token data:", data);
      return {
        accessToken: data.accessToken,
        expiresIn: Date.now() + 29 * 60 * 1000
      };
    } catch (error) {
      await removeRefreshToken();
      return null;
    }
  }

  async function signIn({ email, password }: { email: string; password: string }) {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      console.log("signIn response:", response);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store refresh token from cookies
      const cookies = response.headers.get('set-cookie');
      if (cookies) {
        const refreshToken = cookies.split(';')[0].split('=')[1];
        await storeRefreshToken(refreshToken);
      }

      const token: TokenData = {
        accessToken: data.token,
        expiresIn: Date.now() + 29 * 60 * 1000
      };

      const user = data.user;
      const profile = data.profile
      
      // Store user and profile separately
      await Promise.all([
        AsyncStorage.setItem('@BJJApp:user', JSON.stringify(user)),
        profile ? AsyncStorage.setItem('@BJJApp:profile', JSON.stringify(profile)) : Promise.resolve()
      ]);
      
      console.log("Logged in user:", user);
      // Update auth state
      setAuthState({
        user,
        profile,
        token,
        isLoading: false,
      });
      
      // Return whether the user has a profile to determine routing
      return profile !== null;
    } catch (error) {
      console.error('Login request failed:', error);
      throw error;
    }
  }

  async function signOut() {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Important for sending the refresh token cookie
        headers: {
          Authorization: `Bearer ${authState.token?.accessToken}`
        }
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      await clearAuthData();
    }
  }

  const getAuthenticatedRequest = async (endpoint: string, options: RequestInit = {}) => {
    if (!authState.token) {
      throw new Error('No authentication token available');
    }

    if (isTokenExpired(authState.token.expiresIn)) {
      const newToken = await refreshAuthToken();
      if (!newToken) {
        await clearAuthData();
        throw new Error('Authentication expired');
      }
      setAuthState(prev => ({ ...prev, token: newToken }));
    }

    return fetch(endpoint, {
      ...options,
      credentials: 'include',
      headers: {
        ...options.headers,
        Authorization: `Bearer ${authState.token.accessToken}`,
      },
    });
  };
  
  const isAuthenticated = Boolean(authState.user && authState.token);

  return (
    <AuthContext.Provider 
      value={{
        user: authState.user,
        profile: authState.profile,
        isLoading: authState.isLoading,
        isAuthenticated,
        signIn,
        signOut,
        getAuthenticatedRequest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
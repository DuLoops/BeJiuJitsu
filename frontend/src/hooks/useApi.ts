import { useState, useCallback } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { API_URL } from '@/src/config/env';

interface ApiOptions extends RequestInit {
  requireAuth?: boolean;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

export function useApi<T>() {
  const { getAuthenticatedRequest } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const request = useCallback(async (
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> => {
    setIsLoading(true);
    
    try {
      const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
      const { requireAuth = true, ...requestOptions } = options;

      let response;
      if (requireAuth) {
        response = await getAuthenticatedRequest(url, requestOptions);
      } else {
        response = await fetch(url, requestOptions);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Request failed');
      }

      const data = await response.json();
      return {
        data,
        error: null,
        isLoading: false
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        isLoading: false
      };
    } finally {
      setIsLoading(false);
    }
  }, [getAuthenticatedRequest]);

  return {
    request,
    isLoading
  };
}

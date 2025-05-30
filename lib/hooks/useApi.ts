import { useState, useCallback } from "react";
import { apiClient } from "../api-client";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (promise: Promise<{ data?: T; error?: string }>) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const result = await promise;
        if (result.error) {
          setState({ data: null, loading: false, error: result.error });
        } else {
          setState({ data: result.data || null, loading: false, error: null });
        }
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : "An error occurred",
        });
      }
    },
    []
  );

  return {
    ...state,
    execute,
  };
}

// Example usage:
// const { data, loading, error, execute } = useApi<UserProfile>();
// execute(apiClient.users.getProfile());

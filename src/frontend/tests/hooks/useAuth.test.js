import { useState } from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock hook to test
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = (credentials) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser({ id: 1, email: credentials.email });
      setIsAuthenticated(true);
      setLoading(false);
    }, 100);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };
};

describe('useAuth Hook', () => {
  it('should initialize with unauthenticated state', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should handle login', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      result.current.login({ email: 'user@example.com', password: 'password' });
      await new Promise(resolve => setTimeout(resolve, 150));
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });

  it('should handle logout', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      result.current.login({ email: 'user@example.com', password: 'password' });
      await new Promise(resolve => setTimeout(resolve, 150));
    });

    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should set loading state during login', async () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.login({ email: 'user@example.com', password: 'password' });
    });

    expect(result.current.loading).toBe(true);
  });
});

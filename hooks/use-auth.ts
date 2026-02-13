"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: "user" | "lawyer" | "advocate" | "admin" | "CLIENT" | "LAWYER" | "ADVOCATE" | "ADMIN";
  phone?: string;
  avatar?: string;
  verificationStatus?: "PENDING" | "APPROVED" | "REJECTED" | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setAuth: (user: User, token: string) => void;
}

// Helper function to set cookies
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

// Helper function to delete cookies
const deleteCookie = (name: string) => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user: User, token: string) => {
        // Set cookies for middleware
        setCookie('auth-token', token, 7);
        const authStorage = JSON.stringify({
          state: {
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          },
        });
        setCookie('auth-storage', encodeURIComponent(authStorage), 7);

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        // Clear cookies
        deleteCookie('auth-token');
        deleteCookie('auth-storage');

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (userData: Partial<User>) => {
        set((state) => {
          const updatedUser = state.user ? { ...state.user, ...userData } : null;
          
          // Update cookie if user exists
          if (updatedUser && state.token) {
            const authStorage = JSON.stringify({
              state: {
                user: updatedUser,
                token: state.token,
                isAuthenticated: true,
                isLoading: false,
              },
            });
            setCookie('auth-storage', encodeURIComponent(authStorage), 7);
          }

          return { user: updatedUser };
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setAuth: (user: User, token: string) => {
        // Set cookies for middleware
        setCookie('auth-token', token, 7);
        const authStorage = JSON.stringify({
          state: {
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          },
        });
        setCookie('auth-storage', encodeURIComponent(authStorage), 7);

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

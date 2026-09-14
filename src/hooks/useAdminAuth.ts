import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { AdminUser } from '@/types/content';
import { z } from 'zod';

const ADMIN_STORAGE_KEY = 'nextgen_admin_session';

// Zod validation schema for Admin Email
export const adminEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email address is required.' })
    .email({ message: 'Please enter a valid email address.' }),
});

export interface AdminAuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export function useAdminAuth() {
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to verify if an email exists in the Supabase admin_users table
  const verifyAdminInDatabase = useCallback(async (email: string): Promise<AdminUser | null> => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .ilike('email', email.trim())
        .maybeSingle();

      if (error || !data) {
        return null;
      }
      return data as AdminUser;
    } catch (err) {
      console.error('[AdminAuth] Error querying admin_users table:', err);
      return null;
    }
  }, []);

  // Initialize and restore session from localStorage and verify against Supabase
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
        if (!stored) {
          if (isMounted) {
            setAdminProfile(null);
            setIsAdmin(false);
            setLoading(false);
          }
          return;
        }

        const parsed = JSON.parse(stored) as AdminUser;
        if (!parsed?.email) {
          localStorage.removeItem(ADMIN_STORAGE_KEY);
          if (isMounted) {
            setAdminProfile(null);
            setIsAdmin(false);
            setLoading(false);
          }
          return;
        }

        // Validate currently stored email against Supabase admin_users table
        const profile = await verifyAdminInDatabase(parsed.email);
        if (isMounted) {
          if (profile) {
            localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(profile));
            setAdminProfile(profile);
            setIsAdmin(true);
          } else {
            localStorage.removeItem(ADMIN_STORAGE_KEY);
            setAdminProfile(null);
            setIsAdmin(false);
          }
        }
      } catch (err) {
        console.error('[AdminAuth] Error restoring session:', err);
        localStorage.removeItem(ADMIN_STORAGE_KEY);
        if (isMounted) {
          setAdminProfile(null);
          setIsAdmin(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [verifyAdminInDatabase]);

  // Sign in using ONLY email listed in Supabase admin_users table
  const signIn = useCallback(
    async (emailInput: string): Promise<AdminUser> => {
      // Validate input with Zod
      const validation = adminEmailSchema.safeParse({
        email: emailInput,
      });

      if (!validation.success) {
        const firstError = validation.error.errors[0]?.message || 'Please enter a valid email address.';
        throw new Error(firstError);
      }

      const { email } = validation.data;

      // Verify email existence in Supabase admin_users table
      const profile = await verifyAdminInDatabase(email);
      if (!profile) {
        throw new Error(
          'Access denied: Your email is not registered in the authorized core team admin list.'
        );
      }

      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(profile));
      setAdminProfile(profile);
      setIsAdmin(true);
      return profile;
    },
    [verifyAdminInDatabase]
  );

  const signOut = useCallback(async () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    setAdminProfile(null);
    setIsAdmin(false);
  }, []);

  const user: AdminAuthUser | null = adminProfile
    ? {
        id: adminProfile.id,
        email: adminProfile.email,
        name: adminProfile.name,
        role: adminProfile.role,
      }
    : null;

  return {
    user,
    isAdmin,
    adminProfile,
    loading,
    signIn,
    signOut,
  };
}

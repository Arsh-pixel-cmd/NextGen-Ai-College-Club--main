import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { AdminUser } from '@/types/content';

const ADMIN_STORAGE_KEY = 'nextgen_admin_session';

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

  // Initialize session from localStorage and verify against Supabase
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

        // Set initial state from cached valid session
        if (isMounted) {
          setAdminProfile(parsed);
          setIsAdmin(true);
        }

        // Verify in Supabase that the email is still an authorized admin
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .ilike('email', parsed.email.trim())
          .maybeSingle();

        if (isMounted) {
          if (error || !data) {
            // If verification fails or user was removed, clear session
            console.warn('Admin session validation failed or email not found:', error);
            localStorage.removeItem(ADMIN_STORAGE_KEY);
            setAdminProfile(null);
            setIsAdmin(false);
          } else {
            const updatedProfile = data as AdminUser;
            localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(updatedProfile));
            setAdminProfile(updatedProfile);
            setIsAdmin(true);
          }
        }
      } catch (err) {
        console.error('Error restoring admin session:', err);
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
  }, []);

  const verifyAdminEmail = useCallback(async (emailInput: string): Promise<AdminUser> => {
    const trimmedEmail = emailInput.trim();
    if (!trimmedEmail) {
      throw new Error('Please enter your email address.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      throw new Error('Please enter a valid email address.');
    }

    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .ilike('email', trimmedEmail)
      .maybeSingle();

    if (error) {
      console.error('Supabase admin check error:', error);
      throw new Error('Database error while verifying admin access. Please verify database permissions.');
    }

    if (!data) {
      throw new Error('Access denied: Your email is not registered in the authorized core team admin list.');
    }

    const profile = data as AdminUser;
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(profile));
    setAdminProfile(profile);
    setIsAdmin(true);
    return profile;
  }, []);

  const signIn = useCallback(async (emailInput: string) => {
    return verifyAdminEmail(emailInput);
  }, [verifyAdminEmail]);

  const signOut = useCallback(async () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    setAdminProfile(null);
    setIsAdmin(false);
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore errors from supabase auth signout
    }
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
    verifyAdminEmail,
    signIn,
    signOut,
  };
}


import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { AdminUser } from '@/types/content';

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const verifyAdmin = async (currentUser: User | null): Promise<AdminUser | null> => {
    if (!currentUser?.email) return null;

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .ilike('email', currentUser.email)
        .maybeSingle();

      if (error || !data) {
        return null;
      }
      return data as AdminUser;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        if (!isMounted) return;

        setUser(currentUser);
        if (currentUser) {
          const profile = await verifyAdmin(currentUser);
          if (isMounted) {
            setIsAdmin(!!profile);
            setAdminProfile(profile);
          }
        } else {
          setIsAdmin(false);
          setAdminProfile(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const profile = await verifyAdmin(currentUser);
        setIsAdmin(!!profile);
        setAdminProfile(profile);
      } else {
        setIsAdmin(false);
        setAdminProfile(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Verify admin status after authentication
    const profile = await verifyAdmin(data.user);
    if (!profile) {
      await supabase.auth.signOut();
      throw new Error('Access denied: Your account is not authorized as a core team administrator.');
    }

    setUser(data.user);
    setIsAdmin(true);
    setAdminProfile(profile);
    return data;
  }, []);

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    // Verify that the email is pre-authorized in admin_users
    const { data: adminRecord, error: checkError } = await supabase
      .from('admin_users')
      .select('*')
      .ilike('email', email)
      .maybeSingle();

    if (checkError || !adminRecord) {
      throw new Error('Access denied: This email is not pre-authorized as a core team member. Please contact an administrator.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name || adminRecord.name },
      },
    });

    if (error) throw error;
    return data;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setAdminProfile(null);
    if (error) throw error;
  }, []);

  return { user, isAdmin, adminProfile, loading, signIn, signUp, signOut };
}

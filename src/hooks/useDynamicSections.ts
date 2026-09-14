import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { DynamicSection } from '@/types/content';

export function useDynamicSections(visibleOnly = false) {
  return useQuery<DynamicSection[]>({
    queryKey: ['dynamic_sections', { visibleOnly }],
    queryFn: async () => {
      let query = supabase
        .from('dynamic_sections')
        .select('*')
        .order('display_order', { ascending: true });

      if (visibleOnly) {
        query = query.eq('is_visible', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useDynamicSectionMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['dynamic_sections'] });
  };

  const createSection = useMutation({
    mutationFn: async (section: Omit<DynamicSection, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('dynamic_sections')
        .insert(section)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: invalidate,
  });

  const updateSection = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DynamicSection> & { id: string }) => {
      const { data, error } = await supabase
        .from('dynamic_sections')
        .update(updates)
        .eq('id', id)
        .select();
      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('Dynamic section could not be updated. Please verify Supabase RLS permissions.');
      }
      return data[0];
    },
    onSuccess: invalidate,
  });

  const deleteSection = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('dynamic_sections')
        .delete()
        .eq('id', id)
        .select();
      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('Dynamic section could not be deleted. Please verify Supabase RLS permissions.');
      }
      return data;
    },
    onSuccess: invalidate,
  });

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, is_visible }: { id: string; is_visible: boolean }) => {
      const { data, error } = await supabase
        .from('dynamic_sections')
        .update({ is_visible })
        .eq('id', id)
        .select();
      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('Failed to toggle visibility. Please verify Supabase RLS permissions.');
      }
      return data[0];
    },
    onSuccess: invalidate,
  });

  return { createSection, updateSection, deleteSection, toggleVisibility };
}

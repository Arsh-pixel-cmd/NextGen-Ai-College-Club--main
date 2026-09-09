import { useState } from 'react';
import { useTeamMembers, useTeamMemberMutations } from '@/hooks/useTeamMembers';
import type { TeamMember } from '@/types/content';
import ContentForm, { type FormField } from './ContentForm';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const fields: FormField[] = [
  { name: 'name', label: 'Name', type: 'text', placeholder: 'John Doe', required: true },
  { name: 'position', label: 'Position', type: 'text', placeholder: 'President', required: true },
  { name: 'image_url', label: 'Image URL', type: 'url', placeholder: 'https://example.com/photo.jpg', required: true },
  { name: 'display_order', label: 'Display Order', type: 'number', placeholder: '1', required: true },
];

const TeamManager = () => {
  const { data: members, isLoading, error } = useTeamMembers();
  const { createMember, updateMember, deleteMember } = useTeamMemberMutations();

  const [formOpen, setFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<TeamMember | null>(null);
  const [saving, setSaving] = useState(false);

  const handleAdd = () => {
    setEditingMember(null);
    setFormOpen(true);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormOpen(true);
  };

  const handleSubmit = async (values: Record<string, string | number>) => {
    setSaving(true);
    try {
      if (editingMember) {
        await updateMember.mutateAsync({
          id: editingMember.id,
          name: String(values.name),
          position: String(values.position),
          image_url: String(values.image_url),
          display_order: Number(values.display_order),
        });
        toast.success('Team member updated successfully');
      } else {
        await createMember.mutateAsync({
          name: String(values.name),
          position: String(values.position),
          image_url: String(values.image_url),
          display_order: Number(values.display_order),
        });
        toast.success('Team member added successfully');
      }
      setFormOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteMember.mutateAsync(deleteConfirm.id);
      toast.success('Team member deleted');
      setDeleteConfirm(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#39FF14]/30 border-t-[#39FF14] rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-12">
        <p>Failed to load team members</p>
        <p className="text-sm text-gray-500 mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{members?.length || 0} members</p>
        <Button
          onClick={handleAdd}
          className="bg-[#39FF14] text-black font-semibold hover:bg-[#39FF14]/90 gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </div>

      {/* Table */}
      <div className="bg-[#141414] rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Order</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {members?.map((member) => (
                <tr key={member.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-9 h-9 rounded-full object-cover bg-gray-700"
                      />
                      <span className="text-white text-sm font-medium">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{member.position}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm text-center">{member.display_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(member)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(member)}
                        className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 h-8 w-8 p-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!members || members.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-500 text-sm">
                    No team members yet. Click "Add Member" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Form */}
      <ContentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingMember ? 'Edit Team Member' : 'Add Team Member'}
        fields={fields}
        initialValues={
          editingMember
            ? {
                name: editingMember.name,
                position: editingMember.position,
                image_url: editingMember.image_url,
                display_order: editingMember.display_order,
              }
            : undefined
        }
        onSubmit={handleSubmit}
        loading={saving}
      />

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-[#1C1C1C] border-gray-700 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Team Member</DialogTitle>
          </DialogHeader>
          <p className="text-gray-400 text-sm">
            Are you sure you want to delete <strong className="text-white">{deleteConfirm?.name}</strong>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="text-gray-400 hover:text-white hover:bg-gray-800">
              Cancel
            </Button>
            <Button onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManager;

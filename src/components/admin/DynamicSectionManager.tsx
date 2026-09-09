import { useState } from 'react';
import { useDynamicSections, useDynamicSectionMutations } from '@/hooks/useDynamicSections';
import type { DynamicSection, ContentBlock } from '@/types/content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Eye, EyeOff, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const emptyBlock: ContentBlock = { type: 'card', title: '', description: '', image_url: '', link: '' };

const DynamicSectionManager = () => {
  const { data: sections, isLoading, error } = useDynamicSections();
  const { createSection, updateSection, deleteSection, toggleVisibility } = useDynamicSectionMutations();

  const [formOpen, setFormOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<DynamicSection | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<DynamicSection | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [sectionType, setSectionType] = useState('cards');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setSectionType('cards');
    setDisplayOrder(0);
    setContentBlocks([]);
  };

  const handleAdd = () => {
    resetForm();
    setEditingSection(null);
    setFormOpen(true);
  };

  const handleEdit = (section: DynamicSection) => {
    setEditingSection(section);
    setTitle(section.title);
    setSubtitle(section.subtitle);
    setSectionType(section.section_type);
    setDisplayOrder(section.display_order);
    setContentBlocks(section.content_blocks || []);
    setFormOpen(true);
  };

  const handleAddBlock = () => {
    setContentBlocks([...contentBlocks, { ...emptyBlock }]);
  };

  const handleUpdateBlock = (index: number, field: keyof ContentBlock, value: string) => {
    const updated = [...contentBlocks];
    updated[index] = { ...updated[index], [field]: value };
    setContentBlocks(updated);
  };

  const handleRemoveBlock = (index: number) => {
    setContentBlocks(contentBlocks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title,
        subtitle,
        section_type: sectionType,
        display_order: displayOrder,
        content_blocks: contentBlocks,
        is_visible: editingSection?.is_visible ?? true,
      };
      if (editingSection) {
        await updateSection.mutateAsync({ id: editingSection.id, ...payload });
        toast.success('Section updated successfully');
      } else {
        await createSection.mutateAsync(payload);
        toast.success('Section created successfully');
      }
      setFormOpen(false);
      resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVisibility = async (section: DynamicSection) => {
    try {
      await toggleVisibility.mutateAsync({ id: section.id, is_visible: !section.is_visible });
      toast.success(section.is_visible ? 'Section hidden' : 'Section visible');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to toggle visibility');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteSection.mutateAsync(deleteConfirm.id);
      toast.success('Section deleted');
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
        <p>Failed to load dynamic sections</p>
        <p className="text-sm text-gray-500 mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{sections?.length || 0} sections</p>
        <Button onClick={handleAdd} className="bg-[#39FF14] text-black font-semibold hover:bg-[#39FF14]/90 gap-2">
          <Plus className="w-4 h-4" />
          Add Section
        </Button>
      </div>

      <div className="bg-[#141414] rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Section</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Blocks</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Visible</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Order</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {sections?.map((section) => (
                <tr key={section.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-white text-sm font-medium">{section.title}</p>
                      {section.subtitle && <p className="text-gray-500 text-xs">{section.subtitle}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm hidden md:table-cell">
                    {section.content_blocks?.length || 0} blocks
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleVisibility(section)}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                        section.is_visible
                          ? 'text-[#39FF14] bg-[#39FF14]/10 hover:bg-[#39FF14]/20'
                          : 'text-gray-500 bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm text-center">{section.display_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(section)} className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(section)} className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 h-8 w-8 p-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!sections || sections.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500 text-sm">
                    No dynamic sections yet. Click "Add Section" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Form Dialog */}
      <Dialog open={formOpen} onOpenChange={(open) => { if (!open) resetForm(); setFormOpen(open); }}>
        <DialogContent className="bg-[#1C1C1C] border-gray-700 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingSection ? 'Edit Dynamic Section' : 'Add Dynamic Section'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-gray-400 text-sm">Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Section title" className="bg-[#141414] border-gray-700 text-white focus:border-[#39FF14]" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-400 text-sm">Subtitle</Label>
                <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Optional subtitle" className="bg-[#141414] border-gray-700 text-white focus:border-[#39FF14]" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-400 text-sm">Section Type</Label>
                <Input value={sectionType} onChange={(e) => setSectionType(e.target.value)} placeholder="cards" className="bg-[#141414] border-gray-700 text-white focus:border-[#39FF14]" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-400 text-sm">Display Order</Label>
                <Input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} className="bg-[#141414] border-gray-700 text-white focus:border-[#39FF14]" />
              </div>
            </div>

            {/* Content Blocks */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-gray-400 text-sm font-semibold">Content Blocks</Label>
                <Button type="button" onClick={handleAddBlock} variant="ghost" size="sm" className="text-[#39FF14] hover:bg-[#39FF14]/10 gap-1">
                  <Plus className="w-3.5 h-3.5" />
                  Add Block
                </Button>
              </div>

              {contentBlocks.length === 0 && (
                <p className="text-gray-600 text-xs text-center py-4 border border-dashed border-gray-700 rounded-lg">
                  No content blocks. Click "Add Block" to add cards to this section.
                </p>
              )}

              {contentBlocks.map((block, index) => (
                <div key={index} className="bg-[#141414] border border-gray-700 rounded-lg p-4 space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveBlock(index)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="text-gray-500 text-xs font-semibold uppercase">Block {index + 1}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-gray-500 text-xs">Title</Label>
                      <Input value={block.title} onChange={(e) => handleUpdateBlock(index, 'title', e.target.value)} placeholder="Block title" className="bg-[#0a0a0a] border-gray-700 text-white text-sm h-9 focus:border-[#39FF14]" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-gray-500 text-xs">Type</Label>
                      <Input value={block.type} onChange={(e) => handleUpdateBlock(index, 'type', e.target.value)} placeholder="card" className="bg-[#0a0a0a] border-gray-700 text-white text-sm h-9 focus:border-[#39FF14]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-500 text-xs">Description</Label>
                    <Textarea value={block.description} onChange={(e) => handleUpdateBlock(index, 'description', e.target.value)} placeholder="Block description..." rows={2} className="bg-[#0a0a0a] border-gray-700 text-white text-sm resize-none focus:border-[#39FF14]" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-gray-500 text-xs">Image URL</Label>
                      <Input value={block.image_url} onChange={(e) => handleUpdateBlock(index, 'image_url', e.target.value)} placeholder="https://..." className="bg-[#0a0a0a] border-gray-700 text-white text-sm h-9 focus:border-[#39FF14]" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-gray-500 text-xs">Link</Label>
                      <Input value={block.link} onChange={(e) => handleUpdateBlock(index, 'link', e.target.value)} placeholder="https://..." className="bg-[#0a0a0a] border-gray-700 text-white text-sm h-9 focus:border-[#39FF14]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => { resetForm(); setFormOpen(false); }} className="text-gray-400 hover:text-white hover:bg-gray-800">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-[#39FF14] text-black font-semibold hover:bg-[#39FF14]/90 disabled:opacity-50">
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-[#1C1C1C] border-gray-700 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Section</DialogTitle>
          </DialogHeader>
          <p className="text-gray-400 text-sm">
            Are you sure you want to delete "<strong className="text-white">{deleteConfirm?.title}</strong>"?
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="text-gray-400 hover:text-white hover:bg-gray-800">Cancel</Button>
            <Button onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DynamicSectionManager;

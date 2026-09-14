import { useState } from 'react';
import { useBlogPosts, useBlogPostMutations } from '@/hooks/useBlogPosts';
import type { BlogPost } from '@/types/content';
import ContentForm, { type FormField } from './ContentForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  { name: 'title', label: 'Title', type: 'text', placeholder: 'Blog post title', required: true },
  { name: 'source', label: 'Source', type: 'text', placeholder: 'AI Today' },
  { name: 'source_url', label: 'Source URL', type: 'text', placeholder: 'aitoday.com' },
  { name: 'date', label: 'Date', type: 'text', placeholder: 'Nov 5, 2025' },
  { name: 'snippet', label: 'Snippet', type: 'textarea', placeholder: 'Brief description...' },
  {
    name: 'image_url',
    label: 'Cover Image',
    type: 'image',
    placeholder: 'https://example.com/image.jpg',
    bucket: 'team-images',
    maxSizeMB: 1,
  },
  { name: 'category', label: 'Category', type: 'text', placeholder: 'Insights' },
  { name: 'read_time', label: 'Read Time', type: 'text', placeholder: '5 min read' },
];

const BlogManager = () => {
  const { data: posts, isLoading, error } = useBlogPosts();
  const { createPost, updatePost, deletePost } = useBlogPostMutations();

  const [formOpen, setFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);

  const handleAdd = () => {
    setEditingPost(null);
    setFormOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormOpen(true);
  };

  const handleSubmit = async (values: Record<string, string | number>) => {
    setSaving(true);
    try {
      const payload = {
        title: String(values.title),
        source: String(values.source),
        source_url: String(values.source_url),
        date: String(values.date),
        snippet: String(values.snippet),
        image_url: String(values.image_url),
        category: String(values.category),
        read_time: String(values.read_time),
      };
      if (editingPost) {
        await updatePost.mutateAsync({ id: editingPost.id, ...payload });
        toast.success('Blog post updated successfully');
      } else {
        await createPost.mutateAsync(payload);
        toast.success('Blog post added successfully');
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
      await deletePost.mutateAsync(deleteConfirm.id);
      toast.success('Blog post deleted');
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
        <p>Failed to load blog posts</p>
        <p className="text-sm text-gray-500 mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{posts?.length || 0} posts</p>
        <Button onClick={handleAdd} className="bg-[#39FF14] text-black font-semibold hover:bg-[#39FF14]/90 gap-2">
          <Plus className="w-4 h-4" />
          Add Post
        </Button>
      </div>

      <div className="bg-[#141414] rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Post</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Source</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {posts?.map((post) => (
                <tr key={post.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={post.image_url} alt={post.title} className="w-12 h-9 rounded object-cover bg-gray-700 hidden sm:block" />
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate max-w-[200px] md:max-w-[300px]">{post.title}</p>
                        <p className="text-gray-500 text-xs">{post.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm hidden md:table-cell">{post.source}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-0 text-xs">
                      {post.category}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(post)} className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(post)} className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 h-8 w-8 p-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!posts || posts.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-500 text-sm">
                    No blog posts yet. Click "Add Post" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ContentForm
        key={editingPost ? `edit-${editingPost.id}` : 'new-post'}
        open={formOpen}
        onOpenChange={(isOpen) => {
          setFormOpen(isOpen);
          if (!isOpen) setEditingPost(null);
        }}
        title={editingPost ? 'Edit Blog Post' : 'Add Blog Post'}
        fields={fields}
        initialValues={
          editingPost
            ? {
                title: editingPost.title,
                source: editingPost.source,
                source_url: editingPost.source_url,
                date: editingPost.date,
                snippet: editingPost.snippet,
                image_url: editingPost.image_url,
                category: editingPost.category,
                read_time: editingPost.read_time,
              }
            : undefined
        }
        onSubmit={handleSubmit}
        loading={saving}
      />

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-[#1C1C1C] border-gray-700 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Blog Post</DialogTitle>
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

export default BlogManager;

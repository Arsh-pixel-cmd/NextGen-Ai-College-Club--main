import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, Clock, BookOpen, X } from 'lucide-react';
import type { BlogPost } from '@/types/content';

interface BlogDetailModalProps {
  post: BlogPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BlogDetailModal = ({ post, open, onOpenChange }: BlogDetailModalProps) => {
  if (!post) return null;

  // Split content into paragraphs for clean typography
  const textContent = post.content?.trim() || post.snippet?.trim() || '';
  const paragraphs = textContent.split(/\n+/).filter((p) => p.trim().length > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#141414] border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl">
        {/* Cover Image Banner */}
        {post.image_url && (
          <div className="relative w-full h-56 md:h-72 overflow-hidden bg-gray-900">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
            
            {/* Category badge over image */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-[#39FF14] text-black font-semibold text-xs border-0 px-2.5 py-1">
                {post.category || 'Article'}
              </Badge>
              {post.read_time && (
                <Badge variant="secondary" className="bg-black/60 backdrop-blur-md text-gray-300 border-gray-700 text-xs gap-1">
                  <Clock className="w-3 h-3 text-[#39FF14]" />
                  {post.read_time}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Article Header & Body */}
        <div className="p-6 md:p-8 space-y-6">
          <DialogHeader className="space-y-3 text-left">
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
              <div className="flex items-center gap-1.5 font-medium text-white">
                <div className="w-6 h-6 rounded-full bg-[#39FF14]/15 border border-[#39FF14]/30 flex items-center justify-center text-[10px] font-bold text-[#39FF14]">
                  {post.source ? post.source.substring(0, 2).toUpperCase() : 'AI'}
                </div>
                <span>{post.source}</span>
              </div>
              <span>&middot;</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-500" />
                {post.date}
              </span>
            </div>

            <DialogTitle className="text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
              {post.title}
            </DialogTitle>
          </DialogHeader>

          {/* Snippet Lead paragraph if distinct from content */}
          {post.content && post.snippet && post.snippet !== post.content && (
            <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 text-gray-300 text-sm font-medium leading-relaxed italic border-l-4 border-l-[#39FF14]">
              {post.snippet}
            </div>
          )}

          {/* Full Article Body Paragraphs */}
          <div className="space-y-4 text-gray-300 text-sm md:text-base leading-relaxed">
            {paragraphs.map((para, idx) => (
              <p key={idx} className="text-gray-300">
                {para}
              </p>
            ))}
          </div>

          {/* Article Footer & Actions */}
          <DialogFooter className="pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 w-full sm:w-auto">
              <BookOpen className="w-4 h-4 text-[#39FF14]" />
              <span>NextGen AI Club Insights</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {post.source_url && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="bg-gray-900 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 gap-1.5 text-xs"
                >
                  <a
                    href={
                      post.source_url.startsWith('http')
                        ? post.source_url
                        : `https://${post.source_url}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Read on {post.source || 'Source'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </Button>
              )}
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-[#39FF14] text-black font-semibold hover:bg-[#39FF14]/90 text-xs px-4"
              >
                Done
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

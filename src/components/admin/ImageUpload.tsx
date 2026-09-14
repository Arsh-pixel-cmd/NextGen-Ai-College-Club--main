import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Loader2, Image as ImageIcon, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { isSafeUrl } from '@/lib/security';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  maxSizeMB?: number;
  placeholder?: string;
}

export const ImageUpload = ({
  value,
  onChange,
  bucket = 'team-images',
  maxSizeMB = 1,
  placeholder = 'https://example.com/photo.jpg',
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid image type. Please select a JPG, PNG, WEBP, or GIF image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate size limit
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      toast.error(
        `Image size (${fileSizeMB} MB) exceeds the ${maxSizeMB} MB limit. Please select a smaller image to save storage.`
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    try {
      // Clean file extension and name
      const ext = file.name.split('.').pop() || 'jpg';
      const cleanBase = file.name
        .substring(0, file.name.lastIndexOf('.'))
        .replace(/[^a-zA-Z0-9]/g, '_')
        .slice(0, 20);
      const filePath = `photo_${Date.now()}_${cleanBase}.${ext}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      onChange(publicUrlData.publicUrl);
      toast.success('Image uploaded successfully!');
    } catch (err: unknown) {
      console.error('Storage upload error:', err);
      const msg = err instanceof Error ? err.message : String(err) || 'Failed to upload image';
      if (msg.toLowerCase().includes('bucket not found') || msg.toLowerCase().includes('not found')) {
        toast.error('Bucket "team-images" not found. Please run SQL migration 005 or paste a URL below.');
        setMode('url');
      } else {
        toast.error(`Upload error: ${msg}`);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const [urlError, setUrlError] = useState('');

  const handleUrlInput = (inputVal: string) => {
    onChange(inputVal);
    const trimmed = inputVal.trim();
    if (!trimmed) {
      setUrlError('');
    } else if (!isSafeUrl(trimmed)) {
      setUrlError('Please enter a valid, safe image URL (http:// or https://)');
    } else {
      setUrlError('');
    }
  };

  return (
    <div className="space-y-2">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-[#0a0a0a] p-0.5 rounded-lg border border-gray-800">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              mode === 'upload'
                ? 'bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Upload className="w-3 h-3" />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              mode === 'url'
                ? 'bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            Paste URL
          </button>
        </div>
        <span className="text-[11px] text-gray-500">Max {maxSizeMB} MB</span>
      </div>

      {/* Preview if image exists */}
      {value ? (
        <div className="relative flex items-center gap-3 p-2 bg-[#141414] border border-gray-700 rounded-lg">
          <img
            src={isSafeUrl(value) ? value : 'https://via.placeholder.com/150?text=Invalid+URL'}
            alt="Preview"
            className="w-14 h-14 rounded-md object-cover bg-gray-800 border border-gray-700 flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error';
            }}
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-white truncate max-w-[240px]">
              {value.split('/').pop() || 'Image Selected'}
            </p>
            <p className="text-[10px] text-[#39FF14] mt-0.5 flex items-center gap-1">
              ✓ Ready
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-red-400/10 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : null}

      {/* Upload Mode UI */}
      {mode === 'upload' ? (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            id="team-image-file-input"
          />
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
              uploading
                ? 'border-[#39FF14]/50 bg-[#39FF14]/5 cursor-wait'
                : 'border-gray-700 hover:border-[#39FF14]/50 hover:bg-gray-800/40 bg-[#141414]'
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center justify-center py-2 gap-2">
                <Loader2 className="w-5 h-5 text-[#39FF14] animate-spin" />
                <p className="text-xs text-gray-300">Uploading to storage...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2 gap-1.5">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white">
                    Click to browse or drop an image
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    JPG, PNG, WEBP, or GIF (max {maxSizeMB} MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* URL Input Mode */
        <div className="space-y-1">
          <Input
            type="url"
            value={value}
            onChange={(e) => handleUrlInput(e.target.value)}
            placeholder={placeholder}
            className={`bg-[#141414] border-gray-700 text-white text-xs placeholder:text-gray-600 focus:border-[#39FF14] ${
              urlError ? 'border-red-500/80 focus:border-red-500' : ''
            }`}
          />
          {urlError && (
            <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              <span>{urlError}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

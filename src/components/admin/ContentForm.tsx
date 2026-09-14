import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImageUpload } from './ImageUpload';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'url' | 'image';
  placeholder?: string;
  required?: boolean;
  bucket?: string;
  maxSizeMB?: number;
}

interface ContentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fields: FormField[];
  initialValues?: Record<string, string | number>;
  onSubmit: (values: Record<string, string | number>) => Promise<void>;
  loading?: boolean;
}

const ContentForm = ({
  open,
  onOpenChange,
  title,
  fields,
  initialValues = {},
  onSubmit,
  loading = false,
}: ContentFormProps) => {
  // Stable serialized key to prevent re-renders while typing from triggering useEffect
  const initialValuesKey = JSON.stringify(initialValues ?? {});

  const getInitialState = () => {
    const defaults: Record<string, string | number> = {};
    fields.forEach((f) => {
      const val = initialValues?.[f.name];
      if (val !== undefined && val !== null) {
        defaults[f.name] = f.type === 'number' ? Number(val) : String(val);
      } else {
        defaults[f.name] = f.type === 'number' ? (f.placeholder && !isNaN(Number(f.placeholder)) ? Number(f.placeholder) : 1) : '';
      }
    });
    return defaults;
  };

  const [values, setValues] = useState<Record<string, string | number>>(getInitialState);

  // Synchronize values only when modal opens or initial values actually change
  useEffect(() => {
    if (open) {
      setValues(getInitialState());
    }
  }, [open, initialValuesKey]);

  const handleChange = (name: string, value: string | number) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formatted: Record<string, string | number> = {};
    fields.forEach((f) => {
      const val = values[f.name];
      if (f.type === 'number') {
        formatted[f.name] = val === '' || val === undefined ? 0 : Number(val);
      } else {
        formatted[f.name] = val !== undefined ? String(val) : '';
      }
    });
    await onSubmit(formatted);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1C1C1C] border-gray-700 text-white max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <Label htmlFor={`form-${field.name}`} className="text-gray-400 text-sm">
                {field.label}
              </Label>
              {field.type === 'textarea' ? (
                <Textarea
                  id={`form-${field.name}`}
                  value={String(values[field.name] ?? '')}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={3}
                  className="bg-[#141414] border-gray-700 text-white placeholder:text-gray-600 focus:border-[#39FF14] resize-none"
                />
              ) : field.type === 'image' ? (
                <ImageUpload
                  value={String(values[field.name] ?? '')}
                  onChange={(url) => handleChange(field.name, url)}
                  bucket={field.bucket || 'team-images'}
                  maxSizeMB={field.maxSizeMB || 1}
                  placeholder={field.placeholder}
                />
              ) : (
                <Input
                  id={`form-${field.name}`}
                  type={field.type === 'number' ? 'number' : field.type === 'url' ? 'url' : 'text'}
                  value={values[field.name] ?? ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="bg-[#141414] border-gray-700 text-white placeholder:text-gray-600 focus:border-[#39FF14]"
                />
              )}
            </div>
          ))}
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#39FF14] text-black font-semibold hover:bg-[#39FF14]/90 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContentForm;

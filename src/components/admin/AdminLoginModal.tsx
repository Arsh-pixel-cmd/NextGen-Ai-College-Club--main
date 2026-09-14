import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Mail, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import { checkRateLimit, resetRateLimit } from '@/lib/rateLimiter';

interface AdminLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AdminLoginModal({ open, onOpenChange }: AdminLoginModalProps) {
  const navigate = useNavigate();
  const { user, isAdmin, signIn, signOut } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const limit = checkRateLimit('admin-login-modal-attempt', 5, 60000);
    if (!limit.allowed) {
      const waitSec = Math.ceil(limit.retryAfterMs / 1000);
      setError(`Too many login attempts. Please wait ${waitSec} second${waitSec === 1 ? '' : 's'} before trying again.`);
      return;
    }

    setLoading(true);

    try {
      await signIn(email);
      resetRateLimit('admin-login-modal-attempt');
      toast.success('Admin verified successfully!');
      onOpenChange(false);
      navigate('/admin');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToAdmin = () => {
    onOpenChange(false);
    navigate('/admin');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#141414] border-gray-800 text-white sm:max-w-md p-6">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#39FF14]/10 border border-[#39FF14]/30 mb-2">
            <Shield className="w-7 h-7 text-[#39FF14]" />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-white">
            Core Team Admin Access
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-xs">
            Restricted to authorized club leaders and core team members.
          </DialogDescription>
        </DialogHeader>

        {user && isAdmin ? (
          <div className="py-4 space-y-4 text-center">
            <div className="p-3 bg-[#39FF14]/10 border border-[#39FF14]/20 rounded-lg text-[#39FF14] text-sm flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Signed in as administrator ({user.email}).</span>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleGoToAdmin}
                className="w-full bg-[#39FF14] text-black font-semibold hover:bg-[#39FF14]/90 gap-2"
              >
                <span>Open Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                onClick={signOut}
                variant="ghost"
                className="text-xs text-gray-400 hover:text-white"
              >
                Sign Out
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs leading-relaxed">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="admin-modal-email" className="text-gray-300 text-xs font-medium">
                  Administrator Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="admin-modal-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@college.edu"
                    required
                    autoFocus
                    className="pl-9 bg-[#1C1C1C] border-gray-700 text-white text-sm placeholder:text-gray-600 focus:border-[#39FF14] focus:ring-[#39FF14]/20 h-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-[#39FF14] text-black font-semibold hover:bg-[#39FF14]/90 transition-all text-sm disabled:opacity-50 mt-1"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Verifying Email with Supabase...
                  </span>
                ) : (
                  'Verify & Access Admin'
                )}
              </Button>
            </form>

            <p className="text-[11px] text-gray-500 text-center leading-normal">
              Access is verified against pre-registered emails in Supabase <code className="text-gray-400">admin_users</code>.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

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
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, User } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface AdminLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AdminLoginModal({ open, onOpenChange }: AdminLoginModalProps) {
  const navigate = useNavigate();
  const { user, isAdmin, signIn, signUp } = useAdminAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        toast.success('Admin authenticated successfully!');
        onOpenChange(false);
        navigate('/admin');
      } else {
        await signUp(email, password, name);
        setSuccessMessage(
          'Account created! Check your email to confirm if verification is enabled, or sign in now.'
        );
        toast.success('Core team account created!');
        setMode('signin');
      }
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
              <CheckCircle2 className="w-4 h-4" />
              <span>You are already logged in as an authorized admin ({user.email}).</span>
            </div>
            <Button
              onClick={handleGoToAdmin}
              className="w-full bg-[#39FF14] text-black font-semibold hover:bg-[#39FF14]/90"
            >
              Open Admin Dashboard
            </Button>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            {/* Mode toggle */}
            <div className="flex bg-[#1C1C1C] p-1 rounded-lg border border-gray-800 text-xs">
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(''); }}
                className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
                  mode === 'signin'
                    ? 'bg-[#39FF14] text-black shadow-sm font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
                className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
                  mode === 'signup'
                    ? 'bg-[#39FF14] text-black shadow-sm font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Register (First Time)
              </button>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs leading-relaxed">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs leading-relaxed">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <Label htmlFor="admin-name" className="text-gray-400 text-xs font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="admin-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="pl-9 bg-[#1C1C1C] border-gray-700 text-white text-sm placeholder:text-gray-600 focus:border-[#39FF14] focus:ring-[#39FF14]/20 h-10"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="admin-modal-email" className="text-gray-400 text-xs font-medium">
                  Core Team Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="admin-modal-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@college.edu"
                    required
                    className="pl-9 bg-[#1C1C1C] border-gray-700 text-white text-sm placeholder:text-gray-600 focus:border-[#39FF14] focus:ring-[#39FF14]/20 h-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin-modal-password" className="text-gray-400 text-xs font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="admin-modal-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="pl-9 pr-9 bg-[#1C1C1C] border-gray-700 text-white text-sm placeholder:text-gray-600 focus:border-[#39FF14] focus:ring-[#39FF14]/20 h-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-[#39FF14] text-black font-semibold hover:bg-[#39FF14]/90 transition-all text-sm disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    {mode === 'signin' ? 'Authenticating...' : 'Creating account...'}
                  </span>
                ) : mode === 'signin' ? (
                  'Sign In to Admin Panel'
                ) : (
                  'Register Core Team Account'
                )}
              </Button>
            </form>

            <p className="text-[11px] text-gray-500 text-center">
              Your email must be listed in the authorized <code className="text-gray-400">admin_users</code> table to access this panel.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle2, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminLogin = () => {
  const { signIn, signUp } = useAdminAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
        setSuccessMessage('Core team account created! You can now sign in.');
        setMode('signin');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Top Back Link */}
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-[#39FF14] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Public Site
          </a>
        </div>

        {/* Logo / Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#39FF14]/20 to-[#39FF14]/5 border border-[#39FF14]/30 mb-4">
            <Lock className="w-8 h-8 text-[#39FF14]" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">NextGen AI College Club • Core Team Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#141414] border border-gray-800 rounded-2xl p-8 shadow-2xl shadow-black/50">
          {/* Mode Switcher */}
          <div className="flex bg-[#1C1C1C] p-1 rounded-xl border border-gray-800 text-xs mb-6">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(''); }}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
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
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-[#39FF14] text-black shadow-sm font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Register (First Time)
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Alert */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs leading-relaxed">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Alert */}
            {successMessage && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs leading-relaxed">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Name Field (Sign Up Only) */}
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <Label htmlFor="admin-reg-name" className="text-gray-400 text-xs font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="admin-reg-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="pl-10 bg-[#1C1C1C] border-gray-700 text-white placeholder:text-gray-600 focus:border-[#39FF14] focus:ring-[#39FF14]/20 h-11 text-sm"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="admin-email" className="text-gray-400 text-xs font-medium">
                Core Team Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@college.edu"
                  required
                  className="pl-10 bg-[#1C1C1C] border-gray-700 text-white placeholder:text-gray-600 focus:border-[#39FF14] focus:ring-[#39FF14]/20 h-11 text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="admin-password" className="text-gray-400 text-xs font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="pl-10 pr-10 bg-[#1C1C1C] border-gray-700 text-white placeholder:text-gray-600 focus:border-[#39FF14] focus:ring-[#39FF14]/20 h-11 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 bg-[#39FF14] text-black font-semibold hover:bg-[#39FF14]/90 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : mode === 'signin' ? (
                'Sign In to Admin Panel'
              ) : (
                'Register Core Team Account'
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Access is strictly restricted to emails pre-registered in <code className="text-gray-500">admin_users</code>.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

'use client';
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Chrome } from "lucide-react";

interface MemberAccessProps {
  onAdminClick?: () => void;
}

const MemberAccess = ({ onAdminClick: _onAdminClick }: MemberAccessProps) => {
  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      toast.error("Failed to sign in. Please try again.");
    }
  };

  return (
    <section 
      id="member-access" 
      className="section-standard bg-dark-bg text-dark-fg z-40 relative"
    >
      <div className="w-full max-w-md text-center p-8 rounded-2xl bg-gray-900/50 border border-gray-800 shadow-2xl">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">
          Member Access
        </h2>
        <p className="mt-4 text-base text-gray-400">
          Sign in to view exclusive content, upcoming events, and more.
        </p>
        
        <div className="mt-8 space-y-4">
          <Button 
            onClick={handleGoogleSignIn}
            className="w-full px-8 py-6 bg-white text-black text-lg font-bold hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center gap-3 cursor-pointer"
          >
            <Chrome className="h-6 w-6" />
            <span>Sign In with Google</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MemberAccess;

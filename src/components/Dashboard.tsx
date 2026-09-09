import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/sonner';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Successfully signed out");
    } catch (error) {
      console.error("Error signing out: ", error);
      toast.error("Error signing out. Please try again.");
    }
  };

  return (
    <section 
      id="dashboard" 
      className="section-full bg-dark-bg text-dark-fg z-40 relative"
    >
      <div className="w-full max-w-md text-center p-8">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
          Welcome
        </h2>
        <p className="mt-4 text-lg text-gray-400">
          {user ? user.email : 'Member'}
        </p>
        
        <div className="mt-12">
          <button 
            onClick={handleSignOut}
            className="w-full px-8 py-4 bg-neon-red text-dark-bg text-lg font-bold uppercase tracking-wider border-2 border-neon-red hover:bg-transparent hover:text-neon-red transition-colors duration-300"
          >
            Sign Out
          </button>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

import { useAdminAuth } from '@/hooks/useAdminAuth';
import { LogOut, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
  activeSection: string;
}

const AdminHeader = ({ activeSection }: AdminHeaderProps) => {
  const { user, signOut } = useAdminAuth();

  const sectionLabels: Record<string, string> = {
    team: 'Team Members',
    blogs: 'Blog Posts',
    events: 'Events',
    sections: 'Dynamic Sections',
  };

  return (
    <header className="h-16 bg-[#141414] border-b border-gray-800 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#39FF14]/10 border border-[#39FF14]/30 flex items-center justify-center">
            <span className="text-[#39FF14] font-bold text-sm">N</span>
          </div>
          <span className="text-white font-semibold text-sm">Admin</span>
          <span className="text-gray-600 text-sm">/</span>
        </div>
        <h1 className="text-white font-medium text-base md:text-lg">
          {sectionLabels[activeSection] || 'Dashboard'}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden md:inline text-gray-500 text-xs truncate max-w-[200px]">
          {user?.email}
        </span>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white hover:bg-gray-800 gap-1.5 text-xs"
        >
          <a href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Site</span>
          </a>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 gap-2 text-xs"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;

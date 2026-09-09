import { Users, Newspaper, Calendar, LayoutGrid } from 'lucide-react';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: 'team', label: 'Team Members', icon: Users },
  { id: 'blogs', label: 'Blog Posts', icon: Newspaper },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'sections', label: 'Dynamic Sections', icon: LayoutGrid },
];

const AdminSidebar = ({ activeSection, onSectionChange }: AdminSidebarProps) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#141414] border-r border-gray-800 flex-shrink-0">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Content Management
          </h2>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-[#39FF14]' : ''}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <a
            href="/"
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Back to Public Site
          </a>
        </div>
      </aside>

      {/* Mobile Bottom Tabs */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#141414] border-t border-gray-800 flex justify-around py-2 px-1">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                isActive
                  ? 'text-[#39FF14]'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium truncate">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default AdminSidebar;

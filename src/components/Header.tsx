import { Shield } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  onAdminClick?: () => void;
}

const Header = ({ onMenuToggle, onAdminClick }: HeaderProps) => {
  return (
    <header 
      id="header" 
      className="fixed top-0 left-0 w-full p-6 lg:p-8 z-50 flex justify-between items-center text-white mix-blend-difference"
    >
      <a href="#home" className="text-xl font-bold tracking-wider">
        NEXTGENXAI
      </a>
      <div className="flex items-center gap-4">
        {onAdminClick && (
          <button
            type="button"
            onClick={onAdminClick}
            aria-label="Admin Login"
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border border-white/30 hover:border-[#39FF14] hover:text-[#39FF14] transition-all cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        )}
        <button 
          id="menu-toggle"
          className="text-xl font-bold tracking-wider focus:outline-none cursor-pointer"
          onMouseEnter={onMenuToggle}
          onClick={onMenuToggle}
        >
          MENU
        </button>
      </div>
    </header>
  );
};

export default Header;
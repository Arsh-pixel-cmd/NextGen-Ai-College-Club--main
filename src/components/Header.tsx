interface HeaderProps {
  onMenuToggle: () => void;
}

const Header = ({ onMenuToggle }: HeaderProps) => {
  return (
    <header 
      id="header" 
      className="fixed top-0 left-0 w-full p-6 lg:p-8 z-50 flex justify-between items-center text-white mix-blend-difference"
    >
      <a href="#home" className="text-xl font-bold tracking-wider">
        NEXTGENXAI
      </a>
      <button 
        id="menu-toggle"
        className="text-xl font-bold tracking-wider focus:outline-none"
        onMouseEnter={onMenuToggle}
      >
        MENU
      </button>
    </header>
  );
};

export default Header;
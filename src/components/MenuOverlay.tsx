import { useEffect, useRef } from 'react';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuOverlay = ({ isOpen, onClose }: MenuOverlayProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (overlayRef.current) {
      if (isOpen) {
        overlayRef.current.classList.remove('translate-x-full');
      } else {
        overlayRef.current.classList.add('translate-x-full');
      }
    }
  }, [isOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      onClose();
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  };

  return (
    <div 
      ref={overlayRef}
      id="menu-overlay" 
      className="fixed top-0 left-0 w-full h-full bg-black flex flex-col justify-center items-center z-40 transform translate-x-full transition-transform duration-500 ease-in-out overflow-hidden"
    >
      {/* Video Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/50 to-blue-900/50 z-0" >
      <video src="/videos/menuBackground.mp4" autoPlay loop muted className="w-full h-full object-cover"></video>
      </div>
      
      {/* Dark Overlay for Readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/70 z-10" />
      
      
      
      <nav className="text-center z-20">
        <ul className="space-y-4">
          <li>
            <a 
              href="#home" 
              className="menu-link text-5xl md:text-7xl font-black uppercase tracking-tighter hover:text-gray-400 transition-colors"
              onClick={(e) => handleNavClick(e, '#home')}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="#about" 
              className="menu-link text-5xl md:text-7xl font-black uppercase tracking-tighter hover:text-gray-400 transition-colors"
              onClick={(e) => handleNavClick(e, '#about')}
            >
              About
            </a>
          </li>
          <li>
            <a 
              href="#projects" 
              className="menu-link text-5xl md:text-7xl font-black uppercase tracking-tighter hover:text-gray-400 transition-colors"
              onClick={(e) => handleNavClick(e, '#projects')}
            >
              Work
            </a>
          </li>
          <li>
            <a 
              href="#contact" 
              className="menu-link text-5xl md:text-7xl font-black uppercase tracking-tighter hover:text-gray-400 transition-colors"
              onClick={(e) => handleNavClick(e, '#contact')}
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-full overflow-hidden whitespace-nowrap text-gray-800 z-20 py-4">
        <div className="marquee-animation text-2xl font-bold uppercase inline-block">
          <span>Ignite AI Passion • Every moment matters • Chase your dreams • Stumbled? Try again •&nbsp;</span>
          <span>Practice, practice, practice • You matter too • We all suffer • Do it now •&nbsp;</span>
        </div>
      </div>
    </div>
  );
};

export default MenuOverlay;

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Check if we're on the home page or any section route
  const isHomePage = ['/', '/about', '/services', '/philosophy', '/contact'].includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // On non-home pages, always show background; on home page sections, show background when scrolled
  const shouldShowBackground = !isHomePage || isScrolled;
  
  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 animate-fade-in ${shouldShowBackground ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <Logo variant={shouldShowBackground ? 'color' : 'light'} />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          {['About', 'Services', 'Philosophy'].map((item) => {
            const itemPath = `/${item.toLowerCase()}`;
            const isActive = location.pathname === itemPath;
            return (
              <Link 
                key={item} 
                to={itemPath}
                className={`text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-brand-seaBlue font-semibold' 
                    : shouldShowBackground 
                      ? 'text-brand-charcoal hover:text-brand-ltPurple' 
                      : 'text-white drop-shadow-sm hover:text-brand-ltPurple'
                }`}
              >
                {item}
              </Link>
            );
          })}
          <Link 
            to="/contact"
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all transform hover:scale-105 ${
              location.pathname === '/contact'
                ? 'bg-brand-seaBlue text-white hover:bg-brand-seaBlue/90'
                : shouldShowBackground 
                  ? 'bg-brand-dkPurple text-white hover:bg-brand-ltPurple' 
                  : 'bg-white/90 text-brand-dkPurple hover:bg-white'
            }`}
          >
            Let's Talk
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={shouldShowBackground ? 'text-brand-charcoal' : 'text-white'} />
          ) : (
            <Menu className={shouldShowBackground ? 'text-brand-charcoal' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white absolute w-full shadow-xl border-t border-gray-100">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {['About', 'Services', 'Philosophy', 'Contact'].map((item) => {
              const itemPath = `/${item.toLowerCase()}`;
              const isActive = location.pathname === itemPath;
              return (
                <Link 
                  key={item} 
                  to={itemPath}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive
                      ? 'text-brand-seaBlue bg-brand-seaBlue/10 font-semibold'
                      : 'text-brand-charcoal hover:text-brand-ltPurple hover:bg-brand-soft'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

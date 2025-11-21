
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 animate-fade-in ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <a href="#" className="hover:opacity-90 transition-opacity">
          <Logo variant={isScrolled ? 'color' : 'light'} />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          {['About', 'Services', 'Philosophy'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className={`text-sm font-medium hover:text-brand-ltPurple transition-colors ${isScrolled ? 'text-brand-charcoal' : 'text-white drop-shadow-sm'}`}
            >
              {item}
            </a>
          ))}
          <a 
            href="#contact" 
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all transform hover:scale-105 ${
              isScrolled 
                ? 'bg-brand-dkPurple text-white hover:bg-brand-ltPurple' 
                : 'bg-white/90 text-brand-dkPurple hover:bg-white'
            }`}
          >
            Let's Talk
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={isScrolled ? 'text-brand-charcoal' : 'text-white'} />
          ) : (
            <Menu className={isScrolled ? 'text-brand-charcoal' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white absolute w-full shadow-xl border-t border-gray-100">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {['About', 'Services', 'Philosophy', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="block px-3 py-2 text-base font-medium text-brand-charcoal hover:text-brand-ltPurple hover:bg-brand-soft rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

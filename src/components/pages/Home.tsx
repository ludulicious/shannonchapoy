import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from '../Navigation';
import Hero from '../Hero';
import About from '../About';
import Services from '../Services';
import Philosophy from '../Philosophy';
import Contact from '../Contact';
import Footer from '../Footer';

const Home = () => {
  const location = useLocation();
  const prevPathRef = useRef<string>('');

  useEffect(() => {
    const currentPath = location.pathname;
    const prevPath = prevPathRef.current;
    
    // Define home page section routes
    const homePageRoutes = ['/', '/about', '/services', '/philosophy', '/contact'];
    const isHomePageRoute = homePageRoutes.includes(currentPath);
    const wasHomePageRoute = homePageRoutes.includes(prevPath);
    
    // Only handle scrolling if we're navigating within home page sections
    if (isHomePageRoute) {
      if (currentPath !== '/') {
        const sectionId = currentPath.substring(1); // Remove leading "/"
        
        // If we're coming from another home page section, scroll smoothly
        // If we're coming from a different page, wait for page transition then scroll
        const scrollToSection = () => {
          const element = document.getElementById(sectionId);
          
          if (element) {
            const offset = 80; // Account for fixed navigation
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: wasHomePageRoute ? 'smooth' : 'auto'
            });
          }
        };

        // If coming from a different page, wait for transition
        // If navigating within home page, scroll immediately
        if (wasHomePageRoute) {
          setTimeout(scrollToSection, 50);
        } else {
          setTimeout(scrollToSection, 200); // Wait for page transition
        }
      } else if (currentPath === '/' && !wasHomePageRoute) {
        // Coming from a different page to home, scroll to top
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    }
    
    // Update previous path
    prevPathRef.current = currentPath;
  }, [location.pathname]);

  return (
    <div className="antialiased text-brand-charcoal bg-brand-soft min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1">
        <Hero />
        <About />
        <Services />
        <Philosophy />
        <Contact />
      </div>
      <Footer />
    </div>
  );
};

export default Home;


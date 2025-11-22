import React, { useEffect, useLayoutEffect, useRef } from 'react';
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
    const isPageRefresh = prevPath === '';
    
    let loadHandler: (() => void) | null = null;
    
    // Only handle scrolling if we're navigating within home page sections
    if (isHomePageRoute) {
      if (currentPath === '/') {
        // Navigating to root home page - always scroll to top
        window.scrollTo({ top: 0, behavior: wasHomePageRoute ? 'smooth' : 'auto' });
      } else {
        // Navigating to a section
        const sectionId = currentPath.substring(1); // Remove leading "/"
        
        // Scroll function with retry logic for page refresh
        const scrollToSection = (retryCount = 0) => {
          const element = document.getElementById(sectionId);
          
          if (element) {
            // Ensure element is rendered and has dimensions
            const rect = element.getBoundingClientRect();
            if (rect.height === 0 && retryCount < 20) {
              // Element exists but not rendered yet, retry
              requestAnimationFrame(() => scrollToSection(retryCount + 1));
              return;
            }
            
            const offset = 80; // Account for fixed navigation
            const elementPosition = rect.top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: wasHomePageRoute && !isPageRefresh ? 'smooth' : 'auto'
            });
          } else if (retryCount < 20) {
            // Element not found yet, retry after a short delay
            requestAnimationFrame(() => scrollToSection(retryCount + 1));
          }
        };

        // On page refresh, wait for DOM and resources to be ready
        if (isPageRefresh) {
          // First try after DOM is ready
          requestAnimationFrame(() => {
            setTimeout(() => scrollToSection(), 100);
          });
          
          // Also try after window load (images/iframes loaded)
          loadHandler = () => {
            scrollToSection();
          };
          
          if (document.readyState === 'complete') {
            // Already loaded
            setTimeout(() => scrollToSection(), 300);
          } else {
            window.addEventListener('load', loadHandler, { once: true });
          }
        } else if (wasHomePageRoute) {
          // Navigating within home page sections
          setTimeout(scrollToSection, 50);
        } else {
          // Coming from a different page
          setTimeout(scrollToSection, 200);
        }
      }
    }
    
    // Update previous path
    prevPathRef.current = currentPath;
    
    // Cleanup function
    return () => {
      if (loadHandler) {
        window.removeEventListener('load', loadHandler);
      }
    };
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


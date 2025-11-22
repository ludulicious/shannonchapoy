import { useLayoutEffect, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const prevPathnameRef = useRef<string>('');

  useLayoutEffect(() => {
    // Define home page routes (where we allow section scrolling)
    const homePageRoutes = ['/', '/about', '/services', '/philosophy', '/contact'];
    const isHomePageRoute = homePageRoutes.includes(pathname);
    const wasHomePageRoute = homePageRoutes.includes(prevPathnameRef.current);
    
    // Only scroll to top if:
    // 1. Navigating to a non-home page (privacy, terms, markdown)
    // 2. Navigating from a non-home page to any page
    if (!isHomePageRoute || !wasHomePageRoute) {
      // Add class to prevent visible scrolling during transition
      document.documentElement.classList.add('no-scroll-transition');
      
      // Immediately reset scroll position synchronously before paint
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Force a reflow to ensure scroll position is set
      document.documentElement.offsetHeight;
      
      // Remove class after transition
      setTimeout(() => {
        document.documentElement.classList.remove('no-scroll-transition');
      }, 150);
    }
    
    prevPathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    // Define home page routes
    const homePageRoutes = ['/', '/about', '/services', '/philosophy', '/contact'];
    const isHomePageRoute = homePageRoutes.includes(pathname);
    const wasHomePageRoute = homePageRoutes.includes(prevPathnameRef.current);
    
    // Only enforce scroll position for non-home pages
    if (!isHomePageRoute || !wasHomePageRoute) {
      // Multiple checks to catch any delayed scrolls
      const checkAndReset = () => {
        if (window.scrollY !== 0 || document.documentElement.scrollTop !== 0 || document.body.scrollTop !== 0) {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
      };
      
      // Check immediately and after delays
      requestAnimationFrame(checkAndReset);
      setTimeout(checkAndReset, 0);
      setTimeout(checkAndReset, 10);
      setTimeout(checkAndReset, 50);
      setTimeout(checkAndReset, 100);
      setTimeout(checkAndReset, 200);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;


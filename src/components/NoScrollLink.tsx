import { Link, LinkProps, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

interface NoScrollLinkProps extends LinkProps {
  children: React.ReactNode;
}

const NoScrollLink: React.FC<NoScrollLinkProps> = ({ to, onClick, ...props }) => {
  const location = useLocation();
  
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    // Define routes that should reset scroll
    const nonHomeRoutes = ['/privacy', '/terms'];
    const isNonHomeRoute = typeof to === 'string' && (nonHomeRoutes.includes(to) || to.startsWith('/markdown'));
    const isCurrentlyNonHome = nonHomeRoutes.includes(location.pathname) || location.pathname.startsWith('/markdown');
    
    // If navigating to/from a non-home page, reset scroll immediately
    if (isNonHomeRoute || isCurrentlyNonHome) {
      // Add class to prevent visible scrolling
      document.documentElement.classList.add('no-scroll-transition');
      
      // Reset scroll BEFORE navigation
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Remove class after a short delay to allow navigation
      setTimeout(() => {
        document.documentElement.classList.remove('no-scroll-transition');
      }, 100);
    }
    
    // Call original onClick if provided
    if (onClick) {
      onClick(e);
    }
  }, [to, location.pathname, onClick]);

  return <Link to={to} onClick={handleClick} {...props} />;
};

export default NoScrollLink;


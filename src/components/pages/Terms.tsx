import React, { useLayoutEffect, useEffect, useState, useRef } from 'react';
import Navigation from '../Navigation';
import Footer from '../Footer';
import MarkdownRenderer from '../MarkdownRenderer';

const Terms = () => {
  const [isVisible, setIsVisible] = useState(false);
  const hasScrolledRef = useRef(false);

  useLayoutEffect(() => {
    // Reset scroll position immediately before paint
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    // Fade in effect when page loads
    setIsVisible(true);
  }, []);

  return (
    <div className={`antialiased text-brand-charcoal bg-brand-soft min-h-screen flex flex-col transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Navigation />
      <div className="flex-1 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <MarkdownRenderer filename="terms.md" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;


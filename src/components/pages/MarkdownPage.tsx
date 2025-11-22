import React, { useLayoutEffect, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '../Navigation';
import Footer from '../Footer';
import MarkdownRenderer from '../MarkdownRenderer';

const MarkdownPage = () => {
  const { filename } = useParams<{ filename?: string }>();
  const [isVisible, setIsVisible] = useState(false);

  useLayoutEffect(() => {
    // Prevent any scrolling - scroll to top immediately before paint
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [filename]);

  useEffect(() => {
    // Fade in effect when page loads
    setIsVisible(true);
  }, [filename]);

  if (!filename) {
    return (
      <div className={`antialiased text-brand-charcoal bg-brand-soft min-h-screen transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-8 text-brand-charcoal">Page Not Found</h1>
            <p>Please specify a markdown filename in the URL.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`antialiased text-brand-charcoal bg-brand-soft min-h-screen transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <MarkdownRenderer filename={filename} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MarkdownPage;


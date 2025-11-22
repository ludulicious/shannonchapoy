import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../Navigation';
import Footer from '../Footer';

const NotFound = () => {
  return (
    <div className="antialiased text-brand-charcoal bg-brand-soft min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 pt-24 pb-16 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-brand-dkPurple mb-4">Page Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. The page may have been moved or doesn't exist. Please try again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="px-8 py-3 bg-brand-dkPurple text-white rounded-full font-semibold hover:bg-brand-ltPurple transition-all transform hover:scale-105"
            >
              Go Home
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 bg-white text-brand-dkPurple border-2 border-brand-dkPurple rounded-full font-semibold hover:bg-brand-soft transition-all transform hover:scale-105"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;


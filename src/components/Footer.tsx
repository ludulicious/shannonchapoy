
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-brand-charcoal text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <h3 className="font-serif text-2xl font-bold mb-2">Shannon Chapoy</h3>
          <p className="text-gray-400 text-sm">Helping women lead their best life</p>
        </div>
        
        <div className="flex space-x-8 mb-6 md:mb-0 text-sm text-gray-400">
          <Link to="/privacy" className="hover:text-brand-ltPurple transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-brand-ltPurple transition-colors">Terms of Service</Link>
        </div>
        
        <div className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Shannon Chapoy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

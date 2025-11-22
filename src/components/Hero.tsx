
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Hero = () => {
  const { elementRef: contentRef, isVisible } = useScrollAnimation(0.2);

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-brand-charcoal">
      {/* Background Image */}
      <img 
        src="https://images.unsplash.com/photo-1528739215557-acce0b37e9b7?q=80&w=1920&auto=format&fit=crop"
        alt="Butterflies in brand colors"
        className="absolute inset-0 w-full h-full object-cover z-0 brightness-110"
      />

      {/* Light Overlay to Brighten Background */}
      <div className="absolute inset-0 bg-white/30 z-10"></div>

      {/* Gradient Overlay for Text Readability and Brand Tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dkPurple/30 via-brand-dkPurple/15 to-brand-dkPurple/70 z-10 mix-blend-multiply"></div>
      <div className="absolute inset-0 bg-black/10 z-10"></div>

      {/* Main Content */}
      <div 
        ref={contentRef}
        className={`relative z-20 text-center px-4 max-w-5xl mx-auto transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className={`mb-8 inline-block transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}>
          <div className="p-5 bg-white/50 backdrop-blur-md rounded-full shadow-[0_0_40px_rgba(255,255,255,0.2)] animate-float">
            <Logo variant="color" showText={false} className="scale-110 origin-center" />
          </div>
        </div>
        
        <h1 className={`font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl tracking-tight transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}>
          Shannon Chapoy
        </h1>
        <p className={`font-sans text-xl md:text-3xl text-white mb-12 font-light tracking-wide drop-shadow-lg max-w-2xl mx-auto transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}>
          Helping women lead their best life
        </p>
        <div className={`flex flex-col sm:flex-row gap-5 justify-center transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}>
          <Link 
            to="/contact" 
            className="px-10 py-4 bg-brand-ltPurple text-white rounded-full font-bold text-lg hover:bg-brand-dkPurple transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
          >
            Start Your Journey
          </Link>
          <Link 
            to="/about" 
            className="px-10 py-4 bg-white/10 backdrop-blur-md text-white border border-white/50 rounded-full font-bold text-lg hover:bg-white/20 transition-all hover:shadow-lg transform hover:-translate-y-1"
          >
            Join a PJ Group
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;


import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Philosophy = () => {
  const { elementRef: contentRef, isVisible } = useScrollAnimation(0.2);

  return (
    <section id="philosophy" className="py-24 relative text-white overflow-hidden">
      <div className="absolute inset-0">
        {/* Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2000&auto=format&fit=crop"
          alt="Nature background"
          className="w-full h-full object-cover brightness-110"
        />
        {/* Light Overlay to Brighten Background */}
        <div className="absolute inset-0 bg-white/30"></div>
        {/* Purple Tint Overlay */}
        <div className="absolute inset-0 bg-brand-ltPurple/20"></div>
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-brand-dkPurple/60 mix-blend-multiply"></div>
      </div>
      
      <div 
        ref={contentRef}
        className={`relative z-10 max-w-4xl mx-auto px-4 text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <span className={`inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold tracking-wider mb-6 text-white transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          MY PHILOSOPHY
        </span>
        <h2 className={`font-serif text-4xl md:text-5xl font-bold mb-8 leading-tight transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}>
          "Transformation is not about becoming someone new, it's about becoming who you were always meant to be."
        </h2>
        <p className={`text-xl text-white/90 mb-10 italic font-serif transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}>
          - Shannon Chapoy
        </p>
        <div className={`flex justify-center space-x-2 transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}>
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="w-3 h-3 bg-white rounded-full opacity-50"
              style={{ animationDelay: `${700 + i * 100}ms` }}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Philosophy;

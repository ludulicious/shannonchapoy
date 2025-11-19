
import React from 'react';

const Philosophy = () => {
  return (
    <section id="philosophy" className="py-24 relative text-white overflow-hidden">
      <div className="absolute inset-0">
        {/* Direct Image Element - Reliable Rendering */}
        <img 
          src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2000&auto=format&fit=crop"
          alt="Nature background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-dkPurple/90 mix-blend-multiply"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold tracking-wider mb-6 text-white">MY PHILOSOPHY</span>
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-8 leading-tight">
          "Transformation is not about becoming someone new, it's about becoming who you were always meant to be."
        </h2>
        <p className="text-xl text-white/90 mb-10 italic font-serif">
          - Shannon Chapoy
        </p>
        <div className="flex justify-center space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-3 h-3 bg-white rounded-full opacity-50"></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Philosophy;

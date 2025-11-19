
import React, { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';

const About = () => {
  // Attempt to load the local image from the root directory.
  // Using a query parameter (v=timestamp) bypasses browser cache to ensure 
  // the newly uploaded file is detected immediately instead of a cached 404.
  const [imgSrc, setImgSrc] = useState('/shannon.jpg?v=' + new Date().getTime());
  const [hasError, setHasError] = useState(false);

  const handleImgError = () => {
    if (!hasError) {
      setHasError(true);
      // Fallback to the professional stock photo if the local file is truly missing
      setImgSrc('https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=988&auto=format&fit=crop');
    }
  };

  return (
    <section id="about" className="py-20 bg-brand-soft relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-brand-ltPurple/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-seaBlue/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-dkPurple/10 transform translate-x-4 translate-y-4 rounded-2xl"></div>
            <img 
              src={imgSrc} 
              alt="Shannon Chapoy" 
              onError={handleImgError}
              className="relative rounded-2xl shadow-xl w-full object-cover h-[500px] bg-gray-200"
            />
          </div>
          
          <div>
            <h2 className="font-serif text-4xl font-bold text-brand-dkPurple mb-6">Hi, I'm Shannon</h2>
            <div className="w-20 h-1 bg-brand-ltPurple mb-8"></div>
            <p className="text-lg text-brand-charcoal mb-6 leading-relaxed">
              I believe that every woman holds the power to transform her life, just as a butterfly emerges from its cocoon with vibrant new wings. My mission is to guide you through your own metamorphosis.
            </p>
            <p className="text-lg text-brand-charcoal mb-8 leading-relaxed">
              With years of experience in life coaching and wellness, I specialize in helping women break free from limiting beliefs, discover their true purpose, and create a life that feels as good on the inside as it looks on the outside.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Heart className="text-brand-ltPurple w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-bold text-brand-charcoal">Compassionate</h4>
                  <p className="text-sm text-gray-500">Empathy first approach</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Sparkles className="text-brand-ltPurple w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-bold text-brand-charcoal">Empowering</h4>
                  <p className="text-sm text-gray-500">Tools for real change</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

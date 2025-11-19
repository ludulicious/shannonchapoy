
import React from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Philosophy from './components/Philosophy';
import Contact from './components/Contact';
import Footer from './components/Footer';

const App = () => {
  return (
    <div className="antialiased text-brand-charcoal bg-brand-soft">
      <Navigation />
      <Hero />
      <About />
      <Services />
      <Philosophy />
      <Contact />
      <Footer />
    </div>
  );
};

export default App;

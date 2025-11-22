import Navigation from '../Navigation';
import Hero from '../Hero';
import About from '../About';
import Services from '../Services';
import Philosophy from '../Philosophy';
import Contact from '../Contact';
import Footer from '../Footer';

const Home = () => {
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

export default Home;


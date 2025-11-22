import Navigation from '../Navigation';
import Footer from '../Footer';
import MarkdownRenderer from '../MarkdownRenderer';

const Privacy = () => {
  return (
    <div className="antialiased text-brand-charcoal bg-brand-soft min-h-screen">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <MarkdownRenderer filename="privacy.md" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;


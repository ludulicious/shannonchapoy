import { useParams } from 'react-router-dom';
import Navigation from '../Navigation';
import Footer from '../Footer';
import MarkdownRenderer from '../MarkdownRenderer';

const MarkdownPage = () => {
  const { filename } = useParams<{ filename?: string }>();

  if (!filename) {
    return (
      <div className="antialiased text-brand-charcoal bg-brand-soft min-h-screen">
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
    <div className="antialiased text-brand-charcoal bg-brand-soft min-h-screen">
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


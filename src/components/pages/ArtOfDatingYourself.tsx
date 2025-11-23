import { useLayoutEffect, useEffect, useState } from 'react';
import Navigation from '../Navigation';
import Footer from '../Footer';
import MarkdownRenderer from '../MarkdownRenderer';
import { Sun } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const ArtOfDatingYourself = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { elementRef, isVisible: formVisible } = useScrollAnimation(0.2);

    useLayoutEffect(() => {
        // Prevent any scrolling - scroll to top immediately before paint
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, []);

    useEffect(() => {
        // Fade in effect when page loads
        setIsVisible(true);
    }, []);

    return (
        <div className={`antialiased text-brand-charcoal bg-brand-soft min-h-screen flex flex-col transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <Navigation />
            <div className="flex-1 pt-24 pb-16">
                {/* Title Section */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-md bg-brand-skyBlue flex-shrink-0">
                            <Sun className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-skyBlue">The Art of Dating Yourself</h1>
                    </div>
                </div>

                {/* Markdown Content Section */}
                <p className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                    A series of workshops designed to help you date yourself better. We'll cover topics like self-love, self-care, and self-improvement.
                </p>

                {/* Contact Form Section */}
                <section className="bg-brand-soft">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div
                            ref={elementRef}
                            className={`bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row transition-all duration-1000 ${formVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
                                }`}
                        >
                            <div className="bg-brand-skyBlue p-10 md:w-2/5 text-white flex flex-col justify-between">
                                <div>
                                    <div>
                                        <h3 className="font-serif text-3xl font-bold mb-6">Sign up for my waiting list</h3>
                                        <p className="text-white/80 mb-8">Be the first to know when I launch my The Art of Dating Yourself program.</p>
                                        <p className="text-white/80 mb-8">While I'm  still working on the program, You will receive some emails with inspirational content and tips to help you on your journey.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="md:w-4/5">
                                <iframe
                                    src="https://actions.shannonchapoy.com/widget/form/OuOANmqGsixnQg0en5oF"
                                    style={{ width: '100%', height: '100%', border: 'none', borderRadius: '4px' }}
                                    id="inline-OuOANmqGsixnQg0en5oF"
                                    data-layout="{'id':'INLINE'}"
                                    data-trigger-type="alwaysShow"
                                    data-trigger-value=""
                                    data-activation-type="alwaysActivated"
                                    data-activation-value=""
                                    data-deactivation-type="neverDeactivate"
                                    data-deactivation-value=""
                                    data-form-name="Waiting Art of Dating Yourself"
                                    data-height="555"
                                    data-layout-iframe-id="inline-OuOANmqGsixnQg0en5oF"
                                    data-form-id="OuOANmqGsixnQg0en5oF"
                                    title="Waiting Art of Dating Yourself"
                                >
                                </iframe>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                    <MarkdownRenderer filename="art-of-dating-yourself.md" />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ArtOfDatingYourself;


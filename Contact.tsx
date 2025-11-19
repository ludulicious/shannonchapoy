
import React from 'react';
import { Mail, Instagram, Facebook, Linkedin } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-brand-soft">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          <div className="bg-brand-dkPurple p-10 md:w-2/5 text-white flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-3xl font-bold mb-6">Let's Connect</h3>
              <p className="text-white/80 mb-8">Ready to start your transformation? Send me a message and let's discuss how we can work together.</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5" />
                <span>hello@shannonchapoy.com</span>
              </div>
              <div className="flex space-x-4 mt-8">
                <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Linkedin className="w-5 h-5" /></a>
              </div>
            </div>
          </div>
          
          <div className="p-10 md:w-3/5">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-brand-charcoal mb-1">Your Name</label>
                <input type="text" id="name" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-ltPurple focus:ring-2 focus:ring-brand-ltPurple/20 outline-none transition-all" placeholder="Jane Doe" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-brand-charcoal mb-1">Email Address</label>
                <input type="email" id="email" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-ltPurple focus:ring-2 focus:ring-brand-ltPurple/20 outline-none transition-all" placeholder="jane@example.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-brand-charcoal mb-1">How can I help?</label>
                <textarea id="message" rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-ltPurple focus:ring-2 focus:ring-brand-ltPurple/20 outline-none transition-all" placeholder="Tell me a bit about your journey..."></textarea>
              </div>
              <button type="submit" className="w-full bg-brand-ltPurple text-white font-semibold py-3 rounded-lg hover:bg-brand-dkPurple transition-colors shadow-md transform hover:-translate-y-1">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

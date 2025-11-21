
import React from 'react';
import { Mail, Instagram, Facebook, Linkedin } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-brand-soft">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          <div className="bg-brand-dkPurple p-10 md:w-2/5 text-white flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-3xl font-bold mb-6">Let's Talk</h3>
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

          <div className="md:w-4/5">
            <iframe
              src="https://actions.shannonchapoy.com/widget/form/WQ1oAQmkwYDHYsFWlOV9"
              style={{width: '100%', height: '100%', border: 'none', borderRadius: '4px'}}
              id="inline-WQ1oAQmkwYDHYsFWlOV9"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Website Contact Form"
              data-height="542"
              data-layout-iframe-id="inline-WQ1oAQmkwYDHYsFWlOV9"
              data-form-id="WQ1oAQmkwYDHYsFWlOV9"
              title="Website Contact Form"
            >
            </iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

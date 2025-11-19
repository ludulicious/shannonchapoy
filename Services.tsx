
import React from 'react';
import { Heart, Users, Sun, ArrowRight } from 'lucide-react';

const Services = () => {
  const services = [
    {
      title: "1:1 Life Coaching",
      description: "Personalized guidance tailored to your unique goals and challenges. We'll work together to unlock your potential.",
      icon: <Heart className="w-8 h-8 text-white" />,
      color: "bg-brand-ltPurple",
      textColor: "text-brand-ltPurple"
    },
    {
      title: "Group Workshops",
      description: "Join a community of like-minded women. Share experiences, grow together, and build lasting connections.",
      icon: <Users className="w-8 h-8 text-white" />,
      color: "bg-brand-seaBlue",
      textColor: "text-brand-seaBlue"
    },
    {
      title: "Wellness Retreats",
      description: "Immersive experiences in nature to reset your mind, body, and soul. Reconnect with your inner self.",
      icon: <Sun className="w-8 h-8 text-white" />,
      color: "bg-brand-skyBlue",
      textColor: "text-brand-skyBlue"
    },
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-4xl font-bold text-brand-dkPurple mb-4">How I Can Help You</h2>
        <p className="text-brand-charcoal max-w-2xl mx-auto mb-16">Choose the path that best fits your journey. Whether you prefer individual attention or group energy, I have a program for you.</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
              <div className={`h-3 ${service.color}`}></div>
              <div className="p-8">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 shadow-md ${service.color} group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <h3 className="font-serif text-2xl font-bold text-brand-charcoal mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <a href="#contact" className={`inline-flex items-center ${service.textColor} font-semibold hover:brightness-75 transition-colors`}>
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

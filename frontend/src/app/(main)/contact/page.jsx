'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Contact = () => {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: "  query5566@gmail.com",
      link: "mailto:query5566@gmail.com"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      details: "Lucknow, Uttar Pradesh, India",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      details: "+1 (555) 123-4567",
      link: "tel:+15551234567"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      details: "Mon - Fri, 9AM - 5PM PST"
    }
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Vector Lines */}
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path className="animate-draw-1" d="M0,30 Q25,5 50,30 T100,30" stroke="url(#gradient)" strokeWidth="0.1" fill="none"/>
            <path className="animate-draw-2" d="M0,50 Q25,25 50,50 T100,50" stroke="url(#gradient)" strokeWidth="0.1" fill="none"/>
            <path className="animate-draw-3" d="M0,70 Q25,45 50,70 T100,70" stroke="url(#gradient)" strokeWidth="0.1" fill="none"/>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7C3AED"/>
                <stop offset="100%" stopColor="#DB2777"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
        
        {/* Gradient Circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-float-delay"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <Toaster position="top-right" />
        
        <main className="container mx-auto px-4 pt-24 pb-16">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                Let's Connect
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Have questions about Query Quill? We're here to help! Reach out to our team for support.
            </p>
          </div>

          {/* Contact Information Grid */}
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactInfo.map((item, index) => (
                <div key={index} className="group p-6 rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-violet-500/50 transition-all duration-300">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 mb-4 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:text-violet-300 transition-colors">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    {item.link ? (
                      <a href={item.link} className="text-gray-400 hover:text-violet-400 transition-colors">
                        {item.details}
                      </a>
                    ) : (
                      <p className="text-gray-400">{item.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Contact CTA */}
            <div className="text-center p-8 rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Need Immediate Assistance?</h3>
              <p className="text-gray-400 mb-6">
                Our support team is ready to help you with any questions or concerns.
              </p>
              <a
                href="mailto:query5566@gmail.com"
                className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Support
              </a>
            </div>
          </div>

          {/* FAQ Section - Keep as is */}
          <div className="max-w-3xl mx-auto mt-24">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
            <div className="grid gap-6">
              {/*
                {
                  q: "How quickly can I expect a response?",
                  a: "We typically respond to all inquiries within 24 business hours."
                },
                {
                  q: "Do you offer technical support?",
                  a: "Yes, our team provides technical support for all Query Quill features and implementations."
                },
                {
                  q: "Can I request custom features?",
                  a: "Absolutely! We welcome feature requests and actively incorporate user feedback into our development roadmap."
                }
              */}
              { [
                {
                  q: "How quickly can I expect a response?",
                  a: "We typically respond to all inquiries within 24 business hours."
                },
                {
                  q: "Do you offer technical support?",
                  a: "Yes, our team provides technical support for all Query Quill features and implementations."
                },
                {
                  q: "Can I request custom features?",
                  a: "Absolutely! We welcome feature requests and actively incorporate user feedback into our development roadmap."
                }
              ].map((faq, index) => (
                <div key={index} className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                  <p className="text-gray-400">{faq.a}</p>
                </div>
              )) }
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Contact;
import React from 'react';
import { ArrowRight } from 'lucide-react';

const platforms = [
  { name: 'Discord', color: 'bg-indigo-500', initial: 'D' },
  { name: 'Slack', color: 'bg-purple-500', initial: 'S' },
  { name: 'Reddit', color: 'bg-orange-500', initial: 'R' },
  { name: 'Facebook', color: 'bg-blue-500', initial: 'F' },
  { name: 'LinkedIn', color: 'bg-blue-700', initial: 'L' },
  { name: 'Twitter', color: 'bg-sky-500', initial: 'T' },
  { name: 'Instagram', color: 'bg-pink-500', initial: 'I' },
  { name: 'YouTube', color: 'bg-red-500', initial: 'Y' }
];

export default function Community() {
  return (
    <section id="community" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Join Our Growing Community
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Connect with students across all platforms. Our community spans multiple 
            channels where you can find help, share experiences, and build lasting connections.
          </p>
        </div>

        {/* Platform Icons */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-12">
          {platforms.map((platform, index) => (
            <div 
              key={index}
              className={`w-16 h-16 ${platform.color} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg hover:scale-110 transition-transform cursor-pointer`}
              title={platform.name}
            >
              {platform.initial}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">50,000+</div>
            <p className="text-gray-600">Active Members</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">24/7</div>
            <p className="text-gray-600">Community Support</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">95%</div>
            <p className="text-gray-600">Questions Answered</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready to Connect?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students who are already sharing experiences, 
            asking questions, and helping each other succeed.
          </p>
          <button className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-emerald-700 transition-all transform hover:scale-105 inline-flex items-center gap-2">
            Join Community
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
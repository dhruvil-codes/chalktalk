import React from 'react';
import { Star, BarChart3, MessageCircle, Shield, TrendingUp, Users } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    icon: Star,
    title: 'Real Student Reviews',
    description: 'Read authentic, verified reviews from current students and recent graduates about academics, campus life, and career outcomes.',
    color: 'from-yellow-500 to-orange-500',
    stats: '25,000+ reviews'
  },
  {
    icon: BarChart3,
    title: 'Compare Universities',
    description: 'Side-by-side comparisons of programs, costs, rankings, and student satisfaction across multiple universities.',
    color: 'from-blue-500 to-purple-500',
    stats: '1,200+ universities'
  },
  {
    icon: MessageCircle,
    title: 'Ask Questions',
    description: 'Connect directly with current students and alumni. Get personalized answers to your specific questions.',
    color: 'from-green-500 to-teal-500',
    stats: '24/7 community support'
  }
];

export default function Features() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="features" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div 
          ref={ref}
          className={`text-center mb-16 ${inView ? 'animate-fade-in' : 'opacity-0'}`}
        >
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
            Everything You Need to Choose Right
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Make informed decisions with comprehensive data, real student experiences, 
            and direct connections to university communities.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              feature={feature} 
              index={index}
              inView={inView}
            />
          ))}
        </div>

        {/* Trust Indicators */}
        <div className={`mt-16 ${inView ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
          <div className="bg-gray-50 rounded-2xl p-8 lg:p-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex items-center justify-center space-x-3">
                <Shield className="h-8 w-8 text-primary-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">Verified</p>
                  <p className="text-gray-600">Student Profiles</p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <TrendingUp className="h-8 w-8 text-secondary-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">95%</p>
                  <p className="text-gray-600">Success Rate</p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">24/7</p>
                  <p className="text-gray-600">Community Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  feature: typeof features[0];
  index: number;
  inView: boolean;
}

function FeatureCard({ feature, index, inView }: FeatureCardProps) {
  return (
    <div 
      className={`group relative p-8 rounded-2xl border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-50 ${
        inView ? 'animate-slide-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${0.2 + index * 0.1}s` }}
    >
      {/* Icon */}
      <div className="mb-6">
        <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
          <feature.icon className="h-8 w-8 text-white" />
        </div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-heading font-semibold text-gray-900 mb-3">
        {feature.title}
      </h3>
      <p className="text-gray-600 leading-relaxed mb-4">
        {feature.description}
      </p>

      {/* Stats */}
      <div className="text-sm font-medium text-primary-500">
        {feature.stats}
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}
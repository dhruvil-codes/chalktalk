import React from 'react';
import { Link } from 'react-router-dom';
import { Star, BarChart3, MessageCircle, Users, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    icon: Star,
    title: 'Real Reviews',
    description: 'Authentic student experiences and honest feedback from verified university attendees.',
    color: 'from-yellow-500 to-orange-500',
    link: '/universities'
  },
  {
    icon: BarChart3,
    title: 'Compare Universities',
    description: 'Side-by-side comparisons of programs, rankings, costs, and student satisfaction.',
    color: 'from-blue-500 to-purple-500',
    link: '/compare'
  },
  {
    icon: MessageCircle,
    title: 'Ask Questions',
    description: 'Get personalized answers from current students and alumni about university life.',
    color: 'from-green-500 to-teal-500',
    link: '/review'
  },
  {
    icon: Users,
    title: 'Community Advice',
    description: 'Connect with a supportive community of students, alumni, and education experts.',
    color: 'from-purple-500 to-pink-500',
    link: '/universities'
  }
];

export default function WhatsInside() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
            What's Inside ChalkTalk
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover powerful tools and features designed to help you make the best educational decisions
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="hidden lg:grid lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="group relative"
            >
              <Link
                to={feature.link}
                className="block p-8 rounded-2xl border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 bg-white cursor-pointer h-full"
              >
                {/* Background Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative">
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

                  {/* Arrow */}
                  <div className="flex items-center text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium mr-2">Explore</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Horizontal Scroll */}
        <div className="lg:hidden">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex-none w-80 snap-center"
              >
                <Link
                  to={feature.link}
                  className="block p-6 rounded-2xl border border-gray-200 bg-white shadow-lg h-full hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Icon */}
                  <div className="mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-md`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm mb-3">
                    {feature.description}
                  </p>

                  {/* Mobile Explore Link */}
                  <div className="flex items-center text-primary-500">
                    <span className="text-sm font-medium mr-2">Explore</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex justify-center mt-4"
          >
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ChevronLeft className="h-4 w-4" />
              <span>Swipe to explore</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
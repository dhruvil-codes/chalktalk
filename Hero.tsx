import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, Star, Users, MessageSquare } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface HeroProps {
  onSignupClick: () => void;
}

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
}

function AnimatedCounter({ end, duration = 2, suffix = '' }: CounterProps) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      let startTime: number;
      const startCount = 0;
      
      const updateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(easeOutQuart * (end - startCount) + startCount);
        
        setCount(currentCount);
        
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };
      
      requestAnimationFrame(updateCount);
    }
  }, [inView, end, duration]);

  return (
    <span ref={ref} className="text-2xl lg:text-3xl font-bold text-gray-900">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Hero({ onSignupClick }: HeroProps) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-50 via-white to-primary-50 overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-20"
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-100 rounded-full opacity-20"
      />

      <motion.div 
        style={{ opacity }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 w-full"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div 
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Trust Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 mb-6"
            >
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-700">Trusted by 50,000+ students</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-gray-900 mb-6 leading-tight"
            >
              Find Your Perfect
              <span className="text-gradient block">University Match</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Read authentic reviews from real students and make informed decisions about your university choice. Connect with current students and get insider insights.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start"
            >
              <motion.button 
                onClick={onSignupClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-primary-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-600 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:border-primary-500 hover:text-primary-500 transition-all flex items-center justify-center gap-2"
              >
                <Play className="h-5 w-5" />
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Animated Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-3 gap-8 text-center lg:text-left"
            >
              <div className="group">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <Users className="h-6 w-6 text-primary-500 mr-2" />
                  <AnimatedCounter end={50} suffix="K+" />
                </div>
                <p className="text-gray-600 font-medium">Active Students</p>
              </div>
              <div className="group">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <MessageSquare className="h-6 w-6 text-secondary-500 mr-2" />
                  <AnimatedCounter end={25} suffix="K+" />
                </div>
                <p className="text-gray-600 font-medium">Reviews</p>
              </div>
              <div className="group">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <Star className="h-6 w-6 text-yellow-500 mr-2" />
                  <AnimatedCounter end={1200} suffix="+" />
                </div>
                <p className="text-gray-600 font-medium">Universities</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Image */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl p-8 shadow-2xl"
              >
                <img 
                  src="https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Students collaborating and discussing university choices" 
                  className="w-full h-80 lg:h-96 object-cover rounded-xl shadow-lg"
                  loading="lazy"
                />
              </motion.div>
              
              {/* Floating Cards */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -top-4 -left-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100"
              >
                <div className="flex items-center space-x-3">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-3 h-3 bg-green-500 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Live Reviews</p>
                    <p className="text-xs text-gray-500">Updated 2 min ago</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100"
              >
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">4.9/5</p>
                    <p className="text-xs text-gray-500">Average Rating</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="absolute top-1/2 -left-6 bg-white p-3 rounded-xl shadow-lg border border-gray-100"
              >
                <div className="text-center">
                  <p className="text-lg font-bold text-primary-500">98%</p>
                  <p className="text-xs text-gray-500">Satisfaction</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
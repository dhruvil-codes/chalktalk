import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  MessageCircle, 
  Target, 
  Eye, 
  Zap, 
  BarChart3, 
  Users, 
  Shield,
  ArrowRight,
  Sparkles,
  Brain,
  Globe,
  Award
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Smart summaries and personalized recommendations help you understand what matters most for your educational journey.',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    icon: BarChart3,
    title: 'Advanced Comparison Tools',
    description: 'Side-by-side university comparisons with detailed metrics, rankings, and student satisfaction data.',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    icon: Users,
    title: 'Role-Based Experiences',
    description: 'Tailored content for aspirants, current students, and alumni - each with unique perspectives and needs.',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: Shield,
    title: 'Verified Reviews',
    description: 'Authentic, verified student reviews ensure you get honest insights from real university experiences.',
    color: 'from-orange-500 to-red-600'
  }
];

export default function AboutUsPage() {
  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: featuresRef, inView: featuresInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: teamRef, inView: teamInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link to="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">About Us</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 lg:py-24 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 pattern-bg opacity-30"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`${heroInView ? 'animate-fade-in' : 'opacity-0'}`}>
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl mb-8 shadow-lg">
              <MessageCircle className="h-10 w-10 text-white" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-6 leading-tight">
              Empowering Students Through
              <span className="text-gradient block">Transparent Education Data</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              ChalkTalk connects students with authentic university experiences, helping you make 
              informed decisions about your educational future through real reviews and data-driven insights.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        {/* Introduction */}
        <section className="mb-16 lg:mb-20">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 lg:p-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-8">
                What We Do
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                ChalkTalk is the go-to platform for students seeking authentic insights about universities worldwide. 
                We solve the problem of information asymmetry in higher education by connecting prospective students 
                with real experiences from current students and alumni. Our platform provides verified reviews, 
                detailed comparisons, and personalized recommendations to help you find the perfect educational fit. 
                Whether you're exploring undergraduate programs, graduate schools, or considering a transfer, 
                ChalkTalk gives you the transparent, unbiased information you need to make confident decisions 
                about your academic future.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-16 lg:mb-20">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 lg:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-heading font-bold text-gray-900">
                  Our Mission
                </h3>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                To empower students worldwide with transparent, unbiased information about universities, 
                enabling them to make informed educational decisions that shape their futures. We believe 
                every student deserves access to authentic insights from real university experiences.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 lg:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-heading font-bold text-gray-900">
                  Our Vision
                </h3>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                To become the world's most trusted platform for educational decision-making, where every 
                student can confidently choose their ideal university based on comprehensive, verified data. 
                We envision a future where educational choices are made with complete transparency and confidence.
              </p>
            </div>
          </div>
        </section>

        {/* Unique Features */}
        <section 
          ref={featuresRef}
          className="mb-16 lg:mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
              What Makes Us Different
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the unique features that set ChalkTalk apart from other educational platforms
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-500 hover:scale-105 ${
                  featuresInView ? 'animate-slide-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-heading font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section 
          ref={teamRef}
          className="mb-16 lg:mb-20"
        >
          <div className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 lg:p-12 text-white ${
            teamInView ? 'animate-fade-in' : 'opacity-0'
          }`}>
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-heading font-bold">
                  Born from Innovation
                </h2>
              </div>
              
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                ChalkTalk was born during the Bolt Hackathon, where our passionate team recognized 
                the critical need for transparent, student-centered educational information. What started 
                as a weekend project has evolved into a comprehensive platform serving thousands of 
                students worldwide. We're proud of our humble beginnings and remain committed to our 
                core mission of educational transparency.
              </p>

              <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <span>Global Reach</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span>Hackathon Origins</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  <span>Innovation Driven</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-2xl p-8 lg:p-12 text-white">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
              Ready to Find Your Perfect University?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students who have already discovered their ideal educational path 
              through ChalkTalk's comprehensive platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/universities"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                Explore Universities
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all transform hover:scale-105"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
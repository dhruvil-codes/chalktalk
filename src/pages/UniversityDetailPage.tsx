import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  Star, 
  MapPin, 
  Users, 
  GraduationCap, 
  BookOpen,
  ThumbsUp,
  MessageCircle,
  Search,
  Plus,
  ChevronDown,
  Loader2,
  Shield,
  Calendar,
  Edit,
  HelpCircle
} from 'lucide-react';
import { getUniversityById, University } from '../data/universities';

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  verified: boolean;
  content: string;
  helpful: number;
  program: string;
  year: string;
}

interface Question {
  id: string;
  question: string;
  answer: string;
  askedBy: string;
  answeredBy: string;
  date: string;
  helpful: number;
}

// Mock data for reviews and questions - in a real app, this would come from an API
const getReviewsForUniversity = (universityId: string): Review[] => {
  const baseReviews = [
    {
      id: '1',
      userName: 'Sarah Johnson',
      userAvatar: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      rating: 5,
      date: '2024-01-15',
      verified: true,
      content: 'Excellent university with world-class faculty and amazing research opportunities. The campus is beautiful and the student community is very supportive.',
      helpful: 24,
      program: 'Computer Science',
      year: 'Class of 2023'
    },
    {
      id: '2',
      userName: 'Michael Chen',
      userAvatar: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      rating: 4,
      date: '2024-01-10',
      verified: true,
      content: 'Great university with amazing resources and faculty. The workload is heavy, but the support system is strong. Highly recommend for serious students.',
      helpful: 18,
      program: 'Economics',
      year: 'Class of 2024'
    }
  ];

  // Customize content based on university
  return baseReviews.map(review => ({
    ...review,
    content: universityId === 'harvard' 
      ? review.content.replace('Excellent university', 'Harvard exceeded all my expectations')
      : universityId === 'mit'
      ? review.content.replace('Excellent university', 'MIT is absolutely incredible for STEM')
      : universityId === 'stanford'
      ? review.content.replace('Excellent university', 'Stanford\'s innovation culture is unmatched')
      : universityId === 'oxford'
      ? review.content.replace('Excellent university', 'Oxford\'s tutorial system is phenomenal')
      : universityId === 'cambridge'
      ? review.content.replace('Excellent university', 'Cambridge\'s academic rigor is outstanding')
      : universityId === 'toronto'
      ? review.content.replace('Excellent university', 'University of Toronto offers incredible diversity')
      : review.content
  }));
};

const getQuestionsForUniversity = (universityId: string): Question[] => {
  const baseQuestions = [
    {
      id: '1',
      question: 'What is the average class size?',
      answer: 'The average class size varies by program, but most undergraduate courses have 15-25 students. Seminars can be smaller (8-12 students), while some popular lectures may have 100+ students.',
      askedBy: 'Anonymous',
      answeredBy: 'Current Student',
      date: '2024-01-20',
      helpful: 15
    },
    {
      id: '2',
      question: 'How competitive is the academic environment?',
      answer: 'The academic environment is highly competitive but collaborative. Students push each other to excel while maintaining a supportive community atmosphere.',
      askedBy: 'Future Student',
      answeredBy: 'Alumni',
      date: '2024-01-18',
      helpful: 22
    }
  ];

  // Customize questions based on university
  return baseQuestions.map(q => ({
    ...q,
    question: universityId === 'mit' && q.id === '2' 
      ? 'How competitive is the pre-engineering program?'
      : universityId === 'oxford' && q.id === '1'
      ? 'How does the tutorial system work?'
      : universityId === 'cambridge' && q.id === '1'
      ? 'What is the college system like?'
      : q.question
  }));
};

type TabType = 'overview' | 'reviews' | 'qa';

export default function UniversityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [university, setUniversity] = useState<University | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUniversity = getUniversityById(id);
      if (foundUniversity) {
        setUniversity(foundUniversity);
        setReviews(getReviewsForUniversity(id));
        setQuestions(getQuestionsForUniversity(id));
      }
      
      setLoading(false);
    };
    loadData();
  }, [id]);

  const handleWriteReview = () => {
    if (!id) {
      console.error('University ID is missing');
      return;
    }
    
    try {
      console.log('Navigating to write review for university:', id);
      navigate(`/write-review/${id}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleAskQuestion = () => {
    if (!id) {
      console.error('University ID is missing');
      return;
    }
    
    try {
      console.log('Navigating to ask question for university:', id);
      navigate(`/ask-question/${id}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />);
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-gray-300 fill-current" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300 fill-current" />);
    }

    return stars;
  };

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading university details...</p>
        </div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">University Not Found</h1>
          <p className="text-gray-600 mb-4">The university you're looking for doesn't exist.</p>
          <Link 
            to="/universities" 
            className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Back to Universities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div 
        className="relative h-60 bg-gradient-to-r from-primary-600 to-secondary-600"
        style={{
          backgroundImage: `linear-gradient(rgba(79, 70, 229, 0.8), rgba(16, 185, 129, 0.8)), url(${university.heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
          <div className="flex items-end gap-6">
            <img
              src={university.logo}
              alt={`${university.name} logo`}
              className="w-30 h-30 rounded-xl border-4 border-white shadow-lg"
            />
            <div className="text-white">
              <div className="flex items-center gap-2 text-sm mb-2">
                <Link to="/" className="hover:underline">Home</Link>
                <ChevronRight className="h-4 w-4" />
                <Link to="/universities" className="hover:underline">Universities</Link>
                <ChevronRight className="h-4 w-4" />
                <span>{university.name}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">{university.name}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{university.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(university.rating)}
                  <span className="ml-1">{university.rating} ({university.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Tab Navigation */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'reviews', label: 'Reviews' },
              { id: 'qa', label: 'Q&A' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                <Users className="h-8 w-8 text-primary-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{university.studentCount.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                <Calendar className="h-8 w-8 text-secondary-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{university.foundedYear}</div>
                <div className="text-sm text-gray-600">Founded</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                <GraduationCap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{university.acceptanceRate}%</div>
                <div className="text-sm text-gray-600">Acceptance Rate</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                <BookOpen className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{university.tuitionFee}</div>
                <div className="text-sm text-gray-600">Annual Tuition</div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {university.name}</h2>
              <p className="text-gray-600 leading-relaxed">{university.description}</p>
            </div>

            {/* Rating Breakdown */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Rating Breakdown</h2>
              <div className="space-y-4">
                {Object.entries(university.stats).map(([category, rating]) => (
                  <div key={category} className="flex items-center gap-4">
                    <div className="w-20 text-sm font-medium text-gray-700 capitalize">
                      {category}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(rating / 5) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-sm font-medium text-gray-900">
                      {rating}/5
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleWriteReview}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md font-medium transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-10"
              >
                <Edit className="h-5 w-5" />
                Write a Review
              </button>
              <button 
                onClick={handleAskQuestion}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-800 rounded-md font-medium transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 z-10"
              >
                <HelpCircle className="h-5 w-5" />
                Ask a Question
              </button>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Review Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Student Reviews</h2>
                <p className="text-gray-600">{university.reviewCount} reviews</p>
              </div>
              <div className="flex gap-4">
                <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Most Recent</option>
                  <option>Highest Rated</option>
                  <option>Lowest Rated</option>
                </select>
                <button 
                  onClick={handleWriteReview}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Edit className="h-4 w-4" />
                  Write Review
                </button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-start gap-4">
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{review.userName}</h3>
                        {review.verified && (
                          <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                            <Shield className="h-3 w-3" />
                            Verified
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <span>{review.program}</span>
                        <span>{review.year}</span>
                        <span>{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">{review.content}</p>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                          <ThumbsUp className="h-4 w-4" />
                          Helpful ({review.helpful})
                        </button>
                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                          <MessageCircle className="h-4 w-4" />
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'qa' && (
          <div className="space-y-6">
            {/* Q&A Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Questions & Answers</h2>
                <p className="text-gray-600">Get answers from current students and alumni</p>
              </div>
              <button 
                onClick={handleAskQuestion}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="h-4 w-4" />
                Ask Question
              </button>
            </div>

            {/* Search Questions */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Search questions..."
              />
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleQuestion(question.id)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 pr-4">{question.question}</h3>
                      <ChevronDown 
                        className={`h-5 w-5 text-gray-400 transition-transform ${
                          expandedQuestions.has(question.id) ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>Asked by {question.askedBy}</span>
                      <span>{new Date(question.date).toLocaleDateString()}</span>
                    </div>
                  </button>
                  
                  {expandedQuestions.has(question.id) && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                      <div className="pt-4">
                        <p className="text-gray-700 leading-relaxed mb-4">{question.answer}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            Answered by {question.answeredBy}
                          </div>
                          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                            <ThumbsUp className="h-4 w-4" />
                            Helpful ({question.helpful})
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
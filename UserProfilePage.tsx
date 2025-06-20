import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Edit, 
  Star, 
  MessageSquare, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Eye, 
  ThumbsUp, 
  LogOut,
  AlertTriangle,
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Settings,
  Shield,
  X,
  Loader2
} from 'lucide-react';
import { UserProfile } from '../types/profile';
import EditProfileModal from '../components/profile/EditProfileModal';
import Toast from '../components/ui/Toast';

interface UserProfilePageProps {
  userProfile?: UserProfile | null;
  onProfileUpdate?: (updatedProfile: Partial<UserProfile>) => void;
}

interface Review {
  id: string;
  universityName: string;
  universityId: string;
  content: string;
  rating: number;
  datePosted: string;
  status: 'active' | 'edited' | 'deleted';
  helpfulVotes: number;
  lastEdited?: string;
  category: string;
}

interface Question {
  id: string;
  universityName: string;
  universityId: string;
  questionText: string;
  datePosted: string;
  status: 'answered' | 'unanswered' | 'closed';
  responseCount: number;
  views: number;
  category: string;
  lastActivity?: string;
}

interface ToastState {
  isVisible: boolean;
  message: string;
  type: 'success' | 'error';
}

// Mock data for user reviews and questions
const mockReviews: Review[] = [
  {
    id: '1',
    universityName: 'Harvard University',
    universityId: 'harvard',
    content: 'Excellent university with world-class faculty and amazing research opportunities. The campus is beautiful and the student community is very supportive. The academic rigor is challenging but rewarding.',
    rating: 5,
    datePosted: '2024-01-15T10:30:00Z',
    status: 'active',
    helpfulVotes: 24,
    category: 'Academic Experience'
  },
  {
    id: '2',
    universityName: 'Stanford University',
    universityId: 'stanford',
    content: 'Great innovation culture and entrepreneurship opportunities. The Silicon Valley location provides amazing networking and internship opportunities.',
    rating: 4,
    datePosted: '2024-01-10T14:20:00Z',
    status: 'edited',
    helpfulVotes: 18,
    lastEdited: '2024-01-12T09:15:00Z',
    category: 'Career Opportunities'
  },
  {
    id: '3',
    universityName: 'MIT',
    universityId: 'mit',
    content: 'Incredibly challenging but rewarding experience. The research opportunities are unmatched.',
    rating: 5,
    datePosted: '2023-12-20T16:45:00Z',
    status: 'active',
    helpfulVotes: 31,
    category: 'Academic Experience'
  }
];

const mockQuestions: Question[] = [
  {
    id: '1',
    universityName: 'Harvard University',
    universityId: 'harvard',
    questionText: 'What is the average class size for undergraduate courses?',
    datePosted: '2024-01-20T09:15:00Z',
    status: 'answered',
    responseCount: 3,
    views: 127,
    category: 'Academics',
    lastActivity: '2024-01-21T14:30:00Z'
  },
  {
    id: '2',
    universityName: 'Stanford University',
    universityId: 'stanford',
    questionText: 'How competitive is the computer science program admission?',
    datePosted: '2024-01-18T11:20:00Z',
    status: 'answered',
    responseCount: 5,
    views: 89,
    category: 'Admissions',
    lastActivity: '2024-01-19T16:45:00Z'
  },
  {
    id: '3',
    universityName: 'MIT',
    universityId: 'mit',
    questionText: 'Are there good research opportunities for undergraduates?',
    datePosted: '2024-01-16T13:10:00Z',
    status: 'unanswered',
    responseCount: 0,
    views: 45,
    category: 'Research'
  }
];

type TabType = 'overview' | 'reviews' | 'questions' | 'settings';
type SortOption = 'date' | 'rating' | 'helpful' | 'status';

export default function UserProfilePage({ userProfile, onProfileUpdate }: UserProfilePageProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(mockReviews);
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');
  const [reviewSortBy, setReviewSortBy] = useState<SortOption>('date');
  const [reviewFilterStatus, setReviewFilterStatus] = useState<string>('all');
  const [reviewCurrentPage, setReviewCurrentPage] = useState(1);

  // Questions state
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(mockQuestions);
  const [questionSearchQuery, setQuestionSearchQuery] = useState('');
  const [questionSortBy, setQuestionSortBy] = useState<SortOption>('date');
  const [questionFilterStatus, setQuestionFilterStatus] = useState<string>('all');
  const [questionCurrentPage, setQuestionCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // Filter and sort reviews
  useEffect(() => {
    let filtered = reviews.filter(review => {
      const matchesSearch = 
        review.content.toLowerCase().includes(reviewSearchQuery.toLowerCase()) ||
        review.universityName.toLowerCase().includes(reviewSearchQuery.toLowerCase());
      const matchesStatus = reviewFilterStatus === 'all' || review.status === reviewFilterStatus;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      switch (reviewSortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'helpful':
          return b.helpfulVotes - a.helpfulVotes;
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
        default:
          return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
      }
    });

    setFilteredReviews(filtered);
    setReviewCurrentPage(1);
  }, [reviews, reviewSearchQuery, reviewSortBy, reviewFilterStatus]);

  // Filter and sort questions
  useEffect(() => {
    let filtered = questions.filter(question => {
      const matchesSearch = 
        question.questionText.toLowerCase().includes(questionSearchQuery.toLowerCase()) ||
        question.universityName.toLowerCase().includes(questionSearchQuery.toLowerCase());
      const matchesStatus = questionFilterStatus === 'all' || question.status === questionFilterStatus;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      switch (questionSortBy) {
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
        default:
          return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
      }
    });

    setFilteredQuestions(filtered);
    setQuestionCurrentPage(1);
  }, [questions, questionSearchQuery, questionSortBy, questionFilterStatus]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    
    try {
      // Simulate sign out process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear user session data
      localStorage.removeItem('chalktalk_user_session');
      localStorage.removeItem('chalktalk_user_role');
      localStorage.removeItem('chalktalk_user_email');
      sessionStorage.clear();
      
      setToast({
        isVisible: true,
        message: 'Successfully signed out. Redirecting...',
        type: 'success'
      });

      // Redirect after showing success message
      setTimeout(() => {
        navigate('/');
        window.location.reload(); // Force full page reload to clear all state
      }, 1500);
      
    } catch (error) {
      setToast({
        isVisible: true,
        message: 'Failed to sign out. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSigningOut(false);
      setShowSignOutConfirm(false);
    }
  };

  const handleExportData = () => {
    const exportData = {
      profile: userProfile,
      reviews: reviews,
      questions: questions,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `chalktalk-profile-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToast({
      isVisible: true,
      message: 'Profile data exported successfully!',
      type: 'success'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusBadge = (status: string, type: 'review' | 'question') => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    if (type === 'review') {
      switch (status) {
        case 'active':
          return `${baseClasses} bg-green-100 text-green-800`;
        case 'edited':
          return `${baseClasses} bg-blue-100 text-blue-800`;
        case 'deleted':
          return `${baseClasses} bg-red-100 text-red-800`;
        default:
          return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    } else {
      switch (status) {
        case 'answered':
          return `${baseClasses} bg-green-100 text-green-800`;
        case 'unanswered':
          return `${baseClasses} bg-yellow-100 text-yellow-800`;
        case 'closed':
          return `${baseClasses} bg-gray-100 text-gray-800`;
        default:
          return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    }
  };

  const getCurrentPageItems = (items: any[], currentPage: number) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const getTotalPages = (itemsLength: number) => {
    return Math.ceil(itemsLength / itemsPerPage);
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Profile Found</h2>
          <p className="text-gray-600">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Profile Info */}
            <div className="flex items-center gap-6">
              <div className="relative">
                {userProfile.avatar ? (
                  <img
                    src={userProfile.avatar}
                    alt={`${userProfile.firstName} ${userProfile.lastName}`}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {userProfile.firstName.charAt(0)}{userProfile.lastName.charAt(0)}
                  </div>
                )}
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {userProfile.firstName} {userProfile.lastName}
                </h1>
                <p className="text-lg text-gray-600 capitalize mb-2">
                  {userProfile.role.replace('-', ' ')}
                </p>
                {userProfile.university && (
                  <p className="text-gray-600">
                    {userProfile.course} • {userProfile.university}
                  </p>
                )}
                {userProfile.bio && (
                  <p className="text-gray-700 mt-2 max-w-2xl">{userProfile.bio}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </button>
              
              <button
                onClick={() => setShowSignOutConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', count: null },
              { id: 'reviews', label: 'Reviews', count: reviews.length },
              { id: 'questions', label: 'Questions', count: questions.length },
              { id: 'settings', label: 'Settings', count: null }
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
                {tab.count !== null && (
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.id ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Stats Cards */}
            <div className="lg:col-span-3 grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                    <p className="text-3xl font-bold text-gray-900">{reviews.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Questions Asked</p>
                    <p className="text-3xl font-bold text-gray-900">{questions.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Helpful Votes</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {reviews.reduce((sum, review) => sum + review.helpfulVotes, 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ThumbsUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[...reviews.slice(0, 2), ...questions.slice(0, 2)]
                    .sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime())
                    .slice(0, 4)
                    .map((item, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          'rating' in item ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                          {'rating' in item ? (
                            <Star className={`h-5 w-5 ${'rating' in item ? 'text-blue-600' : 'text-green-600'}`} />
                          ) : (
                            <MessageSquare className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {'rating' in item ? 'Reviewed' : 'Asked about'} {item.universityName}
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {'content' in item ? item.content : item.questionText}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(item.datePosted)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profile Complete</span>
                  <span className={`text-sm font-medium ${
                    userProfile.isProfileComplete ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {userProfile.isProfileComplete ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: userProfile.isProfileComplete ? '100%' : '75%' }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  Member since {new Date(userProfile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Reviews Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">My Reviews</h2>
                <p className="text-gray-600">{filteredReviews.length} reviews</p>
              </div>
              
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={reviewSearchQuery}
                    onChange={(e) => setReviewSearchQuery(e.target.value)}
                    placeholder="Search reviews..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <select
                  value={reviewFilterStatus}
                  onChange={(e) => setReviewFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="edited">Edited</option>
                  <option value="deleted">Deleted</option>
                </select>
                
                <select
                  value={reviewSortBy}
                  onChange={(e) => setReviewSortBy(e.target.value as SortOption)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="date">Sort by Date</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="helpful">Sort by Helpful Votes</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {getCurrentPageItems(filteredReviews, reviewCurrentPage).map((review) => (
                <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{review.universityName}</h3>
                        <span className={getStatusBadge(review.status, 'review')}>
                          {review.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                          <span className="ml-1">{review.rating}/5</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(review.datePosted)}</span>
                        </div>
                        {review.lastEdited && (
                          <span className="text-blue-600">
                            Edited {formatDate(review.lastEdited)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-4">{review.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{review.helpfulVotes} helpful</span>
                      </div>
                      <span className="text-primary-600">{review.category}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="text-sm text-primary-600 hover:text-primary-700 transition-colors">
                        Edit
                      </button>
                      <button className="text-sm text-red-600 hover:text-red-700 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reviews Pagination */}
            {getTotalPages(filteredReviews.length) > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((reviewCurrentPage - 1) * itemsPerPage) + 1} to {Math.min(reviewCurrentPage * itemsPerPage, filteredReviews.length)} of {filteredReviews.length} reviews
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setReviewCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={reviewCurrentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <span className="px-3 py-2 text-sm">
                    Page {reviewCurrentPage} of {getTotalPages(filteredReviews.length)}
                  </span>
                  <button
                    onClick={() => setReviewCurrentPage(prev => Math.min(getTotalPages(filteredReviews.length), prev + 1))}
                    disabled={reviewCurrentPage === getTotalPages(filteredReviews.length)}
                    className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredReviews.length === 0 && (
              <div className="text-center py-12">
                <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
                <p className="text-gray-600">You haven't written any reviews yet or no reviews match your filters.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="space-y-6">
            {/* Questions Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">My Questions</h2>
                <p className="text-gray-600">{filteredQuestions.length} questions</p>
              </div>
              
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={questionSearchQuery}
                    onChange={(e) => setQuestionSearchQuery(e.target.value)}
                    placeholder="Search questions..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <select
                  value={questionFilterStatus}
                  onChange={(e) => setQuestionFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="answered">Answered</option>
                  <option value="unanswered">Unanswered</option>
                  <option value="closed">Closed</option>
                </select>
                
                <select
                  value={questionSortBy}
                  onChange={(e) => setQuestionSortBy(e.target.value as SortOption)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="date">Sort by Date</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {getCurrentPageItems(filteredQuestions, questionCurrentPage).map((question) => (
                <div key={question.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{question.universityName}</h3>
                        <span className={getStatusBadge(question.status, 'question')}>
                          {question.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(question.datePosted)}</span>
                        </div>
                        {question.lastActivity && (
                          <span className="text-green-600">
                            Last activity {formatDate(question.lastActivity)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-4">{question.questionText}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{question.responseCount} responses</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{question.views} views</span>
                      </div>
                      <span className="text-primary-600">{question.category}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="text-sm text-primary-600 hover:text-primary-700 transition-colors">
                        View Answers
                      </button>
                      <button className="text-sm text-red-600 hover:text-red-700 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Questions Pagination */}
            {getTotalPages(filteredQuestions.length) > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((questionCurrentPage - 1) * itemsPerPage) + 1} to {Math.min(questionCurrentPage * itemsPerPage, filteredQuestions.length)} of {filteredQuestions.length} questions
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuestionCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={questionCurrentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <span className="px-3 py-2 text-sm">
                    Page {questionCurrentPage} of {getTotalPages(filteredQuestions.length)}
                  </span>
                  <button
                    onClick={() => setQuestionCurrentPage(prev => Math.min(getTotalPages(filteredQuestions.length), prev + 1))}
                    disabled={questionCurrentPage === getTotalPages(filteredQuestions.length)}
                    className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredQuestions.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
                <p className="text-gray-600">You haven't asked any questions yet or no questions match your filters.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
            
            {/* Data Export */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Export</h3>
              <p className="text-gray-600 mb-4">
                Download all your profile data, reviews, and questions in JSON format.
              </p>
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export My Data
              </button>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Profile Visibility</p>
                    <p className="text-sm text-gray-600">Allow others to find your profile</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600 transition-colors">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Show Reviews Publicly</p>
                    <p className="text-sm text-gray-600">Display your reviews on university pages</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600 transition-colors">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Show Questions Publicly</p>
                    <p className="text-sm text-gray-600">Display your questions on university pages</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600 transition-colors">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
              <div className="space-y-4">
                <button
                  onClick={() => setShowSignOutConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowSignOutConfirm(false)}></div>
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Confirm Sign Out</h3>
                  <p className="text-sm text-gray-600">Are you sure you want to sign out?</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                You will be redirected to the homepage and will need to sign in again to access your account.
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowSignOutConfirm(false)}
                  disabled={isSigningOut}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isSigningOut ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing Out...
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && userProfile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profile={userProfile}
          onSave={(updatedProfile) => {
            if (onProfileUpdate) {
              onProfileUpdate(updatedProfile);
            }
            setIsEditModalOpen(false);
          }}
        />
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}
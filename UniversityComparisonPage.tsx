import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Plus, 
  X, 
  Search, 
  Star, 
  MapPin, 
  Users, 
  GraduationCap, 
  DollarSign,
  Calendar,
  BookOpen,
  Award,
  TrendingUp,
  Building,
  Loader2,
  Lock,
  AlertCircle,
  BarChart3,
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { universities, University } from '../data/universities';

interface ComparisonSlot {
  id: number;
  university: University | null;
}

export default function UniversityComparisonPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [comparisonSlots, setComparisonSlots] = useState<ComparisonSlot[]>([
    { id: 1, university: null },
    { id: 2, university: null },
    { id: 3, university: null },
    { id: 4, university: null }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUniversityPicker, setShowUniversityPicker] = useState<number | null>(null);

  // Check authentication status
  useEffect(() => {
    const checkAuthentication = async () => {
      setIsCheckingAuth(true);
      
      // Simulate checking authentication status
      // In a real app, this would check for valid session/token
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check for authentication indicators
      const hasSession = localStorage.getItem('chalktalk_user_session');
      const hasUserRole = localStorage.getItem('chalktalk_user_role');
      
      // For demo purposes, we'll consider the user authenticated if they have any stored data
      // In production, this would verify a valid JWT token or session
      const authenticated = !!(hasSession || hasUserRole);
      
      setIsAuthenticated(authenticated);
      setIsCheckingAuth(false);
      
      // If not authenticated, redirect to login with return URL
      if (!authenticated) {
        // Store the current path to return after login
        sessionStorage.setItem('chalktalk_return_url', location.pathname + location.search);
        
        // Navigate to home page with a message about requiring authentication
        navigate('/', { 
          state: { 
            showLoginModal: true,
            message: 'To access this feature, please sign up for an account. Click the \'Join Our Growing Community\' button on the homepage or use the sign-up form below to create your account and unlock all features. New members get immediate access to our full platform after registration.'
          }
        });
      }
    };

    checkAuthentication();
  }, [navigate, location]);

  const filteredUniversities = universities.filter(uni =>
    uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    uni.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addUniversityToSlot = (slotId: number, university: University) => {
    setComparisonSlots(prev =>
      prev.map(slot =>
        slot.id === slotId ? { ...slot, university } : slot
      )
    );
    setShowUniversityPicker(null);
    setSearchQuery('');
  };

  const removeUniversityFromSlot = (slotId: number) => {
    setComparisonSlots(prev =>
      prev.map(slot =>
        slot.id === slotId ? { ...slot, university: null } : slot
      )
    );
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

  const getComparisonMetrics = () => [
    {
      label: 'Overall Rating',
      key: 'rating',
      icon: Star,
      format: (value: number) => (
        <div className="flex items-center gap-2">
          <div className="flex">{renderStars(value)}</div>
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      label: 'Global Ranking',
      key: 'ranking',
      icon: Award,
      format: (value: number) => `#${value}`
    },
    {
      label: 'Student Population',
      key: 'studentCount',
      icon: Users,
      format: (value: number) => value.toLocaleString()
    },
    {
      label: 'Founded',
      key: 'foundedYear',
      icon: Calendar,
      format: (value: number) => value.toString()
    },
    {
      label: 'Acceptance Rate',
      key: 'acceptanceRate',
      icon: TrendingUp,
      format: (value: number) => `${value}%`
    },
    {
      label: 'Annual Tuition',
      key: 'tuitionFee',
      icon: DollarSign,
      format: (value: string) => value
    },
    {
      label: 'Type',
      key: 'type',
      icon: Building,
      format: (value: string) => value
    },
    {
      label: 'Location',
      key: 'location',
      icon: MapPin,
      format: (value: string) => value
    }
  ];

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Access</h2>
          <p className="text-gray-600">Checking your authentication status...</p>
        </div>
      </div>
    );
  }

  // Show authentication required message (this shouldn't render due to redirect, but included for safety)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-lg mx-auto text-center p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserPlus className="h-10 w-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Growing Community</h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <p className="text-gray-700 leading-relaxed">
              To access this feature, please sign up for an account. Click the 'Join Our Growing Community' 
              button on the homepage or use the sign-up form below to create your account and unlock all features. 
              New members get immediate access to our full platform after registration.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              <UserPlus className="h-5 w-5" />
              Join Our Community
              <ArrowRight className="h-4 w-4" />
            </Link>
            
            <div className="text-sm text-gray-500">
              Already have an account? 
              <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium ml-1">
                Sign in here
              </Link>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-8 text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">What you'll get:</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-gray-700">University comparison tools</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-gray-700">Access to authentic student reviews</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-gray-700">Connect with current students and alumni</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-gray-700">Personalized university recommendations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <span className="text-gray-900">Compare Universities</span>
          </div>

          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Compare Universities
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Compare up to 4 universities side by side to make informed decisions about your education
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {comparisonSlots.map((slot) => (
            <div key={slot.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {slot.university ? (
                <div>
                  {/* University Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={slot.university.logo}
                        alt={`${slot.university.name} logo`}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                          {slot.university.name}
                        </h3>
                        <p className="text-xs text-gray-600">{slot.university.location}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeUniversityFromSlot(slot.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(slot.university.rating)}</div>
                      <span className="text-sm font-medium">{slot.university.rating}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Rank:</span> #{slot.university.ranking}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Students:</span> {slot.university.studentCount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Acceptance:</span> {slot.university.acceptanceRate}%
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Add University</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Select a university to compare
                  </p>
                  <button
                    onClick={() => setShowUniversityPicker(slot.id)}
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm"
                  >
                    Choose University
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Detailed Comparison Table */}
        {comparisonSlots.some(slot => slot.university) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Detailed Comparison</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Metric</th>
                    {comparisonSlots.map((slot) => (
                      <th key={slot.id} className="px-6 py-4 text-center text-sm font-medium text-gray-900 min-w-48">
                        {slot.university ? slot.university.name : `Slot ${slot.id}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getComparisonMetrics().map((metric, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <metric.icon className="h-4 w-4 text-gray-500" />
                          {metric.label}
                        </div>
                      </td>
                      {comparisonSlots.map((slot) => (
                        <td key={slot.id} className="px-6 py-4 text-sm text-gray-700 text-center">
                          {slot.university ? (
                            <div className="flex justify-center">
                              {metric.format(slot.university[metric.key as keyof University] as any)}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!comparisonSlots.some(slot => slot.university) && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Comparison</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Add universities to the slots above to begin comparing their features, rankings, and statistics side by side.
            </p>
          </div>
        )}
      </div>

      {/* University Picker Modal */}
      {showUniversityPicker && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowUniversityPicker(null)}
            ></div>

            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Choose University</h3>
                <button
                  onClick={() => setShowUniversityPicker(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Search universities..."
                />
              </div>

              {/* University List */}
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredUniversities.map((university) => (
                  <button
                    key={university.id}
                    onClick={() => addUniversityToSlot(showUniversityPicker, university)}
                    className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    disabled={comparisonSlots.some(slot => slot.university?.id === university.id)}
                  >
                    <img
                      src={university.logo}
                      alt={`${university.name} logo`}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{university.name}</h4>
                      <p className="text-sm text-gray-600">{university.location}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">{renderStars(university.rating)}</div>
                        <span className="text-sm text-gray-500">({university.reviewCount} reviews)</span>
                      </div>
                    </div>
                    {comparisonSlots.some(slot => slot.university?.id === university.id) && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Already added
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {filteredUniversities.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No universities found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
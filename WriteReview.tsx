import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Star, ArrowLeft, Save, Loader2 } from 'lucide-react';
import { getUniversityById } from '../data/universities';
import StarRating from '../components/ui/StarRating';
import FormTextarea from '../components/ui/FormTextarea';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';

interface ReviewData {
  academicQuality: number;
  facultyExperience: number;
  campusLife: number;
  housingFacilities: number;
  careerPlacements: number;
  reviewText: string;
}

interface ToastState {
  isVisible: boolean;
  message: string;
  type: 'success' | 'error';
}

const ratingCategories = [
  { key: 'academicQuality', label: 'Academic Quality' },
  { key: 'facultyExperience', label: 'Faculty Experience' },
  { key: 'campusLife', label: 'Campus Life Quality' },
  { key: 'housingFacilities', label: 'Housing Facilities' },
  { key: 'careerPlacements', label: 'Career Placements' }
];

export default function WriteReview() {
  const { universityId } = useParams<{ universityId: string }>();
  const navigate = useNavigate();
  const [university, setUniversity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const [reviewData, setReviewData] = useState<ReviewData>({
    academicQuality: 0,
    facultyExperience: 0,
    campusLife: 0,
    housingFacilities: 0,
    careerPlacements: 0,
    reviewText: ''
  });

  useEffect(() => {
    const loadUniversity = async () => {
      if (!universityId) {
        navigate('/universities');
        return;
      }

      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      const foundUniversity = getUniversityById(universityId);
      if (foundUniversity) {
        setUniversity(foundUniversity);
      } else {
        navigate('/universities');
        return;
      }

      setLoading(false);
    };

    loadUniversity();
  }, [universityId, navigate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Check if at least one rating is provided
    const hasRating = ratingCategories.some(category => 
      reviewData[category.key as keyof ReviewData] > 0
    );
    
    if (!hasRating) {
      newErrors.ratings = 'Please provide at least one rating';
    }

    // Check review text length
    if (reviewData.reviewText.length < 100) {
      newErrors.reviewText = 'Review must be at least 100 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Review submitted for university:', universityId, reviewData);
      
      setToast({
        isVisible: true,
        message: 'Review submitted successfully! Thank you for your feedback.',
        type: 'success'
      });

      // Wait a moment then navigate back
      setTimeout(() => {
        navigate(`/universities/${universityId}`);
      }, 2000);
      
    } catch (error) {
      setToast({
        isVisible: true,
        message: 'Failed to submit review. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateRating = (category: string, rating: number) => {
    setReviewData(prev => ({
      ...prev,
      [category]: rating
    }));
    
    // Clear rating error if it exists
    if (errors.ratings) {
      setErrors(prev => ({ ...prev, ratings: '' }));
    }
  };

  const updateReviewText = (value: string) => {
    setReviewData(prev => ({ ...prev, reviewText: value }));
    
    // Clear error if it exists
    if (errors.reviewText) {
      setErrors(prev => ({ ...prev, reviewText: '' }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">University Not Found</h1>
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
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link to="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/universities" className="hover:text-primary-600 transition-colors">
              Universities
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link 
              to={`/universities/${universityId}`} 
              className="hover:text-primary-600 transition-colors"
            >
              {university.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">Write Review</span>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate(`/universities/${universityId}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {university.name}
          </button>

          {/* Page Title */}
          <div className="flex items-center gap-4">
            <img
              src={university.logo}
              alt={`${university.name} logo`}
              className="w-16 h-16 rounded-lg object-cover border border-gray-200"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Write a Review for {university.name}
              </h1>
              <p className="text-gray-600">
                Share your experience to help future students make informed decisions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Rating Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Rate Your Experience
              </h3>
              
              {errors.ratings && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-6">
                  <p className="text-sm text-red-600">{errors.ratings}</p>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-6">
                {ratingCategories.map((category) => (
                  <StarRating
                    key={category.key}
                    label={category.label}
                    rating={reviewData[category.key as keyof ReviewData] as number}
                    onRatingChange={(rating) => updateRating(category.key, rating)}
                    disabled={isSubmitting}
                  />
                ))}
              </div>
            </div>

            {/* Review Text */}
            <FormTextarea
              label="Detailed Review"
              placeholder="Share your detailed experience (minimum 100 characters)"
              value={reviewData.reviewText}
              onChange={updateReviewText}
              error={errors.reviewText}
              disabled={isSubmitting}
              required
              minLength={100}
              maxLength={2000}
              rows={6}
              showCharacterCount
            />

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/universities/${universityId}`)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
                size="lg"
              >
                <Save className="h-5 w-5 mr-2" />
                {isSubmitting ? 'Submitting Review...' : 'Submit Review'}
              </Button>
            </div>
          </form>
        </div>
      </div>

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
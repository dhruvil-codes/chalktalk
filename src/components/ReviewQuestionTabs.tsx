import React, { useState } from 'react';
import { MessageSquare, Star as StarIcon } from 'lucide-react';
import StarRating from './ui/StarRating';
import FormInput from './ui/FormInput';
import FormTextarea from './ui/FormTextarea';
import FormSelect from './ui/FormSelect';
import Button from './ui/Button';
import Toast from './ui/Toast';

type TabType = 'review' | 'question';

interface ReviewData {
  academicQuality: number;
  facultyExperience: number;
  campusLife: number;
  housingFacilities: number;
  careerPlacements: number;
  reviewText: string;
}

interface QuestionData {
  questionText: string;
  category: string;
}

interface ToastState {
  isVisible: boolean;
  message: string;
  type: 'success' | 'error';
}

export default function ReviewQuestionTabs() {
  const [activeTab, setActiveTab] = useState<TabType>('review');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // Review form state
  const [reviewData, setReviewData] = useState<ReviewData>({
    academicQuality: 0,
    facultyExperience: 0,
    campusLife: 0,
    housingFacilities: 0,
    careerPlacements: 0,
    reviewText: ''
  });

  // Question form state
  const [questionData, setQuestionData] = useState<QuestionData>({
    questionText: '',
    category: ''
  });

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryOptions = [
    { value: 'admissions', label: 'Admissions' },
    { value: 'placements', label: 'Placements' },
    { value: 'campus-life', label: 'Campus Life' }
  ];

  const ratingCategories = [
    { key: 'academicQuality', label: 'Academic Quality' },
    { key: 'facultyExperience', label: 'Faculty Experience' },
    { key: 'campusLife', label: 'Campus Life Quality' },
    { key: 'housingFacilities', label: 'Housing Facilities' },
    { key: 'careerPlacements', label: 'Career Placements' }
  ];

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const validateReviewForm = (): boolean => {
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

  const validateQuestionForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (questionData.questionText.length < 10) {
      newErrors.questionText = 'Question must be at least 10 characters long';
    }

    if (!questionData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateReviewForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Review submitted:', reviewData);
      
      // Reset form
      setReviewData({
        academicQuality: 0,
        facultyExperience: 0,
        campusLife: 0,
        housingFacilities: 0,
        careerPlacements: 0,
        reviewText: ''
      });
      
      setErrors({});
      showToast('Review submitted successfully! Thank you for your feedback.', 'success');
    } catch (error) {
      showToast('Failed to submit review. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateQuestionForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Question submitted:', questionData);
      
      // Reset form
      setQuestionData({
        questionText: '',
        category: ''
      });
      
      setErrors({});
      showToast('Question submitted successfully! You\'ll receive an answer soon.', 'success');
    } catch (error) {
      showToast('Failed to submit question. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateReviewRating = (category: string, rating: number) => {
    setReviewData(prev => ({
      ...prev,
      [category]: rating
    }));
    
    // Clear rating error if it exists
    if (errors.ratings) {
      setErrors(prev => ({ ...prev, ratings: '' }));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('review')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 ${
              activeTab === 'review'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <StarIcon className="h-5 w-5" />
              <span>Write a Review</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('question')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 ${
              activeTab === 'question'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span>Ask a Question</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6 lg:p-8">
        {activeTab === 'review' && (
          <form onSubmit={handleReviewSubmit} className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Share Your Experience
              </h3>
              
              {/* Rating Categories */}
              <div className="space-y-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">
                  Rate Your Experience
                </h4>
                
                {errors.ratings && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{errors.ratings}</p>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-6">
                  {ratingCategories.map((category) => (
                    <StarRating
                      key={category.key}
                      label={category.label}
                      rating={reviewData[category.key as keyof ReviewData] as number}
                      onRatingChange={(rating) => updateReviewRating(category.key, rating)}
                      disabled={isSubmitting}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Review Text */}
            <FormTextarea
              label="Detailed Review"
              placeholder="Share your detailed experience (minimum 100 characters)"
              value={reviewData.reviewText}
              onChange={(value) => setReviewData(prev => ({ ...prev, reviewText: value }))}
              error={errors.reviewText}
              disabled={isSubmitting}
              required
              minLength={100}
              maxLength={2000}
              rows={6}
              showCharacterCount
            />

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? 'Submitting Review...' : 'Submit Review'}
              </Button>
            </div>
          </form>
        )}

        {activeTab === 'question' && (
          <form onSubmit={handleQuestionSubmit} className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Ask a Question
              </h3>
              
              {/* Question Input */}
              <FormInput
                label="Your Question"
                placeholder="Type your question here"
                value={questionData.questionText}
                onChange={(value) => setQuestionData(prev => ({ ...prev, questionText: value }))}
                error={errors.questionText}
                disabled={isSubmitting}
                required
                minLength={10}
              />
            </div>

            {/* Category Selection */}
            <FormSelect
              label="Category"
              value={questionData.category}
              onChange={(value) => setQuestionData(prev => ({ ...prev, category: value }))}
              options={categoryOptions}
              placeholder="Select a category"
              error={errors.category}
              disabled={isSubmitting}
              required
            />

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? 'Submitting Question...' : 'Submit Question'}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
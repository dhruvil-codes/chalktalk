import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, HelpCircle, ArrowLeft, Send, Loader2 } from 'lucide-react';
import { getUniversityById } from '../data/universities';
import FormInput from '../components/ui/FormInput';
import FormSelect from '../components/ui/FormSelect';
import FormTextarea from '../components/ui/FormTextarea';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';

interface QuestionData {
  title: string;
  content: string;
  category: string;
}

interface ToastState {
  isVisible: boolean;
  message: string;
  type: 'success' | 'error';
}

const categoryOptions = [
  { value: '', label: 'Select a category' },
  { value: 'admissions', label: 'Admissions' },
  { value: 'academics', label: 'Academics' },
  { value: 'campus-life', label: 'Campus Life' },
  { value: 'housing', label: 'Housing & Accommodation' },
  { value: 'placements', label: 'Placements & Career' },
  { value: 'facilities', label: 'Facilities & Infrastructure' },
  { value: 'financial', label: 'Financial Aid & Scholarships' },
  { value: 'other', label: 'Other' }
];

export default function AskQuestion() {
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

  const [questionData, setQuestionData] = useState<QuestionData>({
    title: '',
    content: '',
    category: ''
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

    if (!questionData.title.trim()) {
      newErrors.title = 'Question title is required';
    } else if (questionData.title.length < 10) {
      newErrors.title = 'Question title must be at least 10 characters long';
    }

    if (!questionData.content.trim()) {
      newErrors.content = 'Question details are required';
    } else if (questionData.content.length < 20) {
      newErrors.content = 'Question details must be at least 20 characters long';
    }

    if (!questionData.category) {
      newErrors.category = 'Please select a category';
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Question submitted for university:', universityId, questionData);
      
      setToast({
        isVisible: true,
        message: 'Question submitted successfully! You\'ll receive an answer soon.',
        type: 'success'
      });

      // Wait a moment then navigate back
      setTimeout(() => {
        navigate(`/universities/${universityId}?tab=qa`);
      }, 2000);
      
    } catch (error) {
      setToast({
        isVisible: true,
        message: 'Failed to submit question. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof QuestionData, value: string) => {
    setQuestionData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
            <span className="text-gray-900">Ask Question</span>
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
                Ask a Question about {university.name}
              </h1>
              <p className="text-gray-600">
                Get answers from current students and alumni
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <HelpCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Ask Your Question</h2>
              <p className="text-gray-600">Be specific to get the best answers</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Title */}
            <FormInput
              label="Question Title"
              placeholder="What would you like to know?"
              value={questionData.title}
              onChange={(value) => updateField('title', value)}
              error={errors.title}
              required
              disabled={isSubmitting}
              minLength={10}
            />

            {/* Category Selection */}
            <FormSelect
              label="Category"
              value={questionData.category}
              onChange={(value) => updateField('category', value)}
              options={categoryOptions}
              error={errors.category}
              required
              disabled={isSubmitting}
            />

            {/* Question Details */}
            <FormTextarea
              label="Question Details"
              placeholder="Provide more context about your question. The more details you provide, the better answers you'll receive."
              value={questionData.content}
              onChange={(value) => updateField('content', value)}
              error={errors.content}
              required
              minLength={20}
              maxLength={1000}
              rows={6}
              showCharacterCount
              disabled={isSubmitting}
            />

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Tips for getting great answers:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be specific about what you want to know</li>
                <li>• Mention your background (e.g., intended major, year)</li>
                <li>• Ask one question at a time</li>
                <li>• Search existing questions first to avoid duplicates</li>
              </ul>
            </div>

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
                <Send className="h-5 w-5 mr-2" />
                {isSubmitting ? 'Submitting Question...' : 'Submit Question'}
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
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ReviewQuestionTabs from '../components/ReviewQuestionTabs';

export default function ReviewQuestionPage() {
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
            <Link to="/universities" className="hover:text-primary-600 transition-colors">
              Universities
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">Review & Questions</span>
          </div>
          
          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Share Your Experience
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Help future students make informed decisions by sharing your honest review 
              or asking questions about your educational experience.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <ReviewQuestionTabs />
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { MessageCircle, Target, BookOpen, GraduationCap, ArrowLeft, ArrowRight, X } from 'lucide-react';
import ProgressIndicator from './ProgressIndicator';

type UserRole = 'aspirant' | 'current-student' | 'alumni';

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface RoleSelectionScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

const roleOptions: RoleOption[] = [
  {
    id: 'aspirant',
    title: 'Aspirant',
    description: 'I\'m exploring universities and planning my educational journey',
    icon: Target,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'current-student',
    title: 'Current Student',
    description: 'I\'m currently enrolled and want to share my experiences',
    icon: BookOpen,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'alumni',
    title: 'Alumni',
    description: 'I\'ve graduated and want to help guide future students',
    icon: GraduationCap,
    color: 'from-purple-500 to-purple-600'
  }
];

export default function RoleSelectionScreen({ onComplete, onBack }: RoleSelectionScreenProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    
    // Simulate API call to save role
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Selected role:', selectedRole);
    setIsLoading(false);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-bg opacity-30"></div>
      
      <div className="relative w-full max-w-2xl">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute -top-12 left-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>

        {/* Progress Indicator */}
        <div className="mb-6">
          <ProgressIndicator currentStep={2} totalSteps={2} />
        </div>

        {/* Role Selection Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-4">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">
              Tell us about yourself
            </h1>
            <p className="text-gray-600">
              This helps us personalize your ChalkTalk experience
            </p>
          </div>

          {/* Role Options */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {roleOptions.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`relative p-6 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 hover:shadow-lg ${
                  selectedRole === role.id
                    ? 'border-primary-500 bg-primary-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {/* Selection Indicator */}
                {selectedRole === role.id && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${role.color} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                  <role.icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">
                    {role.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {role.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!selectedRole || isLoading}
            className="w-full flex items-center justify-center px-6 py-4 border border-transparent rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-lg"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                Setting up your profile...
              </>
            ) : (
              <>
                Continue to ChalkTalk
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </button>

          {/* Skip Option */}
          <div className="mt-4 text-center">
            <button
              onClick={onComplete}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
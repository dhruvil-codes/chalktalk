import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  GraduationCap, 
  Target, 
  BookOpen, 
  Camera,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  Loader2
} from 'lucide-react';
import { ProfileSetupData, ValidationErrors } from '../../types/profile';
import FormInput from '../ui/FormInput';
import FormSelect from '../ui/FormSelect';
import FormTextarea from '../ui/FormTextarea';
import Button from '../ui/Button';
import Toast from '../ui/Toast';

interface ProfileSetupFlowProps {
  onComplete: (profileData: ProfileSetupData) => void;
  onSkip?: () => void;
  userProfile?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    bio?: string;
    role?: 'aspirant' | 'current-student' | 'alumni';
  } | null;
}

type SetupStep = 'personal' | 'academic' | 'role' | 'avatar';

const universities = [
  { value: 'harvard', label: 'Harvard University' },
  { value: 'mit', label: 'Massachusetts Institute of Technology' },
  { value: 'stanford', label: 'Stanford University' },
  { value: 'oxford', label: 'University of Oxford' },
  { value: 'cambridge', label: 'University of Cambridge' },
  { value: 'toronto', label: 'University of Toronto' },
  { value: 'other', label: 'Other' }
];

const courses = [
  { value: 'computer-science', label: 'Computer Science' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'business', label: 'Business Administration' },
  { value: 'medicine', label: 'Medicine' },
  { value: 'law', label: 'Law' },
  { value: 'psychology', label: 'Psychology' },
  { value: 'economics', label: 'Economics' },
  { value: 'biology', label: 'Biology' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'physics', label: 'Physics' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'other', label: 'Other' }
];

const roleOptions = [
  {
    id: 'aspirant' as const,
    title: 'Aspirant',
    description: 'I\'m exploring universities and planning my educational journey',
    icon: Target,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'current-student' as const,
    title: 'Current Student',
    description: 'I\'m currently enrolled and want to share my experiences',
    icon: BookOpen,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'alumni' as const,
    title: 'Alumni',
    description: 'I\'ve graduated and want to help guide future students',
    icon: GraduationCap,
    color: 'from-purple-500 to-purple-600'
  }
];

// Role persistence utilities
const ROLE_STORAGE_KEY = 'chalktalk_user_role';

const saveRoleToStorage = (role: 'aspirant' | 'current-student' | 'alumni') => {
  try {
    localStorage.setItem(ROLE_STORAGE_KEY, role);
  } catch (error) {
    console.warn('Failed to save role to localStorage:', error);
  }
};

const getRoleFromStorage = (): 'aspirant' | 'current-student' | 'alumni' | null => {
  try {
    return localStorage.getItem(ROLE_STORAGE_KEY) as 'aspirant' | 'current-student' | 'alumni' | null;
  } catch (error) {
    console.warn('Failed to get role from localStorage:', error);
    return null;
  }
};

export default function ProfileSetupFlow({ onComplete, onSkip, userProfile }: ProfileSetupFlowProps) {
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentStep, setCurrentStep] = useState<SetupStep>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as const });

  const [profileData, setProfileData] = useState<ProfileSetupData>({
    personalDetails: {
      firstName: '',
      lastName: '',
      bio: ''
    },
    academicInfo: {
      university: '',
      course: '',
      yearOfStudy: 1,
      graduationYear: undefined
    },
    role: 'aspirant',
    avatar: undefined
  });

  const [avatarPreview, setAvatarPreview] = useState<string>('');

  // Determine which steps to include based on user data
  const getStepsToInclude = (): SetupStep[] => {
    const steps: SetupStep[] = [];
    
    // Check if personal details are complete
    const hasPersonalDetails = userProfile?.firstName && 
                              userProfile?.lastName && 
                              userProfile?.bio && 
                              userProfile.bio.length >= 20;
    
    if (!hasPersonalDetails) {
      steps.push('personal');
    }
    
    // Always include academic info
    steps.push('academic');
    
    // Check if role is already stored
    const storedRole = getRoleFromStorage();
    const hasRole = userProfile?.role || storedRole;
    
    if (!hasRole) {
      steps.push('role');
    }
    
    // Always include avatar (optional step)
    steps.push('avatar');
    
    return steps;
  };

  const [steps, setSteps] = useState<SetupStep[]>([]);

  // Initialize component and determine flow
  useEffect(() => {
    const initializeFlow = async () => {
      setIsInitializing(true);
      
      // Small delay to prevent flicker
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const stepsToInclude = getStepsToInclude();
      setSteps(stepsToInclude);
      
      // Pre-fill data from user profile
      if (userProfile) {
        setProfileData(prev => ({
          ...prev,
          personalDetails: {
            firstName: userProfile.firstName || '',
            lastName: userProfile.lastName || '',
            bio: userProfile.bio || ''
          },
          role: userProfile.role || getRoleFromStorage() || 'aspirant'
        }));
      } else {
        // Check for stored role
        const storedRole = getRoleFromStorage();
        if (storedRole) {
          setProfileData(prev => ({
            ...prev,
            role: storedRole
          }));
        }
      }
      
      // Set initial step
      if (stepsToInclude.length > 0) {
        setCurrentStep(stepsToInclude[0]);
      }
      
      setIsInitializing(false);
    };

    initializeFlow();
  }, [userProfile]);

  const currentStepIndex = steps.indexOf(currentStep);
  const progress = steps.length > 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  const validatePersonalDetails = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!profileData.personalDetails.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!profileData.personalDetails.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (profileData.personalDetails.bio.length < 20) {
      newErrors.bio = 'Bio must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAcademicInfo = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!profileData.academicInfo.university) {
      newErrors.university = 'University is required';
    }
    
    if (!profileData.academicInfo.course) {
      newErrors.course = 'Course is required';
    }
    
    if (profileData.academicInfo.yearOfStudy < 1 || profileData.academicInfo.yearOfStudy > 10) {
      newErrors.yearOfStudy = 'Year of study must be between 1 and 10';
    }

    if (profileData.role === 'alumni' && !profileData.academicInfo.graduationYear) {
      newErrors.graduationYear = 'Graduation year is required for alumni';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = true;

    switch (currentStep) {
      case 'personal':
        isValid = validatePersonalDetails();
        break;
      case 'academic':
        isValid = validateAcademicInfo();
        break;
      case 'role':
        isValid = true; // Role is always valid as it has a default
        // Save role to storage when selected
        saveRoleToStorage(profileData.role);
        break;
      case 'avatar':
        isValid = true; // Avatar is optional
        break;
    }

    if (isValid) {
      const nextStepIndex = currentStepIndex + 1;
      if (nextStepIndex < steps.length) {
        setCurrentStep(steps[nextStepIndex]);
      } else {
        handleComplete();
      }
    }
  };

  const handlePrevious = () => {
    const prevStepIndex = currentStepIndex - 1;
    if (prevStepIndex >= 0) {
      setCurrentStep(steps[prevStepIndex]);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call to save profile
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save role to storage if not already saved
      saveRoleToStorage(profileData.role);
      
      console.log('Profile setup completed:', profileData);
      
      // Show success message
      setToast({
        isVisible: true,
        message: 'Profile setup completed successfully!',
        type: 'success'
      });

      // Wait a moment then complete
      setTimeout(() => {
        onComplete(profileData);
      }, 1500);
      
    } catch (error) {
      setToast({
        isVisible: true,
        message: 'Failed to save profile. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ avatar: 'File size must be less than 5MB' });
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrors({ avatar: 'Please select an image file' });
        return;
      }

      setProfileData(prev => ({ ...prev, avatar: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      setErrors({ ...errors, avatar: '' });
    }
  };

  const updatePersonalDetails = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [field]: value
      }
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateAcademicInfo = (field: string, value: string | number) => {
    setProfileData(prev => ({
      ...prev,
      academicInfo: {
        ...prev.academicInfo,
        [field]: value
      }
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateRole = (role: 'aspirant' | 'current-student' | 'alumni') => {
    setProfileData(prev => ({ ...prev, role }));
    
    // Clear graduation year if not alumni
    if (role !== 'alumni') {
      setProfileData(prev => ({
        ...prev,
        academicInfo: {
          ...prev.academicInfo,
          graduationYear: undefined
        }
      }));
    }
  };

  // Show loading state during initialization
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">Preparing your profile setup...</p>
        </div>
      </div>
    );
  }

  // If no steps needed, complete immediately
  if (steps.length === 0) {
    handleComplete();
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Setup Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            {/* Personal Details Step */}
            {currentStep === 'personal' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
                  <p className="text-gray-600">Let's fill in the missing details</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormInput
                    label="First Name"
                    value={profileData.personalDetails.firstName}
                    onChange={(value) => updatePersonalDetails('firstName', value)}
                    error={errors.firstName}
                    required
                    placeholder="Enter your first name"
                  />
                  
                  <FormInput
                    label="Last Name"
                    value={profileData.personalDetails.lastName}
                    onChange={(value) => updatePersonalDetails('lastName', value)}
                    error={errors.lastName}
                    required
                    placeholder="Enter your last name"
                  />
                </div>

                <FormTextarea
                  label="Bio"
                  value={profileData.personalDetails.bio}
                  onChange={(value) => updatePersonalDetails('bio', value)}
                  error={errors.bio}
                  required
                  minLength={20}
                  maxLength={500}
                  placeholder="Tell us about yourself, your interests, and goals..."
                  showCharacterCount
                  rows={4}
                />
              </div>
            )}

            {/* Academic Information Step */}
            {currentStep === 'academic' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Academic Information</h2>
                  <p className="text-gray-600">Share your educational background</p>
                </div>

                <FormSelect
                  label="University"
                  value={profileData.academicInfo.university}
                  onChange={(value) => updateAcademicInfo('university', value)}
                  options={universities}
                  error={errors.university}
                  required
                  placeholder="Select your university"
                />

                <FormSelect
                  label="Course/Program"
                  value={profileData.academicInfo.course}
                  onChange={(value) => updateAcademicInfo('course', value)}
                  options={courses}
                  error={errors.course}
                  required
                  placeholder="Select your course"
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormInput
                    label="Year of Study"
                    type="number"
                    value={profileData.academicInfo.yearOfStudy.toString()}
                    onChange={(value) => updateAcademicInfo('yearOfStudy', parseInt(value) || 1)}
                    error={errors.yearOfStudy}
                    required
                    placeholder="1"
                  />

                  {profileData.role === 'alumni' && (
                    <FormInput
                      label="Graduation Year"
                      type="number"
                      value={profileData.academicInfo.graduationYear?.toString() || ''}
                      onChange={(value) => updateAcademicInfo('graduationYear', parseInt(value) || undefined)}
                      error={errors.graduationYear}
                      required
                      placeholder="2023"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Role Selection Step */}
            {currentStep === 'role' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Role</h2>
                  <p className="text-gray-600">How would you describe yourself?</p>
                </div>

                <div className="grid gap-4">
                  {roleOptions.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => updateRole(role.id)}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 hover:shadow-lg ${
                        profileData.role === role.id
                          ? 'border-primary-500 bg-primary-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center`}>
                          <role.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {role.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {role.description}
                          </p>
                        </div>
                        {profileData.role === role.id && (
                          <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Avatar Upload Step */}
            {currentStep === 'avatar' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Picture</h2>
                  <p className="text-gray-600">Add a photo to personalize your profile (optional)</p>
                </div>

                <div className="flex flex-col items-center space-y-6">
                  {/* Avatar Preview */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                      {avatarPreview ? (
                        <img 
                          src={avatarPreview} 
                          alt="Avatar preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-gray-400" />
                      )}
                    </div>
                    
                    {/* Upload Button */}
                    <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors shadow-lg">
                      <Upload className="w-5 h-5 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {errors.avatar && (
                    <p className="text-sm text-red-600">{errors.avatar}</p>
                  )}

                  <div className="text-center text-sm text-gray-600">
                    <p>Supported formats: JPG, PNG, GIF</p>
                    <p>Maximum size: 5MB</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <div>
                {currentStepIndex > 0 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                {onSkip && currentStep !== 'avatar' && (
                  <button
                    onClick={onSkip}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    disabled={isSubmitting}
                  >
                    Skip for now
                  </button>
                )}

                <Button
                  onClick={handleNext}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {currentStepIndex === steps.length - 1 ? (
                    isSubmitting ? 'Completing...' : 'Complete Setup'
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
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
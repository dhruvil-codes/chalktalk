import React, { useState, useEffect } from 'react';
import { X, Save, Camera, Upload, User } from 'lucide-react';
import { UserProfile, ValidationErrors } from '../../types/profile';
import FormInput from '../ui/FormInput';
import FormSelect from '../ui/FormSelect';
import FormTextarea from '../ui/FormTextarea';
import Button from '../ui/Button';
import Toast from '../ui/Toast';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updatedProfile: Partial<UserProfile>) => void;
}

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
  { value: 'aspirant', label: 'Aspirant' },
  { value: 'current-student', label: 'Current Student' },
  { value: 'alumni', label: 'Alumni' }
];

export default function EditProfileModal({ isOpen, onClose, profile, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as const });

  useEffect(() => {
    if (isOpen && profile) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        bio: profile.bio || '',
        university: profile.university || '',
        course: profile.course || '',
        yearOfStudy: profile.yearOfStudy || 1,
        graduationYear: profile.graduationYear,
        role: profile.role
      });
      setAvatarPreview(profile.avatar || '');
      setErrors({});
      setAvatarFile(null);
    }
  }, [isOpen, profile]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (formData.bio && formData.bio.length < 20) {
      newErrors.bio = 'Bio must be at least 20 characters';
    }

    if (!formData.university) {
      newErrors.university = 'University is required';
    }

    if (!formData.course) {
      newErrors.course = 'Course is required';
    }

    if (!formData.yearOfStudy || formData.yearOfStudy < 1 || formData.yearOfStudy > 10) {
      newErrors.yearOfStudy = 'Year of study must be between 1 and 10';
    }

    if (formData.role === 'alumni' && !formData.graduationYear) {
      newErrors.graduationYear = 'Graduation year is required for alumni';
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

      // Prepare updated profile data
      const updatedProfile: Partial<UserProfile> = {
        ...formData,
        updatedAt: new Date().toISOString()
      };

      // Handle avatar upload if new file selected
      if (avatarFile) {
        // In a real app, you would upload the file to a storage service
        // For now, we'll use the preview URL
        updatedProfile.avatar = avatarPreview;
      }

      console.log('Profile updated:', updatedProfile);

      setToast({
        isVisible: true,
        message: 'Profile updated successfully!',
        type: 'success'
      });

      // Wait a moment then save
      setTimeout(() => {
        onSave(updatedProfile);
        onClose();
      }, 1500);

    } catch (error) {
      setToast({
        isVisible: true,
        message: 'Failed to update profile. Please try again.',
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
        setErrors({ ...errors, avatar: 'File size must be less than 5MB' });
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, avatar: 'Please select an image file' });
        return;
      }

      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      setErrors({ ...errors, avatar: '' });
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Clear graduation year if role is not alumni
    if (field === 'role' && value !== 'alumni') {
      setFormData(prev => ({ ...prev, graduationYear: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Edit Profile</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Avatar preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors shadow-lg">
                  <Camera className="w-4 h-4 text-white" />
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
            </div>

            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormInput
                label="First Name"
                value={formData.firstName || ''}
                onChange={(value) => updateField('firstName', value)}
                error={errors.firstName}
                required
                disabled={isSubmitting}
              />
              
              <FormInput
                label="Last Name"
                value={formData.lastName || ''}
                onChange={(value) => updateField('lastName', value)}
                error={errors.lastName}
                required
                disabled={isSubmitting}
              />
            </div>

            <FormTextarea
              label="Bio"
              value={formData.bio || ''}
              onChange={(value) => updateField('bio', value)}
              error={errors.bio}
              minLength={20}
              maxLength={500}
              placeholder="Tell us about yourself..."
              showCharacterCount
              rows={3}
              disabled={isSubmitting}
            />

            {/* Academic Information */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900">Academic Information</h4>
              
              <FormSelect
                label="Role"
                value={formData.role || ''}
                onChange={(value) => updateField('role', value)}
                options={roleOptions}
                error={errors.role}
                required
                disabled={isSubmitting}
              />

              <FormSelect
                label="University"
                value={formData.university || ''}
                onChange={(value) => updateField('university', value)}
                options={universities}
                error={errors.university}
                required
                disabled={isSubmitting}
              />

              <FormSelect
                label="Course/Program"
                value={formData.course || ''}
                onChange={(value) => updateField('course', value)}
                options={courses}
                error={errors.course}
                required
                disabled={isSubmitting}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                  label="Year of Study"
                  type="number"
                  value={formData.yearOfStudy?.toString() || ''}
                  onChange={(value) => updateField('yearOfStudy', parseInt(value) || 1)}
                  error={errors.yearOfStudy}
                  required
                  disabled={isSubmitting}
                />

                {formData.role === 'alumni' && (
                  <FormInput
                    label="Graduation Year"
                    type="number"
                    value={formData.graduationYear?.toString() || ''}
                    onChange={(value) => updateField('graduationYear', parseInt(value) || undefined)}
                    error={errors.graduationYear}
                    required
                    disabled={isSubmitting}
                  />
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
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
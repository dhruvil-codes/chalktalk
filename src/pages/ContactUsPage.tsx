import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Mail, 
  Clock, 
  Shield, 
  Send, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Facebook,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { UserProfile } from '../types/profile';
import FormInput from '../components/ui/FormInput';
import FormSelect from '../components/ui/FormSelect';
import FormTextarea from '../components/ui/FormTextarea';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';

interface ContactUsPageProps {
  userProfile?: UserProfile | null;
  isAuthenticated?: boolean;
}

interface ContactFormData {
  name: string;
  email: string;
  userType: string;
  message: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface ToastState {
  isVisible: boolean;
  message: string;
  type: 'success' | 'error';
}

const userTypeOptions = [
  { value: '', label: 'Select your role' },
  { value: 'student', label: 'Student' },
  { value: 'alumni', label: 'Alumni' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'other', label: 'Other' }
];

const socialLinks = [
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com/chalktalk',
    color: 'hover:text-pink-600'
  },
  {
    name: 'Twitter',
    icon: Twitter,
    url: 'https://twitter.com/chalktalk',
    color: 'hover:text-blue-400'
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://linkedin.com/company/chalktalk',
    color: 'hover:text-blue-700'
  },
  {
    name: 'Facebook',
    icon: Facebook,
    url: 'https://facebook.com/chalktalk',
    color: 'hover:text-blue-600'
  }
];

export default function ContactUsPage({ userProfile, isAuthenticated = false }: ContactUsPageProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    userType: '',
    message: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // Auto-populate form fields if user is logged in
  useEffect(() => {
    if (isAuthenticated && userProfile) {
      setFormData(prev => ({
        ...prev,
        name: `${userProfile.firstName} ${userProfile.lastName}`,
        email: userProfile.email,
        userType: userProfile.role === 'current-student' ? 'student' : userProfile.role
      }));
    }
  }, [isAuthenticated, userProfile]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.userType) {
      newErrors.userType = 'Please select your role';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 100) {
      newErrors.message = 'Message must be at least 100 characters long';
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

      console.log('Contact form submitted:', formData);

      // Reset form
      setFormData({
        name: isAuthenticated && userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : '',
        email: isAuthenticated && userProfile ? userProfile.email : '',
        userType: isAuthenticated && userProfile ? (userProfile.role === 'current-student' ? 'student' : userProfile.role) : '',
        message: ''
      });

      setErrors({});

      setToast({
        isVisible: true,
        message: 'Message sent successfully! We\'ll get back to you within 24 hours.',
        type: 'success'
      });

    } catch (error) {
      setToast({
        isVisible: true,
        message: 'Failed to send message. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

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
            <span className="text-gray-900">Contact Us</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            💬 Let's Talk!
          </h1>
          {isAuthenticated && userProfile && (
            <p className="text-xl text-primary-600 font-medium mb-4">
              Hi {userProfile.firstName}! 👋
            </p>
          )}
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 leading-relaxed">
              Whether you're a student exploring universities, an alumni sharing experiences, 
              or a recruiter connecting with talent, we're here to help. Reach out with any 
              questions, feedback, or suggestions to make ChalkTalk even better.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-blue-50 rounded-lg shadow-md p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormInput
                    label="Full Name"
                    value={formData.name}
                    onChange={(value) => updateField('name', value)}
                    error={errors.name}
                    required
                    disabled={isSubmitting}
                    placeholder="Enter your full name"
                  />
                  
                  <FormInput
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(value) => updateField('email', value)}
                    error={errors.email}
                    required
                    disabled={isSubmitting}
                    placeholder="Enter your email address"
                  />
                </div>

                <FormSelect
                  label="I am a..."
                  value={formData.userType}
                  onChange={(value) => updateField('userType', value)}
                  options={userTypeOptions}
                  error={errors.userType}
                  required
                  disabled={isSubmitting}
                />

                <FormTextarea
                  label="Message"
                  value={formData.message}
                  onChange={(value) => updateField('message', value)}
                  error={errors.message}
                  required
                  minLength={100}
                  maxLength={2000}
                  rows={6}
                  showCharacterCount
                  disabled={isSubmitting}
                  placeholder="Tell us how we can help you. Please provide as much detail as possible..."
                />

                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full"
                >
                  <Send className="h-5 w-5 mr-2" />
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>

          {/* Contact Information & Additional Details */}
          <div className="space-y-6">
            {/* Contact Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Get in Touch</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Email Us</p>
                    <a 
                      href="mailto:support@chalktalk.com" 
                      className="text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      support@chalktalk.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Response Time</p>
                    <p className="text-gray-600">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Follow Us</h3>
              
              <div className="flex items-center justify-between">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 transition-all duration-200 hover:scale-110 hover:shadow-md ${social.color}`}
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <social.icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ Preview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">FAQs</h3>
              </div>
              <p className="text-gray-600 mb-4">
                📖 Coming Soon - Frequently asked questions and helpful resources.
              </p>
              <div className="text-sm text-gray-500">
                Check back soon for common questions and detailed answers.
              </div>
            </div>

            {/* Trust Elements */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Privacy & Security</h3>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p>Your data is protected and never shared with third parties</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p>GDPR compliant data handling and processing</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p>Secure communication channels for all inquiries</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-md p-6 lg:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Need Immediate Help?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              For urgent technical issues or account problems, please include your account email 
              and a detailed description of the issue in your message. This helps us resolve 
              your concern faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/universities"
                className="inline-flex items-center justify-center px-6 py-3 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-colors"
              >
                Browse Universities
              </Link>
              <Link
                to="/review"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Share Your Experience
              </Link>
            </div>
          </div>
        </div>
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
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhatsInside from './components/WhatsInside';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import JoinCommunity from './components/JoinCommunity';
import FAQ from './components/FAQ';
import Features from './components/Features';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import LoginScreen from './components/auth/LoginScreen';
import SignupScreen from './components/auth/SignupScreen';
import RoleSelectionScreen from './components/auth/RoleSelectionScreen';
import ProfileSetupFlow from './components/profile/ProfileSetupFlow';
import UniversityListingPage from './pages/UniversityListingPage';
import UniversityDetailPage from './pages/UniversityDetailPage';
import UniversityComparisonPage from './pages/UniversityComparisonPage';
import ReviewQuestionPage from './pages/ReviewQuestionPage';
import UserProfilePage from './pages/UserProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import ContactUsPage from './pages/ContactUsPage';
import AboutUsPage from './pages/AboutUsPage';
import WriteReview from './pages/WriteReview';
import AskQuestion from './pages/AskQuestion';
import UnifiedAssistant from './components/UnifiedAssistant';
import { UserProfile, ProfileSetupData } from './types/profile';

type AuthScreen = 'login' | 'signup' | 'role-selection' | 'profile-setup' | null;

function AppContent() {
  const [currentAuthScreen, setCurrentAuthScreen] = useState<AuthScreen>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const navigate = useNavigate();

  const handleAuthNavigation = (screen: AuthScreen) => {
    setCurrentAuthScreen(screen);
  };

  const handleSignupComplete = () => {
    setCurrentAuthScreen('profile-setup');
    setIsAuthenticated(true);
    setNeedsProfileSetup(true);
  };

  const handleProfileSetupComplete = (profileData: ProfileSetupData) => {
    // Create user profile from setup data
    const newProfile: UserProfile = {
      id: 'user-' + Date.now(),
      email: 'user@example.com', // This would come from signup
      firstName: profileData.personalDetails.firstName,
      lastName: profileData.personalDetails.lastName,
      avatar: profileData.avatar ? URL.createObjectURL(profileData.avatar) : undefined,
      role: profileData.role,
      university: profileData.academicInfo.university,
      course: profileData.academicInfo.course,
      yearOfStudy: profileData.academicInfo.yearOfStudy,
      graduationYear: profileData.academicInfo.graduationYear,
      bio: profileData.personalDetails.bio,
      isProfileComplete: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setUserProfile(newProfile);
    setNeedsProfileSetup(false);
    setCurrentAuthScreen(null);
    
    // Store authentication state
    localStorage.setItem('chalktalk_user_session', 'active');
    localStorage.setItem('chalktalk_user_role', profileData.role);
    
    // Check if there's a return URL from comparison page
    const returnUrl = sessionStorage.getItem('chalktalk_return_url');
    if (returnUrl) {
      sessionStorage.removeItem('chalktalk_return_url');
      navigate(returnUrl);
    } else {
      navigate('/profile');
    }
  };

  const handleProfileSetupSkip = () => {
    // Create minimal profile
    const minimalProfile: UserProfile = {
      id: 'user-' + Date.now(),
      email: 'user@example.com',
      firstName: 'User',
      lastName: 'Name',
      role: 'aspirant',
      isProfileComplete: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setUserProfile(minimalProfile);
    setNeedsProfileSetup(false);
    setCurrentAuthScreen(null);
    
    // Store authentication state
    localStorage.setItem('chalktalk_user_session', 'active');
    localStorage.setItem('chalktalk_user_role', 'aspirant');
    
    // Check if there's a return URL from comparison page
    const returnUrl = sessionStorage.getItem('chalktalk_return_url');
    if (returnUrl) {
      sessionStorage.removeItem('chalktalk_return_url');
      navigate(returnUrl);
    } else {
      navigate('/profile');
    }
  };

  const handleLoginSuccess = () => {
    // Simulate loading existing user profile
    const existingProfile: UserProfile = {
      id: 'user-existing',
      email: 'existing@example.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      avatar: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
      role: 'alumni',
      university: 'harvard',
      course: 'computer-science',
      yearOfStudy: 4,
      graduationYear: 2023,
      bio: 'Computer Science graduate passionate about technology and education.',
      isProfileComplete: true,
      createdAt: '2022-01-15T00:00:00.000Z',
      updatedAt: new Date().toISOString()
    };

    setUserProfile(existingProfile);
    setIsAuthenticated(true);
    setCurrentAuthScreen(null);
    
    // Store authentication state
    localStorage.setItem('chalktalk_user_session', 'active');
    localStorage.setItem('chalktalk_user_role', existingProfile.role);
    
    // Check if there's a return URL from comparison page
    const returnUrl = sessionStorage.getItem('chalktalk_return_url');
    if (returnUrl) {
      sessionStorage.removeItem('chalktalk_return_url');
      navigate(returnUrl);
    } else {
      navigate('/profile');
    }
  };

  // Check for authentication state on app load
  React.useEffect(() => {
    const hasSession = localStorage.getItem('chalktalk_user_session');
    const userRole = localStorage.getItem('chalktalk_user_role');
    
    if (hasSession && userRole) {
      // Simulate loading user profile from stored session
      const existingProfile: UserProfile = {
        id: 'user-existing',
        email: 'existing@example.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        avatar: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
        role: userRole as 'aspirant' | 'current-student' | 'alumni',
        university: 'harvard',
        course: 'computer-science',
        yearOfStudy: 4,
        graduationYear: 2023,
        bio: 'Computer Science graduate passionate about technology and education.',
        isProfileComplete: true,
        createdAt: '2022-01-15T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      };

      setUserProfile(existingProfile);
      setIsAuthenticated(true);
    }
  }, []);

  // Handle login modal from state (for comparison page redirect)
  React.useEffect(() => {
    const state = window.history.state;
    if (state?.showLoginModal && !isAuthenticated) {
      setCurrentAuthScreen('login');
    }
  }, [isAuthenticated]);

  // Show auth screens
  if (currentAuthScreen === 'login') {
    return (
      <ErrorBoundary>
        <LoginScreen 
          onNavigateToSignup={() => handleAuthNavigation('signup')}
          onClose={() => handleAuthNavigation(null)}
          onLoginSuccess={handleLoginSuccess}
        />
      </ErrorBoundary>
    );
  }

  if (currentAuthScreen === 'signup') {
    return (
      <ErrorBoundary>
        <SignupScreen 
          onNavigateToLogin={() => handleAuthNavigation('login')}
          onNavigateToRoleSelection={() => handleAuthNavigation('role-selection')}
          onClose={() => handleAuthNavigation(null)}
        />
      </ErrorBoundary>
    );
  }

  if (currentAuthScreen === 'role-selection') {
    return (
      <ErrorBoundary>
        <RoleSelectionScreen 
          onComplete={handleSignupComplete}
          onBack={() => handleAuthNavigation('signup')}
        />
      </ErrorBoundary>
    );
  }

  if (currentAuthScreen === 'profile-setup') {
    return (
      <ErrorBoundary>
        <ProfileSetupFlow 
          onComplete={handleProfileSetupComplete}
          onSkip={handleProfileSetupSkip}
          userProfile={userProfile}
        />
      </ErrorBoundary>
    );
  }

  // Main application with routing
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Enhanced Landing Page */}
          <Route path="/" element={
            <div className="bg-white">
              <Navbar 
                onLoginClick={() => handleAuthNavigation('login')}
                onSignupClick={() => handleAuthNavigation('signup')}
                isAuthenticated={isAuthenticated}
                userProfile={userProfile}
              />
              <Hero onSignupClick={() => handleAuthNavigation('signup')} />
              <WhatsInside />
              <HowItWorks onSignupClick={() => handleAuthNavigation('signup')} />
              <Testimonials />
              <JoinCommunity />
              <FAQ />
              <Footer />
            </div>
          } />
          
          {/* University Pages */}
          <Route path="/universities" element={
            <>
              <Navbar 
                onLoginClick={() => handleAuthNavigation('login')}
                onSignupClick={() => handleAuthNavigation('signup')}
                isAuthenticated={isAuthenticated}
                userProfile={userProfile}
              />
              <UniversityListingPage />
            </>
          } />
          <Route path="/universities/:id" element={
            <>
              <Navbar 
                onLoginClick={() => handleAuthNavigation('login')}
                onSignupClick={() => handleAuthNavigation('signup')}
                isAuthenticated={isAuthenticated}
                userProfile={userProfile}
              />
              <UniversityDetailPage />
            </>
          } />

          {/* University Comparison - Protected Route */}
          <Route path="/compare" element={
            <>
              <Navbar 
                onLoginClick={() => handleAuthNavigation('login')}
                onSignupClick={() => handleAuthNavigation('signup')}
                isAuthenticated={isAuthenticated}
                userProfile={userProfile}
              />
              <UniversityComparisonPage />
            </>
          } />
          
          {/* Review & Question Pages */}
          <Route path="/review" element={
            <>
              <Navbar 
                onLoginClick={() => handleAuthNavigation('login')}
                onSignupClick={() => handleAuthNavigation('signup')}
                isAuthenticated={isAuthenticated}
                userProfile={userProfile}
              />
              <ReviewQuestionPage />
            </>
          } />

          <Route path="/write-review/:universityId" element={
            <>
              <Navbar 
                onLoginClick={() => handleAuthNavigation('login')}
                onSignupClick={() => handleAuthNavigation('signup')}
                isAuthenticated={isAuthenticated}
                userProfile={userProfile}
              />
              <WriteReview />
            </>
          } />

          <Route path="/ask-question/:universityId" element={
            <>
              <Navbar 
                onLoginClick={() => handleAuthNavigation('login')}
                onSignupClick={() => handleAuthNavigation('signup')}
                isAuthenticated={isAuthenticated}
                userProfile={userProfile}
              />
              <AskQuestion />
            </>
          } />

          {/* User Profile Page */}
          <Route path="/profile" element={
            <>
              <Navbar 
                onLoginClick={() => handleAuthNavigation('login')}
                onSignupClick={() => handleAuthNavigation('signup')}
                isAuthenticated={isAuthenticated}
                userProfile={userProfile}
              />
              <UserProfilePage 
                userProfile={userProfile}
                onProfileUpdate={setUserProfile}
              />
            </>
          } />

          {/* Contact Us Page */}
          <Route path="/contact" element={
            <>
              <Navbar 
                onLoginClick={() => handleAuthNavigation('login')}
                onSignupClick={() => handleAuthNavigation('signup')}
                isAuthenticated={isAuthenticated}
                userProfile={userProfile}
              />
              <ContactUsPage 
                userProfile={userProfile}
                isAuthenticated={isAuthenticated}
              />
            </>
          } />

          {/* About Us Page */}
          <Route path="/about" element={
            <>
              <Navbar 
                onLoginClick={() => handleAuthNavigation('login')}
                onSignupClick={() => handleAuthNavigation('signup')}
                isAuthenticated={isAuthenticated}
                userProfile={userProfile}
              />
              <AboutUsPage />
              <Footer />
            </>
          } />

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>

        {/* Unified AI Assistant - Available on all pages */}
        <UnifiedAssistant 
          isAuthenticated={isAuthenticated}
          userProfile={userProfile}
        />
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
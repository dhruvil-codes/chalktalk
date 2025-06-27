import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhatsInside from './components/WhatsInside';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import JoinCommunity from './components/JoinCommunity';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import LoginScreen from './components/auth/LoginScreen';
import SignupScreen from './components/auth/SignupScreen';
import RoleSelectionScreen from './components/auth/RoleSelectionScreen';
import ProfileSetupFlow from './components/profile/ProfileSetupFlow';
import UniversityListingPage from './pages/UniversityListingPage';
import UserProfilePage from './pages/UserProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import UnifiedAssistant from './components/UnifiedAssistant';
import BoltBadge from './components/BoltBadge'; // ✅ Bolt badge
import { UserProfile, ProfileSetupData } from './types/profile';

type AuthScreen = 'login' | 'signup' | 'role-selection' | 'profile-setup' | null;

function AppContent() {
  const [currentAuthScreen, setCurrentAuthScreen] = useState<AuthScreen>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
  // const location = useLocation(); // <-- Removed unused variable

  const handleAuthNavigation = (screen: AuthScreen) => {
    setCurrentAuthScreen(screen);
  };

  const handleSignupComplete = () => {
    setCurrentAuthScreen('profile-setup');
    setIsAuthenticated(true);
  };

  const handleProfileSetupComplete = (profileData: ProfileSetupData) => {
    const newProfile: UserProfile = {
      id: 'user-' + Date.now(),
      email: 'user@example.com',
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
    setCurrentAuthScreen(null);

    localStorage.setItem('chalktalk_user_session', 'active');
    localStorage.setItem('chalktalk_user_role', profileData.role);

    const returnUrl = sessionStorage.getItem('chalktalk_return_url');
    if (returnUrl) {
      sessionStorage.removeItem('chalktalk_return_url');
      navigate(returnUrl);
    } else {
      navigate('/profile');
    }
  };

  const handleProfileSetupSkip = () => {
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
    setCurrentAuthScreen(null);

    localStorage.setItem('chalktalk_user_session', 'active');
    localStorage.setItem('chalktalk_user_role', 'aspirant');

    const returnUrl = sessionStorage.getItem('chalktalk_return_url');
    if (returnUrl) {
      sessionStorage.removeItem('chalktalk_return_url');
      navigate(returnUrl);
    } else {
      navigate('/profile');
    }
  };

  const handleLoginSuccess = () => {
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

    localStorage.setItem('chalktalk_user_session', 'active');
    localStorage.setItem('chalktalk_user_role', existingProfile.role);

    const returnUrl = sessionStorage.getItem('chalktalk_return_url');
    if (returnUrl) {
      sessionStorage.removeItem('chalktalk_return_url');
      navigate(returnUrl);
    } else {
      navigate('/profile');
    }
  };

  React.useEffect(() => {
    const hasSession = localStorage.getItem('chalktalk_user_session');
    const userRole = localStorage.getItem('chalktalk_user_role');

    if (hasSession && userRole) {
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

  React.useEffect(() => {
    const state = window.history.state;
    if (state?.showLoginModal && !isAuthenticated) {
      setCurrentAuthScreen('login');
    }
  }, [isAuthenticated]);

  if (currentAuthScreen === 'login') {
    return (
      <ErrorBoundary key="login">
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
      <ErrorBoundary key="signup">
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
      <ErrorBoundary key="role-selection">
        <RoleSelectionScreen 
          onComplete={handleSignupComplete}
          onBack={() => handleAuthNavigation('signup')}
        />
      </ErrorBoundary>
    );
  }

  if (currentAuthScreen === 'profile-setup') {
    return (
      <ErrorBoundary key="profile-setup">
        <ProfileSetupFlow 
          onComplete={handleProfileSetupComplete}
          onSkip={handleProfileSetupSkip}
          userProfile={userProfile}
        />
      </ErrorBoundary>
    );
  }

  // Remove ErrorBoundary from main return to expose the real error
  return (
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* All Routes as-is */}
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
          {/* ... Other routes (universities, profile, etc.) */}
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
      onProfileUpdate={updatedProfile =>
        setUserProfile(prev => prev ? { ...prev, ...updatedProfile } : prev)
      }
    />
  </>
} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>

        <BoltBadge /> {/* ✅ Bolt badge shown on all pages */}
        <UnifiedAssistant isAuthenticated={isAuthenticated} userProfile={userProfile} />
      </div>
  );
}

function App() {
  return (
    <MantineProvider>
      <Router>
        <AppContent />
      </Router>
    </MantineProvider>
  );
}

export default App;
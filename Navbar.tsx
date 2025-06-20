import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Menu, X, User, Bell, ChevronDown, Trash2, Check, Clock, MessageSquare, Heart, UserPlus, AtSign, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types/profile';

interface NavbarProps {
  onLoginClick: () => void;
  onSignupClick?: () => void;
  isAuthenticated?: boolean;
  userProfile?: UserProfile | null;
}

interface Notification {
  id: string;
  type: 'reply' | 'like' | 'system' | 'mention' | 'follow';
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  avatar?: string;
}

// Mock notifications data
const mockNotifications: { today: Notification[], thisWeek: Notification[] } = {
  today: [
    {
      id: '1',
      type: 'reply',
      message: 'Sarah replied to your question about Harvard admissions',
      timestamp: '2 hours ago',
      read: false,
      link: '/questions/1',
      avatar: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
    },
    {
      id: '2',
      type: 'like',
      message: '5 people liked your MIT review',
      timestamp: '4 hours ago',
      read: false,
      link: '/reviews/2'
    },
    {
      id: '3',
      type: 'mention',
      message: 'Alex mentioned you in a Stanford discussion',
      timestamp: '6 hours ago',
      read: true,
      link: '/discussions/3',
      avatar: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
    },
    {
      id: '4',
      type: 'system',
      message: 'Your profile is now 100% complete!',
      timestamp: '8 hours ago',
      read: true,
      link: '/profile'
    },
    {
      id: '5',
      type: 'follow',
      message: 'Emma started following you',
      timestamp: '10 hours ago',
      read: true,
      link: '/profile/emma',
      avatar: 'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
    }
  ],
  thisWeek: [
    {
      id: '6',
      type: 'reply',
      message: 'New answer to your Cambridge question',
      timestamp: '2 days ago',
      read: true,
      link: '/questions/6'
    },
    {
      id: '7',
      type: 'like',
      message: 'Your Oxford review got 10 new likes',
      timestamp: '3 days ago',
      read: true,
      link: '/reviews/7'
    },
    {
      id: '8',
      type: 'system',
      message: 'Weekly digest: 25 new reviews this week',
      timestamp: '4 days ago',
      read: true,
      link: '/digest'
    },
    {
      id: '9',
      type: 'mention',
      message: 'You were mentioned in a Toronto discussion',
      timestamp: '5 days ago',
      read: true,
      link: '/discussions/9'
    },
    {
      id: '10',
      type: 'follow',
      message: '3 new followers this week',
      timestamp: '6 days ago',
      read: true,
      link: '/followers'
    }
  ]
};

export default function Navbar({ onLoginClick, onSignupClick, isAuthenticated = false, userProfile }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.notifications-dropdown') && !target.closest('.notifications-trigger')) {
        setShowNotifications(false);
      }
      if (!target.closest('.user-menu-dropdown') && !target.closest('.user-menu-trigger')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'Universities', href: '/universities' },
    { label: 'Compare', href: '/compare' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];

  const isHomePage = location.pathname === '/';

  const handleSignupClick = () => {
    if (onSignupClick) {
      onSignupClick();
    }
  };

  const handleSignOut = () => {
    setShowUserMenu(false);
    
    // Clear user session data
    localStorage.removeItem('chalktalk_user_session');
    localStorage.removeItem('chalktalk_user_role');
    localStorage.removeItem('chalktalk_user_email');
    sessionStorage.clear();
    
    // Reload the page to reset the app state
    window.location.href = '/';
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reply':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'system':
        return <AlertCircle className="h-4 w-4 text-green-500" />;
      case 'mention':
        return <AtSign className="h-4 w-4 text-purple-500" />;
      case 'follow':
        return <UserPlus className="h-4 w-4 text-indigo-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const markAsRead = (notificationId: string, section: 'today' | 'thisWeek') => {
    setNotifications(prev => ({
      ...prev,
      [section]: prev[section].map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    }));
  };

  const deleteNotification = (notificationId: string, section: 'today' | 'thisWeek') => {
    setNotifications(prev => ({
      ...prev,
      [section]: prev[section].filter(notif => notif.id !== notificationId)
    }));
  };

  const markAllAsRead = () => {
    setNotifications(prev => ({
      today: prev.today.map(notif => ({ ...notif, read: true })),
      thisWeek: prev.thisWeek.map(notif => ({ ...notif, read: true }))
    }));
  };

  const unreadCount = notifications.today.filter(n => !n.read).length + 
                     notifications.thisWeek.filter(n => !n.read).length;

  const getUserDisplayName = () => {
    if (!userProfile) return 'Profile';
    return `${userProfile.firstName} ${userProfile.lastName}`;
  };

  const getUserInitials = () => {
    if (!userProfile) return 'U';
    return `${userProfile.firstName.charAt(0)}${userProfile.lastName.charAt(0)}`;
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage
          ? 'bg-white/95 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-heading font-bold text-gray-900">ChalkTalk</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-gray-600 hover:text-primary-500 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && userProfile ? (
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="notifications-trigger relative p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="notifications-dropdown absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                      {/* Header */}
                      <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Notifications Content */}
                      <div className="max-h-96 overflow-y-auto">
                        {/* Today Section */}
                        {notifications.today.length > 0 && (
                          <div className="border-b border-gray-100">
                            <div className="px-4 py-3 bg-gray-50">
                              <h4 className="text-sm font-medium text-gray-700">Today</h4>
                            </div>
                            <div className="divide-y divide-gray-100">
                              {notifications.today.slice(0, 5).map((notification) => (
                                <div
                                  key={notification.id}
                                  className={`group relative p-4 hover:bg-gray-50 transition-colors ${
                                    !notification.read ? 'bg-blue-50' : ''
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    {/* Avatar or Icon */}
                                    <div className="flex-shrink-0">
                                      {notification.avatar ? (
                                        <img
                                          src={notification.avatar}
                                          alt=""
                                          className="w-8 h-8 rounded-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                          {getNotificationIcon(notification.type)}
                                        </div>
                                      )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm text-gray-900 line-clamp-2 mb-1">
                                        {notification.message}
                                      </p>
                                      <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Clock className="h-3 w-3" />
                                        <span>{notification.timestamp}</span>
                                      </div>
                                    </div>

                                    {/* Unread Indicator */}
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {!notification.read && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            markAsRead(notification.id, 'today');
                                          }}
                                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                          title="Mark as read"
                                        >
                                          <Check className="h-3 w-3" />
                                        </button>
                                      )}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteNotification(notification.id, 'today');
                                        }}
                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                        title="Delete"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Click overlay */}
                                  {notification.link && (
                                    <Link
                                      to={notification.link}
                                      className="absolute inset-0"
                                      onClick={() => setShowNotifications(false)}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* This Week Section */}
                        {notifications.thisWeek.length > 0 && (
                          <div>
                            <div className="px-4 py-3 bg-gray-50">
                              <h4 className="text-sm font-medium text-gray-700">This Week</h4>
                            </div>
                            <div className="divide-y divide-gray-100">
                              {notifications.thisWeek.slice(0, 5).map((notification) => (
                                <div
                                  key={notification.id}
                                  className={`group relative p-4 hover:bg-gray-50 transition-colors ${
                                    !notification.read ? 'bg-blue-50' : ''
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    {/* Avatar or Icon */}
                                    <div className="flex-shrink-0">
                                      {notification.avatar ? (
                                        <img
                                          src={notification.avatar}
                                          alt=""
                                          className="w-8 h-8 rounded-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                          {getNotificationIcon(notification.type)}
                                        </div>
                                      )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm text-gray-900 line-clamp-2 mb-1">
                                        {notification.message}
                                      </p>
                                      <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Clock className="h-3 w-3" />
                                        <span>{notification.timestamp}</span>
                                      </div>
                                    </div>

                                    {/* Unread Indicator */}
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {!notification.read && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            markAsRead(notification.id, 'thisWeek');
                                          }}
                                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                          title="Mark as read"
                                        >
                                          <Check className="h-3 w-3" />
                                        </button>
                                      )}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteNotification(notification.id, 'thisWeek');
                                        }}
                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                        title="Delete"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Click overlay */}
                                  {notification.link && (
                                    <Link
                                      to={notification.link}
                                      className="absolute inset-0"
                                      onClick={() => setShowNotifications(false)}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Empty State */}
                        {notifications.today.length === 0 && notifications.thisWeek.length === 0 && (
                          <div className="p-8 text-center">
                            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No notifications yet</p>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="p-3 border-t border-gray-200 bg-gray-50">
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                        >
                          See all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="user-menu-trigger flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {userProfile?.avatar ? (
                        <img
                          src={userProfile.avatar}
                          alt={getUserDisplayName()}
                          className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {getUserInitials()}
                        </div>
                      )}
                      <span className="font-medium hidden lg:block">{getUserDisplayName()}</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="user-menu-dropdown absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4" />
                        View Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                      >
                        <X className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <button 
                  onClick={onLoginClick}
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  Login
                </button>
                <button 
                  onClick={handleSignupClick}
                  className="bg-primary-500 text-white px-6 py-2.5 rounded-lg hover:bg-primary-600 transition-all transform hover:scale-105 font-medium shadow-lg"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="block text-gray-600 hover:text-primary-500 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {isAuthenticated && userProfile ? (
                  <>
                    <div className="flex items-center gap-3 py-2">
                      {userProfile.avatar ? (
                        <img
                          src={userProfile.avatar}
                          alt={getUserDisplayName()}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-medium">
                          {getUserInitials()}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{getUserDisplayName()}</p>
                        <p className="text-sm text-gray-500 capitalize">{userProfile.role.replace('-', ' ')}</p>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      View Profile
                    </Link>
                    <button 
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
                    >
                      <Bell className="h-5 w-5" />
                      Notifications
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    <button 
                      onClick={() => {
                        setIsOpen(false);
                        handleSignOut();
                      }}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors font-medium"
                    >
                      <X className="h-5 w-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        onLoginClick();
                        setIsOpen(false);
                      }}
                      className="block w-full text-left text-gray-600 hover:text-gray-900 transition-colors font-medium"
                    >
                      Login
                    </button>
                    <button 
                      onClick={() => {
                        handleSignupClick();
                        setIsOpen(false);
                      }}
                      className="block w-full bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium text-center"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
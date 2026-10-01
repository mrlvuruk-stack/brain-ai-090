import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  FileText,
  Users,
  Activity,
  HeartPulse,
  AlertTriangle,
  LayoutDashboard,
  ArrowLeft,
  Menu,
  X,
  ShieldCheck,
  Bell,
  Globe,
  Sliders,
  ChevronDown,
  Check,
  ShieldAlert,
  History,
  User,
  Target,
  Search,
  GitBranch,
} from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';
import { IconButton } from '../ui/IconButton';
import { Container } from '../ui/Container';
import { UnifiedSearchModal } from '../common/UnifiedSearchModal';
import { usePrototype } from '../../state';
import { demoProfiles } from '../../data/demoData';
import './PrototypeShell.css';

export interface PrototypeShellProps {
  children: React.ReactNode;
  activeModuleName?: string;
}

export const PrototypeShell: React.FC<PrototypeShellProps> = ({
  children,
  activeModuleName,
}) => {
  const navigate = useNavigate();
  const {
    currentProfileId,
    currentProfile,
    setProfileId,
    language,
    toggleLanguage,
    elderlyMode,
    toggleElderlyMode,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    setIsSearchOpen,
  } = usePrototype();

  const isHindi = language === 'hi';

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click and Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target as Node)
      ) {
        setNotifDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileDropdownOpen(false);
        setNotifDropdownOpen(false);
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  const navItems = [
    {
      to: '/prototype',
      end: true,
      labelEn: 'Overview & Vitals',
      labelHi: 'अवलोकन व वाइटल्स',
      shortLabelEn: 'Overview',
      shortLabelHi: 'अवलोकन',
      icon: <LayoutDashboard size={18} aria-hidden="true" />,
    },
    {
      to: '/prototype/journey',
      labelEn: 'Health Journey',
      labelHi: 'स्वास्थ्य यात्रा',
      shortLabelEn: 'Journey',
      shortLabelHi: 'यात्रा',
      icon: <History size={18} aria-hidden="true" />,
    },
    {
      to: '/prototype/intelligence',
      labelEn: 'Health Intelligence Center',
      labelHi: 'स्वास्थ्य बुद्धिमत्ता केंद्र',
      shortLabelEn: 'Intelligence',
      shortLabelHi: 'बुद्धिमत्ता',
      icon: <Sparkles size={18} aria-hidden="true" />,
    },
    {
      to: '/prototype/patterns',
      labelEn: 'Health Pattern Explorer',
      labelHi: 'स्वास्थ्य पैटर्न अन्वेषक',
      shortLabelEn: 'Patterns',
      shortLabelHi: 'पैटर्न',
      icon: <GitBranch size={18} aria-hidden="true" />,
    },
    {
      to: '/prototype/summary',
      labelEn: 'Personal Health Summary',
      labelHi: 'व्यक्तिगत स्वास्थ्य सारांश',
      shortLabelEn: 'Summary',
      shortLabelHi: 'सारांश',
      icon: <FileText size={18} aria-hidden="true" />,
    },
    {
      to: '/prototype/reports',
      labelEn: 'Reports Library',
      labelHi: 'रिपोर्ट्स लाइब्रेरी',
      shortLabelEn: 'Reports',
      shortLabelHi: 'रिपोर्ट्स',
      icon: <FileText size={18} aria-hidden="true" />,
    },
    {
      to: '/prototype/report-analysis',
      labelEn: 'Demo Report Analysis',
      labelHi: 'डेमो रिपोर्ट विश्लेषण',
      shortLabelEn: 'Analysis',
      shortLabelHi: 'विश्लेषण',
      icon: <FileText size={18} aria-hidden="true" />,
    },
    {
      to: '/prototype/health-intelligence',
      labelEn: 'Biometric Trends',
      labelHi: 'बायोमेट्रिक रुझान',
      shortLabelEn: 'Trends',
      shortLabelHi: 'रुझान',
      icon: <Activity size={18} aria-hidden="true" />,
    },
    {
      to: '/prototype/goals',
      labelEn: 'Health & Wellness Goals',
      labelHi: 'कल्याण लक्ष्य',
      shortLabelEn: 'Goals',
      shortLabelHi: 'लक्ष्य',
      icon: <Target size={18} aria-hidden="true" />,
    },
    {
      to: '/prototype/profile',
      labelEn: 'Health Profile',
      labelHi: 'स्वास्थ्य प्रोफ़ाइल',
      shortLabelEn: 'Profile',
      shortLabelHi: 'प्रोफ़ाइल',
      icon: <User size={18} aria-hidden="true" />,
    },
    {
      to: '/prototype/assistant',
      labelEn: 'AI Health Assistant',
      labelHi: 'AI स्वास्थ्य सहायक',
      shortLabelEn: 'Assistant',
      shortLabelHi: 'सहायक',
      icon: <Sparkles size={18} aria-hidden="true" />,
      isAssistant: true,
    },
    {
      to: '/prototype/family',
      labelEn: 'Family Health Circle',
      labelHi: 'पारिवारिक स्वास्थ्य',
      shortLabelEn: 'Family',
      shortLabelHi: 'परिवार',
      icon: <Users size={18} aria-hidden="true" />,
    },
    {
      to: '/prototype/wellness',
      labelEn: 'Wellness & Ayurveda',
      labelHi: 'कल्याण एवं योग',
      shortLabelEn: 'Wellness',
      shortLabelHi: 'कल्याण',
      icon: <HeartPulse size={18} aria-hidden="true" />,
    },
    {
      to: '/prototype/emergency',
      labelEn: 'Emergency Support',
      labelHi: 'आपातकालीन सहायता',
      shortLabelEn: 'Emergency',
      shortLabelHi: 'आपातकाल',
      icon: <AlertTriangle size={18} aria-hidden="true" />,
      isEmergency: true,
    },
    {
      to: '/prototype/security',
      labelEn: 'Security & Consent',
      labelHi: 'सुरक्षा एवं सहमति',
      shortLabelEn: 'Security',
      shortLabelHi: 'सुरक्षा',
      icon: <ShieldCheck size={18} aria-hidden="true" />,
    },
  ];

  // Curated 6 primary targets for mobile bottom bar
  const mobileNavItems = [
    navItems[0], // Overview
    navItems[1], // Journey
    navItems[2], // Intelligence Center
    navItems[5], // Reports
    navItems[10], // Assistant
    navItems[13], // Emergency
  ];

  const handleNotificationClick = (notif: (typeof notifications)[0]) => {
    markNotificationRead(notif.id);
    setNotifDropdownOpen(false);
    if (notif.targetPath) {
      navigate(notif.targetPath);
    }
  };

  return (
    <div className={`sw-proto-shell ${elderlyMode ? 'sw-proto-shell--elderly' : ''}`}>
      {/* 1. Global Persistent Prototype Boundary Banner */}
      <header className="sw-proto-banner" role="banner">
        <div className="sw-proto-banner__inner">
          <div className="sw-proto-banner__left">
            <span className="sw-proto-banner__indicator">
              <span className="sw-proto-banner__dot" aria-hidden="true" />
              {isHindi ? 'प्रोटोटाइप • केवल सांकेतिक डेटा' : 'Prototype • Illustrative Data'}
            </span>
            <span className="sw-proto-banner__caption">
              {isHindi
                ? 'सिम्युलेटेड क्लिनिकल अनुभव · कोई वास्तविक चिकित्सा निदान नहीं'
                : 'Simulated Health Environment · Non-Diagnostic Educational Model'}
            </span>
          </div>

          <div className="sw-proto-banner__right">
            <RouterLink to="/" className="sw-proto-banner__return-link">
              <ArrowLeft size={13} aria-hidden="true" />
              <span>{isHindi ? 'मार्केटिंग वेबसाइट पर वापस जाएँ' : 'Back to Website'}</span>
            </RouterLink>
          </div>
        </div>
      </header>

      {/* 2. Main Application Workspace Layout */}
      <div className="sw-proto-layout">
        {/* Desktop & Tablet Sidebar */}
        <aside
          className={`sw-proto-sidebar ${sidebarOpen ? 'sw-proto-sidebar--open' : ''}`}
          aria-label={isHindi ? 'प्रोटोटाइप नेविगेशन' : 'Prototype Navigation'}
        >
          <div className="sw-proto-sidebar__header">
            <RouterLink to="/prototype" onClick={closeSidebar} className="sw-proto-sidebar__brand">
              <BrandLogo size="sm" showSubtitle />
            </RouterLink>
            <IconButton
              className="sw-proto-sidebar__close"
              aria-label={isHindi ? 'मेनू बंद करें' : 'Close navigation menu'}
              icon={<X size={20} />}
              onClick={closeSidebar}
            />
          </div>

          {/* Active Profile Info Box in Sidebar */}
          <div className="sw-proto-sidebar__profile">
            <div className="sw-proto-profile-avatar" aria-hidden="true">
              {currentProfile.avatarInitials}
            </div>
            <div className="sw-proto-profile-details">
              <span className="sw-proto-profile-name">{currentProfile.fullName}</span>
              <span className="sw-proto-profile-meta">
                {currentProfile.age} yrs · {currentProfile.gender} · {currentProfile.city}
              </span>
            </div>
          </div>

          {/* Navigation Links List */}
          <nav className="sw-proto-nav">
            <span className="sw-proto-nav__label">
              {isHindi ? 'प्रोटोटाइप मॉड्यूल' : 'PROTOTYPE MODULES'}
            </span>
            <ul className="sw-proto-nav__list">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `sw-proto-nav__link ${
                        isActive ? 'sw-proto-nav__link--active' : ''
                      } ${item.isEmergency ? 'sw-proto-nav__link--emergency' : ''} ${
                        item.isAssistant ? 'sw-proto-nav__link--assistant' : ''
                      }`
                    }
                  >
                    <span className="sw-proto-nav__icon">{item.icon}</span>
                    <span className="sw-proto-nav__text">
                      {isHindi ? item.labelHi : item.labelEn}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Persistent Safety & Study Note in Sidebar */}
          <div className="sw-proto-sidebar__notice">
            <div className="sw-proto-sidebar__notice-header">
              <ShieldAlert size={14} aria-hidden="true" />
              <span>{isHindi ? 'प्रोटोटाइप सीमा' : 'Simulated Boundary'}</span>
            </div>
            <p>
              {isHindi
                ? 'मध्य प्रदेश (इंदौर/उज्जैन) प्राथमिक स्वास्थ्य पायलट अध्ययन हेतु विकसित।'
                : 'Synthetic demo profile for Madhya Pradesh healthcare coordination study.'}
            </p>
          </div>
        </aside>

        {/* Sidebar Backdrop for Mobile view */}
        {sidebarOpen && (
          <div
            className="sw-proto-backdrop"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Main Content Area */}
        <div className="sw-proto-main-container">
          {/* Top Application Bar */}
          <header className="sw-proto-topbar">
            {/* Topbar Left: Mobile Menu Trigger + Breadcrumb */}
            <div className="sw-proto-topbar__left">
              <IconButton
                className="sw-proto-topbar__toggle"
                aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
                icon={<Menu size={20} />}
                onClick={toggleSidebar}
              />

              <div className="sw-proto-topbar__breadcrumbs">
                <span className="sw-proto-crumb-root">
                  {isHindi ? 'प्रोटोटाइप' : 'Prototype'}
                </span>
                <span className="sw-proto-crumb-sep">/</span>
                <span className="sw-proto-crumb-current">
                  {activeModuleName || (isHindi ? 'अवलोकन' : 'Overview')}
                </span>
              </div>
            </div>

            {/* Topbar Right: Search, Language, Elderly, Notifications, Profile */}
            <div className="sw-proto-topbar__right">
              {/* 0. Unified Health Search Trigger */}
              <button
                type="button"
                className="sw-proto-search-trigger"
                onClick={() => setIsSearchOpen(true)}
                title={isHindi ? 'रिकॉर्ड्स खोजें (Ctrl+K)' : 'Search health records (Ctrl+K)'}
                aria-label={isHindi ? 'रिकॉर्ड्स खोजें (Ctrl+K)' : 'Search health records (Ctrl+K)'}
              >
                <Search size={14} aria-hidden="true" />
                <span>{isHindi ? 'खोजें (Ctrl+K)' : 'Search (Ctrl+K)'}</span>
              </button>

              {/* 1. Language Toggle */}
              <button
                type="button"
                className="sw-proto-control-btn sw-proto-lang-btn"
                onClick={toggleLanguage}
                title={isHindi ? 'Switch to English' : 'हिंदी में बदलें'}
                aria-label={isHindi ? 'Switch to English' : 'हिंदी में बदलें'}
              >
                <Globe size={15} aria-hidden="true" />
                <span className="sw-proto-control-text">
                  {isHindi ? 'English' : 'हिन्दी'}
                </span>
              </button>

              {/* 2. Elderly Mode Toggle */}
              <button
                type="button"
                className={`sw-proto-control-btn sw-proto-elderly-btn ${
                  elderlyMode ? 'sw-proto-elderly-btn--active' : ''
                }`}
                onClick={toggleElderlyMode}
                title={
                  elderlyMode
                    ? 'Elderly Mode Active (Large targets)'
                    : 'Enable Elderly Mode (Larger targets & text)'
                }
                aria-pressed={elderlyMode}
              >
                <Sliders size={15} aria-hidden="true" />
                <span className="sw-proto-control-text">
                  {elderlyMode
                    ? (isHindi ? 'वरिष्ठ मोड ON' : 'Senior Mode ON')
                    : (isHindi ? 'वरिष्ठ मोड' : 'Senior Mode')}
                </span>
              </button>

              {/* 3. Notification Control Dropdown */}
              <div className="sw-proto-dropdown-container" ref={notifDropdownRef}>
                <button
                  type="button"
                  className="sw-proto-icon-control-btn"
                  onClick={() => {
                    setNotifDropdownOpen((prev) => !prev);
                    setProfileDropdownOpen(false);
                  }}
                  aria-label={
                    unreadNotificationCount > 0
                      ? `${unreadNotificationCount} unread notifications`
                      : 'Notifications'
                  }
                  aria-expanded={notifDropdownOpen}
                >
                  <Bell size={18} aria-hidden="true" />
                  {unreadNotificationCount > 0 && (
                    <span className="sw-proto-notif-badge">
                      {unreadNotificationCount}
                    </span>
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="sw-proto-dropdown-menu sw-proto-notif-menu" role="menu">
                    <div className="sw-proto-notif-menu-header">
                      <div>
                        <strong>{isHindi ? 'सूचनाएँ' : 'Notifications'}</strong>
                        <span className="sw-proto-notif-count">
                          {unreadNotificationCount}{' '}
                          {isHindi ? 'अपठित' : 'unread'}
                        </span>
                      </div>
                      {unreadNotificationCount > 0 && (
                        <button
                          type="button"
                          className="sw-proto-notif-mark-all"
                          onClick={markAllNotificationsRead}
                        >
                          {isHindi ? 'सभी पढ़ा हुआ मार्क करें' : 'Mark all read'}
                        </button>
                      )}
                    </div>

                    <div className="sw-proto-notif-list">
                      {notifications.map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          className={`sw-proto-notif-item ${
                            !n.read ? 'sw-proto-notif-item--unread' : ''
                          }`}
                          onClick={() => handleNotificationClick(n)}
                        >
                          <div className="sw-proto-notif-item-header">
                            <span className="sw-proto-notif-title">
                              {isHindi ? n.titleHi : n.title}
                            </span>
                            <span className="sw-proto-notif-time">{n.timestamp}</span>
                          </div>
                          <p className="sw-proto-notif-msg">
                            {isHindi ? n.messageHi : n.message}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Active Profile Switcher Dropdown */}
              <div className="sw-proto-dropdown-container" ref={profileDropdownRef}>
                <button
                  type="button"
                  className="sw-proto-profile-switch-btn"
                  onClick={() => {
                    setProfileDropdownOpen((prev) => !prev);
                    setNotifDropdownOpen(false);
                  }}
                  aria-expanded={profileDropdownOpen}
                  aria-label="Switch active demo profile"
                >
                  <div className="sw-proto-top-avatar" aria-hidden="true">
                    {currentProfile.avatarInitials}
                  </div>
                  <span className="sw-proto-top-profile-name">
                    {currentProfile.fullName}
                  </span>
                  <ChevronDown size={14} aria-hidden="true" />
                </button>

                {profileDropdownOpen && (
                  <div className="sw-proto-dropdown-menu sw-proto-profile-menu" role="menu">
                    <div className="sw-proto-profile-menu-header">
                      <span>{isHindi ? 'डेमो प्रोफ़ाइल बदलें' : 'Switch Demo Profile'}</span>
                    </div>

                    {Object.values(demoProfiles).map((p) => {
                      const isSelected = p.id === currentProfileId;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          className={`sw-proto-profile-option ${
                            isSelected ? 'sw-proto-profile-option--selected' : ''
                          }`}
                          onClick={() => {
                            setProfileId(p.id);
                            setProfileDropdownOpen(false);
                          }}
                        >
                          <div className="sw-proto-profile-option-avatar" aria-hidden="true">
                            {p.avatarInitials}
                          </div>
                          <div className="sw-proto-profile-option-info">
                            <span className="sw-proto-profile-option-name">{p.fullName}</span>
                            <span className="sw-proto-profile-option-sub">
                              {p.gender}, {p.age} yrs · {p.city}
                            </span>
                          </div>
                          {isSelected && <Check size={16} className="sw-proto-check-icon" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Module Content */}
          <main className="sw-proto-content">
            <Container size="xl">{children}</Container>
          </main>
        </div>
      </div>

      {/* 3. Mobile Bottom Navigation Bar (Intentional UX Pattern) */}
      <nav className="sw-proto-mobile-nav" aria-label="Mobile Bottom Navigation">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `sw-proto-mobile-nav__item ${
                isActive ? 'sw-proto-mobile-nav__item--active' : ''
              } ${item.isEmergency ? 'sw-proto-mobile-nav__item--emergency' : ''} ${
                item.isAssistant ? 'sw-proto-mobile-nav__item--assistant' : ''
              }`
            }
          >
            <span className="sw-proto-mobile-nav__icon">{item.icon}</span>
            <span className="sw-proto-mobile-nav__label">
              {isHindi ? item.shortLabelHi : item.shortLabelEn}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* 4. Unified Health Search Dialog Modal (Accessible Ctrl+K overlay) */}
      <UnifiedSearchModal />
    </div>
  );
};

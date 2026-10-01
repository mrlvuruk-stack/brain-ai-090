import React, { useState, useEffect } from 'react';
import { NavLink, Link as RouterLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, ShieldCheck, LayoutDashboard, FileText, Users, Activity, HeartPulse, AlertTriangle } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { Container } from '../ui/Container';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Track pathname to close mobile drawer on navigation
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setMobileMenuOpen(false);
  }

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="sw-navbar-header">
      <Container size="xl">
        <div className="sw-navbar">
          {/* Brand Wordmark & Mark */}
          <RouterLink to="/" className="sw-navbar__brand" aria-label="SwasthyaAI Home">
            <BrandLogo size="md" showSubtitle />
          </RouterLink>

          {/* Desktop Nav */}
          <nav className="sw-navbar__nav" aria-label="Primary Navigation">
            <NavLink
              to="/features"
              className={({ isActive }) =>
                `sw-navbar__link ${isActive ? 'sw-navbar__link--active' : ''}`
              }
            >
              Features
            </NavLink>
            <NavLink
              to="/prototype"
              className={({ isActive }) =>
                `sw-navbar__link ${isActive ? 'sw-navbar__link--active' : ''}`
              }
            >
              Prototype
            </NavLink>
            <NavLink
              to="/security"
              className={({ isActive }) =>
                `sw-navbar__link ${isActive ? 'sw-navbar__link--active' : ''}`
              }
            >
              Security
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `sw-navbar__link ${isActive ? 'sw-navbar__link--active' : ''}`
              }
            >
              About
            </NavLink>
          </nav>

          {/* Action CTA */}
          <div className="sw-navbar__actions">
            <RouterLink to="/prototype" tabIndex={-1} className="sw-navbar__cta-link">
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight size={14} aria-hidden="true" />}
              >
                Explore Prototype
              </Button>
            </RouterLink>

            {/* Accessible Mobile Menu Trigger */}
            <IconButton
              className="sw-navbar__mobile-toggle"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="sw-mobile-drawer"
              icon={mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            />
          </div>
        </div>
      </Container>

      {/* Intentional Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div
          id="sw-mobile-drawer"
          className="sw-mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Drawer"
        >
          <div className="sw-mobile-drawer__backdrop" onClick={() => setMobileMenuOpen(false)} />
          <div className="sw-mobile-drawer__panel sw-fade-in">
            <div className="sw-mobile-drawer__header">
              <BrandLogo size="sm" showSubtitle />
              <IconButton
                aria-label="Close menu"
                icon={<X size={20} />}
                onClick={() => setMobileMenuOpen(false)}
              />
            </div>

            <div className="sw-mobile-drawer__body">
              {/* Primary Marketing Pages */}
              <div className="sw-mobile-drawer__group">
                <span className="sw-mobile-drawer__label">PLATFORM</span>
                <nav className="sw-mobile-drawer__links">
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                      `sw-mobile-drawer__link ${isActive ? 'sw-mobile-drawer__link--active' : ''}`
                    }
                  >
                    Home Overview
                  </NavLink>
                  <NavLink
                    to="/features"
                    className={({ isActive }) =>
                      `sw-mobile-drawer__link ${isActive ? 'sw-mobile-drawer__link--active' : ''}`
                    }
                  >
                    Features &amp; Architecture
                  </NavLink>
                  <NavLink
                    to="/security"
                    className={({ isActive }) =>
                      `sw-mobile-drawer__link ${isActive ? 'sw-mobile-drawer__link--active' : ''}`
                    }
                  >
                    Privacy &amp; Security Concept
                  </NavLink>
                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      `sw-mobile-drawer__link ${isActive ? 'sw-mobile-drawer__link--active' : ''}`
                    }
                  >
                    About SwasthyaAI
                  </NavLink>
                </nav>
              </div>

              {/* Prototype Simulation Section */}
              <div className="sw-mobile-drawer__group">
                <span className="sw-mobile-drawer__label">INTERACTIVE PROTOTYPE</span>
                <nav className="sw-mobile-drawer__links">
                  <NavLink
                    to="/prototype"
                    end
                    className={({ isActive }) =>
                      `sw-mobile-drawer__link sw-mobile-drawer__link--sub ${isActive ? 'sw-mobile-drawer__link--active' : ''}`
                    }
                  >
                    <LayoutDashboard size={16} />
                    Overview &amp; Vitals
                  </NavLink>
                  <NavLink
                    to="/prototype/report-analysis"
                    className={({ isActive }) =>
                      `sw-mobile-drawer__link sw-mobile-drawer__link--sub ${isActive ? 'sw-mobile-drawer__link--active' : ''}`
                    }
                  >
                    <FileText size={16} />
                    Medical Report AI
                  </NavLink>
                  <NavLink
                    to="/prototype/family"
                    className={({ isActive }) =>
                      `sw-mobile-drawer__link sw-mobile-drawer__link--sub ${isActive ? 'sw-mobile-drawer__link--active' : ''}`
                    }
                  >
                    <Users size={16} />
                    Family Health Circle
                  </NavLink>
                  <NavLink
                    to="/prototype/health-intelligence"
                    className={({ isActive }) =>
                      `sw-mobile-drawer__link sw-mobile-drawer__link--sub ${isActive ? 'sw-mobile-drawer__link--active' : ''}`
                    }
                  >
                    <Activity size={16} />
                    Health Intelligence
                  </NavLink>
                  <NavLink
                    to="/prototype/wellness"
                    className={({ isActive }) =>
                      `sw-mobile-drawer__link sw-mobile-drawer__link--sub ${isActive ? 'sw-mobile-drawer__link--active' : ''}`
                    }
                  >
                    <HeartPulse size={16} />
                    Ayurveda &amp; Yoga
                  </NavLink>
                  <NavLink
                    to="/prototype/emergency"
                    className={({ isActive }) =>
                      `sw-mobile-drawer__link sw-mobile-drawer__link--sub ${isActive ? 'sw-mobile-drawer__link--active' : ''}`
                    }
                  >
                    <AlertTriangle size={16} color="var(--color-emergency)" />
                    Emergency Support
                  </NavLink>
                </nav>
              </div>
            </div>

            <div className="sw-mobile-drawer__footer">
              <RouterLink to="/prototype" tabIndex={-1}>
                <Button variant="primary" size="md" fullWidth rightIcon={<ArrowRight size={16} />}>
                  Explore Prototype
                </Button>
              </RouterLink>
              <div className="sw-mobile-drawer__safety-note">
                <ShieldCheck size={14} color="var(--color-primary)" />
                <span>Pilot Simulation · Indore &amp; Ujjain, MP</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MedicalDisclaimer } from '../ui/MedicalDisclaimer';
import './PageShell.css';

export interface PageShellProps {
  children: React.ReactNode;
}

export const PageShell: React.FC<PageShellProps> = ({ children }) => {
  return (
    <div className="sw-page-shell">
      {/* WCAG 2.2 Skip to content */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Top prototype safety banner */}
      <MedicalDisclaimer variant="banner" />

      {/* Main navigation */}
      <Navbar />

      {/* Primary content area */}
      <main id="main-content" className="sw-page-shell__main" tabIndex={-1}>
        {children}
      </main>

      {/* Site footer */}
      <Footer />
    </div>
  );
};

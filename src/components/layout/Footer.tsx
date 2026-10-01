import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container } from '../ui/Container';
import { BrandLogo } from '../ui/BrandLogo';
import { MedicalDisclaimer } from '../ui/MedicalDisclaimer';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="sw-footer">
      <Container size="xl">
        <div className="sw-footer__grid">
          {/* Brand & Mission */}
          <div className="sw-footer__col sw-footer__col--main">
            <BrandLogo size="md" showSubtitle />
            <p className="sw-footer__desc">
              A calm, trustworthy health-tech prototype designed for clinical report understanding, family health tracking, and wellness intelligence.
            </p>
            <div className="sw-footer__pilot">
              <span className="sw-footer__pilot-badge">Pilot Context</span>
              <span className="sw-footer__pilot-text">Indore &amp; Ujjain, Madhya Pradesh</span>
            </div>
          </div>

          {/* Marketing Navigation */}
          <div className="sw-footer__col">
            <h4 className="sw-footer__heading">Platform</h4>
            <ul className="sw-footer__links">
              <li><RouterLink to="/" className="sw-footer__link">Overview</RouterLink></li>
              <li><RouterLink to="/features" className="sw-footer__link">Core Features</RouterLink></li>
              <li><RouterLink to="/security" className="sw-footer__link">Privacy &amp; Security</RouterLink></li>
              <li><RouterLink to="/about" className="sw-footer__link">About the Mission</RouterLink></li>
            </ul>
          </div>

          {/* Prototype Modules */}
          <div className="sw-footer__col">
            <h4 className="sw-footer__heading">Simulated Prototype</h4>
            <ul className="sw-footer__links">
              <li><RouterLink to="/prototype" className="sw-footer__link">Prototype Shell</RouterLink></li>
              <li><RouterLink to="/prototype/report-analysis" className="sw-footer__link">Report Understanding</RouterLink></li>
              <li><RouterLink to="/prototype/family" className="sw-footer__link">Family Health Circles</RouterLink></li>
              <li><RouterLink to="/prototype/health-intelligence" className="sw-footer__link">Health Intelligence</RouterLink></li>
              <li><RouterLink to="/prototype/wellness" className="sw-footer__link">Ayurveda &amp; Yoga</RouterLink></li>
              <li><RouterLink to="/prototype/emergency" className="sw-footer__link">Emergency Support</RouterLink></li>
            </ul>
          </div>

          {/* Cultural & Linguistic Inclusivity */}
          <div className="sw-footer__col">
            <h4 className="sw-footer__heading">Linguistic Support</h4>
            <p className="sw-footer__text">
              Engineered for multilingual healthcare access across English and Hindi (<span className="sw-devanagari">हिन्दी</span>).
            </p>
            <div className="sw-footer__lang-pill">
              <span>English</span> · <span className="sw-devanagari">हिंदी में भी उपलब्ध</span>
            </div>
          </div>
        </div>

        {/* Clinical Disclaimer */}
        <div className="sw-footer__disclaimer">
          <MedicalDisclaimer variant="inline" />
        </div>

        {/* Bottom bar */}
        <div className="sw-footer__bottom">
          <p className="sw-footer__copyright">
            © {new Date().getFullYear()} SwasthyaAI Web Prototype. Built with visual restraint and accessibility principles.
          </p>
          <div className="sw-footer__meta">
            <span>Phase 0 — Foundational Architecture</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};

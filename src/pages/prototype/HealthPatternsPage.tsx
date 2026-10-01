import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitBranch, AlertCircle, ArrowLeft, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { PrototypeShell } from '../../components/layout/PrototypeShell';
import { usePrototype } from '../../state';
import { getHealthPatterns } from '../../data/intelligenceData';
import { HealthPatternCard } from '../../components/intelligence/HealthPatternCard';
import './HealthPatternsPage.css';

export const HealthPatternsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentProfile, currentProfileId, language } = usePrototype();
  const isHindi = language === 'hi';

  const patterns = getHealthPatterns(currentProfileId);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredPatterns = selectedFilter === 'all'
    ? patterns
    : patterns.filter((p) => p.category === selectedFilter);

  return (
    <PrototypeShell activeModuleName={isHindi ? 'स्वास्थ्य पैटर्न' : 'Pattern Explorer'}>
      <div className="sw-patterns-page">
        {/* Navigation Breadcrumb / Back */}
        <div className="sw-patterns-nav-row">
          <button
            type="button"
            className="sw-patterns-back-btn"
            onClick={() => navigate('/prototype/intelligence')}
            aria-label={isHindi ? 'बुद्धिमत्ता केंद्र पर वापस जाएं' : 'Back to Intelligence Center'}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>{isHindi ? 'बुद्धिमत्ता केंद्र पर वापस' : 'Back to Intelligence Center'}</span>
          </button>

          <span className="sw-patterns-badge sw-patterns-badge--notice">
            {isHindi ? 'गैर-कारण संबंध' : 'Non-Causal Relationship Explorer'}
          </span>
        </div>

        {/* Page Header */}
        <header className="sw-patterns-header">
          <div className="sw-patterns-header__icon" aria-hidden="true">
            <GitBranch size={28} />
          </div>
          <div className="sw-patterns-header__text">
            <div className="sw-patterns-header__tag-row">
              <span className="sw-patterns-tag">
                <Sparkles size={13} aria-hidden="true" />
                <span>{isHindi ? 'डेटा संबंध अन्वेषक' : 'Data Relationship Explorer'}</span>
              </span>
              <span className="sw-patterns-tag sw-patterns-tag--profile">
                {currentProfile.fullName}
              </span>
            </div>
            <h1 className="sw-patterns-header__title">
              {isHindi ? 'स्वास्थ्य पैटर्न अन्वेषक' : 'Health Pattern Explorer'}
            </h1>
            <p className="sw-patterns-header__subtitle">
              {isHindi
                ? 'विभिन्न स्वास्थ्य मेट्रिक्स, जीवनशैली की आदतों और रिपोर्ट तिथियों के बीच साथ-साथ दर्ज संबंधों का पारदर्शी अन्वेषण।'
                : 'Explore relationships observed alongside each other across your metrics, wellness routines, and laboratory dates without claiming causal effects.'}
            </p>
          </div>
        </header>

        {/* Core Non-Causal Foundation Banner */}
        <div className="sw-patterns-disclaimer-card" role="region" aria-labelledby="non-causal-title">
          <div className="sw-patterns-disclaimer-card__header">
            <AlertCircle size={18} className="sw-patterns-disclaimer-icon" aria-hidden="true" />
            <h2 id="non-causal-title" className="sw-patterns-disclaimer-title">
              {isHindi ? 'महत्वपूर्ण पारदर्शी सिद्धांत: सह-उपस्थिति बनाम कार्य-कारण' : 'Core Design Principle: Co-occurrence vs Causality'}
            </h2>
          </div>
          <p className="sw-patterns-disclaimer-text">
            {isHindi
              ? 'यह प्रोटोटाइप केवल उन पैटर्नों को दिखाता है जो एक ही समय अवधि में "साथ-साथ देखे गए" हैं। यह कभी यह दावा नहीं करता कि एक आदत (जैसे टहलना या योग) ने सीधे किसी बायोमेट्रिक माप (जैसे ग्लूकोज या रक्तचाप) को ठीक या परिवर्तित किया। यह केवल सूचना के संबंधों को प्रदर्शित करता है।'
              : 'The prototype only documents patterns that appeared during the same period ("observed alongside"). It does NOT claim clinical causality (e.g. "Yoga caused improvement" or "Exercise cured a condition"). It demonstrates information relationships in synthetic demo data.'}
          </p>
          <div className="sw-patterns-disclaimer-badges">
            <span className="sw-patterns-chip">
              <ShieldCheck size={13} aria-hidden="true" />
              <span>{isHindi ? 'शून्य चिकित्सीय कारणता' : 'No Causal Claims'}</span>
            </span>
            <span className="sw-patterns-chip">
              <Layers size={13} aria-hidden="true" />
              <span>{isHindi ? 'तुलनात्मक डेमो रिकॉर्ड्स' : 'Comparative Demo Records'}</span>
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="sw-patterns-filter-bar" role="tablist" aria-label={isHindi ? 'पैटर्न फ़िल्टर' : 'Pattern filters'}>
          <button
            type="button"
            role="tab"
            aria-selected={selectedFilter === 'all'}
            className={`sw-patterns-filter-btn ${selectedFilter === 'all' ? 'sw-patterns-filter-btn--active' : ''}`}
            onClick={() => setSelectedFilter('all')}
          >
            {isHindi ? `सभी पैटर्न (${patterns.length})` : `All Patterns (${patterns.length})`}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedFilter === 'sleep_movement'}
            className={`sw-patterns-filter-btn ${selectedFilter === 'sleep_movement' ? 'sw-patterns-filter-btn--active' : ''}`}
            onClick={() => setSelectedFilter('sleep_movement')}
          >
            {isHindi ? 'नींद एवं गतिशीलता' : 'Rest & Movement'}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedFilter === 'wellness_routine'}
            className={`sw-patterns-filter-btn ${selectedFilter === 'wellness_routine' ? 'sw-patterns-filter-btn--active' : ''}`}
            onClick={() => setSelectedFilter('wellness_routine')}
          >
            {isHindi ? 'दिनचर्या एवं माप' : 'Routine & Biometrics'}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedFilter === 'movement_goals'}
            className={`sw-patterns-filter-btn ${selectedFilter === 'movement_goals' ? 'sw-patterns-filter-btn--active' : ''}`}
            onClick={() => setSelectedFilter('movement_goals')}
          >
            {isHindi ? 'कल्याण लक्ष्य' : 'Wellness Goals'}
          </button>
        </div>

        {/* Patterns List */}
        <main className="sw-patterns-list">
          {filteredPatterns.length === 0 ? (
            <div className="sw-patterns-empty" role="status">
              <p className="sw-patterns-empty-text">
                {isHindi
                  ? 'चयनित श्रेणी के लिए कोई तुलनात्मक पैटर्न उपलब्ध नहीं है।'
                  : 'No comparative patterns available for the selected category.'}
              </p>
              <button
                type="button"
                className="sw-patterns-empty-btn"
                onClick={() => setSelectedFilter('all')}
              >
                {isHindi ? 'सभी पैटर्न देखें' : 'View All Patterns'}
              </button>
            </div>
          ) : (
            filteredPatterns.map((pat) => (
              <HealthPatternCard
                key={pat.id}
                pattern={pat}
                isHindi={isHindi}
              />
            ))
          )}
        </main>
      </div>
    </PrototypeShell>
  );
};

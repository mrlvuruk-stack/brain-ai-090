import React, { useState, useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Target,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Flame,
  Droplet,
  Wind,
  Moon,
  Sparkles,
  Info,
  History,
} from 'lucide-react';
import { PrototypeShell } from '../../components/layout/PrototypeShell';
import { Button } from '../../components/ui/Button';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { ContextualAskButton } from '../../components/intelligence/ContextualAskButton';
import { usePrototype } from '../../state';
import type { GoalCategory } from '../../data/journeyTypes';
import './HealthGoalsPage.css';

export const HealthGoalsPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, currentProfile, healthGoals, toggleGoalStatus } = usePrototype();
  const isHindi = language === 'hi';

  const [activeCategory, setActiveCategory] = useState<GoalCategory | 'all'>('all');

  const filteredGoals = useMemo(() => {
    if (activeCategory === 'all') return healthGoals;
    return healthGoals.filter((g) => g.category === activeCategory);
  }, [healthGoals, activeCategory]);

  const completedCount = healthGoals.filter((g) => g.completed).length;

  const getCategoryIcon = (cat: GoalCategory) => {
    switch (cat) {
      case 'movement':
        return <Flame size={13} aria-hidden="true" />;
      case 'hydration':
        return <Droplet size={13} aria-hidden="true" />;
      case 'breathing':
        return <Wind size={13} aria-hidden="true" />;
      case 'sleep':
        return <Moon size={13} aria-hidden="true" />;
      case 'dinacharya':
      default:
        return <Target size={13} aria-hidden="true" />;
    }
  };

  return (
    <PrototypeShell activeModuleName={isHindi ? 'कल्याण लक्ष्य' : 'Health Goals'}>
      <div className="sw-goals-page">
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: isHindi ? 'अवलोकन' : 'Overview', to: '/prototype' },
            { label: isHindi ? 'स्वास्थ्य यात्रा' : 'Health Journey', to: '/prototype/journey' },
            { label: isHindi ? 'कल्याण लक्ष्य' : 'Health Goals' },
          ]}
        />

        {/* Page Header */}
        <header className="sw-goals-page__header">
          <h1 className="sw-goals-page__title">
            {isHindi ? 'दैनिक स्वास्थ्य एवं कल्याण लक्ष्य' : 'Daily Health & Wellness Goals'}
          </h1>
          <p className="sw-goals-page__subtitle">
            {isHindi
              ? `${currentProfile.fullName} के लिए व्यक्तिगत जीवनशैली व दिनचर्या लक्ष्य। अपनी प्रगति ट्रैक करें और आदतों को सुदृढ़ बनाएं।`
              : `Personalized lifestyle and Dinacharya routines for ${currentProfile.fullName}. Track daily progress and build sustainable wellness habits.`}
          </p>
        </header>

        {/* Prototype Safeguard Banner */}
        <div className="sw-goals-page__disclaimer" role="note">
          <Info size={16} aria-hidden="true" />
          <div>
            <strong>{isHindi ? 'प्रोटोटाइप जीवनशैली लक्ष्य:' : 'Educational Lifestyle Targets:'}</strong>{' '}
            {isHindi
              ? 'ये लक्ष्य सामान्य कल्याण, प्राकृतिक दिनचर्या और आदतों के सांकेतिक मॉडल हैं। इन्हें चिकित्सकीय उपचार योजना अथवा नुस्खा न समझें।'
              : 'These goals represent supportive lifestyle routines and habit-building concepts. They do not constitute clinical treatment plans or medical prescriptions.'}
          </div>
        </div>

        {/* Category Tabs & Stats Summary */}
        <div className="sw-goals-page__tabs" role="tablist" aria-label="Goal Categories">
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === 'all'}
            className={`sw-goals-page__tab ${activeCategory === 'all' ? 'sw-goals-page__tab--active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            <span>{isHindi ? 'सभी लक्ष्य' : 'All Goals'}</span>
            <span style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>({completedCount}/{healthGoals.length} {isHindi ? 'पूर्ण' : 'done'})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === 'movement'}
            className={`sw-goals-page__tab ${activeCategory === 'movement' ? 'sw-goals-page__tab--active' : ''}`}
            onClick={() => setActiveCategory('movement')}
          >
            <Flame size={14} aria-hidden="true" />
            <span>{isHindi ? 'व्यायाम व गति (Movement)' : 'Movement'}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === 'hydration'}
            className={`sw-goals-page__tab ${activeCategory === 'hydration' ? 'sw-goals-page__tab--active' : ''}`}
            onClick={() => setActiveCategory('hydration')}
          >
            <Droplet size={14} aria-hidden="true" />
            <span>{isHindi ? 'उषापान व जल (Hydration)' : 'Hydration'}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === 'breathing'}
            className={`sw-goals-page__tab ${activeCategory === 'breathing' ? 'sw-goals-page__tab--active' : ''}`}
            onClick={() => setActiveCategory('breathing')}
          >
            <Wind size={14} aria-hidden="true" />
            <span>{isHindi ? 'प्राणायाम (Breathing)' : 'Breathing'}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === 'dinacharya'}
            className={`sw-goals-page__tab ${activeCategory === 'dinacharya' ? 'sw-goals-page__tab--active' : ''}`}
            onClick={() => setActiveCategory('dinacharya')}
          >
            <Target size={14} aria-hidden="true" />
            <span>{isHindi ? 'दिनचर्या (Routine)' : 'Dinacharya'}</span>
          </button>
        </div>

        {/* Goals Cards Grid */}
        <div className="sw-goals-page__grid">
          {filteredGoals.map((goal) => {
            return (
              <article
                key={goal.id}
                className={`sw-goal-card ${goal.completed ? 'sw-goal-card--completed' : ''}`}
              >
                {/* Top Badge & Toggle Button */}
                <div className="sw-goal-card__top">
                  <span className="sw-goal-card__category-badge">
                    {getCategoryIcon(goal.category)}
                    <span>{goal.category}</span>
                  </span>

                  <button
                    type="button"
                    className={`sw-goal-card__toggle-btn ${
                      goal.completed ? 'sw-goal-card__toggle-btn--done' : ''
                    }`}
                    onClick={() => toggleGoalStatus(goal.id)}
                    aria-label={
                      goal.completed
                        ? (isHindi ? 'लक्ष्य को अपूर्ण मार्क करें' : 'Mark goal as incomplete')
                        : (isHindi ? 'लक्ष्य को पूर्ण मार्क करें' : 'Mark goal as complete')
                    }
                  >
                    {goal.completed ? (
                      <>
                        <CheckCircle2 size={14} aria-hidden="true" />
                        <span>{isHindi ? 'संपन्न' : 'Done'}</span>
                      </>
                    ) : (
                      <>
                        <Circle size={14} aria-hidden="true" />
                        <span>{isHindi ? 'मार्क करें' : 'Check off'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Title & Description */}
                <h2 className="sw-goal-card__title">
                  {isHindi ? goal.titleHi : goal.titleEn}
                </h2>
                <p className="sw-goal-card__desc">
                  {isHindi ? goal.descriptionHi : goal.descriptionEn}
                </p>

                {/* Progress Meter */}
                <div className="sw-goal-card__meter-container">
                  <div className="sw-goal-card__meter-header">
                    <span className="sw-goal-card__meter-label">
                      {isHindi ? 'लक्ष्य प्रगति' : 'Current Progress'}
                    </span>
                    <span className="sw-goal-card__meter-value">
                      {goal.completed ? '100%' : `${goal.progressPercent}%`}
                    </span>
                  </div>

                  <div
                    className="sw-goal-card__progress-track"
                    role="progressbar"
                    aria-valuenow={goal.completed ? 100 : goal.progressPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${goal.titleEn} Progress`}
                  >
                    <div
                      className="sw-goal-card__progress-bar"
                      style={{ width: `${goal.completed ? 100 : goal.progressPercent}%` }}
                    />
                  </div>

                  <div className="sw-goal-card__meter-footer">
                    <span>
                      {goal.currentValue} / {goal.targetValue} {goal.unit}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={11} aria-hidden="true" />
                      {isHindi ? goal.frequencyHi : goal.frequencyEn}
                    </span>
                  </div>
                </div>

                  {/* Action Links & Cross-Feature Navigation */}
                  <div className="sw-goal-card__footer">
                    <RouterLink to="/prototype/wellness" className="sw-goal-card__link">
                      <Sparkles size={13} aria-hidden="true" />
                      <span>{isHindi ? 'कल्याण योजना देखें' : 'View Wellness Plan'}</span>
                    </RouterLink>

                    <RouterLink to="/prototype/journey" className="sw-goal-card__link">
                      <History size={13} aria-hidden="true" />
                      <span>{isHindi ? 'यात्रा में देखें' : 'In Journey'}</span>
                    </RouterLink>

                    <ContextualAskButton
                      context={{
                        sourceType: 'goal',
                        sourceTitleEn: goal.titleEn,
                        sourceTitleHi: goal.titleHi,
                        snippetEn: goal.descriptionEn,
                        snippetHi: goal.descriptionHi,
                        suggestedQuestions: [
                          {
                            questionEn: `How consistent has the routine "${goal.titleEn}" been?`,
                            questionHi: `दिनचर्या "${goal.titleHi}" कितनी नियमित रही है?`,
                            assistantQuery: `Explain the consistency and adherence of the goal "${goal.titleEn}".`,
                          },
                        ],
                      }}
                      labelEn="Ask about routine"
                      labelHi="दिनचर्या पर पूछें"
                      variant="ghost"
                      size="sm"
                    />
                  </div>
                </article>
            );
          })}
        </div>

        {/* Supportive Bottom Prompt */}
        <div
          style={{
            marginTop: 'var(--space-12)',
            padding: 'var(--space-6)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
          }}
        >
          <div>
            <h3 style={{ margin: '0 0 var(--space-1)', fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)' }}>
              {isHindi ? 'क्या अपनी दिनचर्या में कोई बदलाव चाहते हैं?' : 'Need guidance customizing your routine?'}
            </h3>
            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              {isHindi
                ? 'SwasthyaAI सहायक से पूछें कि कैसे ये लक्ष्य आपकी लैब रिपोर्ट और वाइटल्स से सामंजस्य रखते हैं।'
                : 'Ask SwasthyaAI how these habits connect with your sleep continuity and glucose levels.'}
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            rightIcon={<ArrowRight size={14} />}
            onClick={() => navigate('/prototype/assistant')}
          >
            {isHindi ? 'AI सहायक से पूछें' : 'Consult Assistant'}
          </Button>
        </div>
      </div>
    </PrototypeShell>
  );
};

import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Moon,
  Sun,
  Utensils,
  Flower2,
  Info,
} from 'lucide-react';
import { PrototypeShell } from '../../components/layout/PrototypeShell';
import { Heading, Text } from '../../components/ui/Typography';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { usePrototype } from '../../state';
import { demoWellnessRecommendations } from '../../data/demoData';
import './WellnessPage.css';

export const WellnessPage: React.FC = () => {
  const { language, addToast } = usePrototype();
  const isHindi = language === 'hi';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [completedHabitIds, setCompletedHabitIds] = useState<string[]>([]);

  const categories = [
    { id: 'all', labelEn: "All / Today's Routine", labelHi: 'सभी / आज की दिनचर्या' },
    { id: 'yoga', labelEn: 'Therapeutic Yoga', labelHi: 'योग व प्राणायाम' },
    { id: 'ayurveda', labelEn: 'Ayurveda & Agni', labelHi: 'आयुर्वेद व पाचन' },
    { id: 'nutrition', labelEn: 'Nutrition Pacing', labelHi: 'आहार व पोषण' },
    { id: 'sleep', labelEn: 'Sleep & Nidra', labelHi: 'निद्रा विश्राम' },
    { id: 'lifestyle', labelEn: 'Circadian Lifestyle', labelHi: 'दिनचर्या' },
  ];

  const filteredItems =
    activeCategory === 'all'
      ? demoWellnessRecommendations
      : demoWellnessRecommendations.filter((item) => item.category === activeCategory);

  const toggleCompleteHabit = (id: string, title: string) => {
    if (completedHabitIds.includes(id)) {
      setCompletedHabitIds((prev) => prev.filter((i) => i !== id));
      addToast(
        isHindi ? `${title}: पूर्णता चिह्न हटाया गया` : `${title}: Mark removed`,
        'info'
      );
    } else {
      setCompletedHabitIds((prev) => [...prev, id]);
      addToast(
        isHindi
          ? `${title}: आज की दिनचर्या में पूर्ण चिह्नित!`
          : `${title}: Logged as completed today!`,
        'success'
      );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'yoga':
        return <Flower2 size={16} aria-hidden="true" />;
      case 'ayurveda':
        return <Sparkles size={16} aria-hidden="true" />;
      case 'nutrition':
        return <Utensils size={16} aria-hidden="true" />;
      case 'sleep':
        return <Moon size={16} aria-hidden="true" />;
      case 'lifestyle':
      case 'today':
      default:
        return <Sun size={16} aria-hidden="true" />;
    }
  };

  return (
    <PrototypeShell activeModuleName={isHindi ? 'कल्याण एवं योग' : 'Wellness & Ayurveda'}>
      <div className="sw-wellness-page">
        {/* Header */}
        <div className="sw-proto-page-header">
          <div className="sw-proto-page-header__meta">
            <Badge variant="primary" size="sm" showDot>
              {isHindi ? 'समग्र भारतीय कल्याण' : 'Integrative Indian Wellness'}
            </Badge>
            <span className="sw-proto-page-header__sub">
              {isHindi
                ? 'शैक्षणिक स्वास्थ्य दिनचर्या · गैर-औषधीय सुझाव'
                : 'Educational Lifestyle Routines · Non-Prescriptive Guidance'}
            </span>
          </div>
          <Heading level={1} size="h3">
            {isHindi ? 'दैनिक दिनचर्या, आयुर्वेद व योग' : 'Ayurveda, Therapeutic Yoga & Daily Routine'}
          </Heading>
          <Text variant="secondary">
            {isHindi
              ? 'पारंपरिक भारतीय स्वास्थ्य विज्ञान और आधुनिक जीवनशैली का शालीन संगम। ये सुझाव सामान्य स्वास्थ्य संवर्धन हेतु हैं, किसी रोग के उपचार की गारंटी नहीं।'
              : 'Integrative lifestyle recommendations blending classical Dinacharya principles with metabolic pacing. Formatted for daily wellbeing.'}
          </Text>
        </div>

        {/* Category Tabs */}
        <div className="sw-wellness-tabs" role="tablist" aria-label="Wellness categories">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat.id}
              className={`sw-wellness-tab-btn ${
                activeCategory === cat.id ? 'sw-wellness-tab-btn--active' : ''
              }`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {isHindi ? cat.labelHi : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Wellness Cards List */}
        <div className="sw-wellness-grid">
          {filteredItems.map((item) => {
            const isCompleted = completedHabitIds.includes(item.id);

            return (
              <Card
                key={item.id}
                variant="default"
                padding="lg"
                className={`sw-wellness-card ${
                  isCompleted ? 'sw-wellness-card--completed' : ''
                }`}
              >
                {/* Card Header */}
                <div className="sw-wellness-card-head">
                  <div className="sw-wellness-card-badge-row">
                    <span className="sw-wellness-cat-pill">
                      {getCategoryIcon(item.category)}
                      <span>{item.category.toUpperCase()}</span>
                    </span>
                    <span className="sw-wellness-duration">
                      <Clock size={13} aria-hidden="true" />
                      <span>{item.duration}</span>
                    </span>
                  </div>

                  <Heading level={2} size="h5" className="sw-wellness-title">
                    {isHindi ? item.titleHi : item.title}
                  </Heading>
                </div>

                {/* 1. Purpose */}
                <div className="sw-wellness-section">
                  <span className="sw-wellness-section-label">
                    {isHindi ? 'उद्देश्य एवं लाभ:' : 'Purpose & Clinical Intent:'}
                  </span>
                  <p className="sw-wellness-purpose-text">{item.purpose}</p>
                </div>

                {/* 2. Suggested Activity */}
                <div className="sw-wellness-section">
                  <span className="sw-wellness-section-label">
                    {isHindi ? 'सुझाया गया अभ्यास:' : 'Suggested Activity:'}
                  </span>
                  <p className="sw-wellness-activity-text">{item.suggestedActivity}</p>
                </div>

                {/* 3. Description & Context */}
                <p className="sw-wellness-desc-text">{item.description}</p>

                {item.ayurvedicContext && (
                  <div className="sw-wellness-ayur-box">
                    <span className="sw-ayur-tag">
                      {isHindi ? 'आयुर्वेदिक सिद्धांत:' : 'Ayurvedic Principle:'}
                    </span>
                    <span className="sw-ayur-val">{item.ayurvedicContext}</span>
                  </div>
                )}

                {/* 4. Mandatory Safety Note */}
                <div className="sw-wellness-safety-box">
                  <ShieldAlert size={14} className="sw-safety-icon" aria-hidden="true" />
                  <div className="sw-safety-text">
                    <strong>{isHindi ? 'सुरक्षा टिप्पणी:' : 'Safety Note:'}</strong>
                    <span>{item.safetyNote}</span>
                  </div>
                </div>

                {/* Card Action: Interactive Simulation */}
                <div className="sw-wellness-card-foot">
                  <span className="sw-wellness-suitability">
                    {isHindi ? 'उपयुक्तता: ' : 'Suitability: '}
                    {item.suitability}
                  </span>

                  <Button
                    variant={isCompleted ? 'outline' : 'primary'}
                    size="sm"
                    onClick={() =>
                      toggleCompleteHabit(item.id, isHindi ? item.titleHi : item.title)
                    }
                    leftIcon={isCompleted ? <CheckCircle2 size={14} /> : undefined}
                  >
                    {isCompleted
                      ? (isHindi ? 'पूर्ण चिह्नित (हटाएँ)' : 'Completed Today')
                      : (isHindi ? 'अभ्यास पूर्ण दर्ज करें' : 'Log Habit Completed')}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Global Wellness Educational Disclaimer */}
        <div className="sw-report-disclaimer-box">
          <Info size={18} className="sw-disclaimer-icon" aria-hidden="true" />
          <div className="sw-disclaimer-content">
            <strong>
              {isHindi ? 'आयुष व कल्याण शैक्षिक सूचना' : 'Integrative Wellness Boundary'}
            </strong>
            <p>
              {isHindi
                ? 'यहाँ दिए गए योग व आयुर्वेदिक सुझाव सामान्य स्वास्थ्य संवर्धन के लिए हैं और किसी विशिष्ट रोगोपचार की गारंटी नहीं देते। किसी भी नई जड़ी-बूटी या तीव्र योग आसन से पहले अपने चिकित्सक से परामर्श लें।'
                : 'Lifestyle guidance is illustrative and educational. Recommendations do not guarantee treatment or replace individualized medical advice from licensed physicians or Ayurvedic practitioners.'}
            </p>
          </div>
        </div>
      </div>
    </PrototypeShell>
  );
};

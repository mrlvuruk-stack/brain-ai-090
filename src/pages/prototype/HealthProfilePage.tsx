import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Shield,
  Heart,
  Sliders,
  Users,
  Globe,
  Lock,
  ArrowRight,
  Sparkles,
  Clock,
  Eye,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { PrototypeShell } from '../../components/layout/PrototypeShell';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Heading } from '../../components/ui/Typography';
import { usePrototype } from '../../state';
import './HealthProfilePage.css';

export const HealthProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentProfile,
    currentProfileId,
    language,
    toggleLanguage,
    elderlyMode,
    toggleElderlyMode,
    familyMembers,
  } = usePrototype();

  const isHindi = language === 'hi';

  const wellnessInterests = currentProfileId === 'aarav'
    ? [
        { en: 'Glycemic Pacing', hi: 'ग्लाइसेमिक नियंत्रण' },
        { en: 'Post-Meal Shatapadi Walking', hi: 'भोजनोपरांत शतपदी' },
        { en: 'Anulom Vilom Pranayama', hi: 'अनुलोम विलोम प्राणायाम' },
        { en: 'Sleep Hygiene', hi: 'स्वस्थ निद्रा नियम' },
      ]
    : currentProfileId === 'meera'
    ? [
        { en: 'Maternal Nutrition', hi: 'मातृ पोषण' },
        { en: 'Restorative Meditation', hi: 'विश्राम ध्यान' },
        { en: 'Daily Hydration Tracking', hi: 'दैनिक जल सेवन' },
      ]
    : [
        { en: 'Senior Joint Mobility', hi: 'वरिष्ठ जोड़ गतिशीलता' },
        { en: 'Blood Pressure Monitoring', hi: 'रक्तचाप निगरानी' },
        { en: 'Salt-Paced Dinacharya', hi: 'संतुलित आहार व दिनचर्या' },
      ];

  const knownConditions = currentProfileId === 'aarav'
    ? [
        {
          nameEn: 'Demo glucose observation',
          nameHi: 'डेमो ग्लूकोज अवलोकन',
          status: 'warning',
          noteEn: 'Monitored via 30-day home glucometer logs.',
          noteHi: '30-दिवसीय ग्लूकोमीटर लॉग द्वारा निगरानी।',
        },
        {
          nameEn: 'Demo cardiovascular measurements',
          nameHi: 'डेमो कार्डियोवास्कुलर माप',
          status: 'normal',
          noteEn: 'Resting heart rate 72 bpm, BP 118/78 mmHg.',
          noteHi: 'विश्राम हृदय गति 72 bpm, रक्तचाप 118/78 mmHg।',
        },
      ]
    : currentProfileId === 'meera'
    ? [
        {
          nameEn: 'Demo hematology measurements',
          nameHi: 'डेमो रुधिर माप',
          status: 'normal',
          noteEn: 'Hemoglobin 14.6 g/dL, regular wellness logs.',
          noteHi: 'हीमोग्लोबिन 14.6 g/dL, नियमित कल्याण लॉग्स।',
        },
      ]
    : [
        {
          nameEn: 'Demo blood pressure observation',
          nameHi: 'डेमो रक्तचाप अवलोकन',
          status: 'warning',
          noteEn: 'Paced salt diet and evening rest tracking.',
          noteHi: 'संतुलित नमक आहार और शाम के विश्राम की निगरानी।',
        },
      ];

  return (
    <PrototypeShell activeModuleName={isHindi ? 'स्वास्थ्य प्रोफ़ाइल' : 'My Health Profile'}>
      <div className="sw-profile-page">
        {/* Header Section */}
        <header className="sw-profile-header">
          <div className="sw-profile-header__main">
            <div className="sw-profile-header__title-row">
              <div className="sw-profile-badge-icon" aria-hidden="true">
                <User size={20} />
              </div>
              <h1 className="sw-profile-title">
                {isHindi ? 'स्वास्थ्य प्रोफ़ाइल व सेटिंग्स' : 'Personal Health Profile'}
              </h1>
              <span className="sw-profile-boundary-tag">
                {isHindi ? 'प्रोटोटाइप • सांकेतिक रिकॉर्ड' : 'PROTOTYPE • DEMO PROFILE'}
              </span>
            </div>
            <p className="sw-profile-subtitle">
              {isHindi
                ? 'आपकी व्यक्तिगत स्वास्थ्य पहचान, बायोमार्कर संदर्भ, गोपनीयता सेटिंग्स और पारिवारिक संबंधों का समग्र विवरण।'
                : 'Comprehensive view of your synthetic demographic identity, clinical parameters, family sharing, and interface preferences.'}
            </p>
          </div>

          <div className="sw-profile-header__actions">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Clock size={14} />}
              onClick={() => navigate('/prototype/journey')}
            >
              {isHindi ? 'स्वास्थ्य यात्रा देखें' : 'View Health Journey'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Sparkles size={14} />}
              onClick={() => navigate('/prototype/assistant')}
            >
              {isHindi ? 'AI सहायक से पूछें' : 'Consult Assistant'}
            </Button>
          </div>
        </header>

        {/* 1. Identity & Demo Patient ID Card */}
        <section className="sw-profile-card" aria-labelledby="identity-heading">
          <div className="sw-profile-card__head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <User size={18} color="var(--color-primary)" />
              <Heading level={2} size="h5" id="identity-heading">
                {isHindi ? 'व्यक्तिगत पहचान व डिजिटल स्वास्थ्य आईडी' : 'Identity & Digital Health Record'}
              </Heading>
            </div>
            <Badge variant="primary" size="sm">
              {isHindi ? 'सक्रिय खाता' : 'Active Account'}
            </Badge>
          </div>

          <div className="sw-profile-identity-grid">
            <div className="sw-profile-avatar-large" aria-hidden="true">
              {currentProfile.avatarInitials}
            </div>

            <div className="sw-profile-identity-info">
              <div className="sw-profile-name-row">
                <strong className="sw-profile-display-name">{currentProfile.fullName}</strong>
                <span className="sw-profile-ehr-tag">
                  {`DEMO-${currentProfile.id.toUpperCase()}-001`}
                </span>
              </div>
              <p className="sw-profile-bio">
                {currentProfile.age} {isHindi ? 'वर्ष' : 'years'} · {currentProfile.gender} · {currentProfile.city}, {currentProfile.state}
              </p>

              <div className="sw-profile-tags-row">
                <span className="sw-profile-mini-tag">
                  <strong>{isHindi ? 'रक्त समूह: ' : 'Blood Group: '}</strong>
                  {currentProfile.bloodGroup}
                </span>
                <span className="sw-profile-mini-tag">
                  <strong>{isHindi ? 'पंजीकृत शहर: ' : 'City: '}</strong>
                  {currentProfile.city}
                </span>
                <span className="sw-profile-mini-tag">
                  <strong>{isHindi ? 'एलर्जी: ' : 'Allergies: '}</strong>
                  {currentProfile.allergies.join(', ')}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Health Context & Monitored Parameters */}
        <section className="sw-profile-card" aria-labelledby="context-heading">
          <div className="sw-profile-card__head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Heart size={18} color="var(--color-primary)" />
              <Heading level={2} size="h5" id="context-heading">
                {isHindi ? 'स्वास्थ्य संदर्भ व बायोमार्कर अवलोकन' : 'Health Context & Monitored Parameters'}
              </Heading>
            </div>
            <span className="sw-profile-card__subnote">
              {isHindi ? 'सांकेतिक नैदानिक अवलोकन' : 'Illustrative Clinical Parameters'}
            </span>
          </div>

          <div className="sw-profile-context-grid">
            {/* Known conditions */}
            <div className="sw-profile-subcol">
              <span className="sw-profile-subcol-title">
                {isHindi ? 'सांकेतिक स्वास्थ्य अवलोकन' : 'Illustrative Health Observations'}
              </span>
              <div className="sw-profile-cond-list">
                {knownConditions.map((cond, idx) => (
                  <div key={idx} className={`sw-profile-cond-item sw-profile-cond-item--${cond.status}`}>
                    {cond.status === 'warning' ? (
                      <AlertCircle size={16} className="sw-cond-icon sw-cond-icon--warning" />
                    ) : (
                      <CheckCircle2 size={16} className="sw-cond-icon sw-cond-icon--normal" />
                    )}
                    <div>
                      <strong className="sw-cond-name">
                        {isHindi ? cond.nameHi : cond.nameEn}
                      </strong>
                      <p className="sw-cond-note">
                        {isHindi ? cond.noteHi : cond.noteEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wellness Interests */}
            <div className="sw-profile-subcol">
              <span className="sw-profile-subcol-title">
                {isHindi ? 'कल्याण व दिनचर्या प्राथमिकताएं' : 'Wellness & Dinacharya Focus'}
              </span>
              <div className="sw-wellness-chips-wrap">
                {wellnessInterests.map((w, idx) => (
                  <span key={idx} className="sw-wellness-interest-chip">
                    <Sparkles size={12} aria-hidden="true" />
                    <span>{isHindi ? w.hi : w.en}</span>
                  </span>
                ))}
              </div>
              <p className="sw-profile-subcol-desc">
                {isHindi
                  ? 'पारंपरिक आयुर्वेद-प्रेरित जीवनशैली और दैनिक योग अभ्यास के प्रति पंजीकृत प्राथमिकताएं।'
                  : 'Selected integrative health routines informing your personalized wellness recommendations.'}
              </p>
            </div>
          </div>
        </section>

        {/* 3. Interface Preferences & Accessibility Settings */}
        <section className="sw-profile-card" aria-labelledby="preferences-heading">
          <div className="sw-profile-card__head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Sliders size={18} color="var(--color-primary)" />
              <Heading level={2} size="h5" id="preferences-heading">
                {isHindi ? 'इंटरफ़ेस प्राथमिकताएं व सुगमता' : 'Interface Preferences & Accessibility'}
              </Heading>
            </div>
          </div>

          <div className="sw-profile-prefs-grid">
            {/* Language Switcher Setting */}
            <div className="sw-pref-tile">
              <div className="sw-pref-tile__left">
                <Globe size={18} className="sw-pref-icon" />
                <div>
                  <strong className="sw-pref-title">
                    {isHindi ? 'प्राथमिक प्रदर्शन भाषा' : 'Display Language'}
                  </strong>
                  <p className="sw-pref-desc">
                    {isHindi
                      ? 'वर्तमान में हिन्दी चयनित है (Noto Sans Devanagari फॉन्ट सहित)'
                      : 'Currently set to English. Instant toggle to हिन्दी supported.'}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={toggleLanguage}>
                {isHindi ? 'Switch to English' : 'हिन्दी में बदलें'}
              </Button>
            </div>

            {/* Senior Mode Setting */}
            <div className="sw-pref-tile">
              <div className="sw-pref-tile__left">
                <Eye size={18} className="sw-pref-icon" />
                <div>
                  <strong className="sw-pref-title">
                    {isHindi ? 'वरिष्ठ सुगमता मोड' : 'Senior Accessibility Mode'}
                  </strong>
                  <p className="sw-pref-desc">
                    {isHindi
                      ? 'बड़े फॉन्ट्स, 60px टच टार्गेट्स और उच्च कंट्रास्ट'
                      : 'High-contrast typography, large ~60px tap targets, and simplified navigation.'}
                  </p>
                </div>
              </div>
              <Button
                variant={elderlyMode ? 'primary' : 'outline'}
                size="sm"
                onClick={toggleElderlyMode}
              >
                {elderlyMode ? (isHindi ? 'सक्रिय (चालू)' : 'Enabled') : (isHindi ? 'सक्रिय करें' : 'Enable')}
              </Button>
            </div>
          </div>
        </section>

        {/* 4. Family Circle Access & Consent */}
        <section className="sw-profile-card" aria-labelledby="family-heading">
          <div className="sw-profile-card__head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Users size={18} color="var(--color-primary)" />
              <Heading level={2} size="h5" id="family-heading">
                {isHindi ? 'पारिवारिक स्वास्थ्य संबंध व सहमति' : 'Family Circle & Medical Access Status'}
              </Heading>
            </div>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight size={13} />}
              onClick={() => navigate('/prototype/family')}
            >
              {isHindi ? 'अनुमतियाँ प्रबंधित करें' : 'Manage Family Access'}
            </Button>
          </div>

          <div className="sw-profile-family-list">
            {familyMembers.map((member) => (
              <div key={member.id} className="sw-profile-family-item">
                <div className="sw-family-avatar" aria-hidden="true">
                  {member.avatarInitials}
                </div>
                <div className="sw-family-info">
                  <strong className="sw-family-name">{member.name}</strong>
                  <span className="sw-family-rel">
                    {member.relationship} · {member.age} {isHindi ? 'वर्ष' : 'yrs'}
                  </span>
                </div>
                <div className="sw-family-access-badge">
                  <Badge
                    variant={member.medicalAccessState === 'Not shared' ? 'default' : 'primary'}
                    size="sm"
                  >
                    {member.medicalAccessState}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Privacy & Prototype Boundary Disclosures */}
        <section className="sw-profile-card sw-profile-card--privacy" aria-labelledby="privacy-heading">
          <div className="sw-profile-card__head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Lock size={18} color="var(--color-primary)" />
              <Heading level={2} size="h5" id="privacy-heading">
                {isHindi ? 'गोपनीयता संकल्पना व प्रोटोटाइप सीमाएं' : 'Privacy Concept & Prototype Boundaries'}
              </Heading>
            </div>
            <Button
              variant="outline"
              size="sm"
              rightIcon={<ArrowRight size={13} />}
              onClick={() => navigate('/prototype/security')}
            >
              {isHindi ? 'सुरक्षा पृष्ठ देखें' : 'Security Architecture'}
            </Button>
          </div>

          <div className="sw-profile-privacy-body">
            <p className="sw-privacy-statement">
              {isHindi
                ? 'प्रोटोटाइप प्रकटीकरण: यह इंटरफ़ेस एक ब्राउज़र-आधारित डिज़ाइन प्रदर्शन है। इसमें कोई वास्तविक रोगी डेटाबेस, क्लाउड सिंक, या बाहरी AI नेटवर्क कनेक्टेड नहीं है। सभी डेटा स्थानीय और सांकेतिक है।'
                : 'Prototype Disclosure: This application is a browser-only design simulation. No real electronic health records, external cloud lockers, or medical AI networks are active. All consent states represent client-side conceptual workflows.'}
            </p>
            <div className="sw-privacy-items-row">
              <span className="sw-privacy-item">
                <Shield size={13} />
                <span>{isHindi ? 'स्थानीय क्लाइंट सैंडबॉक्स' : 'Client-Side Sandbox'}</span>
              </span>
              <span className="sw-privacy-item">
                <Shield size={13} />
                <span>{isHindi ? 'समयबद्ध अनुमति नियंत्रण' : 'Time-Bound Consent Concept'}</span>
              </span>
              <span className="sw-privacy-item">
                <Shield size={13} />
                <span>{isHindi ? 'पूर्णतः गैर-नैदानिक' : 'Strictly Non-Diagnostic'}</span>
              </span>
            </div>
          </div>
        </section>
      </div>
    </PrototypeShell>
  );
};

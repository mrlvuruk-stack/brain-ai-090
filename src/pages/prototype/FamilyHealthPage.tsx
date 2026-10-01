import React, { useState, useEffect } from 'react';
import {
  Lock,
  Check,
  X,
  Clock,
  FileText,
  Activity,
  Pill,
  HeartPulse,
  Info,
} from 'lucide-react';
import { PrototypeShell } from '../../components/layout/PrototypeShell';
import { Heading, Text } from '../../components/ui/Typography';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { usePrototype } from '../../state';
import type { DemoFamilyMember } from '../../data/types';
import './FamilyHealthPage.css';

export const FamilyHealthPage: React.FC = () => {
  const { familyMembers, updateFamilyAccess, language } = usePrototype();
  const isHindi = language === 'hi';

  const [selectedMember, setSelectedMember] = useState<DemoFamilyMember | null>(null);

  // Drawer / modal edit state
  const [selectedScopes, setSelectedScopes] = useState<DemoFamilyMember['sharedScopes']>([]);
  const [selectedDuration, setSelectedDuration] = useState<DemoFamilyMember['accessDurationDays']>(30);

  const openMemberDetail = (member: DemoFamilyMember) => {
    setSelectedMember(member);
    setSelectedScopes([...member.sharedScopes]);
    setSelectedDuration(member.accessDurationDays);
  };

  const closeDrawer = () => {
    setSelectedMember(null);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedMember) {
        closeDrawer();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedMember]);

  const toggleScope = (scope: 'Reports' | 'Lab Results' | 'Health Metrics' | 'Medications') => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  const handleSaveAccess = () => {
    if (!selectedMember) return;
    const finalState: DemoFamilyMember['medicalAccessState'] =
      selectedScopes.length === 0
        ? 'Not shared'
        : selectedScopes.length === 4
        ? 'Shared (Full)'
        : 'Shared (Limited)';

    updateFamilyAccess(selectedMember.id, finalState, selectedScopes, selectedDuration);
    closeDrawer();
  };

  const handleRevokeAccess = () => {
    if (!selectedMember) return;
    updateFamilyAccess(selectedMember.id, 'Not shared', [], selectedDuration);
    closeDrawer();
  };

  const allScopes: Array<{
    id: 'Reports' | 'Lab Results' | 'Health Metrics' | 'Medications';
    labelEn: string;
    labelHi: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'Reports',
      labelEn: 'Illustrative Lab Reports',
      labelHi: 'सांकेतिक लैब रिपोर्ट',
      icon: <FileText size={16} />,
    },
    {
      id: 'Lab Results',
      labelEn: 'Numerical Lab Values',
      labelHi: 'लैब मापक मान',
      icon: <Activity size={16} />,
    },
    {
      id: 'Health Metrics',
      labelEn: 'Daily Vitals (BP, Glucose)',
      labelHi: 'दैनिक वाइटल्स (बीपी, शुगर)',
      icon: <HeartPulse size={16} />,
    },
    {
      id: 'Medications',
      labelEn: 'Prescriptions & Dosages',
      labelHi: 'दवाइयाँ एवं खुराक',
      icon: <Pill size={16} />,
    },
  ];

  return (
    <PrototypeShell activeModuleName={isHindi ? 'पारिवारिक स्वास्थ्य' : 'Family Health Circle'}>
      <div className="sw-family-page">
        {/* Header */}
        <div className="sw-proto-page-header">
          <div className="sw-proto-page-header__meta">
            <Badge variant="primary" size="sm" showDot>
              {isHindi ? 'मल्टी-जेनरेशनल केयर' : 'Multi-Generational Care'}
            </Badge>
            <span className="sw-proto-page-header__sub">
              {isHindi ? 'इंदौर व उज्जैन परिवार घेरा' : 'Indore & Ujjain Family Network'}
            </span>
          </div>
          <Heading level={1} size="h3">
            {isHindi ? 'पारिवारिक स्वास्थ्य एवं अनुमति प्रबंधन' : 'Family Health Circles & Access Control'}
          </Heading>
          <Text variant="secondary">
            {isHindi
              ? 'पारिवारिक संबंध होना स्वतः चिकित्सा डेटा पहुँच नहीं देता। प्रत्येक सदस्य की अनुमति को स्पष्ट और सीमित रखा जाता है।'
              : 'Family relationships are intentionally decoupled from medical data sharing. Grant or revoke granular diagnostic scopes on demand.'}
          </Text>
        </div>

        {/* Critical Distinction Banner */}
        <div className="sw-family-rule-banner">
          <div className="sw-family-rule-icon">
            <Lock size={18} aria-hidden="true" />
          </div>
          <div className="sw-family-rule-content">
            <strong>
              {isHindi
                ? 'मूल सिद्धांत: पारिवारिक संबंध ≠ चिकित्सा डेटा पहुँच'
                : 'Guiding Architectural Rule: Family Relationship ≠ Medical Data Access'}
            </strong>
            <p>
              {isHindi
                ? 'एक व्यक्ति आपका पारिवारिक सदस्य हो सकता है, लेकिन जब तक आप स्पष्ट अनुमति नहीं देते, उसका मेडिकल एक्सेस "साझा नहीं" रहता है।'
                : 'A family connection acknowledges kinship. Medical access requires explicit consent with specific scope and duration limits.'}
            </p>
          </div>
        </div>

        {/* Family Cards Grid */}
        <div className="sw-family-grid">
          {familyMembers.map((member) => {
            const isShared = member.medicalAccessState !== 'Not shared';

            return (
              <Card
                key={member.id}
                variant="default"
                padding="md"
                className="sw-family-card"
                onClick={() => openMemberDetail(member)}
              >
                {/* Top Info */}
                <div className="sw-family-card-head">
                  <div className="sw-family-card-avatar" aria-hidden="true">
                    {member.avatarInitials}
                  </div>
                  <div className="sw-family-card-info">
                    <strong className="sw-family-card-name">{member.name}</strong>
                    <span className="sw-family-card-age">
                      {member.age} yrs · {isHindi ? 'आयु वर्ग' : 'Age category'}
                    </span>
                  </div>
                </div>

                {/* Explicit Separation Display */}
                <div className="sw-family-distinction-box">
                  {/* Column 1: Family Relationship */}
                  <div className="sw-distinction-col">
                    <span className="sw-distinction-label">
                      {isHindi ? 'पारिवारिक संबंध:' : 'Family Relationship:'}
                    </span>
                    <strong className="sw-distinction-val">{member.relationship}</strong>
                  </div>

                  {/* Column 2: Medical Access State */}
                  <div className="sw-distinction-col">
                    <span className="sw-distinction-label">
                      {isHindi ? 'चिकित्सा डेटा पहुँच:' : 'Medical Data Access:'}
                    </span>
                    <Badge
                      variant={isShared ? 'primary' : 'default'}
                      size="sm"
                    >
                      {member.medicalAccessState}
                    </Badge>
                  </div>
                </div>

                {/* Shared Scopes Preview */}
                <div className="sw-family-card-scopes">
                  <span className="sw-scopes-label">
                    {isHindi ? 'अनुमति दायरे:' : 'Active Scopes:'}
                  </span>
                  <div className="sw-scopes-chips">
                    {member.sharedScopes.length > 0 ? (
                      member.sharedScopes.map((scope) => (
                        <span key={scope} className="sw-scope-chip">
                          {scope}
                        </span>
                      ))
                    ) : (
                      <span className="sw-scope-chip sw-scope-chip--none">
                        {isHindi ? 'कोई डेटा साझा नहीं' : 'No data shared'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Conditions / Medical Context */}
                <div className="sw-family-card-conditions">
                  <span className="sw-conditions-label">
                    {isHindi ? 'ज्ञात स्वास्थ्य स्थिति:' : 'Simulated Context:'}
                  </span>
                  <span className="sw-conditions-text">
                    {member.chronicConditions.join(', ')}
                  </span>
                </div>

                {/* Card Action */}
                <div className="sw-family-card-foot">
                  <span className="sw-family-last-updated">
                    {isHindi ? 'अद्यतन: ' : 'Updated: '}
                    {member.lastUpdated}
                  </span>
                  <Button variant="outline" size="sm">
                    {isHindi ? 'अनुमति प्रबंधित करें' : 'Manage Access'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Member Detail / Permission Drawer / Modal */}
        {selectedMember && (
          <div className="sw-drawer-backdrop" onClick={closeDrawer} role="dialog" aria-modal="true">
            <div
              className="sw-drawer-modal"
              onClick={(e) => e.stopPropagation()}
              aria-labelledby="drawer-title"
            >
              {/* Drawer Header */}
              <div className="sw-drawer-header">
                <div className="sw-drawer-header-info">
                  <div className="sw-drawer-avatar" aria-hidden="true">
                    {selectedMember.avatarInitials}
                  </div>
                  <div>
                    <Heading level={2} size="h4" id="drawer-title">
                      {selectedMember.name}
                    </Heading>
                    <span className="sw-drawer-sub">
                      {selectedMember.relationship} · {selectedMember.age} yrs · Indore Circle
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="sw-drawer-close"
                  onClick={closeDrawer}
                  aria-label="Close detail view"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="sw-drawer-body">
                {/* Distinction Highlight */}
                <div className="sw-drawer-distinction-highlight">
                  <div className="sw-drawer-dist-item">
                    <span className="sw-drawer-dist-label">
                      {isHindi ? 'पारिवारिक संबंध' : 'Family Relationship'}
                    </span>
                    <strong className="sw-drawer-dist-val">{selectedMember.relationship}</strong>
                  </div>
                  <div className="sw-drawer-dist-divider" aria-hidden="true">
                    ≠
                  </div>
                  <div className="sw-drawer-dist-item">
                    <span className="sw-drawer-dist-label">
                      {isHindi ? 'वर्तमान डेटा पहुँच' : 'Medical Access State'}
                    </span>
                    <Badge
                      variant={selectedMember.medicalAccessState === 'Not shared' ? 'default' : 'primary'}
                      size="sm"
                    >
                      {selectedMember.medicalAccessState}
                    </Badge>
                  </div>
                </div>

                {/* Health Information Note */}
                <div className="sw-drawer-section">
                  <span className="sw-drawer-section-title">
                    {isHindi ? 'स्वास्थ्य पृष्ठभूमि (सिम्युलेटेड):' : 'Health Background (Simulated):'}
                  </span>
                  <p className="sw-drawer-desc">
                    {selectedMember.chronicConditions.join(', ')}
                  </p>
                </div>

                {/* Interactive Scopes Selection */}
                <div className="sw-drawer-section">
                  <span className="sw-drawer-section-title">
                    {isHindi ? 'साझा किए जाने वाले दायरे चुनें:' : 'Select Permitted Scopes:'}
                  </span>
                  <div className="sw-drawer-scopes-list">
                    {allScopes.map((scope) => {
                      const isChecked = selectedScopes.includes(scope.id);
                      return (
                        <label
                          key={scope.id}
                          className={`sw-scope-checkbox-label ${
                            isChecked ? 'sw-scope-checkbox-label--active' : ''
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleScope(scope.id)}
                            className="sw-scope-checkbox"
                          />
                          <span className="sw-scope-icon">{scope.icon}</span>
                          <span className="sw-scope-name">
                            {isHindi ? scope.labelHi : scope.labelEn}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Duration Selection */}
                <div className="sw-drawer-section">
                  <span className="sw-drawer-section-title">
                    {isHindi ? 'पहुँच अवधि (समय सीमा):' : 'Access Duration (Time Window):'}
                  </span>
                  <div className="sw-drawer-duration-options">
                    {([7, 30, 90, 365] as const).map((days) => (
                      <button
                        key={days}
                        type="button"
                        className={`sw-duration-btn ${
                          selectedDuration === days ? 'sw-duration-btn--active' : ''
                        }`}
                        onClick={() => setSelectedDuration(days)}
                      >
                        <Clock size={13} aria-hidden="true" />
                        <span>
                          {days === 365
                            ? (isHindi ? '1 वर्ष' : '1 Year')
                            : `${days} ${isHindi ? 'दिन' : 'Days'}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sw-drawer-safety-note">
                  <Info size={14} aria-hidden="true" />
                  <span>
                    {isHindi
                      ? 'परिवर्तन स्थानीय प्रोटोटाइप स्थिति में सहेजे जाते हैं। कोई बाहरी डेटाबेस नहीं।'
                      : 'Changes take effect immediately in prototype local state. No cloud database.'}
                  </span>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="sw-drawer-footer">
                {selectedMember.medicalAccessState !== 'Not shared' && (
                  <Button variant="outline" size="sm" onClick={handleRevokeAccess}>
                    <Lock size={14} />
                    <span>{isHindi ? 'पहुँच समाप्त करें' : 'Revoke Access'}</span>
                  </Button>
                )}
                <Button variant="primary" size="sm" onClick={handleSaveAccess}>
                  <Check size={14} />
                  <span>{isHindi ? 'अनुमति सहेजें' : 'Save Access Scopes'}</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PrototypeShell>
  );
};

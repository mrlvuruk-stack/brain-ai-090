import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Smartphone,
  Users,
  FileCheck,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { PrototypeShell } from '../../components/layout/PrototypeShell';
import { Heading, Text } from '../../components/ui/Typography';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { usePrototype } from '../../state';
import './PrototypeSecurityPage.css';

export const PrototypeSecurityPage: React.FC = () => {
  const { currentProfile, familyMembers, language } = usePrototype();

  const isHindi = language === 'hi';

  const consentAuditLogs = [
    {
      id: 'log_01',
      action: isHindi ? 'पारिवारिक अनुमति अद्यतित' : 'Family access scope updated (Demo)',
      detail: isHindi ? 'सावित्री देवी को स्वास्थ्य मेट्रिक्स साझा किए गए' : 'Shared Health Metrics & Medications with Savitri Devi',
      timestamp: '24 Sep 2026, 08:30 IST',
      status: 'Active (Demo)',
    },
    {
      id: 'log_02',
      action: isHindi ? 'स्थानीय सत्र पूर्वावलोकन' : 'Local demo session initiated',
      detail: isHindi ? 'इंदौर (म.प्र.) से वेब ब्राउज़र सत्र सक्रिय' : 'Chrome on Windows · Indore, Madhya Pradesh',
      timestamp: '24 Sep 2026, 08:00 IST',
      status: 'Illustrative',
    },
    {
      id: 'log_03',
      action: isHindi ? 'प्रयोगशाला डेटा गोपनीयता सिमुलेशन' : 'Illustrative lab report loaded in local sandbox',
      detail: isHindi ? 'कोई क्लाउड स्टोरेज नहीं, केवल क्लाइंट-साइड व्याख्या' : 'Client-side simulation · No persistent cloud transit',
      timestamp: '12 Sep 2026, 14:15 IST',
      status: 'Prototype Only',
    },
  ];

  return (
    <PrototypeShell activeModuleName={isHindi ? 'सुरक्षा और गोपनीयता' : 'Security & Privacy'}>
      <div className="sw-proto-security-page">
        {/* Header */}
        <div className="sw-proto-page-header">
          <div className="sw-proto-page-header__meta">
            <Badge variant="normal" size="sm" showDot>
              {isHindi ? 'गोपनीयता शील्ड सक्रिय' : 'Privacy Sandbox Active'}
            </Badge>
            <span className="sw-proto-page-header__sub">
              {isHindi
                ? 'स्थानीय ब्राउज़र प्रोटोटाइप · कोई क्लाउड कनेक्शन नहीं'
                : 'Local Browser Prototype · No Cloud Connection'}
            </span>
          </div>
          <Heading level={1} size="h3">
            {isHindi ? 'सुरक्षा एवं डेटा नियंत्रण' : 'Security & Privacy Controls'}
          </Heading>
          <Text variant="secondary">
            {isHindi
              ? 'प्रोटोटाइप सुरक्षा अवधारणा: कोई बैकएंड डेटाबेस या वास्तविक प्रमाणीकरण नहीं है। यह स्क्रीन स्वास्थ्य गोपनीयता नियंत्रणों के इंटरफ़ेस मॉडल को प्रदर्शित करती है।'
              : 'Security Concept & Privacy Controls: No backend database or real authentication exists in this prototype. This view demonstrates illustrative privacy governance controls.'}
          </Text>
        </div>

        {/* Security Status Cards */}
        <div className="sw-proto-sec-grid">
          {/* Card 1: Device & Session */}
          <Card variant="default" padding="lg">
            <div className="sw-proto-sec-card-header">
              <div className="sw-proto-sec-icon-wrap sw-proto-sec-icon-wrap--primary">
                <Smartphone size={20} aria-hidden="true" />
              </div>
              <div>
                <Heading level={2} size="h5">
                  {isHindi ? 'डिवाइस और वर्तमान सत्र' : 'Device & Active Session'}
                </Heading>
                <span className="sw-proto-sec-sub">
                  {isHindi ? 'सिम्युलेटेड सत्र प्रबंधन' : 'Simulated Session Boundary'}
                </span>
              </div>
            </div>

            <div className="sw-proto-sec-card-body">
              <div className="sw-proto-sec-row">
                <span className="sw-proto-sec-label">{isHindi ? 'सक्रिय प्रोफ़ाइल' : 'Active Profile'}</span>
                <span className="sw-proto-sec-val">{currentProfile.fullName}</span>
              </div>
              <div className="sw-proto-sec-row">
                <span className="sw-proto-sec-label">{isHindi ? 'स्थान' : 'Location Context'}</span>
                <span className="sw-proto-sec-val">{currentProfile.city}, {currentProfile.state}</span>
              </div>
              <div className="sw-proto-sec-row">
                <span className="sw-proto-sec-label">{isHindi ? 'सत्र स्थिति' : 'Session State'}</span>
                <Badge variant="normal" size="sm">
                  {isHindi ? 'सुरक्षित स्थानीय ब्राउज़र' : 'Local Browser Only'}
                </Badge>
              </div>
              <div className="sw-proto-sec-row">
                <span className="sw-proto-sec-label">{isHindi ? 'डेटा प्रतिधारण' : 'Cloud Retention'}</span>
                <span className="sw-proto-sec-val sw-proto-sec-val--secure">
                  {isHindi ? 'प्रोटोटाइप में कोई क्लाउड कनेक्शन नहीं' : 'No cloud connection in this prototype'}
                </span>
              </div>
            </div>
          </Card>

          {/* Card 2: Privacy & Encryption */}
          <Card variant="default" padding="lg">
            <div className="sw-proto-sec-card-header">
              <div className="sw-proto-sec-icon-wrap sw-proto-sec-icon-wrap--success">
                <Lock size={20} aria-hidden="true" />
              </div>
              <div>
                <Heading level={2} size="h5">
                  {isHindi ? 'डेटा गोपनीयता और एन्क्रिप्शन' : 'Privacy & Token Architecture'}
                </Heading>
                <span className="sw-proto-sec-sub">
                  {isHindi ? 'सैद्धांतिक सुरक्षा मॉडल (प्रोटोटाइप)' : 'Simulated Concept (Prototype)'}
                </span>
              </div>
            </div>

            <div className="sw-proto-sec-card-body">
              <div className="sw-proto-sec-row">
                <span className="sw-proto-sec-label">{isHindi ? 'एन्क्रिप्शन स्तर' : 'Encryption Standard'}</span>
                <span className="sw-proto-sec-val">Security Concept · Not Implemented (Prototype)</span>
              </div>
              <div className="sw-proto-sec-row">
                <span className="sw-proto-sec-label">{isHindi ? 'फ़ाइल पारगमन' : 'File Ingestion'}</span>
                <span className="sw-proto-sec-val">{isHindi ? 'ब्राउज़र इन-मेमोरी पार्सिंग' : 'In-Browser Parsing'}</span>
              </div>
              <div className="sw-proto-sec-row">
                <span className="sw-proto-sec-label">{isHindi ? 'विज्ञापन या ट्रैकर' : 'Ad Tracking'}</span>
                <Badge variant="normal" size="sm">
                  {isHindi ? 'शून्य ट्रैकर' : 'Zero Trackers'}
                </Badge>
              </div>
              <div className="sw-proto-sec-row">
                <span className="sw-proto-sec-label">{isHindi ? 'अनुपालन लक्ष्य' : 'Target Framework'}</span>
                <span className="sw-proto-sec-val">DISHA / ABDM Architecture (Design Concept)</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Family Access Summary */}
        <Card variant="subtle" padding="lg" style={{ marginTop: 'var(--space-4)' }}>
          <div className="sw-proto-sec-card-header">
            <div className="sw-proto-sec-icon-wrap sw-proto-sec-icon-wrap--accent">
              <Users size={20} aria-hidden="true" />
            </div>
            <div>
              <Heading level={2} size="h5">
                {isHindi ? 'पारिवारिक स्वास्थ्य साझाकरण समीक्षा' : 'Family Access Scope Summary'}
              </Heading>
              <Text variant="secondary" style={{ fontSize: 'var(--text-xs)', margin: 0 }}>
                {isHindi
                  ? 'पारिवारिक संबंध और चिकित्सा डेटा की पहुँच अलग-अलग हैं।'
                  : 'Family relationships are separated from explicit medical access scopes.'}
              </Text>
            </div>
          </div>

          <div className="sw-proto-sec-family-list">
            {familyMembers.map((member) => (
              <div key={member.id} className="sw-proto-sec-family-item">
                <div className="sw-proto-sec-family-info">
                  <strong>{member.name}</strong>
                  <span className="sw-proto-sec-family-rel">{member.relationship}</span>
                </div>
                <div className="sw-proto-sec-family-status">
                  <Badge
                    variant={member.medicalAccessState === 'Not shared' ? 'default' : 'primary'}
                    size="sm"
                  >
                    {member.medicalAccessState}
                  </Badge>
                  <span className="sw-proto-sec-family-scopes">
                    {member.sharedScopes.length > 0
                      ? member.sharedScopes.join(', ')
                      : isHindi
                      ? 'कोई डेटा साझा नहीं'
                      : 'No scopes granted'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'flex-end' }}>
            <RouterLink to="/prototype/family">
              <Button variant="outline" size="sm">
                {isHindi ? 'पारिवारिक अनुमतियाँ प्रबंधित करें' : 'Manage Family Access'}
              </Button>
            </RouterLink>
          </div>
        </Card>

        {/* Consent & Audit Trail */}
        <div style={{ marginTop: 'var(--space-6)' }}>
          <div className="sw-proto-sec-section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <FileCheck size={18} color="var(--color-primary)" />
              <Heading level={2} size="h5">
                {isHindi ? 'सहमति ऑडिट लॉग' : 'Consent & Access Audit Trail'}
              </Heading>
            </div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
              {isHindi ? 'स्थानीय सिम्युलेटेड लॉग' : 'Client-side simulation records'}
            </span>
          </div>

          <div className="sw-proto-sec-log-table">
            {consentAuditLogs.map((log) => (
              <div key={log.id} className="sw-proto-sec-log-row">
                <div className="sw-proto-sec-log-main">
                  <span className="sw-proto-sec-log-action">{log.action}</span>
                  <span className="sw-proto-sec-log-detail">{log.detail}</span>
                </div>
                <div className="sw-proto-sec-log-meta">
                  <span className="sw-proto-sec-log-time">{log.timestamp}</span>
                  <Badge variant="normal" size="sm">
                    {log.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Link to Full Marketing Security Page */}
        <div className="sw-proto-sec-footer-banner">
          <div>
            <strong>{isHindi ? 'पूर्ण सुरक्षा वास्तुकला पढ़ें' : 'Read Our Full Security Framework'}</strong>
            <p>
              {isHindi
                ? 'हमारे विस्तृत सहमति मॉडल, बायोमेट्रिक सुरक्षा और डेटा संप्रभुता सिद्धांतों की समीक्षा करें।'
                : 'Explore our multi-tier consent model, edge-first processing, and data sovereignty safeguards.'}
            </p>
          </div>
          <RouterLink to="/security">
            <Button variant="outline" size="sm" rightIcon={<ExternalLink size={14} />}>
              {isHindi ? 'सुरक्षा पृष्ठ देखें' : 'View Security Page'}
            </Button>
          </RouterLink>
        </div>
      </div>
    </PrototypeShell>
  );
};

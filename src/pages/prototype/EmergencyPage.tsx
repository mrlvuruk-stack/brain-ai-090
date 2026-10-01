import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Phone,
  ShieldAlert,
  Pill,
  Users,
  CheckCircle2,
  X,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { PrototypeShell } from '../../components/layout/PrototypeShell';
import { Heading, Text } from '../../components/ui/Typography';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { usePrototype } from '../../state';
import { demoEmergencyProfile } from '../../data/demoData';
import './EmergencyPage.css';

export const EmergencyPage: React.FC = () => {
  const { currentProfile, language, addToast } = usePrototype();
  const isHindi = language === 'hi';

  const [simulationModalOpen, setSimulationModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && simulationModalOpen) {
        setSimulationModalOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [simulationModalOpen]);

  const copySimulatedSummary = () => {
    addToast(
      isHindi
        ? 'आपातकालीन सारांश क्लिपबोर्ड पर कॉपी हुआ (सिमुलेशन)'
        : 'Emergency medical summary copied to clipboard (Simulation)',
      'info'
    );
  };

  return (
    <PrototypeShell activeModuleName={isHindi ? 'आपातकालीन सहायता' : 'Emergency Support'}>
      <div className="sw-emergency-page">
        {/* Header */}
        <div className="sw-proto-page-header">
          <div className="sw-proto-page-header__meta">
            <Badge variant="emergency" size="sm" showDot>
              {isHindi ? 'आपातकालीन सूचना पूर्वावलोकन' : 'Emergency Information Preview'}
            </Badge>
            <span className="sw-proto-page-header__sub">
              {isHindi
                ? 'केवल सॉफ्टवेयर सिमुलेशन · आपातकालीन सेवा से जुड़ा नहीं है'
                : 'Simulated Emergency Flow · No Emergency Service is Contacted'}
            </span>
          </div>
          <Heading level={1} size="h3">
            {isHindi ? 'आपातकालीन मेडिकल आईडी एवं संपर्क' : 'Emergency Triage & Critical Medical ID'}
          </Heading>
          <Text variant="secondary">
            {isHindi
              ? 'आपातकालीन सूचना पूर्वावलोकन: डेमो ब्लड ग्रुप, एलर्जी विवरण, दवाइयाँ एवं परिवार प्रॉक्सी संपर्क (प्रोटोटाइप डेटा मात्र)।'
              : 'Emergency information preview for educational demonstration: illustrative blood group, simulated allergies, demo medications, and designated family proxy.'}
          </Text>
        </div>

        {/* Prototype Boundary Notice (Strict Prompt Compliance) */}
        <div className="sw-emg-boundary-strip">
          <ShieldAlert size={18} className="sw-emg-boundary-icon" aria-hidden="true" />
          <div className="sw-emg-boundary-text">
            <strong>
              {isHindi ? 'महत्वपूर्ण प्रोटोटाइप सुरक्षा सीमा:' : 'Important Prototype Safety Boundary:'}
            </strong>
            <p>
              {isHindi
                ? 'यह पृष्ठ केवल सॉफ्टवेयर सिमुलेशन है। यह वास्तविक 108/112 आपातकालीन सेवाओं, एम्बुलेंस डिस्पैच, या जीपीएस अस्पताल रूटिंग से जुड़ा नहीं है। वास्तविक आपातकाल में तुरंत अपने फोन से 108 या 112 डायल करें।'
                : 'This is a UI prototype demonstrating critical data organization. It does NOT place emergency calls, dispatch ambulances, track live locations, or route to hospitals. No emergency service is contacted. In a real medical emergency, dial 108 or 112 directly.'}
            </p>
          </div>
        </div>

        {/* 1. Critical Medical ID Card (Visually Distinct) */}
        <Card variant="default" padding="lg" className="sw-emg-id-card">
          <div className="sw-emg-id-head">
            <div className="sw-emg-id-badge-wrap">
              <span className="sw-emg-blood-pill">{currentProfile.bloodGroup}</span>
              <div>
                <Heading level={2} size="h4" className="sw-emg-id-name">
                  {currentProfile.fullName}
                </Heading>
                <span className="sw-emg-id-meta">
                  {currentProfile.age} yrs · {currentProfile.gender} · {currentProfile.city}, {currentProfile.state}
                </span>
              </div>
            </div>

            <Button
              variant="emergency"
              size="md"
              onClick={() => setSimulationModalOpen(true)}
              leftIcon={<AlertTriangle size={16} />}
            >
              {isHindi ? 'आपातकालीन फ्लो का पूर्वाभ्यास' : 'Simulate Emergency Flow'}
            </Button>
          </div>

          {/* Critical Triage Row */}
          <div className="sw-emg-triage-grid">
            {/* Allergies */}
            <div className="sw-emg-triage-box sw-emg-triage-box--allergy">
              <span className="sw-triage-label">
                {isHindi ? 'गंभीर एलर्जी (एलर्जी चेतावनी):' : 'Documented Allergies:'}
              </span>
              <strong className="sw-triage-val">
                {currentProfile.allergies.join(', ')}
              </strong>
              <span className="sw-triage-sub">
                {isHindi ? 'दवा देने से पूर्व सत्यापित करें' : 'Verify before administering medication'}
              </span>
            </div>

            {/* Primary Proxy */}
            <div className="sw-emg-triage-box">
              <span className="sw-triage-label">
                {isHindi ? 'प्राथमिक आपातकालीन प्रॉक्सी:' : 'Designated Emergency Proxy:'}
              </span>
              <strong className="sw-triage-val">
                {demoEmergencyProfile.emergencyContacts[0].name} (
                {demoEmergencyProfile.emergencyContacts[0].relationship})
              </strong>
              <span className="sw-triage-sub">
                {demoEmergencyProfile.emergencyContacts[0].phone}
              </span>
            </div>

            {/* Primary Reference Facility */}
            <div className="sw-emg-triage-box">
              <span className="sw-triage-label">
                {isHindi ? 'प्राथमिक निकटवर्ती अस्पताल (संदर्भ):' : 'Primary Reference Hospital:'}
              </span>
              <strong className="sw-triage-val">
                {demoEmergencyProfile.primaryHospital}
              </strong>
              <span className="sw-triage-sub">{demoEmergencyProfile.hospitalLocation}</span>
            </div>
          </div>

          {/* Active Medications List */}
          <div className="sw-emg-meds-box">
            <div className="sw-emg-meds-head">
              <Pill size={16} color="var(--color-primary)" />
              <strong>
                {isHindi ? 'सक्रिय नियमित दवाइयाँ (सिम्युलेटेड):' : 'Active Daily Medications:'}
              </strong>
            </div>
            <ul className="sw-emg-meds-list">
              {demoEmergencyProfile.activeMedications.map((med, idx) => (
                <li key={idx}>{med}</li>
              ))}
            </ul>
          </div>
        </Card>

        {/* 2. Emergency Contacts & Physician Section */}
        <div className="sw-emg-duo-grid">
          {/* Contacts Card */}
          <Card variant="default" padding="lg">
            <div className="sw-card-head-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Users size={18} color="var(--color-primary)" />
                <Heading level={2} size="h5">
                  {isHindi ? 'आपातकालीन संपर्क सूची' : 'Emergency Contacts Network'}
                </Heading>
              </div>
              <Badge variant="default" size="sm">
                {isHindi ? 'नामित संपर्क (डेमो)' : 'Designated Proxy (Demo)'}
              </Badge>
            </div>

            <div className="sw-emg-contact-list">
              {demoEmergencyProfile.emergencyContacts.map((contact, idx) => (
                <div key={idx} className="sw-emg-contact-item">
                  <div>
                    <strong className="sw-emg-contact-name">{contact.name}</strong>
                    <span className="sw-emg-contact-rel">{contact.relationship}</span>
                  </div>
                  <div className="sw-emg-contact-phone">
                    <Phone size={13} aria-hidden="true" />
                    <span>{contact.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Readiness Checklist */}
          <Card variant="subtle" padding="lg">
            <div className="sw-card-head-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <CheckCircle2 size={18} color="var(--color-success)" />
                <Heading level={2} size="h5">
                  {isHindi ? 'आपातकालीन तैयारी चेकलिस्ट' : 'Emergency Readiness Checklist'}
                </Heading>
              </div>
              <Badge variant="primary" size="sm">
                4 / 4 Complete
              </Badge>
            </div>

            <div className="sw-emg-checklist">
              <div className="sw-checklist-item">
                <CheckCircle2 size={16} className="sw-check-icon" />
                <span>
                  {isHindi
                    ? 'डेमो रक्त समूह व एलर्जी विवरण दर्ज'
                    : 'Demo blood group and illustrative allergies recorded'}
                </span>
              </div>
              <div className="sw-checklist-item">
                <CheckCircle2 size={16} className="sw-check-icon" />
                <span>
                  {isHindi
                    ? 'पारिवारिक प्रॉक्सी (मीरा शर्मा) अधिकृत (डेमो)'
                    : 'Designated family emergency proxy authorized (Demo)'}
                </span>
              </div>
              <div className="sw-checklist-item">
                <CheckCircle2 size={16} className="sw-check-icon" />
                <span>
                  {isHindi
                    ? 'सक्रिय दैनिक दवाओं की सूची अद्यतन (डेमो)'
                    : 'Active prescription dosage list up-to-date (Demo)'}
                </span>
              </div>
              <div className="sw-checklist-item">
                <CheckCircle2 size={16} className="sw-check-icon" />
                <span>
                  {isHindi
                    ? 'डेमो संदर्भ अस्पताल पता दर्ज'
                    : 'Reference facility location noted for prototype simulation'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* 3. Simulated Emergency Flow Modal */}
        {simulationModalOpen && (
          <div
            className="sw-drawer-backdrop"
            onClick={() => setSimulationModalOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="sw-drawer-modal sw-emg-sim-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sw-drawer-header sw-emg-modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <AlertTriangle size={20} color="var(--color-emergency)" />
                  <strong>
                    {isHindi
                      ? 'आपातकालीन सूचना पूर्वावलोकन · केवल प्रोटोटाइप'
                      : 'Emergency Information Preview • Prototype Only'}
                  </strong>
                </div>
                <button
                  type="button"
                  className="sw-drawer-close"
                  onClick={() => setSimulationModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="sw-drawer-body">
                <div className="sw-emg-modal-disclaimer">
                  <AlertCircle size={16} aria-hidden="true" />
                  <span>
                    {isHindi
                      ? 'यह एक सिमुलेशन है। कोई वास्तविक आपातकालीन कॉल या डिस्पैच नहीं की जाती है। No emergency service is contacted.'
                      : 'Simulated emergency flow. No live call, dispatch, GPS, or paramedic communication is performed. No emergency service is contacted.'}
                  </span>
                </div>

                <div className="sw-emg-packet-box">
                  <div className="sw-emg-packet-header">
                    <span className="sw-packet-title">
                      {isHindi ? 'आपातकालीन सूचना पूर्वावलोकन (सिम्युलेटेड डेटा):' : 'EMERGENCY INFORMATION PREVIEW (SIMULATED DATA):'}
                    </span>
                    <button
                      type="button"
                      className="sw-packet-copy-btn"
                      onClick={copySimulatedSummary}
                    >
                      <Copy size={13} />
                      <span>{isHindi ? 'कॉपी करें' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="sw-emg-packet-pre">
{`SIMULATED EMERGENCY INFORMATION PREVIEW (PROTOTYPE ONLY)
PATIENT: ${currentProfile.fullName} (Illustrative Profile: ${currentProfile.gender}, ${currentProfile.age}y)
DEMO BLOOD GROUP: ${currentProfile.bloodGroup} (Synthetic)
SIMULATED ALLERGIES: ${currentProfile.allergies.join(', ')}
HEALTH EDUCATION CONTEXT: Pre-diabetes observational pattern (Simulated)
ACTIVE MEDS: Metformin 500mg, Atorvastatin 10mg (Demo)
PROXY CONTACT: Meera Sharma (+91 98765 43210 - Demo)
REFERENCE FACILITY: Indore Care Super-Speciality Hospital (Demo Reference)
TIMESTAMP: 24 Sep 2026 18:30 IST
NOTICE: Prototype only. No emergency services are contacted.`}
                  </pre>
                </div>
              </div>

              <div className="sw-drawer-footer">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSimulationModalOpen(false)}
                >
                  {isHindi ? 'सिमुलेशन बंद करें' : 'Close Simulation Flow'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PrototypeShell>
  );
};

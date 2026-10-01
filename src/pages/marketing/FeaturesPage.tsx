import React from 'react';
import {
  FileText,
  Users,
  Activity,
  HeartPulse,
  AlertTriangle,
  ShieldCheck,
  Globe2,
  Sparkles,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { PageShell } from '../../components/layout/PageShell';
import { Container } from '../../components/ui/Container';
import { Section } from '../../components/ui/Section';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { FeatureSection } from '../../components/ui/FeatureSection';
import { FeatureList } from '../../components/ui/FeatureList';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CTASection } from '../../components/ui/CTASection';
import { demoLabReports, demoFamilyMembers } from '../../data/demoData';

export const FeaturesPage: React.FC = () => {
  const sampleReport = demoLabReports[0];

  return (
    <PageShell>
      {/* 1. Header */}
      <Section variant="default" spacing="xl">
        <Container size="xl">
          <SectionHeader
            badgeText="System Architecture"
            badgeVariant="secondary"
            kicker="EIGHT INTEGRATED CAPABILITIES"
            title="Healthcare intelligence designed for clarity, family, and everyday care."
            subtitle="SwasthyaAI links clinical laboratory analytics with family coordination, integrative Ayurvedic wellness, and rapid emergency awareness."
            align="center"
          />
        </Container>
      </Section>

      {/* 2. Primary Feature 1: Medical Report Analysis (Large Editorial Feature) */}
      <Section variant="subtle" spacing="xl">
        <Container size="xl">
          <FeatureSection
            badgeText="Pillar 01"
            badgeVariant="primary"
            kicker="CLINICAL EXPLANATION ENGINE"
            title="Medical Report Analysis & Plain-Language Translation"
            description="Diagnostic pathology sheets are packed with technical abbreviations and reference ranges that can be overwhelming. SwasthyaAI systematically parses values, normalizes them against standard clinical baselines, and presents an educational summary."
            supportingPoints={[
              {
                title: 'Structured Parameter Normalization',
                text: 'Metabolic markers, lipid profiles, and blood counts organized with units and flagged ranges.',
                icon: <FileText size={16} />,
              },
              {
                title: 'Empathetic Plain-Language Guidance',
                text: 'Translates borderline values into everyday explanations without inducing panic or offering diagnosis.',
                icon: <CheckCircle2 size={16} />,
              },
              {
                title: 'Doctor Discussion Prompts',
                text: 'Suggests concrete questions to ask your physician during your next consultation.',
                icon: <Sparkles size={16} />,
              },
            ]}
            layout="content-left"
            visualElement={
              <Card variant="default" padding="lg">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                  <div>
                    <span className="text-label">SIMULATED PATHOLOGY RESULT</span>
                    <h4 style={{ fontSize: 'var(--text-base)', margin: '2px 0 0 0' }}>{sampleReport.title}</h4>
                  </div>
                  <Badge variant="warning" size="sm" showDot>Attention</Badge>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-3)' }}>
                  {sampleReport.facilityName} · {sampleReport.date}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                  {sampleReport.keyFindings.slice(0, 3).map((f) => (
                    <div
                      key={f.parameter}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 'var(--space-2) 0',
                        borderBottom: '1px solid var(--color-border-subtle)',
                        fontSize: 'var(--text-xs)'
                      }}
                    >
                      <span style={{ fontWeight: 'var(--fw-medium)' }}>{f.parameter}</span>
                      <span style={{ fontWeight: 'var(--fw-bold)', color: f.status === 'warning' ? 'var(--color-health-warning)' : 'var(--color-health-normal)' }}>
                        {f.value}
                      </span>
                      <span style={{ color: 'var(--color-text-tertiary)' }}>{f.standardRange}</span>
                    </div>
                  ))}
                </div>

                <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-primary)' }}>
                  <span style={{ fontSize: '10px', fontWeight: 'var(--fw-bold)', color: 'var(--color-primary-dark)' }}>AI SUMMARY (DEMO):</span>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: '2px 0 0 0' }}>
                    {sampleReport.aiInsights[0]}
                  </p>
                </div>
              </Card>
            }
          />
        </Container>
      </Section>

      {/* 3. Primary Feature 2: Family Health Circles (Large Editorial Feature, Content Right) */}
      <Section variant="default" spacing="xl">
        <Container size="xl">
          <FeatureSection
            badgeText="Pillar 02"
            badgeVariant="secondary"
            kicker="MULTI-GENERATIONAL HEALTH"
            title="Family Health Circles with Consent Controls"
            description="Healthcare in Indian households is an interdependent family journey. SwasthyaAI allows family circles to monitor elderly parents in Indore or Ujjain while preserving individual dignity and access boundaries."
            supportingPoints={[
              {
                title: 'Elder Parent Vitals Monitoring',
                text: 'Receive quiet notifications when parents log blood pressure, glucose, or physician appointments.',
                icon: <Users size={16} />,
              },
              {
                title: 'Granular Access Roles',
                text: 'Choose between Full Access, View-Only, and Emergency-Only permissions per family member.',
                icon: <ShieldCheck size={16} />,
              },
              {
                title: 'Centralized Health Histories',
                text: 'Maintain historical checkup records and medication lists across family generations.',
                icon: <Calendar size={16} />,
              },
            ]}
            layout="content-right"
            visualElement={
              <Card variant="subtle" padding="lg">
                <span className="text-label">SIMULATED FAMILY ROSTER</span>
                <h4 style={{ fontSize: 'var(--text-base)', margin: '4px 0 var(--space-4) 0' }}>
                  Aarav Sharma Family Circle (3 Connected)
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {demoFamilyMembers.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 'var(--space-3)',
                        backgroundColor: 'var(--color-surface)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border-subtle)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-primary-muted)', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'var(--fw-bold)', fontSize: '11px' }}>
                          {m.avatarInitials}
                        </div>
                        <div>
                          <strong style={{ fontSize: 'var(--text-xs)', display: 'block' }}>{m.name}</strong>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>{m.relationship}</span>
                        </div>
                      </div>
                      <Badge variant="default" size="sm">{m.accessRole}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            }
          />
        </Container>
      </Section>

      {/* 4. Primary Feature 3: Multilingual Healthcare */}
      <Section variant="subtle" spacing="xl">
        <Container size="xl">
          <FeatureSection
            badgeText="Pillar 03"
            badgeVariant="secondary"
            kicker="AUTHENTIC LINGUISTIC INCLUSION"
            title="Multilingual Healthcare: English and Hindi"
            description="Medical communication should meet people where they live. SwasthyaAI is built from the ground up to render medical intelligence in natural, accessible Hindi alongside English, ensuring elders can read reports without feeling alienated."
            supportingPoints={[
              {
                title: 'Natural Devanagari Typography',
                text: 'Rendered using Google Fonts Noto Sans Devanagari with clinical clarity and correct spacing.',
                icon: <Globe2 size={16} />,
              },
              {
                title: 'Culturally Natural Translations',
                text: 'Avoids robotic machine translations by employing natural, respectful Indian healthcare vocabulary.',
                icon: <Sparkles size={16} />,
              },
            ]}
            layout="content-left"
            visualElement={
              <Card variant="default" padding="lg" style={{ borderLeft: '4px solid var(--color-secondary)' }}>
                <span className="text-label">BILINGUAL REPORT EXPLANATION (DEMO)</span>
                <h4 className="sw-devanagari" style={{ fontSize: 'var(--text-base)', margin: '4px 0 var(--space-2) 0' }}>
                  मधुमेह पूर्व (Pre-Diabetes) मूल्यांकन
                </h4>
                <p className="sw-devanagari text-small" style={{ lineHeight: 'var(--leading-relaxed)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
                  "फास्टिंग ग्लूकोज का स्तर 112 mg/dL दर्ज किया गया है। यह सामान्य सीमा (70-99) से थोड़ा अधिक है। अपने चिकित्सक से संतुलित आहार और दैनिक सैर के बारे में परामर्श लें।"
                </p>
                <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-2)' }}>
                  Educational prototype sample · Context: Indore, MP
                </div>
              </Card>
            }
          />
        </Container>
      </Section>

      {/* 5. Compact Secondary Features (The remaining 5 Pillars) */}
      <Section variant="default" spacing="xl">
        <Container size="xl">
          <SectionHeader
            badgeText="Integrative &amp; Protective Pillars"
            badgeVariant="primary"
            kicker="COMPLEMENTARY CAPABILITIES"
            title="Wellness, Vitals, and Emergency Readiness"
            subtitle="Explore how daily lifestyle habits, physiological trend tracking, and emergency shortcuts work together."
            align="center"
          />

          <FeatureList
            columns={2}
            items={[
              {
                id: 'feat_intelligence',
                title: 'Health Intelligence & Vitals',
                category: 'PILLAR 04 · PHYSIOLOGICAL TRENDS',
                badge: 'Vitals Stream',
                description: 'Tracks blood pressure, fasting glucose, and pulse trends over weeks to identify subtle metabolic drift before clinical complications arise.',
                icon: <Activity size={18} />,
              },
              {
                id: 'feat_ayurveda',
                title: 'Ayurveda & Seasonal Rhythms',
                category: 'PILLAR 05 · INTEGRATIVE WELLNESS',
                badge: 'Ritucharya',
                description: 'Evidence-informed classical Indian dietetics, seasonal eating practices, and digestive fire (Agni) balance tailored to regional climates.',
                icon: <Sparkles size={18} />,
              },
              {
                id: 'feat_yoga',
                title: 'Therapeutic Yoga & Pranayama',
                category: 'PILLAR 06 · STRESS REGULATION',
                badge: 'Breathwork',
                description: 'Guided gentle routines including Anulom Vilom and restorative asanas designed to regulate the parasympathetic nervous system.',
                icon: <HeartPulse size={18} />,
              },
              {
                id: 'feat_emergency',
                title: 'Emergency Support & Medical ID',
                category: 'PILLAR 07 · CRITICAL TRIAGE',
                badge: '108 Helpline',
                description: 'One-tap critical health parameters card, emergency hospital contact for Indore/Ujjain, and designated family emergency contacts.',
                icon: <AlertTriangle size={18} color="var(--color-emergency)" />,
              },
              {
                id: 'feat_privacy',
                title: 'Privacy & Conceptual Data Boundaries',
                category: 'PILLAR 08 · DATA TRUST',
                badge: 'Zero Tracking Demo',
                description: 'Strict client-side demonstration architecture. No real electronic health records stored, no third-party data tracking, and clear non-clinical boundaries.',
                icon: <ShieldCheck size={18} />,
              },
            ]}
          />
        </Container>
      </Section>

      {/* 6. Prototype CTA Section */}
      <CTASection
        title="Explore all 8 capabilities inside the prototype."
        description="See how reports, family vitals, Ayurvedic wellness routines, and emergency profiles behave in our browser simulation."
        primaryCtaText="Launch Interactive Prototype"
        primaryCtaTo="/prototype"
      />
    </PageShell>
  );
};

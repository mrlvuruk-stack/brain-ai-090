import React from 'react';
import {
  Heart,
  Globe2,
  MapPin,
} from 'lucide-react';
import { PageShell } from '../../components/layout/PageShell';
import { Container } from '../../components/ui/Container';
import { Section } from '../../components/ui/Section';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Card } from '../../components/ui/Card';
import { DevanagariText } from '../../components/ui/Typography';
import { CTASection } from '../../components/ui/CTASection';

export const AboutPage: React.FC = () => {
  return (
    <PageShell>
      {/* 1. Header */}
      <Section variant="default" spacing="xl">
        <Container size="xl">
          <SectionHeader
            badgeText="Origin &amp; Mission"
            badgeVariant="secondary"
            kicker="HUMAN-CENTERED HEALTHCARE INTELLIGENCE"
            title="Designed for people, families, and everyday healthcare decisions."
            subtitle="SwasthyaAI is a research-informed software prototype exploring how calm technology can make laboratory report understanding and family care more accessible across India."
            align="center"
          />
        </Container>
      </Section>

      {/* 2. Core Storytelling */}
      <Section variant="subtle" spacing="xl">
        <Container size="lg">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {/* The Mission */}
            <Card variant="default" padding="lg">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                <Heart size={22} color="var(--color-primary)" />
                <h3 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>The Mission</h3>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', margin: '0 0 var(--space-3) 0' }}>
                Medical information in India often arrives at moments of vulnerability. Whether receiving a routine blood test or managing a chronic condition, patients and families are frequently handed dense pathology sheets filled with abbreviations, reference ranges, and clinical terminology that produce anxiety rather than clarity.
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', margin: 0 }}>
                SwasthyaAI was conceived to transform that experience. By pairing plain-language explanations with respectful family care circles, we aim to make health intelligence calm, dignified, and actionable without replacing the indispensable role of qualified medical professionals and registered doctors.
              </p>
            </Card>

            {/* The India Context & Linguistic Dignity */}
            <Card variant="default" padding="lg">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                <Globe2 size={22} color="var(--color-primary)" />
                <h3 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>The India Context: Family &amp; Language</h3>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', margin: '0 0 var(--space-3) 0' }}>
                In India, healthcare is rarely an isolated individual activity. Adult children manage medical appointments for elderly parents, and parents monitor vitals for young children. Yet, most modern health software treats every user as a solitary consumer.
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', margin: 0 }}>
                Moreover, language remains a critical barrier. Medical reports in India are predominantly issued in English, creating an unnecessary divide for millions of Hindi (<DevanagariText>हिंदी</DevanagariText>) speakers. SwasthyaAI prioritizes native Devanagari typography and natural phrasing so that healthcare literacy extends to all generations.
              </p>
            </Card>

            {/* Pilot Context: Indore & Ujjain */}
            <Card variant="default" padding="lg">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                <MapPin size={22} color="var(--color-secondary)" />
                <h3 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>Pilot Context: Indore &amp; Ujjain, Madhya Pradesh</h3>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', margin: '0 0 var(--space-3) 0' }}>
                Our conceptual research focuses specifically on the urban and semi-urban healthcare ecosystem of the Malwa plateau region, anchored by <strong>Indore</strong> (a major diagnostic and referral hub) and <strong>Ujjain</strong> (a historic cultural center with strong multi-generational family networks).
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', margin: 0 }}>
                By designing for the real-world communication rhythms between diagnostic centers in Indore and family households in surrounding districts, we ensure our simulation models reflect genuine healthcare workflows rather than abstract tech assumptions.
              </p>
            </Card>

            {/* Integrity Notice */}
            <div
              style={{
                padding: 'var(--space-4) var(--space-5)',
                backgroundColor: 'var(--color-surface)',
                border: '1px dashed var(--color-border-medium)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-tertiary)',
                lineHeight: 'var(--leading-relaxed)',
              }}
            >
              <strong style={{ color: 'var(--color-text-secondary)' }}>Project Integrity Notice:</strong> SwasthyaAI is an independent software prototype. We do not fabricate doctor endorsements, clinical certifications, hospital affiliations, or commercial investor statistics. All patient profiles, laboratory reports, and metric streams shown in this prototype are synthetic educational models.
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. Prototype CTA */}
      <CTASection
        title="Experience the SwasthyaAI vision in the browser."
        description="See how our human-centered healthcare philosophy translates into an interactive digital prototype."
        primaryCtaText="Launch Interactive Prototype"
        primaryCtaTo="/prototype"
      />
    </PageShell>
  );
};

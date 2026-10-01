import {
  Lock,
  Users,
  Smartphone,
  Server,
  FileCheck,
  AlertCircle,
  EyeOff,
} from 'lucide-react';
import { PageShell } from '../../components/layout/PageShell';
import { Container } from '../../components/ui/Container';
import { Section } from '../../components/ui/Section';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Card } from '../../components/ui/Card';
import { MedicalDisclaimer } from '../../components/ui/MedicalDisclaimer';
import { CTASection } from '../../components/ui/CTASection';

export const SecurityPage: React.FC = () => {
  return (
    <PageShell>
      {/* 1. Header */}
      <Section variant="default" spacing="xl">
        <Container size="xl">
          <SectionHeader
            badgeText="Trust &amp; Governance"
            badgeVariant="primary"
            kicker="CONCEPTUAL ARCHITECTURE"
            title="Privacy, Consent, and Data Boundaries"
            subtitle="How SwasthyaAI is conceptually designed around patient privacy, family consent controls, and strict simulation boundaries."
            align="center"
          />

          {/* Prominent Prototype Architecture Notice */}
          <div
            style={{
              maxWidth: '840px',
              margin: '0 auto var(--space-10) auto',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border-subtle)',
              borderLeft: '4px solid var(--color-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4) var(--space-5)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
            }}
          >
            <AlertCircle size={20} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                Prototype Architecture Notice
              </strong>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: '4px 0 0 0', lineHeight: 'var(--leading-relaxed)' }}>
                This is a software demonstration prototype. The principles described below reflect our architectural model and design philosophy. This prototype does not store real protected health information and does not claim production DPDP compliance certification, medical device regulatory approval, or military-grade encryption.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. Conceptual Product Principles */}
      <Section variant="subtle" spacing="xl">
        <Container size="xl">
          <SectionHeader
            badgeText="Guiding Framework"
            badgeVariant="secondary"
            kicker="DESIGNED AROUND PATIENTS"
            title="Six Core Architectural Principles"
            subtitle="Designed around the realities of Indian family life and respectful health information sharing."
            align="center"
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {/* Principle 1: Privacy by Design */}
            <Card variant="default" padding="lg">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                <EyeOff size={20} color="var(--color-primary)" />
                <h3 style={{ fontSize: 'var(--text-base)', margin: 0 }}>Data Privacy &amp; Minimization</h3>
              </div>
              <p className="text-small" style={{ marginBottom: 'var(--space-2)' }}>
                <strong>Designed around:</strong> Minimal data retention. In this prototype concept, diagnostic evaluations are designed to process ephemeral lab tokens rather than retaining unbounded clinical dossiers.
              </p>
              <p className="text-caption">
                * Prototype concept: All demonstration profiles in this application reside purely in client state without cloud database persistence.
              </p>
            </Card>

            {/* Principle 2: Consent */}
            <Card variant="default" padding="lg">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                <FileCheck size={20} color="var(--color-primary)" />
                <h3 style={{ fontSize: 'var(--text-base)', margin: 0 }}>Explicit Consent Architecture</h3>
              </div>
              <p className="text-small" style={{ marginBottom: 'var(--space-2)' }}>
                <strong>Designed around:</strong> Unambiguous, granular consent. Sharing a blood pressure trend with a daughter does not automatically grant visibility to historical diagnostic biopsy records.
              </p>
              <p className="text-caption">
                * Production implementation would require cryptographic consent signatures and instantaneous revocation audit trails.
              </p>
            </Card>

            {/* Principle 3: Family Access */}
            <Card variant="default" padding="lg">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                <Users size={20} color="var(--color-primary)" />
                <h3 style={{ fontSize: 'var(--text-base)', margin: 0 }}>Family Access Segmentation</h3>
              </div>
              <p className="text-small" style={{ marginBottom: 'var(--space-2)' }}>
                <strong>Designed around:</strong> Three clear tiers of family participation: Full Primary Caregiver, View-Only Wellness updates, and Emergency-Only medical ID access.
              </p>
              <p className="text-caption">
                * Prototype concept: Demonstrates multi-generational care coordination between Indore and Ujjain family households.
              </p>
            </Card>

            {/* Principle 4: Device Awareness */}
            <Card variant="default" padding="lg">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                <Smartphone size={20} color="var(--color-primary)" />
                <h3 style={{ fontSize: 'var(--text-base)', margin: 0 }}>Device Awareness</h3>
              </div>
              <p className="text-small" style={{ marginBottom: 'var(--space-2)' }}>
                <strong>Designed around:</strong> Recognizing trusted client hardware (conceptual model) to mitigate unauthorized sessions, particularly on shared family tablets and mobile phones.
              </p>
              <p className="text-caption">
                * Production implementation would require hardware-backed biometric authentication (WebAuthn / Passkeys) and automatic session timeouts.
              </p>
            </Card>

            {/* Principle 5: Security Controls */}
            <Card variant="default" padding="lg">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                <Lock size={20} color="var(--color-primary)" />
                <h3 style={{ fontSize: 'var(--text-base)', margin: 0 }}>Security Controls Blueprint</h3>
              </div>
              <p className="text-small" style={{ marginBottom: 'var(--space-2)' }}>
                <strong>Designed around:</strong> Restricting access strictly to authenticated subjects. Production implementation would require TLS 1.3 transport encryption, zero-trust network policies, and segregated health databases.
              </p>
              <p className="text-caption">
                * Prototype note: No production keys or real medical APIs are connected in this prototype.
              </p>
            </Card>

            {/* Principle 6: Data Boundaries */}
            <Card variant="default" padding="lg">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                <Server size={20} color="var(--color-secondary)" />
                <h3 style={{ fontSize: 'var(--text-base)', margin: 0 }}>Data Boundaries &amp; Non-Commercial Use</h3>
              </div>
              <p className="text-small" style={{ marginBottom: 'var(--space-2)' }}>
                <strong>Designed around:</strong> A strict boundary against commercial health data broker integration. User health parameters are never used for targeted pharmaceutical advertising or insurance profiling.
              </p>
              <p className="text-caption">
                * Clear boundary: All data displayed in this prototype is synthetically generated for demonstration.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* 3. Safety Notice Block */}
      <Section variant="surface" spacing="lg">
        <Container size="lg">
          <MedicalDisclaimer variant="card" />
        </Container>
      </Section>

      {/* 4. Prototype CTA */}
      <CTASection
        title="Review how privacy boundaries look in practice."
        description="Launch our interactive prototype shell to see how simulated consent, family role tags, and privacy banners are displayed in real interface contexts."
        primaryCtaText="Launch Interactive Prototype"
        primaryCtaTo="/prototype"
      />
    </PageShell>
  );
};

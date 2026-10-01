import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  ArrowRight,
  FileText,
  HeartPulse,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { PageShell } from '../../components/layout/PageShell';
import { Container } from '../../components/ui/Container';
import { Section } from '../../components/ui/Section';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { ProductPreview } from '../../components/ui/ProductPreview';
import { FeatureSection } from '../../components/ui/FeatureSection';
import { CTASection } from '../../components/ui/CTASection';
import { demoFamilyMembers } from '../../data/demoData';
import './HomePage.css';

export const HomePage: React.FC = () => {
  return (
    <PageShell>
      {/* 1. HERO SECTION */}
      <Section variant="default" spacing="xl" className="sw-hero">
        <Container size="xl">
          <div className="sw-hero__header-stack">
            <div className="sw-hero__badge-row">
              <Badge variant="primary" size="md" showDot>
                Healthcare Intelligence Prototype
              </Badge>
              <span className="sw-hero__pilot-text">
                Pilot Simulation · Indore &amp; Ujjain, Madhya Pradesh
              </span>
            </div>

            <h1 className="text-display sw-hero__title">
              Healthcare intelligence,
              <br />
              <span className="sw-hero__title-accent">designed around people.</span>
            </h1>

            <p className="sw-hero__lead">
              SwasthyaAI brings medical reports, family health, wellness and health intelligence into one thoughtful digital experience.
            </p>

            <div className="sw-hero__actions">
              <RouterLink to="/prototype" tabIndex={-1}>
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight size={18} aria-hidden="true" />}
                >
                  Explore Prototype
                </Button>
              </RouterLink>
              <a href="#why-swasthya" tabIndex={-1}>
                <Button variant="outline" size="lg">
                  See How It Works
                </Button>
              </a>
            </div>

            {/* Reassuring calm points */}
            <div className="sw-hero__reassurance">
              <span>✓ Clear language without medical jargon</span>
              <span className="sw-hero__reassurance-dot">·</span>
              <span>✓ Multi-generational family health circles</span>
              <span className="sw-hero__reassurance-dot">·</span>
              <span>✓ Educational prototype data only</span>
            </div>
          </div>

          {/* COMPOSED INTERFACE PREVIEW VISUAL */}
          <div className="sw-hero__preview-wrapper sw-fade-in">
            <div className="sw-hero__preview-decor" aria-hidden="true" />
            <ProductPreview variant="full" interactive={true} />
          </div>
        </Container>
      </Section>

      {/* 2. WHY SWASTHYAAI (Editorial Philosophy) */}
      <Section id="why-swasthya" variant="subtle" spacing="xl">
        <Container size="xl">
          <SectionHeader
            badgeText="Core Philosophy"
            badgeVariant="secondary"
            kicker="HUMAN HEALTH COMES FIRST"
            title="Healthcare information should bring clarity, not anxiety."
            subtitle="Too often, medical laboratory results are delivered as dense sheets of abbreviations and reference values. SwasthyaAI is conceptualized to bridge the gap between clinical data and everyday family understanding."
          />

          <div className="sw-why-grid">
            <div className="sw-why-card">
              <span className="sw-why-num">01</span>
              <h3 className="sw-why-title">Plain Language Translation</h3>
              <p className="sw-why-text">
                Laboratory biomarkers are translated into calm, human context. We explain what each metric measures, whether it falls inside standard ranges, and questions worth exploring with a qualified physician.
              </p>
            </div>

            <div className="sw-why-card">
              <span className="sw-why-num">02</span>
              <h3 className="sw-why-title">Linguistic Dignity</h3>
              <p className="sw-why-text">
                Healthcare decisions happen in the language of the home. SwasthyaAI natively integrates Hindi (<span className="sw-devanagari">हिंदी</span>) and Devanagari script so elders and caregivers can engage comfortably.
              </p>
            </div>

            <div className="sw-why-card">
              <span className="sw-why-num">03</span>
              <h3 className="sw-why-title">Longitudinal Context</h3>
              <p className="sw-why-text">
                A single blood test is just a snapshot. By tracking vitals and diagnostic summaries over time, families can observe trends and prioritize preventive lifestyle changes before issues escalate.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. CORE CAPABILITIES (Alternating Editorial Compositions) */}
      <Section variant="default" spacing="xl">
        <Container size="xl">
          <SectionHeader
            badgeText="Platform Capabilities"
            badgeVariant="primary"
            kicker="COMPREHENSIVE HEALTH EXPERIENCE"
            title="Designed for everyday health decisions."
            subtitle="Explore how SwasthyaAI structures report understanding, physiological trends, and integrative wellness into an accessible system."
          />

          {/* Capability 1: Medical Report Understanding */}
          <FeatureSection
            badgeText="Diagnostic AI"
            badgeVariant="primary"
            kicker="REPORT UNDERSTANDING"
            title="Understand health information more clearly."
            description="Diagnostic lab sheets often cause unnecessary worry or pass unnoticed. SwasthyaAI extracts key parameters, compares them to clinical baseline ranges, and highlights what deserves attention."
            supportingPoints={[
              {
                title: 'Structured Parameter Extraction',
                text: 'Metabolic, hematologic, and lipid metrics normalized with clear units and reference limits.',
                icon: <FileText size={16} />,
              },
              {
                title: 'Doctor Discussion Guidance',
                text: 'Generates thoughtful questions to help you have a more meaningful conversation with your doctor.',
                icon: <HeartHandshake size={16} />,
              },
            ]}
            actionElement={
              <RouterLink to="/prototype/report-analysis">
                <Button variant="outline" size="sm" rightIcon={<ArrowRight size={14} />}>
                  Explore Lab Simulation →
                </Button>
              </RouterLink>
            }
            layout="content-left"
            visualElement={
              <Card variant="default" padding="lg" className="sw-cap-visual-card">
                <div className="sw-cap-visual__header">
                  <span className="text-label">SIMULATED LAB CARD</span>
                  <Badge variant="warning" size="sm" showDot>Attention</Badge>
                </div>
                <h4 className="sw-cap-visual__title">Fasting Blood Glucose Analysis</h4>
                <div className="sw-cap-visual__metric-row">
                  <div>
                    <span className="text-metric">112</span>
                    <span className="text-metric-unit">mg/dL</span>
                  </div>
                  <div className="sw-cap-visual__ref-tag">
                    Standard Range: 70 - 99 mg/dL
                  </div>
                </div>
                <div className="sw-cap-visual__quote">
                  <p>
                    "Fasting glucose is mildly elevated compared to reference thresholds. Suggested lifestyle discussion: regular morning walking and moderating refined sweets."
                  </p>
                </div>
                <div className="sw-cap-visual__disclaimer">
                  * Educational illustration. Discuss results with a qualified physician.
                </div>
              </Card>
            }
          />

          <hr className="sw-hairline" style={{ margin: 'var(--space-8) 0' }} />

          {/* Capability 2: Integrative Wellness & Ayurveda */}
          <FeatureSection
            badgeText="Ayurveda &amp; Yoga"
            badgeVariant="secondary"
            kicker="INTEGRATIVE WELLNESS"
            title="Ancient lifestyle wisdom, guided by modern sensibility."
            description="Rooted in classical Indian traditions, SwasthyaAI suggests gentle, evidence-informed lifestyle routines, seasonal eating (Ritucharya), and therapeutic yoga that complement conventional medical advice."
            supportingPoints={[
              {
                title: 'Pranayama & Breathing Sequences',
                text: 'Structured breathwork routines such as Anulom Vilom to foster autonomic balance and reduce stress.',
                icon: <HeartPulse size={16} />,
              },
              {
                title: 'Ayurvedic Daily Rhythms (Dinacharya)',
                text: 'Practical dietary and digestive habits suited to regional seasonal cycles in central India.',
                icon: <Sparkles size={16} />,
              },
            ]}
            actionElement={
              <RouterLink to="/prototype/wellness">
                <Button variant="outline" size="sm" rightIcon={<ArrowRight size={14} />}>
                  Explore Wellness Routines →
                </Button>
              </RouterLink>
            }
            layout="content-right"
            visualElement={
              <Card variant="subtle" padding="lg" className="sw-cap-visual-card">
                <div className="sw-cap-visual__header">
                  <span className="text-label">FEATURED ROUTINE</span>
                  <Badge variant="secondary" size="sm">YOGA &amp; PRANAYAMA</Badge>
                </div>
                <h4 className="sw-cap-visual__title">Anulom Vilom (Alternate Nostril)</h4>
                <p className="text-small" style={{ margin: 'var(--space-2) 0 var(--space-4) 0' }}>
                  A 10-minute rhythmic breathing exercise designed to calm the sympathetic nervous system and encourage focused mental equilibrium.
                </p>
                <div className="sw-cap-visual__routine-details">
                  <span><strong>Duration:</strong> 10 mins daily</span>
                  <span><strong>Time:</strong> Morning before breakfast</span>
                  <span><strong>Suitability:</strong> Universal / Beginner</span>
                </div>
              </Card>
            }
          />
        </Container>
      </Section>

      {/* 4. FAMILY / HUMAN CARE CONCEPT */}
      <Section variant="subtle" spacing="xl">
        <Container size="xl">
          <div className="sw-family-concept">
            <div className="sw-family-concept__text">
              <Badge variant="primary" size="sm">
                Family Health Circles
              </Badge>
              <h2 className="text-h2 sw-family-concept__title">
                Keep family health information organized across generations.
              </h2>
              <p className="sw-family-concept__lead">
                In India, family members frequently coordinate care for aging parents and growing children. SwasthyaAI is architected around family circles where updates can be shared transparently with clear, respectful boundaries.
              </p>

              <div className="sw-family-features-list">
                <div className="sw-family-feat">
                  <CheckCircle2 size={18} color="var(--color-primary)" />
                  <div>
                    <strong>Aging Parent Care Coordination</strong>
                    <p className="text-small">
                      Stay informed when parents in Indore or Ujjain log their blood pressure or receive checkup results.
                    </p>
                  </div>
                </div>

                <div className="sw-family-feat">
                  <CheckCircle2 size={18} color="var(--color-primary)" />
                  <div>
                    <strong>Consent-Driven Permission Tiers</strong>
                    <p className="text-small">
                      Every family member retains privacy choices, designating what records are shared and with whom.
                    </p>
                  </div>
                </div>

                <div className="sw-family-feat">
                  <CheckCircle2 size={18} color="var(--color-primary)" />
                  <div>
                    <strong>Emergency Access Safeguards</strong>
                    <p className="text-small">
                      Pre-authorized family members can access essential medical ID details during clinical urgencies.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-4)' }}>
                <RouterLink to="/prototype/family">
                  <Button variant="primary" size="md" rightIcon={<ArrowRight size={14} />}>
                    View Family Circle Simulation
                  </Button>
                </RouterLink>
              </div>
            </div>

            {/* Family Members Card Stack */}
            <div className="sw-family-concept__visual">
              <div className="sw-family-cards-stack">
                {demoFamilyMembers.map((member, index) => (
                  <Card
                    key={member.id}
                    variant={index === 0 ? 'default' : 'subtle'}
                    padding="md"
                    className="sw-family-card-item"
                  >
                    <div className="sw-family-card-item__left">
                      <div className="sw-family-card-item__avatar" aria-hidden="true">
                        {member.avatarInitials}
                      </div>
                      <div>
                        <strong className="sw-family-card-item__name">{member.name}</strong>
                        <div className="sw-family-card-item__meta">
                          {member.relationship} · Age {member.age}
                        </div>
                      </div>
                    </div>
                    <div className="sw-family-card-item__right">
                      <Badge variant="default" size="sm">
                        {member.accessRole}
                      </Badge>
                      <span className="sw-family-card-item__condition">
                        {member.chronicConditions[0]}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 5. MULTILINGUAL HEALTHCARE EXPERIENCE */}
      <Section variant="default" spacing="xl">
        <Container size="xl">
          <SectionHeader
            badgeText="Linguistic Inclusion"
            badgeVariant="secondary"
            kicker="AUTHENTIC MULTILINGUAL ACCESS"
            title="Understanding medical reports in your own language."
            subtitle="Clinical clarity should not be limited by language barriers. SwasthyaAI demonstrates native dual-language communication in simple English and authentic Hindi (हिंदी)."
          />

          <div className="sw-lang-comparison">
            {/* English Card */}
            <Card variant="default" padding="lg" className="sw-lang-card">
              <div className="sw-lang-card__header">
                <span className="sw-lang-card__tag">English Interface</span>
                <Badge variant="default" size="sm">EN</Badge>
              </div>
              <h4 className="sw-lang-card__title">Hemoglobin Assessment</h4>
              <div className="sw-lang-card__val-row">
                <span className="text-metric">14.6</span>
                <span className="text-metric-unit">g/dL</span>
                <Badge variant="normal" size="sm" style={{ marginLeft: 'auto' }}>Standard Range</Badge>
              </div>
              <p className="sw-lang-card__text">
                "Hemoglobin levels are within standard clinical thresholds. This indicates normal oxygen-carrying capacity in the bloodstream."
              </p>
              <div className="sw-lang-card__footer">
                Reference Range: 13.8 - 17.2 g/dL
              </div>
            </Card>

            {/* Hindi Card */}
            <Card variant="default" padding="lg" className="sw-lang-card sw-lang-card--hindi">
              <div className="sw-lang-card__header">
                <span className="sw-lang-card__tag sw-devanagari">हिंदी इंटरफ़ेस</span>
                <Badge variant="secondary" size="sm">HI</Badge>
              </div>
              <h4 className="sw-lang-card__title sw-devanagari">हीमोग्लोबिन विश्लेषण</h4>
              <div className="sw-lang-card__val-row">
                <span className="text-metric">14.6</span>
                <span className="text-metric-unit">g/dL</span>
                <Badge variant="normal" size="sm" style={{ marginLeft: 'auto' }}>
                  <span className="sw-devanagari">सामान्य स्तर</span>
                </Badge>
              </div>
              <p className="sw-lang-card__text sw-devanagari">
                "आपका हीमोग्लोबिन स्तर सामान्य सीमा के भीतर है। यह दर्शाता है कि शरीर में रक्त और ऑक्सीजन का प्रवाह संतुलित रूप से कार्य कर रहा है।"
              </p>
              <div className="sw-lang-card__footer sw-devanagari">
                मानक सीमा: 13.8 - 17.2 g/dL
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* 6. SAFETY & PRIVACY CONCEPT (Clear Boundaries) */}
      <Section variant="surface" spacing="lg">
        <Container size="lg">
          <div className="sw-safety-block">
            <div className="sw-safety-block__icon" aria-hidden="true">
              <ShieldCheck size={28} color="var(--color-primary)" />
            </div>
            <div className="sw-safety-block__content">
              <h3 className="sw-safety-block__title">
                Educational Prototype &amp; Privacy Boundary Notice
              </h3>
              <p className="sw-safety-block__text">
                SwasthyaAI is an interactive software demonstration developed for pilot study in Indore and Ujjain. All patient names, vital streams, and diagnostic parameters are fictional demo constructs.
              </p>
              <p className="sw-safety-block__subtext">
                This system does not provide medical diagnosis, clinical treatment plans, or emergency dispatch. Never submit real patient data or make clinical decisions based on illustrative simulation outputs.
              </p>
              <div className="sw-safety-block__link-row">
                <RouterLink to="/security" className="sw-safety-block__link">
                  Read our full privacy and boundary framework →
                </RouterLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 7. PROTOTYPE INVITATION */}
      <CTASection
        title="Explore the simulated SwasthyaAI product experience."
        description="Launch our interactive prototype shell to test report understanding, review family health circles, and explore how calm health intelligence works in the browser."
        primaryCtaText="Launch Interactive Prototype"
        primaryCtaTo="/prototype"
        secondaryCtaText="Explore Architecture"
        secondaryCtaTo="/features"
      />
    </PageShell>
  );
};

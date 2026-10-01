import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Container } from './Container';
import { Button } from './Button';
import { Heading } from './Typography';
import { Badge } from './Badge';
import './CTASection.css';

export interface CTASectionProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  primaryCtaText?: string;
  primaryCtaTo?: string;
  secondaryCtaText?: string;
  secondaryCtaTo?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  title = 'Experience the interactive SwasthyaAI prototype.',
  description = 'Explore how medical reports, family vitals, and Ayurvedic wellness insights come together in a thoughtful, simulated health environment.',
  primaryCtaText = 'Explore Prototype',
  primaryCtaTo = '/prototype',
  secondaryCtaText = 'Explore Architecture',
  secondaryCtaTo = '/features',
}) => {
  return (
    <section className="sw-cta-section" aria-label="Prototype Exploration Invitation">
      <Container size="lg">
        <div className="sw-cta-section__box">
          <Badge variant="secondary" size="md">
            Interactive Software Simulation
          </Badge>

          <Heading level={2} size="h2" className="sw-cta-section__title">
            {title}
          </Heading>

          <p className="sw-cta-section__desc">
            {description}
          </p>

          <div className="sw-cta-section__actions">
            <RouterLink to={primaryCtaTo} tabIndex={-1}>
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight size={18} aria-hidden="true" />}
              >
                {primaryCtaText}
              </Button>
            </RouterLink>

            {secondaryCtaTo && (
              <RouterLink to={secondaryCtaTo} tabIndex={-1}>
                <Button variant="outline" size="lg">
                  {secondaryCtaText}
                </Button>
              </RouterLink>
            )}
          </div>

          <div className="sw-cta-section__boundary">
            <ShieldCheck size={16} color="var(--color-primary)" />
            <span>
              Demonstration prototype with fictional data for Indore &amp; Ujjain pilot study. Not real medical care.
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
};

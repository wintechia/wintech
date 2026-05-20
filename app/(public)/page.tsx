import { HeroSection } from './_components/hero-section';
import { ProblemSection } from './_components/problem-section';
import { ServicesSection } from './_components/services-section';
import { HowItWorksSection } from './_components/how-it-works-section';
import { IndustriesSection } from './_components/industries-section';
import { TestimonialsSection } from './_components/testimonials-section';
import { PricingSection } from './_components/pricing-section';
import { CTASection } from './_components/cta-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <ServicesSection />
      <HowItWorksSection />
      <IndustriesSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
    </>
  );
}

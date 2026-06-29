import heroImage from "../../assets/hero.png";

// Section bundle (clean import from index.js)
import {
  HeroSection,
  ProgramsSection,
  CoursesSection,
  EventsSection,
  StoriesSection,
  CampaignsSection,
  PartnersSection,
  TestimonialsSection,
  NewsletterSection,
  CTASection,
} from "../../components/sections";

// Direct section imports (only those NOT in index.js)
import FeaturesSection from "../../components/sections/FeaturesSection";
import ImpactSection from "../../components/sections/ImpactSection";
import FloatingCTASection from "../../components/sections/FloatingCTASection";
import WhyChooseUsSection from "../../components/sections/WhyChooseUsSection";
import TeamSection from "../../components/sections/TeamSection";
import TimelineSection from "../../components/sections/TimelineSection";

function HomePage() {
  console.log("[dev] HomePage render");

  const stats = [
    {
      value: "500+",
      label: "Youth Empowered",
    },
    {
      value: "40+",
      label: "Professional Courses",
    },
    {
      value: "25+",
      label: "Strategic Partners",
    },
    {
      value: "100+",
      label: "Volunteers",
    },
  ];

  return (
    <>
      <HeroSection
        title="Transforming Lives Through Skills Development"
        subtitle="Empowering youth and women through education, mentorship, entrepreneurship and opportunities."
        image={heroImage}
        primaryText="Join Us"
        primaryLink="/register"
        secondaryText="Explore Programs"
        secondaryLink="/programs"
      />
      <FeaturesSection />

      <WhyChooseUsSection />

      <ProgramsSection />

      <CoursesSection />

      <EventsSection />

      <ImpactSection />

      <TimelineSection />

      <StoriesSection />

      <CampaignsSection />

      <TestimonialsSection />

      <TeamSection />

      <PartnersSection />

      <NewsletterSection />

      <FloatingCTASection />

      <CTASection />
    </>
  );
}

export default HomePage;
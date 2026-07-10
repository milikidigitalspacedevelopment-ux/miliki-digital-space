import { useEffect, useState } from "react";
import heroImage from "../../assets/hero.png";
import heroImage1 from "../../assets/hero 1.png";
import heroImage2 from "../../assets/hero 2.png";
import heroImage3 from "../../assets/hero 3.png";
import heroImage4 from "../../assets/hero 4.png";
import api from "../../services/api";

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
import StatsSection from "../../components/sections/StatsSection";
import analyticsService from "../../services/analyticsService";

function HomePage() {
  const [stats, setStats] = useState([]);
  const [heroContent, setHeroContent] = useState(null);

  useEffect(() => {
    let active = true;

    const loadStats = async () => {
      try {
        const [dashboard, content] = await Promise.all([
          analyticsService.getDashboardStats().catch(() => null),
          api.get("/content/home").then((res) => res.data).catch(() => null),
        ]);

        if (!active) return;

        if (Array.isArray(dashboard?.stats)) {
          setStats(
            dashboard.stats.map((item) => ({
              value: item.value || item.count || item.total || "0",
              label: item.title || "Metric",
            }))
          );
        }

        if (content?.hero) {
          setHeroContent(content.hero);
        }
      } catch (error) {
        console.error("Failed to load home page data", error);
      }
    };

    loadStats();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <HeroSection
        title={heroContent?.title || "Transforming Lives Through Digital Inclusion"}
        subtitle={heroContent?.subtitle || "Empowering youth and women through education, mentorship, entrepreneurship and opportunities."}
        image={[heroImage, heroImage1, heroImage2, heroImage3, heroImage4]}
        primaryText={heroContent?.primaryText || "Join Us"}
        primaryLink="/register"
        secondaryText={heroContent?.secondaryText || "Explore Programs"}
        secondaryLink="/programs"
      />
      <FeaturesSection />

      <WhyChooseUsSection />

      {stats.length > 0 && <StatsSection stats={stats} />}

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
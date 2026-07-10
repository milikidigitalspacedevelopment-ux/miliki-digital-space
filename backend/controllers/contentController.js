import asyncHandler from "express-async-handler";
import { pool } from "../config/db.js";

const homeContent = {
  hero: {
    title: "Transforming Lives Through Skills Development",
    subtitle: "Empowering youth and women through education, mentorship, entrepreneurship and opportunities.",
    primaryText: "Join Us",
    secondaryText: "Explore Programs",
  },
};

const aboutContent = {
  mission: {
    title: "Our Mission",
    body: "To empower youth and communities through practical skills training, mentorship, entrepreneurship and sustainable development initiatives.",
  },
  vision: {
    title: "Our Vision",
    body: "A society where every individual has the opportunity and skills needed to achieve economic and social independence.",
  },
};

const donateContent = {
  causes: [
    {
      title: "Education",
      description: "Provide training materials, scholarships and learning opportunities.",
      icon: "GraduationCap",
      color: "primary",
    },
    {
      title: "Technology",
      description: "Equip youth with digital skills and access to modern tools.",
      icon: "Laptop",
      color: "success",
    },
    {
      title: "Agriculture",
      description: "Support sustainable farming and food security initiatives.",
      icon: "Sprout",
      color: "warning",
    },
    {
      title: "Entrepreneurship",
      description: "Help young people start businesses and become self-reliant.",
      icon: "Briefcase",
      color: "danger",
    },
  ],
  reasons: [
    {
      title: "Transparency",
      description: "Every contribution is tracked and impact reports are shared with donors.",
      icon: "ShieldCheck",
    },
    {
      title: "Community Impact",
      description: "Your support creates opportunities and transforms lives.",
      icon: "Heart",
    },
    {
      title: "Sustainability",
      description: "We focus on long-term solutions that empower communities.",
      icon: "Globe",
    },
    {
      title: "Accountability",
      description: "Donors receive updates, receipts and measurable outcomes.",
      icon: "HandCoins",
    },
  ],
};

const impactContent = async () => {
  const [yearsResult, communitiesResult, graduatesResult] = await Promise.all([
    pool.query("SELECT EXTRACT(YEAR FROM AGE(NOW(), COALESCE(MIN(created_at), NOW())))::int AS years FROM users"),
    pool.query("SELECT COUNT(DISTINCT NULLIF(location, '')) AS communities FROM events"),
    pool.query("SELECT COUNT(*) AS graduates FROM certificates"),
  ]);

  const years = yearsResult.rows[0]?.years || 1;
  const communities = communitiesResult.rows[0]?.communities || 0;
  const graduates = graduatesResult.rows[0]?.graduates || 0;

  return {
    hero: {
      title: "Creating Opportunities and Changing Lives",
      subtitle: `Serving ${communities} communities, supporting ${graduates} graduates, and building measurable impact across the region.`,
    },
    highlights: [
      { value: `${years}+`, label: "Years of Impact" },
      { value: `${communities}`, label: "Communities Served" },
      { value: `${graduates}`, label: "Graduates" },
    ],
  };
};

export const getHomeContent = (req, res) => res.json(homeContent);
export const getAboutContent = (req, res) => res.json(aboutContent);
export const getDonateContent = (req, res) => res.json(donateContent);
export const getImpactContent = asyncHandler(async (req, res) => {
  const content = await impactContent();
  res.json(content);
});

export default {
  getHomeContent,
  getAboutContent,
  getDonateContent,
  getImpactContent,
};

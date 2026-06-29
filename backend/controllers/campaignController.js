const campaigns = [
  {
    id: 1,
    title: "School Supply Drive",
    slug: "school-supply-drive",
    description: "Help us provide essential materials to students in underserved communities.",
    image: "/images/campaign1.jpg",
    raised_amount: 240000,
    goal_amount: 500000,
    category: "Education",
  },
  {
    id: 2,
    title: "Clean Water Initiative",
    slug: "clean-water-initiative",
    description: "Support access to safe water and sanitation facilities.",
    image: "/images/campaign2.jpg",
    raised_amount: 310000,
    goal_amount: 600000,
    category: "Health",
  },
  {
    id: 3,
    title: "Youth Entrepreneurship Fund",
    slug: "youth-entrepreneurship-fund",
    description: "Fund small-business training and starter kits for young entrepreneurs.",
    image: "/images/campaign3.jpg",
    raised_amount: 180000,
    goal_amount: 400000,
    category: "Economic Empowerment",
  },
];

export const getCampaigns = (req, res) => {
  res.json(campaigns);
};

export const getCampaign = (req, res) => {
  const campaign = campaigns.find(
    (item) => item.id === Number(req.params.id) || item.slug === req.params.id
  );

  if (!campaign) {
    return res.status(404).json({ message: "Campaign not found" });
  }

  return res.json(campaign);
};

export const donateToCampaign = (req, res) => {
  const campaign = campaigns.find(
    (item) => item.id === Number(req.params.id) || item.slug === req.params.id
  );

  if (!campaign) {
    return res.status(404).json({ message: "Campaign not found" });
  }

  return res.json({
    success: true,
    message: "Donation recorded",
    campaignId: campaign.id,
  });
};

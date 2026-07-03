const stories = [
  {
    id: 1,
    title: "How Sarah Started Her Digital Career",
    slug: "how-sarah-started-her-digital-career",
    category: "Youth Empowerment",
    author: "Miliki Team",
    status: "Published",
    featured: true,
    image: "/images/story1.jpg",
    excerpt: "A young woman shares how training changed her life and career path.",
    content: "With support from our training programs, Sarah built the confidence and skills required to begin a new career in technology.",
    views: 1245,
    likes: 340,
    comments: 48,
    date: "2026-06-12",
  },
  {
    id: 2,
    title: "Women Entrepreneurs Changing Communities",
    slug: "women-entrepreneurs-changing-communities",
    category: "Women Empowerment",
    author: "Grace Wanjiku",
    status: "Published",
    featured: false,
    image: "/images/story2.jpg",
    excerpt: "Women entrepreneurs are using their skills to create opportunities for others.",
    content: "Our programs support women who are now mentoring and employing others in their communities.",
    views: 832,
    likes: 211,
    comments: 32,
    date: "2026-06-10",
  },
];

export const getStories = (req, res) => {
  res.json(stories);
};

export const getStory = (req, res) => {
  const story = stories.find(
    (item) => item.id === Number(req.params.id) || item.slug === req.params.id
  );

  if (!story) {
    return res.status(404).json({ message: "Story not found" });
  }

  return res.json(story);
};

const programs = [
  {
    id: 1,
    title: "Tailoring & Fashion Design",
    slug: "tailoring-fashion-design",
    category: "Fashion",
    image: "/images/program1.jpg",
    description: "Acquire practical tailoring and fashion design skills.",
    featured: true,
  },
  {
    id: 2,
    title: "Digital Skills",
    slug: "digital-skills",
    category: "Technology",
    image: "/images/program2.jpg",
    description: "Learn web development, graphic design and digital literacy.",
    featured: true,
  },
  {
    id: 3,
    title: "Agribusiness",
    slug: "agribusiness",
    category: "Agriculture",
    image: "/images/program3.jpg",
    description: "Modern farming and agribusiness opportunities.",
    featured: false,
  },
];

export const getPrograms = (req, res) => {
  res.json(programs);
};

export const getProgram = (req, res) => {
  const program = programs.find(
    (item) => item.id === Number(req.params.id) || item.slug === req.params.id
  );

  if (!program) {
    return res.status(404).json({ message: "Program not found" });
  }

  return res.json(program);
};

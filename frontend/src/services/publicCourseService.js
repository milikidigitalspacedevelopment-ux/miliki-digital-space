import { fetchPublicRow, fetchPublicRows } from "./supabaseRead";

const COURSE_COLUMNS = `
  id,
  slug,
  program_id,
  category_id,
  title,
  short_description,
  description,
  overview,
  level,
  status,
  duration_weeks,
  delivery_mode,
  class_schedule,
  tuition_fee,
  registration_fee,
  next_intake,
  language,
  featured,
  image_url,
  popularity,
  created_at,
  categories (name),
  programs (title)
`;

const toDurationParts = (durationWeeks) => {
  const total = Number(durationWeeks) || 0;
  return {
    duration_months: Math.floor(total / 4),
    duration_weeks_remaining: total % 4,
  };
};

const normalizeCourse = ({ categories, programs, ...course }) => ({
  ...course,
  ...toDurationParts(course.duration_weeks),
  category_name: categories?.name || "",
  category: categories?.name || "",
  program_name: programs?.title || "",
  program: programs?.title || "",
});

const splitCourseContent = (items) => {
  const requirements = [];
  const learning_outcomes = [];
  const career_opportunities = [];

  items.forEach((item) => {
    if (item.type === "learning_outcome") learning_outcomes.push(item);
    else if (item.type === "career_opportunity") career_opportunities.push(item);
    else requirements.push(item);
  });

  return { requirements, learning_outcomes, career_opportunities };
};

export const getPublicCourses = async () => {
  const courses = await fetchPublicRows({
    table: "courses",
    columns: COURSE_COLUMNS,
    orderBy: "popularity",
  });

  return courses.map(normalizeCourse);
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const getPublicCourseById = async (id) => {
  const lookupColumn = UUID_PATTERN.test(id) ? "id" : "slug";
  const course = await fetchPublicRow({
    table: "courses",
    columns: COURSE_COLUMNS,
    column: lookupColumn,
    value: id,
  });

  if (!course) return null;

  const content = await fetchPublicRows({
    table: "course_requirements",
    columns: "id, type, content, order_position",
    filters: [{ column: "course_id", value: course.id }],
    orderBy: "order_position",
    ascending: true,
  });

  return { ...normalizeCourse(course), ...splitCourseContent(content) };
};

export default { getPublicCourses, getPublicCourseById };

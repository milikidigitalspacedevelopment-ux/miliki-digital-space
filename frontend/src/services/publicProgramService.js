import { fetchPublicRow, fetchPublicRows } from "./supabaseRead";
import api from "./api";

const PROGRAM_COLUMNS = `
  id,
  title,
  description,
  status,
  start_date,
  end_date,
  image_url,
  category_id,
  created_at,
  updated_at,
  categories (name, slug)
`;

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const normalizeProgram = ({ categories, ...program }) => ({
  ...program,
  slug: slugify(program.slug || program.title || program.name || program.id),
  image: program.image_url || "/images/program.jpg",
  category: categories?.name || "",
  category_name: categories?.name || "",
  category_slug: categories?.slug || "",
});

export const getPublicPrograms = async () => {
  console.debug("[publicProgramService] loading public programs");
  const programs = await fetchPublicRows({
    table: "programs",
    columns: PROGRAM_COLUMNS,
  });

  const normalized = Array.isArray(programs) ? programs.map(normalizeProgram) : [];
  console.debug("[publicProgramService] public programs loaded", { count: normalized.length });
  return normalized;
};

export const getPublicProgramBySlug = async (slug) => {
  console.debug("[publicProgramService] loading public program by slug", { slug });

  const programs = await getPublicPrograms();
  const normalizedSlug = slugify(slug);

  const program = programs.find((item) => {
    if (!item) return false;
    if (item.slug && item.slug === normalizedSlug) return true;
    if (item.id && String(item.id) === String(slug)) return true;
    return slugify(item.title || item.name) === normalizedSlug;
  });

  console.debug("[publicProgramService] public program resolved", { slug, found: Boolean(program) });
  return program || null;
};

export const getPublicProgramById = async (id) => getPublicProgramBySlug(id);

export const recordProgramView = async (slug) => {
  if (!slug) return null;

  try {
    const response = await api.post(`/programs/${slug}/view`);
    return response.data;
  } catch (error) {
    console.warn("[publicProgramService] failed to record program view", error);
    return null;
  }
};

export default {
  getPublicPrograms,
  getPublicProgramBySlug,
  getPublicProgramById,
  recordProgramView,
};

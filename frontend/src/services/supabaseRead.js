import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const useSupabase = Boolean(supabaseUrl && supabaseKey);

let supabaseClient = null;

const initializeSupabaseClient = () => {
  if (supabaseClient) return supabaseClient;

  if (!useSupabase) {
    console.warn("Supabase is not configured in the frontend environment.");
    return null;
  }

  supabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  return supabaseClient;
};

initializeSupabaseClient();

// Keep browser queries limited to tables deliberately made public by the RLS
// migration. Add a table here only after adding its corresponding SELECT policy.
export const PUBLIC_READ_TABLES = new Set([
  "categories",
  "programs",
  "courses",
  "course_requirements",
  "events",
  "blogs",
  "stories",
  "partners",
  "campaigns",
  "volunteer_opportunities",
]);

const assertPublicReadTable = (table) => {
  if (!PUBLIC_READ_TABLES.has(table)) {
    throw new Error(`Direct frontend reads are not permitted for "${table}".`);
  }
};

const logDebug = (message, details) => {
  console.debug(`[supabaseRead] ${message}`, details);
};

/**
 * Fetches rows from an explicitly approved public table using the Supabase client.
 */
export const fetchPublicRows = async ({
  table,
  columns = "*",
  filters = [],
  orderBy = "created_at",
  ascending = false,
  from,
  to,
} = {}) => {
  assertPublicReadTable(table);
  logDebug("fetchPublicRows requested", { table, columns, filters, orderBy, ascending, from, to, useSupabase });

  const client = initializeSupabaseClient();
  if (!client) {
    throw new Error("Supabase client is not available for public reads.");
  }

  let query = client.from(table).select(columns);

  for (const { column, operator = "eq", value } of filters) {
    query = query.filter(column, operator, value);
  }

  if (orderBy) query = query.order(orderBy, { ascending });
  if (Number.isInteger(from) && Number.isInteger(to)) query = query.range(from, to);

  const { data, error } = await query;
  if (error) {
    console.error("Supabase read failed", { table, error });
    throw error;
  }

  logDebug("Supabase read succeeded", { table, count: Array.isArray(data) ? data.length : 0 });
  return data ?? [];
};

export const fetchPublicRow = async ({ table, columns = "*", column = "id", value } = {}) => {
  assertPublicReadTable(table);
  logDebug("fetchPublicRow requested", { table, column, value });

  const client = initializeSupabaseClient();
  if (!client) {
    throw new Error("Supabase client is not available for public reads.");
  }

  const { data, error } = await client
    .from(table)
    .select(columns)
    .eq(column, value)
    .maybeSingle();

  if (error) {
    console.error("Supabase single-row read failed", { table, column, value, error });
    throw error;
  }

  logDebug("Supabase single-row read succeeded", { table, found: Boolean(data) });
  return data ?? null;
};

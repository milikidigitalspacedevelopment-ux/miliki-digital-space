-- Run this in the Supabase SQL editor after the corresponding tables exist.
-- The browser may SELECT published/public content only. All writes stay on the
-- backend, which must use a server-only database connection or service-role key.
-- Never put a service-role key in the frontend.

-- Defence in depth: the PostgREST client roles receive no DML privileges.
REVOKE INSERT, UPDATE, DELETE ON TABLE
  public.categories,
  public.programs,
  public.courses,
  public.events,
  public.blogs,
  public.stories,
  public.partners,
  public.campaigns,
  public.volunteer_opportunities
FROM anon, authenticated;

GRANT SELECT ON TABLE
  public.categories,
  public.programs,
  public.courses,
  public.events,
  public.blogs,
  public.stories,
  public.partners,
  public.campaigns,
  public.volunteer_opportunities
TO anon, authenticated;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_opportunities ENABLE ROW LEVEL SECURITY;

-- These are SELECT-only policies. Do not add INSERT, UPDATE, DELETE, or ALL
-- policies for anon/authenticated if writes must remain backend-only.
CREATE POLICY "public can read categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public can read published programs" ON public.programs FOR SELECT TO anon, authenticated USING (status IN ('active', 'published'));
CREATE POLICY "public can read published courses" ON public.courses FOR SELECT TO anon, authenticated USING (status IN ('active', 'published'));
CREATE POLICY "public can read published events" ON public.events FOR SELECT TO anon, authenticated USING (status IN ('active', 'published'));
CREATE POLICY "public can read published blogs" ON public.blogs FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "public can read published stories" ON public.stories FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "public can read active partners" ON public.partners FOR SELECT TO anon, authenticated USING (status = 'active');
CREATE POLICY "public can read active campaigns" ON public.campaigns FOR SELECT TO anon, authenticated USING (status IN ('active', 'published'));
CREATE POLICY "public can read active volunteer opportunities" ON public.volunteer_opportunities FOR SELECT TO anon, authenticated USING (status = 'active');

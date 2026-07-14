-- Public course details need requirements, learning outcomes, and career
-- opportunities. A row is visible only when its parent course is public.

REVOKE INSERT, UPDATE, DELETE ON TABLE public.course_requirements FROM anon, authenticated;
GRANT SELECT ON TABLE public.course_requirements TO anon, authenticated;

ALTER TABLE public.course_requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can read content for published courses"
ON public.course_requirements
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.courses
    WHERE courses.id = course_requirements.course_id
      AND courses.status IN ('active', 'published')
  )
);

-- Existing public courses use status = 'open'. Include that deliberate public
-- status in the frontend read policies without granting any write access.

DROP POLICY IF EXISTS "public can read published courses" ON public.courses;
CREATE POLICY "public can read public courses"
ON public.courses
FOR SELECT
TO anon, authenticated
USING (status IN ('active', 'open', 'published'));

DROP POLICY IF EXISTS "public can read content for published courses" ON public.course_requirements;
CREATE POLICY "public can read content for public courses"
ON public.course_requirements
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.courses
    WHERE courses.id = course_requirements.course_id
      AND courses.status IN ('active', 'open', 'published')
  )
);

-- A stable, readable URL for public course pages.
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS slug TEXT;

WITH generated_slugs AS (
  SELECT
    id,
    CASE
      WHEN row_number() OVER (PARTITION BY base_slug ORDER BY id) = 1 THEN base_slug
      ELSE base_slug || '-' || row_number() OVER (PARTITION BY base_slug ORDER BY id)
    END AS slug
  FROM (
    SELECT
      id,
      COALESCE(
        NULLIF(
          regexp_replace(
            regexp_replace(lower(trim(title)), '[^a-z0-9]+', '-', 'g'),
            '(^-|-$)',
            '',
            'g'
          ),
          ''
        ),
        'course'
      ) AS base_slug
    FROM public.courses
    WHERE slug IS NULL OR slug = ''
  ) AS source
)
UPDATE public.courses AS courses
SET slug = generated_slugs.slug
FROM generated_slugs
WHERE courses.id = generated_slugs.id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_courses_slug_unique ON public.courses (slug);

CREATE OR REPLACE FUNCTION public.set_course_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug TEXT;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    base_slug := COALESCE(
      NULLIF(
        regexp_replace(
          regexp_replace(lower(trim(NEW.title)), '[^a-z0-9]+', '-', 'g'),
          '(^-|-$)',
          '',
          'g'
        ),
        ''
      ),
      'course'
    );

    NEW.slug := base_slug;

    IF EXISTS (SELECT 1 FROM public.courses WHERE slug = NEW.slug) THEN
      NEW.slug := base_slug || '-' || left(NEW.id::text, 8);
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_course_slug_before_insert ON public.courses;
CREATE TRIGGER set_course_slug_before_insert
BEFORE INSERT ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.set_course_slug();

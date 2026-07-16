import asyncHandler from "express-async-handler";
import { pool } from "../config/db.js";
import { triggerContentNotifications } from "../services/communicationsService.js";

/* ============================================================
   HELPERS
============================================================ */

const normalizeDuration = (value) => {
  if (value === "" || value === null || value === undefined) return null;

  const numeric = Number(value);

  return Number.isNaN(numeric) ? null : numeric;
};

const toDurationInWeeks = ({
  duration_months,
  duration_weeks,
}) => {
  const months = normalizeDuration(duration_months) ?? 0;
  const weeks = normalizeDuration(duration_weeks) ?? 0;

  return months * 4 + weeks;
};

const toDurationParts = (durationWeeks) => {
  const total = normalizeDuration(durationWeeks);

  if (!total || total <= 0) {
    return {
      duration_months: 0,
      duration_weeks: 0,
    };
  }

  return {
    duration_months: Math.floor(total / 4),
    duration_weeks: total % 4,
  };
};

const buildCoursePayload = (course) => {
  if (!course) return null;

  const duration = toDurationParts(course.duration_weeks);

  return {
    ...course,

    duration_months: duration.duration_months,
    duration_weeks_remaining: duration.duration_weeks,
  };
};

/* ============================================================
   LIST COURSES
============================================================ */

export const listCourses = asyncHandler(async (req, res) => {
  const {
    q,
    status,
    category,
    level,
    featured,
    page = 1,
    perPage = 20,
  } = req.query;

  try {
  const offset =
    (Number(page) - 1) * Number(perPage);

  let query = `
    SELECT

      c.id,
      c.title,
      c.short_description,
      c.level,
      c.status,
      c.duration_weeks,
      c.delivery_mode,
      c.class_schedule,
      c.tuition_fee,
      c.registration_fee,
      c.next_intake,
      c.featured,
      c.image_url,
      c.popularity,
      c.created_at,

      u.name AS instructor_name,
      cat.name AS category_name,
      p.title AS program_name

    FROM courses c

    LEFT JOIN users u
      ON u.id = c.instructor_id

    LEFT JOIN categories cat
      ON cat.id = c.category_id

    LEFT JOIN programs p
      ON p.id = c.program_id
  `;

  const values = [];
  const where = [];

  if (q) {
    where.push(`
      (
        c.title ILIKE $${values.length + 1}

        OR

        c.short_description ILIKE $${values.length + 1}

        OR

        cat.name ILIKE $${values.length + 1}

        OR

        p.title ILIKE $${values.length + 1}
      )
    `);

    values.push(`%${q}%`);
  }

  if (status) {
    where.push(`c.status = $${values.length + 1}`);
    values.push(status);
  }

  if (category) {
    where.push(`LOWER(cat.name)=LOWER($${values.length + 1})`);
    values.push(category);
  }

  if (level) {
    where.push(`LOWER(c.level)=LOWER($${values.length + 1})`);
    values.push(level);
  }

  if (featured !== undefined) {
    where.push(`c.featured = $${values.length + 1}`);
    values.push(featured === "true");
  }

  if (where.length) {
    query += ` WHERE ${where.join(" AND ")}`;
  }

  query += `
    ORDER BY

      c.popularity DESC,

      c.featured DESC,

      c.created_at DESC

    LIMIT $${values.length + 1}

    OFFSET $${values.length + 2}
  `;

  values.push(Number(perPage));
  values.push(offset);

  const result = await pool.query(query, values);

  res.json(result.rows.map(buildCoursePayload));
} catch (error) {
  console.error("An error occurred while listing courses.", error.message);
  res.status(500).json({
    message: "An error occurred while listing courses.",
  });
}
});

/* ============================================================
   GET SINGLE COURSE
============================================================ */

export const getCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch course with all joined data
    const courseResult = await pool.query(
      `
        SELECT
          c.*,
          u.name AS instructor_name,
          u.id AS instructor_id,
          cat.name AS category_name,
          cat.id AS category_id,
          p.title AS program_name,
          p.id AS program_id
        FROM courses c
        LEFT JOIN users u
          ON u.id = c.instructor_id
        LEFT JOIN categories cat
          ON cat.id = c.category_id
        LEFT JOIN programs p
          ON p.id = c.program_id
        WHERE c.id = $1
      `,
      [id]
    );

    if (!courseResult.rows.length) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Fetch all course requirements (requirements, learning outcomes, career opportunities)
    const contentResult = await pool.query(
      `
        SELECT
          id,
          type,
          content,
          order_position
        FROM course_requirements
        WHERE course_id = $1
        ORDER BY type, order_position ASC
      `,
      [id]
    );

    const reqList = [];
    const outcomes = [];
    const opportunities = [];

    contentResult.rows.forEach((item) => {
      switch (item.type) {
        case "learning_outcome":
          outcomes.push(item);
          break;
        case "career_opportunity":
          opportunities.push(item);
          break;
        default:
          reqList.push(item);
          break;
      }
    });

    const course = buildCoursePayload(courseResult.rows[0]);

    course.requirements = reqList;
    course.learning_outcomes = outcomes;
    course.career_opportunities = opportunities;

    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error.message);
    res.status(500).json({
      message: "An error occurred while fetching the course.",
    });
  }
});

const getUserId = (req) => req.user?.userId || req.user?.id;

export const getCourseEnrollmentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const result = await pool.query(
    `SELECT EXISTS (SELECT 1 FROM course_enrollments WHERE course_id = $1 AND user_id = $2) AS enrolled`,
    [id, userId]
  );

  res.json({ enrolled: result.rows[0]?.enrolled === true });
});

export const enrollCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const courseResult = await pool.query(
    `SELECT id FROM courses WHERE id = $1`,
    [id]
  );

  if (!courseResult.rows.length) {
    return res.status(404).json({ message: "Course not found" });
  }

  try {
    const insertResult = await pool.query(
      `INSERT INTO course_enrollments (course_id, user_id, enrolled_at) VALUES ($1, $2, NOW()) RETURNING id`,
      [id, userId]
    );

    await pool.query(
      `UPDATE courses SET popularity = COALESCE(popularity, 0) + 1 WHERE id = $1`,
      [id]
    );

    res.status(201).json({
      message: "Enrolled successfully",
      enrollmentId: insertResult.rows[0].id,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "You are already enrolled in this course." });
    }

    console.error("Error enrolling user in course:", error.message);
    res.status(500).json({ message: "An error occurred while enrolling in the course." });
  }
});

/* ============================================================
   CREATE COURSE
   Creates course and all related records (requirements, learning outcomes,
   career opportunities) in a single transaction.
============================================================ */

export const createCourse = asyncHandler(async (req, res) => {
  const {
    program_id,
    category_id,
    instructor_id,

    title,
    short_description,
    description,

    overview,
    objectives,
    syllabus,
    weekly_schedule,
    final_outcome,

    level,

    duration_months,
    duration_weeks,

    delivery_mode,
    class_schedule,

    tuition_fee,
    registration_fee,

    next_intake,

    language,

    status,

    featured,

    image_url,

    requirements = [],
    learning_outcomes = [],
    career_opportunities = [],
  } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({
      message: "Course title is required.",
    });
  }

  const totalWeeks = toDurationInWeeks({
    duration_months,
    duration_weeks,
  });

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert course
    const courseResult = await client.query(
      `
        INSERT INTO courses (

          program_id,
          category_id,
          instructor_id,

          title,
          short_description,
          description,

          overview,
          objectives,
          syllabus,
          weekly_schedule,
          final_outcome,

          level,

          duration_weeks,

          delivery_mode,
          class_schedule,

          tuition_fee,
          registration_fee,

          next_intake,

          language,

          status,

          featured,

          image_url

        )

        VALUES (

          $1,
          $2,
          $3,

          $4,
          $5,
          $6,

          $7,
          $8,
          $9,
          $10,
          $11,

          $12,

          $13,

          $14,
          $15,

          $16,
          $17,

          $18,

          $19,

          $20,

          $21,

          $22

        )

        RETURNING *
      `,
      [
        program_id || null,
        category_id || null,
        instructor_id || null,

        title.trim(),
        short_description || null,
        description || null,

        overview || null,
        objectives || null,
        syllabus || null,
        weekly_schedule || null,
        final_outcome || null,

        level || "beginner",

        totalWeeks,

        delivery_mode || "Physical",
        class_schedule || null,

        tuition_fee || null,
        registration_fee || 0,

        next_intake || null,

        language || "English",

        status || "draft",

        featured ?? false,

        image_url || null,
      ]
    );

    const courseId = courseResult.rows[0].id;

    // Insert requirements
    if (Array.isArray(requirements) && requirements.length > 0) {
      for (let i = 0; i < requirements.length; i++) {
        const req = requirements[i];
        if (req.content?.trim()) {
          await client.query(
            `
              INSERT INTO course_requirements (
                course_id,
                type,
                content,
                order_position
              )
              VALUES ($1, $2, $3, $4)
            `,
            [
              courseId,
              req.type || "requirement",
              req.content.trim(),
              i,
            ]
          );
        }
      }
    }

    // Insert learning outcomes
    if (Array.isArray(learning_outcomes) && learning_outcomes.length > 0) {
      for (let i = 0; i < learning_outcomes.length; i++) {
        const outcome = learning_outcomes[i];
        if (outcome.content?.trim()) {
          await client.query(
            `
              INSERT INTO course_requirements (
                course_id,
                type,
                content,
                order_position
              )
              VALUES ($1, $2, $3, $4)
            `,
            [
              courseId,
              "learning_outcome",
              outcome.content.trim(),
              i,
            ]
          );
        }
      }
    }

    // Insert career opportunities
    if (Array.isArray(career_opportunities) && career_opportunities.length > 0) {
      for (let i = 0; i < career_opportunities.length; i++) {
        const opportunity = career_opportunities[i];
        if (opportunity.content?.trim()) {
          await client.query(
            `
              INSERT INTO course_requirements (
                course_id,
                type,
                content,
                order_position
              )
              VALUES ($1, $2, $3, $4)
            `,
            [
              courseId,
              "career_opportunity",
              opportunity.content.trim(),
              i,
            ]
          );
        }
      }
    }

    await client.query("COMMIT");

    // Fetch complete course with all related records
    const completeCourse = await pool.query(
      `
        SELECT

          c.*,

          u.name AS instructor_name,

          cat.name AS category_name,

          p.title AS program_name

        FROM courses c

        LEFT JOIN users u
          ON u.id = c.instructor_id

        LEFT JOIN categories cat
          ON cat.id = c.category_id

        LEFT JOIN programs p
          ON p.id = c.program_id

        WHERE c.id = $1
      `,
      [courseId]
    );

    const contentResult = await pool.query(
      `
        SELECT

          id,

          type,

          content,

          order_position

        FROM course_requirements

        WHERE course_id = $1

        ORDER BY

          type,

          order_position ASC
      `,
      [courseId]
    );

    const course = buildCoursePayload(completeCourse.rows[0]);

    const reqList = [];
    const outcomes = [];
    const opportunities = [];

    contentResult.rows.forEach((item) => {
      switch (item.type) {
        case "learning_outcome":
          outcomes.push(item);
          break;

        case "career_opportunity":
          opportunities.push(item);
          break;

        default:
          reqList.push(item);
          break;
      }
    });

    course.requirements = reqList;
    course.learning_outcomes = outcomes;
    course.career_opportunities = opportunities;

    try {
      await triggerContentNotifications({
        entityType: "course",
        title: course.title,
        message: `A new course, ${course.title}, is now open for registration.`,
        actionUrl: `/courses/${course.id}`,
        userId: instructor_id || null,
      });
    } catch (notificationError) {
      console.error("Course notification dispatch failed", notificationError.message);
    }

    res.status(201).json(course);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating course with transaction:", error.message);
    res.status(500).json({
      message: "Failed to create course. Transaction rolled back.",
    });
  } finally {
    client.release();
  }
});

/* ============================================================
   UPDATE COURSE
============================================================ */

export const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    program_id,
    category_id,
    instructor_id,

    title,
    short_description,
    description,

    overview,
    objectives,
    syllabus,
    weekly_schedule,
    final_outcome,

    level,

    duration_months,
    duration_weeks,

    delivery_mode,
    class_schedule,

    tuition_fee,
    registration_fee,

    next_intake,

    language,

    status,

    featured,

    image_url,
  } = req.body;

  let totalWeeks = null;

  if (
    duration_months !== undefined ||
    duration_weeks !== undefined
  ) {
    totalWeeks = toDurationInWeeks({
      duration_months,
      duration_weeks,
    });
  }

  const result = await pool.query(
    `
      UPDATE courses

      SET

        program_id = COALESCE($1, program_id),

        category_id = COALESCE($2, category_id),

        instructor_id = COALESCE($3, instructor_id),

        title = COALESCE($4, title),

        short_description = COALESCE($5, short_description),

        description = COALESCE($6, description),

        overview = COALESCE($7, overview),

        objectives = COALESCE($8, objectives),

        syllabus = COALESCE($9, syllabus),

        weekly_schedule = COALESCE($10, weekly_schedule),

        final_outcome = COALESCE($11, final_outcome),

        level = COALESCE($12, level),

        duration_weeks = COALESCE($13, duration_weeks),

        delivery_mode = COALESCE($14, delivery_mode),

        class_schedule = COALESCE($15, class_schedule),

        tuition_fee = COALESCE($16, tuition_fee),

        registration_fee = COALESCE($17, registration_fee),

        next_intake = COALESCE($18, next_intake),

        language = COALESCE($19, language),

        status = COALESCE($20, status),

        featured = COALESCE($21, featured),

        image_url = COALESCE($22, image_url),

        updated_at = NOW()

      WHERE id = $23

      RETURNING *
    `,
    [
      program_id,
      category_id,
      instructor_id,

      title,
      short_description,
      description,

      overview,
      objectives,
      syllabus,
      weekly_schedule,
      final_outcome,

      level,

      totalWeeks,

      delivery_mode,
      class_schedule,

      tuition_fee,
      registration_fee,

      next_intake,

      language,

      status,

      featured,

      image_url,

      id,
    ]
  );

  if (!result.rows.length) {
    return res.status(404).json({
      message: "Course not found.",
    });
  }

  res.json(
    buildCoursePayload(result.rows[0])
  );
});

/* ============================================================
   DELETE COURSE
============================================================ */

export const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    `
      DELETE FROM courses

      WHERE id = $1

      RETURNING id
    `,
    [id]
  );

  if (!result.rows.length) {
    return res.status(404).json({
      message: "Course not found.",
    });
  }

  res.json({
    message: "Course deleted successfully.",
  });
});

/* ============================================================
   ADD COURSE CONTENT
   type:
   - requirement
   - learning_outcome
   - career_opportunity
============================================================ */

export const addCourseRequirement = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  try {
  const {
    type = "requirement",
    content,
  } = req.body;

  if (!content?.trim()) {
    return res.status(400).json({
      message: "Content is required.",
    });
  }

  const validTypes = [
    "requirement",
    "learning_outcome",
    "career_opportunity",
  ];

  if (!validTypes.includes(type)) {
    return res.status(400).json({
      message: "Invalid content type.",
    });
  }

  // Ensure course exists
  const course = await pool.query(
    `SELECT id FROM courses WHERE id = $1`,
    [courseId]
  );

  if (!course.rows.length) {
    return res.status(404).json({
      message: "Course not found.",
    });
  }

  const maxOrder = await pool.query(
    `
      SELECT COALESCE(MAX(order_position), -1) AS max_order

      FROM course_requirements

      WHERE course_id = $1
      AND type = $2
    `,
    [courseId, type]
  );

  const nextOrder =
    Number(maxOrder.rows[0].max_order) + 1;

  const result = await pool.query(
    `
      INSERT INTO course_requirements (

        course_id,

        type,

        content,

        order_position

      )

      VALUES (

        $1,

        $2,

        $3,

        $4

      )

      RETURNING *
    `,
    [
      courseId,
      type,
      content.trim(),
      nextOrder,
    ]
  );

  res.status(201).json(result.rows[0]);
} catch (error) {
  console.error("Error adding course requirement:", error.message);
  res.status(500).json({
    message: "An error occurred while adding course content.",
  });
}
});

/* ============================================================
   UPDATE COURSE CONTENT
============================================================ */

export const updateCourseRequirement = asyncHandler(async (req, res) => {
  const {
    courseId,
    requirementId,
  } = req.params;

  const {
    type,
    content,
  } = req.body;

  if (!content?.trim()) {
    return res.status(400).json({
      message: "Content is required.",
    });
  }

  const validTypes = [
    "requirement",
    "learning_outcome",
    "career_opportunity",
  ];

  if (
    type &&
    !validTypes.includes(type)
  ) {
    return res.status(400).json({
      message: "Invalid content type.",
    });
  }

  const result = await pool.query(
    `
      UPDATE course_requirements

      SET

        type = COALESCE($1, type),

        content = $2,

        updated_at = NOW()

      WHERE

        id = $3

      AND

        course_id = $4

      RETURNING *
    `,
    [
      type,
      content.trim(),
      requirementId,
      courseId,
    ]
  );

  if (!result.rows.length) {
    return res.status(404).json({
      message: "Item not found.",
    });
  }

  res.json(result.rows[0]);
});

/* ============================================================
   DELETE COURSE CONTENT
============================================================ */

export const deleteCourseRequirement = asyncHandler(async (req, res) => {
  const {
    courseId,
    requirementId,
  } = req.params;

  const result = await pool.query(
    `
      DELETE FROM course_requirements

      WHERE

        id = $1

      AND

        course_id = $2

      RETURNING id
    `,
    [
      requirementId,
      courseId,
    ]
  );

  if (!result.rows.length) {
    return res.status(404).json({
      message: "Item not found.",
    });
  }

  res.json({
    message: "Deleted successfully.",
  });
});

/* ============================================================
   REORDER COURSE CONTENT
============================================================ */

export const reorderCourseRequirements = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const {
    type,
    items,
  } = req.body;

  if (
    !Array.isArray(items)
  ) {
    return res.status(400).json({
      message: "Items array is required.",
    });
  }

  const validTypes = [
    "requirement",
    "learning_outcome",
    "career_opportunity",
  ];

  if (
    type &&
    !validTypes.includes(type)
  ) {
    return res.status(400).json({
      message: "Invalid content type.",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (let i = 0; i < items.length; i++) {
      await client.query(
        `
          UPDATE course_requirements

          SET

            order_position = $1,

            updated_at = NOW()

          WHERE

            id = $2

          AND

            course_id = $3
        `,
        [
          i,
          items[i].id,
          courseId,
        ]
      );
    }

    await client.query("COMMIT");

    res.json({
      message:
        "Items reordered successfully.",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
});
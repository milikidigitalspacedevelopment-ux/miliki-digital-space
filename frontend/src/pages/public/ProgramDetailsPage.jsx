import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import ProgramSidebarCard from "../../components/sidebars/ProgramSidebarCard";
import CourseCard from "../../components/cards/CourseCard";
import CTASection from "../../components/sections/CTASection";

import publicProgramService from "../../services/publicProgramService";
import publicCourseService from "../../services/publicCourseService";

function ProgramDetailsPage() {
  const { slug } = useParams();

  const [program, setProgram] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);

  const normalizeListItems = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value
        .map((item) => String(item ?? "").trim())
        .filter(Boolean);
    }

    if (typeof value === "string") {
      const raw = String(value).trim();
      if (!raw) return [];

      const lines = raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.replace(/^[-*•]\s*/, "").replace(/^\d+[.)]\s*/, "").trim())
        .filter(Boolean);

      if (lines.length > 1) {
        return lines;
      }

      const sentenceChunks = raw
        .split(/(?<=[.!?;])\s+/)
        .map((chunk) => chunk.replace(/^[-*•]\s*/, "").replace(/^\d+[.)]\s*/, "").trim())
        .filter(Boolean);

      return sentenceChunks.length > 1 ? sentenceChunks : [raw];
    }

    return [];
  };

  const renderDescription = (value) => {
    if (!value) return null;

    const items = normalizeListItems(value);

    if (items.length === 0) return null;

    if (items.length > 1) {
      return (
        <ul className="list-unstyled mb-0">
          {items.map((item, index) => (
            <li className="d-flex align-items-start gap-2 mb-3" key={`desc-${index}`}>
              <span className="text-success fw-bold mt-1">•</span>
              <span className="text-secondary">{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    return <p className="lead text-secondary mb-0">{items[0]}</p>;
  };

  useEffect(() => {
    loadProgram();
  }, [slug]);

  const loadProgram = async () => {
    try {
      console.debug("[ProgramDetailsPage] requesting program detail", { slug });
      const response = await publicProgramService.getPublicProgramBySlug(slug);
      const programData = response?.data ?? response;
      console.debug("[ProgramDetailsPage] program detail response", { slug, hasData: Boolean(programData) });

      const normalizedProgram = {
        ...programData,
        title: programData?.title || "Untitled program",
        image: programData?.image || "/images/program.jpg",
        description: programData?.description || programData?.overview || "",
        objectives: normalizeListItems(programData?.objectives),
        benefits: normalizeListItems(programData?.benefits),
        duration: programData?.duration || programData?.duration_hours || "",
        category: programData?.category || programData?.category_name || "",
        students: programData?.students || programData?.participants || 0,
        startDate: programData?.startDate || programData?.start_date || "",
      };

      setProgram(normalizedProgram);
      if (normalizedProgram?.slug || normalizedProgram?.id || slug) {
        await publicProgramService.recordProgramView(normalizedProgram?.slug || normalizedProgram?.id || slug);
      }

      const related = await publicCourseService.getPublicCourses();

      const relatedPayload = Array.isArray(related) ? related : related?.data || [];

      setRelatedCourses(
        relatedPayload
          .filter((item) => item.category_name === normalizedProgram.category)
          .filter((item) => item.id !== normalizedProgram.id)
          .slice(0, 4)
      );
    } catch (error) {
      console.error(error);
      setProgram(null);
    }
  };

  if (!program) return null;

  return (
    <>
      <section className="container py-5">

        <Breadcrumbs
          items={[
            {
              label: "Home",
              path: "/"
            },
            {
              label: "Programs",
              path: "/programs"
            },
            {
              label: program.title
            }
          ]}
        />

        <div className="row g-5">

          <div className="col-lg-8">

            <img
              src={program.image}
              alt={program.title}
              className="img-fluid rounded-5 shadow mb-4"
            />

            <h1 className="fw-bold mb-4">
              {program.title}
            </h1>

            <div className="rounded-4 border border-light-subtle p-4 shadow-sm bg-white">
              {renderDescription(program.description)}
            </div>

            {((program.objectives || []).length > 0 || (program.benefits || []).length > 0) && (
              <div className="mt-5">
                <div className="row g-4">
                  {program.objectives?.length > 0 && (
                    <div className="col-md-6">
                      <div className="rounded-4 border border-light-subtle p-4 shadow-sm bg-white h-100">
                        <h3 className="fw-bold mb-3">Program Objectives</h3>
                        <ul className="list-unstyled mb-0">
                          {program.objectives.map((item, index) => (
                            <li className="d-flex align-items-start gap-2 mb-3" key={`objective-${index}`}>
                              <span className="text-success fw-bold mt-1">✓</span>
                              <span className="text-secondary">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {program.benefits?.length > 0 && (
                    <div className="col-md-6">
                      <div className="rounded-4 border border-light-subtle p-4 shadow-sm bg-light h-100">
                        <h3 className="fw-bold mb-3">Benefits</h3>
                        <ul className="list-unstyled mb-0">
                          {program.benefits.map((item, index) => (
                            <li className="d-flex align-items-start gap-2 mb-3" key={`benefit-${index}`}>
                              <span className="text-success fw-bold mt-1">•</span>
                              <span className="text-secondary">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-5">
              <h3 className="fw-bold mb-4">Related Courses</h3>

              {relatedCourses.length === 0 ? (
                <p className="text-muted">There are no related courses available right now.</p>
              ) : (
                <div className="course-grid">
                  {relatedCourses.map((course) => (
                    <div className="course-card-wrapper" key={course.id}>
                      <CourseCard course={course} />
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          <div className="col-lg-4">

            <ProgramSidebarCard
              duration={program.duration}
              category={program.category}
              students={program.students}
              startDate={program.startDate}
            />

          </div>

        </div>

      </section>

      <CTASection />
    </>
  );
}

export default ProgramDetailsPage;

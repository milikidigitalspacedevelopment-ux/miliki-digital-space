import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import ProgramSidebarCard from "../../components/sidebars/ProgramSidebarCard";
import CourseCard from "../../components/cards/CourseCard";
import CTASection from "../../components/sections/CTASection";

import programService from "../../services/programService";
import courseService from "../../services/courseService";

function ProgramDetailsPage() {
  const { id } = useParams();

  const [program, setProgram] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);

  useEffect(() => {
    loadProgram();
  }, [id]);

  const loadProgram = async () => {
    try {
      const response = await programService.getProgramById(id);
      const programData = response?.data ?? response;

      const normalizedProgram = {
        ...programData,
        title: programData?.title || "Untitled program",
        image: programData?.image || "/images/program.jpg",
        description: programData?.description || programData?.overview || "",
        objectives: Array.isArray(programData?.objectives) ? programData.objectives : [],
        benefits: Array.isArray(programData?.benefits) ? programData.benefits : [],
        duration: programData?.duration || programData?.duration_hours || "",
        category: programData?.category || programData?.category_name || "",
        students: programData?.students || programData?.participants || 0,
        startDate: programData?.startDate || programData?.start_date || "",
      };

      setProgram(normalizedProgram);

      const related = await courseService.getCourses({
        category: normalizedProgram.category,
        status: "Published",
      });

      const relatedPayload = Array.isArray(related) ? related : related?.data || [];

      setRelatedCourses(
        relatedPayload.filter((item) => item.id !== normalizedProgram.id).slice(0, 4)
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

            <p className="lead text-secondary">
              {program.description}
            </p>

            <div className="mt-5">
              <h3 className="fw-bold mb-4">
                Program Objectives
              </h3>

              <div className="row g-3">

                {program.objectives.map((item) => (
                  <div className="col-md-6" key={item}>
                    <div className="shadow-sm p-4 rounded-5 bg-white">
                      ✓ {item}
                    </div>
                  </div>
                ))}

              </div>
            </div>

            <div className="mt-5">

              <h3 className="fw-bold mb-4">
                Benefits
              </h3>

              <div className="row g-3">

                {program.benefits.map((item) => (
                  <div className="col-md-6" key={item}>
                    <div className="shadow-sm p-4 rounded-5 bg-light">
                      {item}
                    </div>
                  </div>
                ))}

              </div>

            </div>

            {program.objectives.length > 0 && (
              <div className="mt-5">
                <h3 className="fw-bold mb-4">Program Objectives</h3>

                <div className="row g-3">
                  {program.objectives.map((item) => (
                    <div className="col-md-6" key={item}>
                      <div className="shadow-sm p-4 rounded-5 bg-white">
                        ✓ {item}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {program.benefits.length > 0 && (
              <div className="mt-5">
                <h3 className="fw-bold mb-4">Benefits</h3>

                <div className="row g-3">
                  {program.benefits.map((item) => (
                    <div className="col-md-6" key={item}>
                      <div className="shadow-sm p-4 rounded-5 bg-light">
                        {item}
                      </div>
                    </div>
                  ))}
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
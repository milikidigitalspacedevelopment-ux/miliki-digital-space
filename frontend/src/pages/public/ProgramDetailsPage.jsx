import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import ProgramSidebarCard from "../../components/sidebars/ProgramSidebarCard";
import CourseCard from "../../components/cards/CourseCard";
import CTASection from "../../components/sections/CTASection";

import programService from "../../services/programService";

function ProgramDetailsPage() {
  const { id } = useParams();

  const [program, setProgram] = useState(null);

  useEffect(() => {
    loadProgram();
  }, [id]);

  const loadProgram = async () => {
    try {
      const response = await programService.getProgramById(id);
      const programData = response?.data ?? response;

      setProgram({
        ...programData,
        objectives: programData?.objectives || [
          "Skill development",
          "Community impact",
          "Mentorship",
        ],
        benefits: programData?.benefits || [
          "Practical training",
          "Networking",
          "Certification",
        ],
        duration: programData?.duration || "Flexible",
        students: programData?.students || 0,
        startDate: programData?.startDate || "Coming soon",
      });
    } catch {
      setProgram({
        title: "Digital Skills Program",
        image: "/images/program.jpg",
        description:
          "A practical program designed to equip youth with modern digital skills.",
        objectives: [
          "Web Development",
          "Graphic Design",
          "Digital Literacy"
        ],
        benefits: [
          "Certification",
          "Mentorship",
          "Hands-on Projects"
        ],
        duration: "6 Months",
        category: "Technology",
        students: 320,
        startDate: "July 2026"
      });
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

            <div className="mt-5">

              <h3 className="fw-bold mb-4">
                Related Courses
              </h3>

              <div className="row g-4">

                {[1, 2].map((course) => (
                  <div
                    key={course}
                    className="col-md-6"
                  >
                    <CourseCard />
                  </div>
                ))}

              </div>

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
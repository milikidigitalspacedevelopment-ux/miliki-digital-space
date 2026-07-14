import { useEffect, useState } from "react";
import ProgramCard from "../cards/ProgramCard";
import publicProgramService from "../../services/publicProgramService";

function ProgramsSection() {
  const [programs, setPrograms] =
    useState([]);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      console.debug("[ProgramsSection] requesting featured programs");
      const data = await publicProgramService.getPublicPrograms();
      const nextPrograms = Array.isArray(data) ? data : data?.data || data?.programs || [];
      console.debug("[ProgramsSection] received featured programs", { count: nextPrograms.length });
      setPrograms(nextPrograms);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="py-3">

      <div className="container">

        <h2 className="fw-bold mb-4">
          Featured Programs
        </h2>

        <div className="program-grid">
          {programs.map((program) => (
            <div className="program-card-wrapper" key={program.id}>
              <ProgramCard program={program} />
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}


export default ProgramsSection;

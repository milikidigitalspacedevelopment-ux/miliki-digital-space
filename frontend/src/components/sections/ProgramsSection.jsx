import { useEffect, useState } from "react";
import ProgramCard from "../cards/ProgramCard";
import programService from "../../services/programService";

function ProgramsSection() {
  const [programs, setPrograms] =
    useState([]);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const data = await programService.getPrograms();
      setPrograms(Array.isArray(data) ? data : data?.data || data?.programs || []);
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
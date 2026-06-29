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
      setPrograms(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="py-5">

      <div className="container">

        <h2 className="fw-bold mb-4">
          Featured Programs
        </h2>

        <div className="row">

          {programs.map((program) => (
            <div
              key={program.id}
              className="col-lg-4 mb-4"
            >
              <ProgramCard
                program={program}
              />
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}


export default ProgramsSection;
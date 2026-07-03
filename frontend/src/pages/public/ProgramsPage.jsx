import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import PageBanner from "../../components/common/PageBanner";
import ProgramCard from "../../components/cards/ProgramCard";
import SearchBar from "../../components/filters/SearchBar";
import CategoryPills from "../../components/filters/CategoryPills";
import CTASection from "../../components/sections/CTASection";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";

import programService from "../../services/programService";

function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      setLoading(true);

      const response = await programService.getPrograms();
      const payload = Array.isArray(response) ? response : response?.data || response?.programs || [];

      setPrograms(payload);
    } catch (error) {
      console.error(error);
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const unique = [
      ...new Set(
        programs.map((item) => item.category || item.category_name || "")
      ),
    ].filter(Boolean);

    return ["All", ...unique];
  }, [programs]);

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const matchesSearch =
        program.title
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        category === program.category;

      return matchesSearch && matchesCategory;
    });
  }, [programs, search, category]);

  return (
    <>
      <PageBanner
        title="Programs"
        subtitle="Empowering communities through skills and innovation."
      />

      <section className="container py-5">

        <div className="row g-4 align-items-center mb-5">

          <div className="col-lg-8">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search programs..."
            />
          </div>

          <div className="col-lg-4">
            <CategoryPills
              categories={categories}
              activeCategory={category}
              onSelect={setCategory}
            />
          </div>

        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filteredPrograms.length === 0 ? (
          <EmptyState
            title="No Programs Found"
            message="Try changing your filters."
          />
        ) : (
          <div className="program-grid">
            {filteredPrograms.map((program) => (
              <div className="program-card-wrapper" key={program.id}>
                <ProgramCard program={program} />

                <div className="mt-3">
                  <Link
                    to={`/programs/${program.id}`}
                    className="btn btn-success rounded-pill px-4"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <CTASection />
    </>
  );
}

export default ProgramsPage;
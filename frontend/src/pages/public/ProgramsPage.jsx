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

      // Backend ready
      const response = await programService.getPrograms();

      setPrograms(Array.isArray(response) ? response : response?.data || []);
    } catch (error) {
      console.error(error);

      // Temporary mock data
      setPrograms([
        {
          id: 1,
          title: "Tailoring & Fashion Design",
          category: "Fashion",
          image: "/images/program1.jpg",
          description:
            "Acquire practical tailoring and fashion design skills."
        },
        {
          id: 2,
          title: "Digital Skills",
          category: "Technology",
          image: "/images/program2.jpg",
          description:
            "Learn web development, graphic design and digital literacy."
        },
        {
          id: 3,
          title: "Agribusiness",
          category: "Agriculture",
          image: "/images/program3.jpg",
          description:
            "Modern farming and agribusiness opportunities."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(programs.map((item) => item.category))
    ];
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
          <div className="row g-4">

            {filteredPrograms.map((program) => (
              <div
                key={program.id}
                className="col-md-6 col-xl-4"
              >
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
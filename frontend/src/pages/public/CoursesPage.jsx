import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import PageBanner from "../../components/common/PageBanner";
import SearchBar from "../../components/filters/SearchBar";
import CategoryPills from "../../components/filters/CategoryPills";
import SortDropdown from "../../components/filters/SortDropdown";
import CourseCard from "../../components/cards/CourseCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import CTASection from "../../components/sections/CTASection";

import courseService from "../../services/courseService";

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);

      const response = await courseService.getCourses();

      setCourses(response?.data || []);
    } catch {
      setCourses([
        {
          id: 1,
          title: "Web Development",
          category: "Technology",
          level: "Beginner",
          students: 250
        },
        {
          id: 2,
          title: "Fashion Design",
          category: "Fashion",
          level: "Intermediate",
          students: 180
        },
        {
          id: 3,
          title: "Agribusiness",
          category: "Agriculture",
          level: "Beginner",
          students: 120
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    return ["All", ...new Set(courses.map(c => c.category))];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    let data = [...courses];

    data = data.filter(
      course =>
        course.title
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        (category === "All" || course.category === category)
    );

    switch (sortBy) {
      case "alphabetical":
        data.sort((a, b) => a.title.localeCompare(b.title));
        break;

      case "popular":
        data.sort((a, b) => b.students - a.students);
        break;

      default:
        break;
    }

    return data;
  }, [courses, search, category, sortBy]);

  return (
    <>
      <PageBanner
        title="Courses"
        subtitle="Learn practical skills and transform your future."
      />

      <section className="container py-5">

        <div className="row g-4 mb-5">

          <div className="col-lg-5">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search courses..."
            />
          </div>

          <div className="col-lg-4">
            <CategoryPills
              categories={categories}
              activeCategory={category}
              onSelect={setCategory}
            />
          </div>

          <div className="col-lg-3">
            <SortDropdown
              value={sortBy}
              onChange={setSortBy}
            />
          </div>

        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filteredCourses.length === 0 ? (
          <EmptyState
            title="No Courses Found"
            message="Try adjusting your filters."
          />
        ) : (
          <div className="row g-4">

            {filteredCourses.map(course => (
              <div
                className="col-md-6 col-xl-4"
                key={course.id}
              >
                <CourseCard course={course} />

                <div className="mt-3">
                  <Link
                    to={`/courses/${course.id}`}
                    className="btn btn-primary rounded-pill"
                  >
                    View Course
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

export default CoursesPage;
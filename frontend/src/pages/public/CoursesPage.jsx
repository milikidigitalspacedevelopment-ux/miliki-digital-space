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
      const payload = Array.isArray(response) ? response : response?.data || [];

      setCourses(payload);
    } catch (error) {
      console.error(error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const unique = [
      ...new Set(
        courses.map((course) => course.category_name || course.category || "")
      ),
    ].filter(Boolean);

    return ["All", ...unique];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    let data = [...courses];

    data = data.filter((course) => {
      const title = (course.title || "").toLowerCase();
      const instructor = (course.instructor_name || course.instructor || "").toLowerCase();
      const categoryName = (course.category_name || course.category || "").toLowerCase();
      const query = search.toLowerCase();

      return (
        (title.includes(query) || instructor.includes(query) || categoryName.includes(query)) &&
        (category === "All" || categoryName === category.toLowerCase())
      );
    });

    switch (sortBy) {
      case "alphabetical":
        data.sort((a, b) =>
          (a.title || "").localeCompare(b.title || "")
        );
        break;

      case "popular":
        data.sort(
          (a, b) =>
            (b.students_count || b.students || 0) -
            (a.students_count || a.students || 0)
        );
        break;

      default:
        data.sort((a, b) => {
          const aDate = new Date(a.created_at || a.createdAt || Date.now());
          const bDate = new Date(b.created_at || b.createdAt || Date.now());
          return bDate - aDate;
        });
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
          <div className="course-grid">
            {filteredCourses.map((course) => (
              <div className="course-card-wrapper" key={course.id}>
                <CourseCard course={course} />
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
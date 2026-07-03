import { useEffect, useMemo, useState } from "react";
import { BookOpen, PlayCircle } from "lucide-react";

import CourseCard from "../../components/cards/CourseCard";
import SearchBar from "../../components/filters/SearchBar";
import CategoryPills from "../../components/filters/CategoryPills";
import SortDropdown from "../../components/filters/SortDropdown";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

import courseService from "../../services/courseService";

function MyCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const response = await courseService.getMyCourses?.();

      setCourses(response || []);
    } catch (err) {
      setError("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const unique = [
      ...new Set(courses.map((course) => course.category)),
    ];

    return ["All", ...unique];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    if (category !== "All") {
      result = result.filter(
        (course) => course.category === category
      );
    }

    if (search.trim()) {
      result = result.filter(
        (course) =>
          course.title
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          course.instructor
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    if (sort === "progress") {
      result.sort(
        (a, b) => (b.progress || 0) - (a.progress || 0)
      );
    }

    if (sort === "alphabetical") {
      result.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    return result;
  }, [courses, search, category, sort]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <ErrorState
        title="Courses Error"
        message={error}
        onRetry={fetchCourses}
      />
    );
  }

  return (
    <div className="container-fluid py-4">

      {/* Header */}

      <div className="mb-5">

        <h2 className="fw-bold mb-2">
          My Courses
        </h2>

        <p className="text-muted mb-0">
          Continue learning and track your progress.
        </p>

      </div>

      {/* Filters */}

      <div className="card border-0 shadow-sm rounded-5 mb-5">

        <div className="card-body">

          <div className="row g-3">

            <div className="col-lg-5">

              <SearchBar
                value={search}
                onChange={(value) => setSearch(value)}
                placeholder="Search courses..."
              />

            </div>

            <div className="col-lg-4">

              <CategoryPills
                categories={categories}
                activeCategory={category}
                onChange={setCategory}
              />

            </div>

            <div className="col-lg-3">

              <SortDropdown
                value={sort}
                onChange={setSort}
                options={[
                  {
                    value: "latest",
                    label: "Latest",
                  },
                  {
                    value: "progress",
                    label: "Progress",
                  },
                  {
                    value: "alphabetical",
                    label: "Alphabetical",
                  },
                ]}
              />

            </div>

          </div>

        </div>

      </div>

      {/* Stats */}

      <div className="row g-4 mb-5">

        <div className="col-md-6">

          <div className="card border-0 shadow-sm rounded-5">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <BookOpen
                  size={36}
                  className="text-primary me-3"
                />

                <div>

                  <small className="text-muted">
                    Enrolled Courses
                  </small>

                  <h3 className="fw-bold mb-0">
                    {courses.length}
                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-md-6">

          <div className="card border-0 shadow-sm rounded-5">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <PlayCircle
                  size={36}
                  className="text-success me-3"
                />

                <div>

                  <small className="text-muted">
                    In Progress
                  </small>

                  <h3 className="fw-bold mb-0">
                    {
                      courses.filter(
                        (course) =>
                          course.progress > 0 &&
                          course.progress < 100
                      ).length
                    }
                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Course Grid */}

      {filteredCourses.length === 0 ? (
        <EmptyState
          title="No Courses Found"
          description="There are currently no courses matching your search."
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

    </div>
  );
}

export default MyCoursesPage;
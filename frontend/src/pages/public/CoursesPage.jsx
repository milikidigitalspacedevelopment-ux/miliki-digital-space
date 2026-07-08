import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

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
  const courseTrackRef = useRef(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const track = courseTrackRef.current;
    if (!track) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;

    const scrollStep = () => {
      const card = track.querySelector(".course-card-wrapper");
      if (!card) return;

      const gap = 14;
      const offset = card.getBoundingClientRect().width + gap;
      const maxScroll = track.scrollWidth - track.clientWidth;

      if (maxScroll <= 0) return;

      const nextScroll = track.scrollLeft + offset;
      const target = nextScroll >= maxScroll ? 0 : nextScroll;

      track.scrollTo({ left: target, behavior: "smooth" });
    };

    const intervalId = window.setInterval(scrollStep, 3200);
    return () => window.clearInterval(intervalId);
  }, [courses]);

  const loadCourses = async () => {
    try {
      setLoading(true);

      const response = await courseService.getCourses();
      const payload = Array.isArray(response) ? response : response?.data || [];
      const publicCourses = (Array.isArray(payload) ? payload : []).filter((course) => {
        const status = (course?.status || "").toLowerCase();
        return !["draft", "archived", "closed"].includes(status);
      });

      setCourses(publicCourses);
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
      const description = (course.short_description || course.description || course.overview || "").toLowerCase();
      const categoryName = (course.category_name || course.category || "").toLowerCase();
      const query = search.toLowerCase();

      return (
        (title.includes(query) || description.includes(query) || categoryName.includes(query)) &&
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
            (b.popularity || 0) -
            (a.popularity || 0)
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
      <section className="container py-5">

        <div className="mb-4">
          <h2 className="fw-bold">Explore our most popular courses</h2>
          <p className="text-muted">Join thousands of learners — pick a course to build practical skills and advance your career.</p>
        </div>

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
          <div className="course-grid public-courses-grid" ref={courseTrackRef}>
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
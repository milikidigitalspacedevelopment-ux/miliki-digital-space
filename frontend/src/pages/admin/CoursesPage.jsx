import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Users,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import courseService from "../../services/courseService";

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await courseService.getAllCourses();
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Unable to load courses.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return courses.filter((course) => {
      const title = (course.title || "").toLowerCase();
      const instructor = (course.instructor_name || "").toLowerCase();
      const category = (course.category_name || "").toLowerCase();
      return title.includes(term) || instructor.includes(term) || category.includes(term);
    });
  }, [courses, searchTerm]);

  return (
    <div className="container-fluid py-4">

      {/* Header */}

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold mb-1">
            Courses Management
          </h2>

          <p className="text-muted mb-0">
            Manage courses, instructors and enrollments.
          </p>
        </div>

        <button className="btn btn-success rounded-pill px-4">
          <Plus size={18} className="me-2" />
          Add Course
        </button>

      </div>

      {/* Statistics */}

      <div className="row g-4 mb-4">

        <div className="col-md-4">

          <div className="card border-0 shadow-sm rounded-5 h-100">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <div
                  className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center me-3"
                  style={{
                    width: 60,
                    height: 60,
                  }}
                >
                  <BookOpen size={26} />
                </div>

                <div>
                  <small className="text-muted">
                    Total Courses
                  </small>

                  <h3 className="fw-bold mb-0">
                    {courses.length}
                  </h3>
                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card border-0 shadow-sm rounded-5 h-100">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <div
                  className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3"
                  style={{
                    width: 60,
                    height: 60,
                  }}
                >
                  <Users size={26} />
                </div>

                <div>
                  <small className="text-muted">
                    Enrollments
                  </small>

                  <h3 className="fw-bold mb-0">
                    {courses.reduce((sum, course) => sum + (Number(course.duration_hours) || 0), 0)}
                  </h3>
                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card border-0 shadow-sm rounded-5 h-100">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <div
                  className="bg-warning text-white rounded-circle d-flex justify-content-center align-items-center me-3"
                  style={{
                    width: 60,
                    height: 60,
                  }}
                >
                  <BookOpen size={26} />
                </div>

                <div>
                  <small className="text-muted">
                    Active Courses
                  </small>

                  <h3 className="fw-bold mb-0">
                    {courses.filter((course) => (course.status || "").toLowerCase() === "published").length}
                  </h3>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Search */}

      <div className="card border-0 shadow-sm rounded-5 mb-4">

        <div className="card-body">

          <div className="row g-3">

            <div className="col-lg-8">

              <div className="input-group">

                <span className="input-group-text bg-white border-end-0">
                  <Search size={18} />
                </span>

                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                />

              </div>

            </div>

            <div className="col-lg-4">

              <button className="btn btn-outline-secondary rounded-pill w-100">
                <Filter size={18} className="me-2" />
                Filters
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Table */}

      <div className="card border-0 shadow-sm rounded-5">

        <div className="card-body table-responsive">

          <table className="table align-middle">

            <thead>

              <tr>
                <th>Course</th>
                <th>Instructor</th>
                <th>Category</th>
                <th>Students</th>
                <th>Status</th>
                <th width="180">
                  Actions
                </th>
              </tr>

            </thead>

            <tbody>

              {loading && (
                <tr>
                  <td colSpan="6" className="text-center py-4">Loading courses...</td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-danger">{error}</td>
                </tr>
              )}

              {!loading && !error && filteredCourses.map((course) => (
                <tr key={course.id}>

                  <td className="fw-semibold">
                    {course.title}
                  </td>

                  <td>
                    {course.instructor_name || "—"}
                  </td>

                  <td>
                    {course.category_name || "—"}
                  </td>

                  <td>
                    {course.duration_hours || 0}
                  </td>

                  <td>

                    <span
                      className={`badge ${
                        (course.status || "").toLowerCase() === "published"
                          ? "bg-success"
                          : "bg-warning"
                      }`}
                    >
                      {course.status}
                    </span>

                  </td>

                  <td>

                    <div className="d-flex gap-2 flex-wrap">

                      <button className="btn btn-sm btn-outline-primary rounded-pill">
                        <Eye size={16} />
                      </button>

                      <button className="btn btn-sm btn-outline-success rounded-pill">
                        <Pencil size={16} />
                      </button>

                      <button className="btn btn-sm btn-outline-danger rounded-pill">
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default CoursesPage;
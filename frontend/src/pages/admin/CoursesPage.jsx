import { useState } from "react";
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

function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const courses = [
    {
      id: 1,
      title: "Web Development",
      instructor: "John Doe",
      category: "Technology",
      students: 125,
      status: "Published",
    },
    {
      id: 2,
      title: "Digital Marketing",
      instructor: "Mary Wanjiku",
      category: "Business",
      students: 89,
      status: "Draft",
    },
    {
      id: 3,
      title: "Graphic Design",
      instructor: "David Kimani",
      category: "Creative",
      students: 63,
      status: "Published",
    },
  ];

  const filteredCourses = courses.filter(
    (course) =>
      course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      course.instructor
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

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
                    127
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
                    3,842
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
                    94
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

              {filteredCourses.map((course) => (
                <tr key={course.id}>

                  <td className="fw-semibold">
                    {course.title}
                  </td>

                  <td>
                    {course.instructor}
                  </td>

                  <td>
                    {course.category}
                  </td>

                  <td>
                    {course.students}
                  </td>

                  <td>

                    <span
                      className={`badge ${
                        course.status === "Published"
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
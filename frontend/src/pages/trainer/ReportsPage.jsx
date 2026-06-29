import { useEffect, useState } from "react";
import {
  Download,
  TrendingUp,
  Users,
  BookOpen,
  Award,
} from "lucide-react";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";

import ChartCard from "../../components/charts/ChartCard";
import AreaChartComponent from "../../components/charts/AreaChartComponent";
import BarChartComponent from "../../components/charts/BarChartComponent";
import LineChartComponent from "../../components/charts/LineChartComponent";
import PieChartComponent from "../../components/charts/PieChartComponent";
import RadialChartComponent from "../../components/charts/RadialChartComponent";

import analyticsService from "../../services/analyticsService";

function ReportsPage() {
  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const response =
        await analyticsService.getTrainerReports?.();

      setReport(response);
    } catch (err) {
      setError("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await analyticsService.exportReport?.();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <ErrorState
        title="Reports Error"
        message={error}
        onRetry={fetchReports}
      />
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold mb-2">
            Reports & Analytics
          </h2>

          <p className="text-muted mb-0">
            Monitor course performance and student progress.
          </p>
        </div>

        <button
          className="btn btn-primary rounded-pill"
          onClick={handleExport}
        >
          <Download size={18} className="me-2" />
          Export Report
        </button>
      </div>

      {/* KPI CARDS */}

      <div className="row g-4 mb-5">
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body text-center">
              <Users
                size={45}
                className="text-primary mb-3"
              />

              <h3 className="fw-bold">
                {report?.totalStudents || 0}
              </h3>

              <p className="text-muted mb-0">
                Students
              </p>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body text-center">
              <BookOpen
                size={45}
                className="text-success mb-3"
              />

              <h3 className="fw-bold">
                {report?.totalCourses || 0}
              </h3>

              <p className="text-muted mb-0">
                Courses
              </p>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body text-center">
              <Award
                size={45}
                className="text-warning mb-3"
              />

              <h3 className="fw-bold">
                {report?.completionRate || 0}%
              </h3>

              <p className="text-muted mb-0">
                Completion Rate
              </p>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body text-center">
              <TrendingUp
                size={45}
                className="text-info mb-3"
              />

              <h3 className="fw-bold">
                {report?.averageGrade || 0}%
              </h3>

              <p className="text-muted mb-0">
                Average Grade
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS */}

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <ChartCard title="Enrollment Trend">
            <AreaChartComponent
              data={report?.enrollmentTrend || []}
              xKey="month"
              dataKey="students"
            />
          </ChartCard>
        </div>

        <div className="col-lg-4">
          <ChartCard title="Course Completion">
            <RadialChartComponent
              data={report?.completionChart || []}
            />
          </ChartCard>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <ChartCard title="Assignment Performance">
            <BarChartComponent
              data={report?.assignmentPerformance || []}
              xKey="course"
              dataKey="averageScore"
            />
          </ChartCard>
        </div>

        <div className="col-lg-6">
          <ChartCard title="Student Distribution">
            <PieChartComponent
              data={report?.studentDistribution || []}
            />
          </ChartCard>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12">
          <ChartCard title="Monthly Performance">
            <LineChartComponent
              data={report?.monthlyPerformance || []}
              xKey="month"
              dataKey="score"
            />
          </ChartCard>
        </div>
      </div>

      {/* TOP COURSES */}

      <div className="card border-0 shadow-sm rounded-5 mt-5">
        <div className="card-body">

          <h5 className="fw-bold mb-4">
            Top Performing Courses
          </h5>

          <div className="table-responsive">
            <table className="table align-middle">

              <thead>
                <tr>
                  <th>Course</th>
                  <th>Students</th>
                  <th>Completion Rate</th>
                  <th>Average Score</th>
                </tr>
              </thead>

              <tbody>

                {(report?.topCourses || []).map((course) => (
                  <tr key={course.id}>
                    <td>{course.title}</td>

                    <td>{course.students}</td>

                    <td>{course.completionRate}%</td>

                    <td>{course.averageScore}%</td>
                  </tr>
                ))}

              </tbody>

            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
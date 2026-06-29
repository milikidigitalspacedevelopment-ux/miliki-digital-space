import { useEffect, useMemo, useState } from "react";
import {
  Award,
  Download,
  Eye,
  Search,
  Calendar,
  BadgeCheck,
} from "lucide-react";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

import courseService from "../../services/courseService";

function CertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);

      const response =
        await courseService.getCertificates?.();

      setCertificates(response || []);
    } catch (err) {
      setError("Unable to load certificates.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCertificates = useMemo(() => {
    return certificates.filter((certificate) =>
      certificate.courseTitle
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [certificates, search]);

  const handleDownload = async (id) => {
    try {
      await courseService.downloadCertificate?.(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePreview = (certificate) => {
    console.log("Preview certificate:", certificate);
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <ErrorState
        title="Certificates Error"
        message={error}
        onRetry={fetchCertificates}
      />
    );
  }

  if (!certificates.length) {
    return (
      <EmptyState
        title="No Certificates Yet"
        description="Certificates will appear after successfully completing courses."
      />
    );
  }

  return (
    <div className="container-fluid py-4">

      {/* Header */}

      <div className="mb-5">

        <h2 className="fw-bold mb-2">
          My Certificates
        </h2>

        <p className="text-muted">
          Download and manage all earned certificates.
        </p>

      </div>

      {/* Search */}

      <div className="card border-0 shadow-sm rounded-5 mb-5">

        <div className="card-body">

          <div className="input-group">

            <span className="input-group-text bg-white border-end-0">

              <Search size={18} />

            </span>

            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search certificates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>

      </div>

      {/* Certificates */}

      <div className="row g-4">

        {filteredCertificates.map((certificate) => (

          <div
            className="col-lg-4 col-md-6"
            key={certificate.id}
          >

            <div className="card border-0 shadow-sm rounded-5 h-100">

              <div className="card-body">

                <div className="text-center mb-4">

                  <Award
                    size={60}
                    className="text-warning"
                  />

                </div>

                <h5 className="fw-bold text-center mb-3">

                  {certificate.courseTitle}

                </h5>

                <div className="mb-3">

                  <div className="d-flex align-items-center mb-2">

                    <Calendar
                      size={16}
                      className="text-primary me-2"
                    />

                    <small>
                      Completed:
                      {" "}
                      {certificate.completedAt}
                    </small>

                  </div>

                  <div className="d-flex align-items-center mb-2">

                    <BadgeCheck
                      size={16}
                      className="text-success me-2"
                    />

                    <small>
                      Grade:
                      {" "}
                      {certificate.grade}
                    </small>

                  </div>

                </div>

                <div className="bg-light rounded-4 p-3 mb-4">

                  <small className="text-muted">
                    Verification Code
                  </small>

                  <div className="fw-bold">

                    {certificate.verificationCode}

                  </div>

                </div>

                <div className="d-grid gap-2">

                  <button
                    className="btn btn-outline-primary rounded-pill"
                    onClick={() =>
                      handlePreview(certificate)
                    }
                  >

                    <Eye
                      size={16}
                      className="me-2"
                    />

                    Preview

                  </button>

                  <button
                    className="btn btn-success rounded-pill"
                    onClick={() =>
                      handleDownload(certificate.id)
                    }
                  >

                    <Download
                      size={16}
                      className="me-2"
                    />

                    Download PDF

                  </button>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default CertificatesPage;
import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Download,
  HeartHandshake,
} from "lucide-react";

import donationService from "../../services/donationService";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

import TableSearch from "../../components/tables/TableSearch";
import TablePagination from "../../components/tables/TablePagination";

function DonationsPage() {
  const [donations, setDonations] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);

      const response =
        await donationService.getMyDonations?.();

      setDonations(response || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load donations.");
    } finally {
      setLoading(false);
    }
  };

  const filteredDonations = useMemo(() => {
    return donations.filter(
      (donation) =>
        donation.campaign
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        donation.method
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        donation.status
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [donations, search]);

  const totalPages = Math.ceil(
    filteredDonations.length / pageSize
  );

  const paginatedDonations = filteredDonations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDownloadReceipt = async (id) => {
    try {
      await donationService.downloadReceipt?.(id);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorState
        title="Donations Error"
        message={error}
        onRetry={fetchDonations}
      />
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}

      <div className="mb-4">
        <h2 className="fw-bold mb-2">
          Donation History
        </h2>

        <p className="text-muted">
          View all your donations and download
          receipts.
        </p>
      </div>

      {/* Search */}

      <div className="card border-0 shadow-sm rounded-5 mb-4">
        <div className="card-body">

          <TableSearch
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search donations..."
          />

        </div>
      </div>

      {/* Empty State */}

      {filteredDonations.length === 0 ? (
        <EmptyState
          icon={<HeartHandshake size={50} />}
          title="No Donations Found"
          message="You have not made any donations yet."
        />
      ) : (
        <>
          {/* Table */}

          <div className="card border-0 shadow-sm rounded-5">

            <div className="card-body">

              <div className="table-responsive">
                <table className="table align-middle">

                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Campaign</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {paginatedDonations.map(
                      (donation) => (
                        <tr key={donation.id}>
                          <td>{donation.date}</td>

                          <td>
                            {donation.campaign}
                          </td>

                          <td>
                            KES{" "}
                            {donation.amount?.toLocaleString()}
                          </td>

                          <td>{donation.method}</td>

                          <td>
                            <span
                              className={`badge bg-${
                                donation.status ===
                                "Completed"
                                  ? "success"
                                  : donation.status ===
                                    "Pending"
                                  ? "warning"
                                  : "danger"
                              }`}
                            >
                              {donation.status}
                            </span>
                          </td>

                          <td>

                            <div className="d-flex gap-2">

                              <button className="btn btn-outline-primary btn-sm rounded-pill">
                                <Eye
                                  size={16}
                                  className="me-1"
                                />
                                View
                              </button>

                              <button
                                className="btn btn-outline-success btn-sm rounded-pill"
                                onClick={() =>
                                  handleDownloadReceipt(
                                    donation.id
                                  )
                                }
                              >
                                <Download
                                  size={16}
                                  className="me-1"
                                />
                                Receipt
                              </button>

                            </div>

                          </td>
                        </tr>
                      )
                    )}

                  </tbody>

                </table>
              </div>

            </div>

          </div>

          {/* Pagination */}

          <div className="mt-4">
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default DonationsPage;
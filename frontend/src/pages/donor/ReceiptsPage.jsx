import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Download,
  Printer,
  ReceiptText,
} from "lucide-react";

import donationService from "../../services/donationService";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

import TableSearch from "../../components/tables/TableSearch";
import TablePagination from "../../components/tables/TablePagination";

function ReceiptsPage() {
  const [receipts, setReceipts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      setLoading(true);

      const response =
        await donationService.getReceipts?.();

      setReceipts(response || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load receipts.");
    } finally {
      setLoading(false);
    }
  };

  const filteredReceipts = useMemo(() => {
    return receipts.filter(
      (receipt) =>
        receipt.receiptNumber
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        receipt.campaign
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        receipt.status
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [receipts, search]);

  const totalPages = Math.ceil(
    filteredReceipts.length / pageSize
  );

  const paginatedReceipts = filteredReceipts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDownload = async (id) => {
    try {
      await donationService.downloadReceipt?.(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = (receipt) => {
    window.print(receipt);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorState
        title="Receipts Error"
        message={error}
        onRetry={fetchReceipts}
      />
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}

      <div className="mb-4">
        <h2 className="fw-bold mb-2">
          Receipt Center
        </h2>

        <p className="text-muted">
          View, download and print donation receipts.
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
            placeholder="Search receipts..."
          />

        </div>
      </div>

      {/* Empty State */}

      {filteredReceipts.length === 0 ? (
        <EmptyState
          icon={<ReceiptText size={55} />}
          title="No Receipts Found"
          message="Your donation receipts will appear here."
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
                      <th>Receipt No.</th>
                      <th>Date</th>
                      <th>Campaign</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {paginatedReceipts.map(
                      (receipt) => (
                        <tr key={receipt.id}>
                          <td>
                            {receipt.receiptNumber}
                          </td>

                          <td>{receipt.date}</td>

                          <td>{receipt.campaign}</td>

                          <td>
                            KES{" "}
                            {receipt.amount.toLocaleString()}
                          </td>

                          <td>
                            <span className="badge bg-success">
                              {receipt.status}
                            </span>
                          </td>

                          <td>

                            <div className="d-flex gap-2">

                              <button className="btn btn-outline-primary btn-sm rounded-pill">
                                <Eye
                                  size={15}
                                  className="me-1"
                                />
                                View
                              </button>

                              <button
                                className="btn btn-outline-success btn-sm rounded-pill"
                                onClick={() =>
                                  handleDownload(
                                    receipt.id
                                  )
                                }
                              >
                                <Download
                                  size={15}
                                  className="me-1"
                                />
                                Download
                              </button>

                              <button
                                className="btn btn-outline-secondary btn-sm rounded-pill"
                                onClick={() =>
                                  handlePrint(
                                    receipt
                                  )
                                }
                              >
                                <Printer
                                  size={15}
                                  className="me-1"
                                />
                                Print
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

export default ReceiptsPage;
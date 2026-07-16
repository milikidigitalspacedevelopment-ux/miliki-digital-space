import { useEffect, useMemo, useState } from "react";
import { Mail, Send, Users, Sparkles } from "lucide-react";
import api from "../../services/api";
import communicationsService from "../../services/communicationsService";

function CommunicationsPage() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await api.get("/users");
        const payload = response?.data?.data ?? response?.data?.users ?? response?.data ?? [];
        const normalized = Array.isArray(payload) ? payload : [];
        setUsers(normalized.filter((user) => user?.email));
      } catch (err) {
        console.error(err);
        setError("Unable to load users for the audience list.");
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  const selectedCount = selectedRecipients.length;

  const allEmails = useMemo(() => users.map((user) => user.email), [users]);

  const toggleRecipient = (email) => {
    setSelectedRecipients((current) =>
      current.includes(email) ? current.filter((item) => item !== email) : [...current, email]
    );
  };

  const selectAll = () => {
    setSelectedRecipients(allEmails);
  };

  const clearSelection = () => {
    setSelectedRecipients([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    setFeedback("");
    setError("");

    try {
      const response = await communicationsService.sendMassEmail({
        subject,
        message,
        recipients: selectedRecipients,
        sendNotification: true,
        metadata: { userId: null },
      });

      const data = response?.data?.data;
      setFeedback(`Queued ${data?.queuedCount || selectedRecipients.length} message${selectedRecipients.length === 1 ? "" : "s"} for delivery.`);
      setSubject("");
      setMessage("");
      setSelectedRecipients([]);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Unable to queue the mass email right now.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Communications Center</h2>
          <p className="text-muted mb-0">Send outreach emails to your audience and keep supporters informed.</p>
        </div>
        <div className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">
          <Sparkles size={16} className="me-2" />
          Batch delivery ready
        </div>
      </div>

      <div className="row g-4">
        <div className="col-xl-8">
          <div className="card border-0 shadow-sm rounded-5">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Compose broadcast</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Subject</label>
                  <input
                    className="form-control"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder="Weekly update from Miliki"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    rows="8"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Write a helpful newsletter or announcement here..."
                    required
                  />
                </div>

                <div className="d-flex flex-wrap gap-2">
                  <button className="btn btn-primary rounded-pill px-4" type="submit" disabled={sending || !subject || !message || selectedRecipients.length === 0}>
                    <Send size={16} className="me-2" />
                    {sending ? "Queuing..." : "Queue broadcast"}
                  </button>
                  <button className="btn btn-outline-secondary rounded-pill" type="button" onClick={selectAll}>
                    Select all users
                  </button>
                  <button className="btn btn-outline-danger rounded-pill" type="button" onClick={clearSelection}>
                    Clear selection
                  </button>
                </div>
              </form>

              {feedback ? <div className="alert alert-success mt-3 mb-0">{feedback}</div> : null}
              {error ? <div className="alert alert-danger mt-3 mb-0">{error}</div> : null}
            </div>
          </div>
        </div>

        <div className="col-xl-4">
          <div className="card border-0 shadow-sm rounded-5">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold mb-0">Recipients</h5>
                <span className="badge bg-success-subtle text-success rounded-pill px-3">{selectedCount} selected</span>
              </div>

              <div className="mb-3 text-muted small">
                The system batches delivery in groups of 10 every 6 minutes for reliability.
              </div>

              <div className="border rounded-4 p-3" style={{ maxHeight: 420, overflowY: "auto" }}>
                {loadingUsers ? (
                  <div className="text-muted">Loading contacts...</div>
                ) : users.length === 0 ? (
                  <div className="text-muted">No users with email addresses were found.</div>
                ) : (
                  users.map((user) => (
                    <label key={user.id || user.email} className="d-flex align-items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedRecipients.includes(user.email)}
                        onChange={() => toggleRecipient(user.email)}
                      />
                      <span className="flex-grow-1">
                        <div className="fw-semibold">{user.name || user.full_name || "Unnamed user"}</div>
                        <div className="small text-muted">{user.email}</div>
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunicationsPage;

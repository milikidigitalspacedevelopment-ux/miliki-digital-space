import { useState, useEffect } from "react";
import { Mail, Edit } from "lucide-react";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

function MessagesPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Placeholder: no backend messages service yet
    setLoading(true);
    setTimeout(() => {
      setMessages([]);
      setLoading(false);
    }, 300);
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error)
    return (
      <ErrorState title="Messages Error" message={error} onRetry={() => {}} />
    );

  if (!messages.length)
    return (
      <div className="container-fluid py-4">
        <div className="mb-5">
          <h2 className="fw-bold mb-2">Messages</h2>
          <p className="text-muted">Your conversations and messages will appear here.</p>
        </div>

        <EmptyState
          title="No Messages"
          description="You don't have any messages yet. Use the compose button to start a conversation."
        />

        <div className="mt-4">
          <button className="btn btn-primary rounded-pill d-inline-flex align-items-center">
            <Edit size={16} className="me-2" />
            Compose
          </button>
        </div>
      </div>
    );

  return (
    <div className="container-fluid py-4">
      <div className="mb-5">
        <h2 className="fw-bold mb-2">Messages</h2>
        <p className="text-muted">Your conversations.</p>
      </div>

      <div className="card border-0 shadow-sm rounded-5">
        <div className="card-body">{/* render messages when implemented */}</div>
      </div>
    </div>
  );
}

export default MessagesPage;

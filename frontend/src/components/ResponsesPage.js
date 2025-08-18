import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Res.css';

export default function ResponsesPage() {
  const { rfpId } = useParams();
  const [rfp, setRfp] = useState(null);
  const [loadingRfp, setLoadingRfp] = useState(true);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRfpDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/rfp/${rfpId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch RFP details');
      const data = await res.json();
      setRfp(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingRfp(false);
    }
  }, [rfpId]);

  const fetchResponses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/rfpGet/${rfpId}/responses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch responses');
      const data = await res.json();
      setResponses(data.responses || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [rfpId]);

  useEffect(() => {
    fetchRfpDetails();
    fetchResponses();
  }, [fetchRfpDetails, fetchResponses]);

  async function updateResponseStatus(responseId, newStatus) {
    setUpdatingId(responseId);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/rfpRes/${responseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ responseStatus: newStatus }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update response');
      }
      setResponses(prevResponses =>
        prevResponses.map(resp =>
          resp._id === responseId ? { ...resp, responseStatus: newStatus } : resp
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  }


  if (loading) return <p>Loading responses...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;
//   if (responses.length === 0) return <p>No responses yet.</p>;

  return (
    <div className="container-fluid px-0 mx-0 body"> 
    <div className='container-fluid head_pane mb-3'>
        <div className="container py-5 pb-3 d-flex align-items-center">
            <a href="/dashboard" className='me-3 mb-3 back-btn'><i class="bi bi-arrow-left-circle-fill"></i></a>
      <h4 className="title mb-3">Responses for Proposal</h4>
      <div className='flex-grow-1'>
      <button
    className="btn btn-primary btn-ref mb-3 float-end"
    onClick={fetchResponses}
    disabled={updatingId !== null} // optional: disable during update
  >
    Refresh
  </button>
  </div>
      </div>
      <div className="container pb-3">
         {loadingRfp ? (
            <p>Loading proposal...</p>
        ) : rfp ? (
            <>
            <p><strong>Proposal Name:</strong> {rfp.title}</p>
            <p className='clamp-3'><strong>Description:</strong> {rfp.description}</p>
            <p><strong>Deadline:</strong> {new Date(rfp.deadline).toLocaleDateString()}</p>
            </>
        ) : (
            <p>Proposal not found.</p>
        )}
      </div>
      </div>

    <div className='container'>
  {responses.length > 0 ? (
    <ul className="list-group">
      {responses.map((resp) => (
        <li
          key={resp._id}
          className={`list-group-item mb-3 ${
            resp.responseStatus === "approved"
              ? "list-card-approved"
              : resp.responseStatus === "rejected"
              ? "list-card-reject"
              : "list-card"
          }`}
        >
          <strong>Supplier:</strong> {resp.supplierName || "Unknown"}
          <br />
          <strong>Response:</strong> {resp.responseText}
          <br />
          <small className="float-end">
            Submitted at: {new Date(resp.submittedAt).toLocaleString()}
          </small>
          <br />

          {(resp.responseStatus === "pending" ||
          resp.responseStatus === "interested") ? (
            <>
              <button
                disabled={updatingId === resp._id}
                onClick={() => updateResponseStatus(resp._id, "approved")}
                className="btn btn-success btn-app btn-sm me-2 mt-2 float-end"
              >
                Approve
              </button>
              <button
                disabled={updatingId === resp._id}
                onClick={() => updateResponseStatus(resp._id, "rejected")}
                className="btn btn-danger btn-rej btn-sm mt-2 float-end"
              >
                Reject
              </button>
            </>
          ) : (
            <p
              className={`float-end status ${
                resp.responseStatus === "approved" ? "approved" : "reject"
              }`}
            >
              {resp.responseStatus}
            </p>
          )}
        </li>
      ))}
    </ul>
  ) : (
    <p>No responses yet.</p>
  )}
</div>

    </div>
  );
}

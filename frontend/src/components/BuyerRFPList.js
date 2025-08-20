// frontend/src/components/BuyerRFPList.js
import React, { useEffect, useState } from 'react';
import '../styles/List.css';

export default function BuyerRFPList() {
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch buyer's RFPs from backend on mount
  useEffect(() => {
    async function fetchRFPs() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/rfp/list', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch RFPs');
        const data = await res.json();
        setRfps(data.rfps || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRFPs();
  }, []);

  // Delete RFP
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this RFP?")) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/rfp/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete RFP');

      // remove from state after success
      setRfps((prev) => prev.filter((rfp) => rfp._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  if (error) return <p className="text-danger">Error: {error}</p>;

  if (rfps.length === 0) return <p>No RFPs found. Create one!</p>;

  return (
    <div>
      <h4 className="title mb-4">Your Proposals</h4>
      <div className="row align-items-stretch">
        {rfps.map((rfp) => (
          <div
            key={rfp._id}
            className="col-xl-4 col-lg-6 col-md-6 col-12 pb-4 mb-4 d-flex flex-column justify-content-between align-items-center"
          >
            <div className="w-100 h-100">
              <div className="list-card border_bottom p-3 pb-0 h-100 w-100">
                <strong className="card-title">{rfp.title}</strong>
                <p className="mb-1 card-desc mt-2">{rfp.description}</p>
                <hr className="mb-2" />
                <small>
                  <strong>Deadline:</strong>{" "}
                  {new Date(rfp.deadline).toLocaleDateString()}
                </small>
                <br />
                <small className="card-stat">
                  <strong>Status:</strong> {rfp.status}
                </small>

                {rfp.documents && rfp.documents.length > 0 && (
                  <div className="mt-2">
                    <p className="card-doc d-inline">Documents:</p>{" "}
                    {rfp.documents.map((doc, index) => (
                      <span key={index}>
                        <a
                          href={`/${doc.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="card-doc-link"
                        >
                          <i className="bi bi-file-earmark-pdf-fill"></i> View Doc{" "}
                          {rfp.documents.length > 1 ? index + 1 : ""}
                        </a>
                        {index < rfp.documents.length - 1 && ", "}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Buttons row */}
              <div className="d-flex gap-2 mt-2">
                <button
                  onClick={() =>
                    (window.location.href = `/responses/${rfp._id}`)
                  }
                  className="btn btn-outline-primary w-100 py-2"
                >
                  <i className="bi bi-eye-fill me-1"></i> See Responses
                </button>

                <button
                  onClick={() => handleDelete(rfp._id)}
                  className="btn btn-outline-danger w-100 py-2"
                >
                  <i className="bi bi-trash-fill me-1"></i> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

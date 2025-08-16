import React, { useEffect, useState } from 'react';
import '../styles/Res.css';

export default function SupplierResponses() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMyResponses() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/subRes/myresponses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch your responses');
        const data = await res.json();
        setResponses(data.responses || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMyResponses();
  }, []);

  if (loading) return <p>Loading your responses...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;
  if (responses.length === 0) return <p>You have not responded to any proposals yet.</p>;

  return (
    <div className="container-fluid px-0 mx-0 body">
        <div className="container-fluid py-5 pb-3 head_pane">
        <div className="container">
            <div className="d-flex px-0 mx-0 align-items-center">
            <a href="/dashboard" className='me-3 mb-3 back-btn'><i class="bi bi-arrow-left-circle-fill"></i></a>
      <h3 className='title mb-3'>Your Responses to Proposals</h3>
      </div>
      </div>
      </div>
      <div className="container">
      <div className="row mt-4">
        {responses.map(resp => (
          <div className='col-xl-4 col-lg-4 col-md-6 my-2 col-12 '>
          <div key={resp._id} className={`p-3 h-100 ${
            resp.responseStatus === 'approved' ? 'list-card-approved' :
            resp.responseStatus === 'rejected' ? 'list-card-reject' : 'list-card'
          }`}>
            <h5>{resp.rfp.title}</h5>
            <p className='clamp-3'><strong>Description:</strong> {resp.rfp.description}</p>
            <p className='clamp-3 mb-1'><strong>Deadline:</strong> {new Date(resp.rfp.deadline).toLocaleDateString()}</p>
            <hr />
            <p className='clamp-3 mb-1'><strong>Your Response:</strong> {resp.responseText}</p>
            <p className='clamp-3'>
              <strong>Status: </strong>
              {resp.responseStatus === 'approved' && (
                <span className="text-success">Approved ✅</span>
              )}
              {resp.responseStatus === 'rejected' && (
                <span className="text-danger">Rejected ❌</span>
              )}
              {(resp.responseStatus === 'pending' || resp.responseStatus === 'interested') && (
                <span className="text-warning">Pending ⏳</span>
              )}
            </p>

            {/* Default messages */}
            {resp.responseStatus === 'approved' && (
              <p className="alert alert-success alert-my">Your proposal has been approved. Congratulations!</p>
            )}
            {resp.responseStatus === 'rejected' && (
              <p className="alert alert-danger alert-my">Sorry, your proposal has been rejected.</p>
            )}
            {(resp.responseStatus === 'pending' || resp.responseStatus === 'interested') && (
              <p className="alert alert-info alert-my">Your response is under review. Please wait for the decision.</p>
            )}
          </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

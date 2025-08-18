import React, { useState, useEffect } from 'react';
import '../styles/List.css';

export default function SupplierRFPList() {
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // For response modal
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [currentRfp, setCurrentRfp] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [submitError, setSubmitError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setRfps([]);
      return;
    }
    setLoading(true);
    setError(null);
    fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: searchTerm }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch search results');
        return res.json();
      })
      .then(data => {
        setRfps(data.hits || []);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchTerm]);

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      setSearchTerm(searchInput.trim());
    }
  };

  const handleSearchClick = () => {
    setSearchTerm(searchInput.trim());
  };

  // Open modal for a specific RFP
  const openResponseModal = (rfp) => {
    setCurrentRfp(rfp);
    setResponseText('');
    setSubmitError(null);
    setShowResponseModal(true);
  };

  const closeResponseModal = () => {
    setShowResponseModal(false);
    setCurrentRfp(null);
    setResponseText('');
  };

  // Submit response to backend
  const handleResponseSubmit = async () => {
    if (!responseText.trim()) {
      setSubmitError('Response cannot be empty');
      return;
    }

    setSubmitLoading(true);
    setSubmitError(null);

    try {
      const token = localStorage.getItem('token'); // assuming you use token auth
      const res = await fetch('/api/rfpRes/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rfpId: currentRfp.objectID,
          responseText,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit response');
      }

      alert('Response submitted successfully!');
      closeResponseModal();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <p>Loading proposals...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div>
      <h4 className='title mb-4'>Available Proposals</h4>
      <div className="input-group mb-3">
        <input
          type="text"
          placeholder="Search proposals..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="form-control"
        />
        <button onClick={handleSearchClick} className="btn btn-primary" type="button">
          Search
        </button>
      </div>
      {rfps.length === 0 ? (
        <p>No proposals found.</p>
      ) : (
        <div className="row align-items-stretch">
          {rfps.map(rfp => (
            <div
              key={rfp.objectID}
              className="col-xl-4 col-lg-3 col-md-6 col-12 d-flex justify-content-between align-items-center"
            >
              <div className='list-card p-3 pb-4 mb-2 w-100 h-100'>
                <strong className='card-title'>{rfp.title}</strong>
                <p className="mb-1 card-desc mt-2">{rfp.description}</p>
                <hr className='mb-2' />
                <small><strong>Deadline:</strong> {new Date(rfp.deadline).toLocaleDateString()}</small><br />
                <small className='card-stat'><strong>Status:</strong> {rfp.status}</small>
                {rfp.documents && rfp.documents.length > 0 && (
                  <div className="mt-2">
                    <p className='card-doc d-inline'>Documents:</p>{' '}
                    {rfp.documents.map((doc, index) => (
                      <span key={index}>
                        <a
                          href={`/${doc.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className='card-doc-link'
                        >
                          <i className="bi bi-file-earmark-pdf-fill"></i> View Doc {rfp.documents.length > 1 ? index + 1 : ''}
                        </a>
                        {index < rfp.documents.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                )}

                {/* Submit Response Button */}
                <button
                  className="btn btn-success success_btn mt-3 float-end"
                  onClick={() => openResponseModal(rfp)}
                >
                  Add Response
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for submitting response */}
      {showResponseModal && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={closeResponseModal}
        >
          <div
          className='modal-res'
            onClick={e => e.stopPropagation()}
          >
            <h5 className='mb-4'>Add your Response for "{currentRfp.title}"</h5>
            <textarea
              value={responseText}
              onChange={e => setResponseText(e.target.value)}
              rows={5}
              className='form-control'
              style={{ width: '100%', marginTop: 10 }}
              placeholder="Write your response here..."
            />
            {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
            <div style={{ marginTop: 20, textAlign: 'right' }}>
              <button className='btn btn-primary' onClick={closeResponseModal} disabled={submitLoading} style={{ marginRight: 10 }}>
                Cancel
              </button>
              <button className='btn btn-primary' onClick={handleResponseSubmit} disabled={submitLoading}>
                {submitLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

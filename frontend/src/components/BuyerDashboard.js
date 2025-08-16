import React, { useState } from 'react';
import '../styles/Dashboard.css';
import BuyerCreateRFP from './BuyerCreateRFP';
import BuyerRFPList from './BuyerRFPList'; // assuming you have this listing component

export default function BuyerDashboard() {
  const [view, setView] = useState('create'); // 'create' or 'list'

  return (
    <div>
      <div className="dash_pane p-3 pb-0">
        <div className="container">
          <h3 className="mb-1">Buyer Dashboard</h3>
          <p className="mb-3">This is where buyer-specific content will go.</p>
          <div className='d-flex align-items-center'>
                <button 
                className={`btn btn-sm me-2 pb-2 px-2 ${view === 'create' ? 'btn-nav-active' : 'btn-nav'}`}
                onClick={() => setView('create')}
                >
                <i class="bi bi-plus-circle-fill me-2"></i>
                Create Proposal
                </button>
                <button 
                className={`btn btn-sm pb-2 px-2 ${view === 'list' ? 'btn-nav-active' : 'btn-nav'}`}
                onClick={() => setView('list')}
                >
                <i class="bi bi-card-list me-2"></i>
                View Proposals
                </button>
            </div>
          </div>
      </div>
      <div className="container mt-3">
        {view === 'create' && <BuyerCreateRFP />}
        {view === 'list' && <BuyerRFPList />}
      </div>
    </div>
  );
}

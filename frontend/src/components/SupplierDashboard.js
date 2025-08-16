// frontend/src/components/SupplierDashboard.js
import React from 'react';
import '../styles/Dashboard.css';
import SupplierRFPList from './SupplierRFPList';

export default function SupplierDashboard() {
  return (
    <div>
          <div className="dash_pane p-3 pb-0">
            <div className="container">
            <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-1">Supplier Dashboard</h3>
              <p className="mb-3">This is where supplier-specific content will go.</p>
              </div>
              <div>
                <a href="/my-responses" className='res-btn float-end'>Response Review</a>
              </div>
            </div>  
            </div>
            
          </div>
          <div className="container mt-3">
            <SupplierRFPList />
          </div>
        </div>
  );

}

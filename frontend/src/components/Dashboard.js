// frontend/src/components/Dashboard.js
import React from 'react';
import BuyerDashboard from './BuyerDashboard';
import SupplierDashboard from './SupplierDashboard';
import NotificationBell from './NotificationBell';
import '../styles/Dashboard.css';
export default function Dashboard({ user, onLogout }) {
  return (
    <div className="container-fluid mx-0 px-0 body">
        <div className="containe-fluid dashboard-pane pt-5">
        <div className="container pb-1">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className='title mb-0'>👋 Welcome, {user.email} ({user.role})</h2>
                <div className='d-flex'>
                <NotificationBell userId={user._id} userRole={user.role} />
                <button class="btn btn-secondary logout" onClick={onLogout}><i class="bi bi-power"></i></button>
                </div>
            </div>
            <div>
        </div>
        </div>
        </div>
        <div className="container-fluid mx-0 px-0">
            {user.role === 'buyer' ? (
                <BuyerDashboard user={user} />
            ) : (
                <SupplierDashboard user={user} />
            )}
            </div>
    </div>  
  );
}

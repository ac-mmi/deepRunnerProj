// frontend/src/components/Dashboard.js
import React from 'react';
import BuyerDashboard from './BuyerDashboard';
import SupplierDashboard from './SupplierDashboard';
import '../styles/Dashboard.css';
import Navbar from './Navbar';
import GridImage from '../assets/grid.png'
export default function Dashboard({ user, onLogout }) {
  return (
    <div className="container-fluid mx-0 px-0 body">
        <Navbar user={user} onLogout={onLogout}/>
        <div className="container-fluid dashboard-pane pt-4 pb-2">
            <img src={GridImage} className='grid' alt="" />
        <div className="container pb-1">
            <div className="d-flex flex-column justify-content-start align-items-start mb-4">
                <h6 className='greet mb-1'>Good Morning,</h6>
                <h2 className='title mb-0'>👋 Welcome, {user.email} ({user.role})</h2>
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

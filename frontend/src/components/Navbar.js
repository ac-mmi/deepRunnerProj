import React from 'react';
import NotificationBell from './NotificationBell';
import '../styles/Nav.css';
const Navbar = ({user,onLogout}) => {
  return (
    <div className='container-fluid navbar'>
        <div className="container">
            <div className='d-flex justify-content-between align-items-center w-100'>
                <h6 className='logo mb-0'>
                    <i class="bi bi-stars"></i>
                </h6>
                <div className='d-flex justify-content-end align-items-center'>
                        <NotificationBell userId={user._id} userRole={user.role} />
                        <button class="btn btn-secondary logout" onClick={onLogout}><i class="bi bi-power"></i></button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar
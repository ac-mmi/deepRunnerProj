import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import '../styles/Bell.css';

export default function NotificationBell({ userId, userRole }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const socketRef = useRef(null);

 useEffect(() => {
  if (!socketRef.current) {
    socketRef.current = io("http://localhost:5000", { transports: ['websocket'] });
  }
  const socket = socketRef.current;

  if (userId) {
    socket.emit('register', userId);
  }

  // Buyer gets notification when a supplier responds
  socket.on('newResponse', (data) => {
    if (userRole === 'buyer') {
      console.log("📩 newResponse received:", data);
      setNotifications(prev => [{ message: data.message, time: new Date() }, ...prev]);
      setUnreadCount(count => count + 1);
    }
  });

  // Supplier gets notification when buyer updates response status
  socket.on('responseStatusUpdated', (data) => {
    if (userRole === 'supplier') {
      console.log("📩 responseStatusUpdated received:", data);
      setNotifications(prev => [{ message: data.message, time: new Date() }, ...prev]);
      setUnreadCount(count => count + 1);
    }
  });

  // NEW: Notify when an RFP is deleted
  socket.on('rfpDeleted', (data) => {
    console.log("🔥 rfpDeleted event received:", data, typeof data);
    console.log("🔥 rfpDeleted event received:", data);
    setNotifications(prev => [{ message: data.message, time: new Date() }, ...prev]);
    setUnreadCount(count => count + 1);
  });

  // ✅ Cleanup at root level (important)
  return () => {
    socket.off('newResponse');
    socket.off('responseStatusUpdated');
    socket.off('rfpDeleted');
  };
}, [userId, userRole]);


const toggleDropdown = () => {
    if (!open) {
      // When opening dropdown, reset unread count (hide badge)
      setUnreadCount(0);
    }
    setOpen(!open);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={toggleDropdown}
        className="btn btn-light btn-bell position-relative"
      >
        <i className="bi bi-bell-fill"></i>
        {unreadCount > 0 && (
          <span className="position-absolute translate-middle badge rounded-pill bg-danger danger-font">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="dropdown-menu show" style={{ position: 'absolute', right: 0 }}>
          {notifications.length === 0 ? (
            <p className="dropdown-item">No notifications</p>
          ) : (
            notifications.map((n, idx) => (
              <p
                key={idx}
                className="dropdown-item"
                style={{ cursor: 'pointer' }}
                onClick={() => setNotifications(prev => prev.filter((_, i) => i !== idx))}
              >
                {n.message} <br />
                <small>{n.time.toLocaleTimeString()}</small>
              </p>
            ))
          )}
        </div>
      )}
    </div>
  );
}

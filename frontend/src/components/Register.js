// frontend/src/components/Register.js
import React, { useState } from 'react';
import '../styles/Login.css';
export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [message, setMessage] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(null);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Registered successfully! Please login.');
    } else {
      setMessage(data.error || 'Registration failed');
    }
  };

  return (
     <div className="container-fluid px-0 mx-0">
      <div className="row px-0 mx-0 align-items-center">
    <div className="container form mt-5 px-3 py-3 pb-4" style={{ maxWidth: '400px' }}>
  <h2 className="form-title mb-2">Register</h2>
  <p className='form-subtitle mb-3'>Join our platform to connect Buyers and Suppliers.</p>
  {message && <div className="alert alert-info">{message}</div>}
  <form onSubmit={handleSubmit}>
    <div className="mb-3">
      <label className="mb-2 form-label">Email</label>
      <input
        type="email"
        className="form-control"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
    </div>
    <div className="mb-3">
      <label className="mb-2 form-label">Password</label>
      <input
        type="password"
        className="form-control"
        required
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
    </div>
    <div className="mb-3">
      <label className="mb-2 form-label">Role</label>
      <select
        className="form-select"
        value={role}
        onChange={e => setRole(e.target.value)}
      >
        <option value="buyer">Buyer</option>
        <option value="supplier">Supplier</option>
      </select>
    </div>
    <button className="btn btn-primary submit-btn w-100" type="submit">Register</button>
    <p className='text-center mt-3 form-subtitle'>Already have an account? <a href="./login">Log in</a> here</p>

  </form>
</div>
<div className='reg_log_back col-lg-6 col-12'></div>
</div>
</div>

  );
}

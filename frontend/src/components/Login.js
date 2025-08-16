// frontend/src/components/Login.js
import React, { useState } from 'react';
import '../styles/Login.css';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(null);

    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      onLogin(data);
    } else {
      setMessage(data.error || 'Login failed');
    }
  };

  return (
    <div className="container-fluid px-0 mx-0">
      <div className="row mx-0 px-0 align-items-center">
    <div className="container col-lg-6 col-12 form mt-5 px-3 py-3 pb-4" style={{ maxWidth: '400px' }}>
      <h2 className='form-title mb-2'>Welcome Back 👋</h2>
      <p className='mb-4 form-subtitle'>Sign in to track proposals and responses.</p>
      {message && <div className="alert alert-danger">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className='mb-2 form-label'>Email</label>
          <input
            type="email" className="form-control" required
            value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className='mb-2 form-label'>Password</label>
          <input
            type="password" className="form-control" required
            value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary submit-btn w-100" type="submit">Login</button>
        <p className='text-center mt-3 form-subtitle'>Don't have an account? <a href="./register">Register here</a></p>
      </form>
    </div>
    <div className='reg_log_back col-lg-6 col-12'></div>
    </div>
    </div>
  );
}

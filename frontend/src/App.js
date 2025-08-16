import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ResponsesPage from './components/ResponsesPage';
import SupplierResponses from './components/MyResponses';

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoadingUser(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  if (loadingUser) return <p>Loading...</p>;

  // Protect private routes
  function PrivateRoute({ children }) {
    return user ? children : <Navigate to="/login" replace />;
  }

  // Redirect logged-in users away from login/register
  function PublicRoute({ children }) {
    return !user ? children : <Navigate to="/dashboard" replace />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login onLogin={handleLogin} />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* Single dashboard route */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard user={user} onLogout={handleLogout} />
          </PrivateRoute>
        } />

        {/* Responses page */}
        <Route path="/responses/:rfpId" element={
          <PrivateRoute>
            <ResponsesPage user={user} />
          </PrivateRoute>
        } />
        
        {/* Supplier Responses page */}
        <Route path="/my-responses" element={
          <PrivateRoute>
            <SupplierResponses user={user} />
          </PrivateRoute>
        } />

        {/* Redirect root */}
        <Route path="/" element={
          user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } />

        {/* 404 fallback */}
        <Route path="*" element={<p>Page Not Found</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

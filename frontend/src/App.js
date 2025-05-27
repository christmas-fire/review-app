import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import SplashScreen from './components/SplashScreen/SplashScreen';
import AuthScreen from './components/AuthScreen/AuthScreen';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import ArticleManagement from './components/ArticleManagement/ArticleManagement';
import UserManagement from './components/UserManagement/UserManagement';

function AppContent() {
  const [authMode, setAuthMode] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return !!savedUser;
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const handleNavigateToAuth = (mode) => {
    setAuthMode(mode);
  };

  const handleAuthSuccess = (userData) => {
    console.log('Authentication successful:', userData);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <div className="App">
      <Routes>
        <Route 
          path="/" 
          element={
            !isAuthenticated ? (
              <SplashScreen onNavigate={handleNavigateToAuth} />
            ) : user?.role === 'admin' ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <div className="App-header-authenticated">
                <h1>Welcome, {user?.username || 'User'}!</h1>
                <p>You are logged in to ReviewApp.</p>
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </div>
            )
          } 
        />
        <Route 
          path="/auth" 
          element={
            !isAuthenticated ? (
              <AuthScreen initialMode={authMode} onAuthSuccess={handleAuthSuccess} />
            ) : (
              user?.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            isAuthenticated && user?.role === 'admin' ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
        <Route 
          path="/admin/articles" 
          element={
            isAuthenticated && user?.role === 'admin' ? (
              <ArticleManagement />
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            isAuthenticated && user?.role === 'admin' ? (
              <UserManagement />
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {isAuthenticated && user?.role !== 'admin' && (
         <div style={{ textAlign: 'center', padding: '10px' }}> 
         </div>
      )}
       {isAuthenticated && user?.role === 'admin' && (
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <button onClick={handleLogout} className="logout-button" style={{ position: 'fixed', bottom: '20px', right: '20px' }}>Выйти</button>
          </div>
        )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
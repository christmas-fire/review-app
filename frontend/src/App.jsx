import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import SplashScreen from './components/SplashScreen/SplashScreen';
import AuthScreen from './components/AuthScreen/AuthScreen';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import ArticleManagement from './components/ArticleManagement/ArticleManagement';
import UserManagement from './components/UserManagement/UserManagement';
import AuthorDashboard from './components/AuthorDashboard/AuthorDashboard';
import CreateArticle from './components/CreateArticle/CreateArticle';
import MyArticles from './components/MyArticles/MyArticles';
import UserProfile from './components/UserProfile/UserProfile';

// Reviewer components
import ReviewerDashboard from './components/ReviewerDashboard/ReviewerDashboard';
import AvailableReviews from './components/AvailableReviews/AvailableReviews';
import CreateReview from './components/CreateReview/CreateReview';
import MyReviewsPage from './components/MyReviewsPage/MyReviewsPage';

// Helper component for protected routes
const ProtectedRoute = ({ isAuthenticated, userRole, allowedRoles, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // If the user role is not allowed, redirect to their default dashboard or a generic page
    // This prevents users from accessing dashboards not meant for them
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'author':
        return <Navigate to="/author/dashboard" replace />;
      case 'reviewer':
        return <Navigate to="/reviewer/dashboard" replace />;
      default:
        return <Navigate to="/" replace />; // Fallback to home or a generic "access denied" page
    }
  }
  return children;
};

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
            ) : user?.role === 'author' ? (
              <Navigate to="/author/dashboard" replace />
            ) : user?.role === 'reviewer' ? (
              <Navigate to="/reviewer/dashboard" replace />
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
              user?.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : 
              user?.role === 'author' ? <Navigate to="/author/dashboard" replace /> : 
              user?.role === 'reviewer' ? <Navigate to="/reviewer/dashboard" replace /> : 
              <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={user?.role} allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/articles" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={user?.role} allowedRoles={['admin']}>
              <ArticleManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={user?.role} allowedRoles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/author/dashboard" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={user?.role} allowedRoles={['author']}>
              <AuthorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/author/articles/create" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={user?.role} allowedRoles={['author']}>
              <CreateArticle />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/author/articles/my" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={user?.role} allowedRoles={['author']}>
              <MyArticles />
            </ProtectedRoute>
          } 
        />
        {/* <Route 
          path="/author/profile" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={user?.role} allowedRoles={['author']}>
              <MyProfile />
            </ProtectedRoute>
          } 
        /> */}
        {/* Reviewer Routes */}
        <Route 
          path="/reviewer/dashboard" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={user?.role} allowedRoles={['reviewer']}>
              <ReviewerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reviewer/available-reviews" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={user?.role} allowedRoles={['reviewer']}>
              <AvailableReviews />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reviewer/create-review/:articleId" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={user?.role} allowedRoles={['reviewer']}>
              <CreateReview />
            </ProtectedRoute>
          } 
        />
        {/* <Route 
          path="/reviewer/profile" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={user?.role} allowedRoles={['reviewer']}>
              <ReviewerProfile />
            </ProtectedRoute>
          } 
        /> */}
        <Route 
          path="/reviewer/my-reviews"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={user?.role} allowedRoles={['reviewer']}>
              <MyReviewsPage />
            </ProtectedRoute>
          } 
        />
        {/* New Unified Profile Route */}
        <Route 
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={user?.role} allowedRoles={null}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {isAuthenticated && (user?.role === 'author' || user?.role === 'admin' || user?.role === 'reviewer') && (
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

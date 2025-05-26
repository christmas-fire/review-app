import React, { useState } from 'react';
import './App.css';
import SplashScreen from './components/SplashScreen/SplashScreen';
import AuthScreen from './components/AuthScreen/AuthScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [authMode, setAuthMode] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);


  const handleNavigateToAuth = (mode) => {
    setAuthMode(mode);
    setCurrentScreen('auth');
  };

  const handleAuthSuccess = (userData) => {
    console.log('Authentication successful:', userData);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentScreen('splash'); 
  };

  if (isAuthenticated) {
    return (
      <div className="App">
        <header className="App-header-authenticated"> {/* Изменено для потенциально другого стиля */}
          <h1>Welcome, {user?.username || 'User'}!</h1>
          <p>You are logged in to ReviewApp.</p>
          {/* Здесь будет  основной контент приложения после логина */}
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      {currentScreen === 'splash' && <SplashScreen onNavigate={handleNavigateToAuth} />}
      {currentScreen === 'auth' && <AuthScreen initialMode={authMode} onAuthSuccess={handleAuthSuccess} />}
    </div>
  );
}

export default App;
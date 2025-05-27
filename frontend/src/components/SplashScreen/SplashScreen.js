import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';

function SplashScreen({ onNavigate }) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    onNavigate('login');
    navigate('/auth');
  };

  const handleRegisterClick = () => {
    onNavigate('register');
    navigate('/auth');
  };

  return (
    <div className="splash-screen-container">
      <div className="splash-content">
        <h1 className="splash-title">review-app</h1>
        <p className="splash-tagline">Платформа для рецензирования статей</p>
        <div className="splash-actions">
            <button 
              onClick={handleLoginClick}
              className="splash-button splash-button-primary"
            >
              Войти
            </button>
            <button 
              onClick={handleRegisterClick}
              className="splash-button splash-button-secondary"
            >
              Регистрация
            </button>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
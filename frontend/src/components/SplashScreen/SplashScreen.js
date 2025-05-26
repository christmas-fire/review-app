import React from 'react';
import './SplashScreen.css';

function SplashScreen({ onNavigate }) {
  return (
    <div className="splash-screen-container">
      <div className="splash-content">
        <h1 className="splash-title">review-app</h1>
        <p className="splash-tagline">Платформа для рецензирования статей</p>
        <div className="splash-actions">
            <button 
              onClick={() => onNavigate('login')} 
              className="splash-button splash-button-primary"
            >
              Войти
            </button>
            <button 
              onClick={() => onNavigate('register')} 
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
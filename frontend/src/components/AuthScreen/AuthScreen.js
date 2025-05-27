import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthScreen.css';

const API_BASE_URL = 'http://localhost:8080';

function AuthScreen({ initialMode = 'login', onAuthSuccess }) {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(initialMode === 'login');
  const [formData, setFormData] = useState({
    username: '',
    email: '', 
    password: '',
    confirmPassword: '',
    role: 'author',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoginMode(initialMode === 'login');
    setFormData({ 
        username: '', 
        email: '', 
        password: '', 
        confirmPassword: '',
        role: 'author'
    });
    setError('');
    setMessage('');
  }, [initialMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    if (!isLoginMode) {
      if (formData.password !== formData.confirmPassword) {
        setError('Пароли не совпадают!');
        setIsLoading(false);
        return;
      }
      if (!formData.username || !formData.email || !formData.password) {
        setError('Имя пользователя, email и пароль обязательны для регистрации.');
        setIsLoading(false);
        return;
      }
      if (!formData.role) { 
          setError('Пожалуйста, выберите роль.');
          setIsLoading(false);
          return;
      }
    } else {
      if (!formData.username || !formData.password) {
        setError('Имя пользователя и пароль обязательны для входа.');
        setIsLoading(false);
        return;
      }
    }

    const endpoint = isLoginMode 
      ? `${API_BASE_URL}/api/v1/auth/login` 
      : `${API_BASE_URL}/api/v1/auth/register`;
    
    let payload;
    if (isLoginMode) {
      payload = { username: formData.username, password: formData.password };
    } else {
      payload = { 
        username: formData.username, 
        email: formData.email, 
        password: formData.password,
        role: formData.role
      };
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      // console.log('API Login Response Data:', data); // Keep for debugging if needed, or remove

      if (response.ok) {
        if (isLoginMode && data.token) { // Check if data.token exists
          try {
            const token = data.token;
            // Decode JWT payload
            const payloadBase64Url = token.split('.')[1];
            const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
            const decodedPayloadString = atob(payloadBase64);
            const decodedPayload = JSON.parse(decodedPayloadString);

            console.log('Decoded JWT Payload:', decodedPayload); // Log the decoded payload

            // Construct userData with info from token and the token itself
            const userData = { 
              ...decodedPayload, // Spread all fields from payload (e.g., id, username, role, exp, iat)
              token: token 
            };

            onAuthSuccess(userData); // Pass the combined user data and token

            if (decodedPayload.role === 'admin') {
              navigate('/admin/dashboard');
            } else if (decodedPayload.role === 'author') {
              navigate('/author/dashboard');
            } else {
              // For non-admins, show success message (if login mode)
              // The onAuthSuccess call above already updated App state, App.js will handle user's welcome screen
              setMessage('Вход выполнен успешно!'); 
              // Optionally, navigate non-admins to a default page if desired, e.g., navigate('/')
              // For now, showing message and relying on App.js to show authenticated view
            }
          } catch (e) {
            console.error('Error decoding JWT or processing login:', e);
            setError('Ошибка обработки данных пользователя.');
            // Clear any potentially partially set auth state if onAuthSuccess was called prematurely
            // This depends on how onAuthSuccess and App.js state are structured
          }
        } else if (!isLoginMode) { // Registration success
          setMessage('Регистрация прошла успешно! Пожалуйста, войдите.');
          setIsLoginMode(true);
          setFormData({ 
              username: payload.username, // Pre-fill username for login
              email: '', 
              password: '', 
              confirmPassword: '',
              role: 'author'
          });
        } else {
          // Handle cases where login is successful but token is missing, or other unexpected response
          setError(data.error || data.message || 'Неожиданный ответ от сервера при входе.');
        }
      } else {
        setError(data.error || data.message || `Ошибка: ${response.status}`);
      }
    } catch (err) {
      console.error('API call failed:', err);
      setError('Не удалось подключиться к серверу. Проверьте ваше интернет-соединение или настройки сервера.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setMessage('');
    setFormData({ 
        username: '', 
        email: '', 
        password: '', 
        confirmPassword: '',
        role: 'author'
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h2 className="auth-title">{isLoginMode ? 'Вход' : 'Создать аккаунт'}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Поле Имя пользователя */}
          <div className="form-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Введите имя пользователя"
              required
            />
          </div>

          {/* Поле Email (только для регистрации) */}
          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Введите ваш email"
                required={!isLoginMode}
              />
            </div>
          )}

          {/* Поле Пароль */}
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите пароль"
              required
            />
          </div>

          {/* Поле Подтвердите пароль (только для регистрации) */}
          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Подтвердите пароль</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Подтвердите пароль"
                required={!isLoginMode}
              />
            </div>
          )}

          {/* Поле Выбор роли (только для регистрации) */}
          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="role">Зарегистрироваться как:</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="admin">Администратор</option>
                <option value="author">Автор</option>
                <option value="reviewer">Рецензент</option>
              </select>
            </div>
          )}

          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Обработка...' : (isLoginMode ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>
        <p className="toggle-mode-text">
          {isLoginMode ? "Нет аккаунта?" : 'Уже есть аккаунт?'}
          <button onClick={toggleMode} className="toggle-button-link">
            {isLoginMode ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthScreen;
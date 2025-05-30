import React, { useState } from 'react';
import './CreateUserModal.css';

const API_BASE_URL = 'http://localhost:8080';

function CreateUserModal({ isOpen, onClose, onUserCreated }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'author', 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.username || !formData.email || !formData.password || !formData.role) {
      setError('Все поля обязательны для заполнения.');
      setIsLoading(false);
      return;
    }

    const token = JSON.parse(localStorage.getItem('user'))?.token;
    if (!token) {
      setError('Ошибка: Действие требует авторизации.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || `Ошибка ${response.status} при создании пользователя`);
      }
      
      onUserCreated(); 
      onClose(); 
      setFormData({ username: '', email: '', password: '', role: 'author' });

    } catch (err) {
      console.error('Failed to create user:', err);
      setError(err.message || 'Не удалось создать пользователя.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Создать нового пользователя</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Роль</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="author">Автор</option>
              <option value="reviewer">Рецензент</option>
            </select>
          </div>
          {error && <p className="error-message modal-error">{error}</p>}
          <div className="modal-actions">
            <button type="submit" className="action-button" disabled={isLoading}>
              {isLoading ? 'Создание...' : 'Создать'}
            </button>
            <button type="button" className="action-button secondary" onClick={onClose} disabled={isLoading}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUserModal; 

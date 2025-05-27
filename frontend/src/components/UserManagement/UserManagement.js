import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UserManagement.css'; 
import CreateUserModal from '../CreateUserModal/CreateUserModal'; 

const API_BASE_URL = 'http://localhost:8080'; 

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    if (!token) {
      setError('Ошибка: Пользователь не авторизован или токен отсутствует.');
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Ошибка ${response.status} при загрузке пользователей`);
      }
      const data = await response.json();
      setUsers(data.users || data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err.message || 'Не удалось загрузить пользователей.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); 
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return;
    }
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    if (!token) {
      setError('Ошибка: Действие требует авторизации.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Ошибка ${response.status} при удалении пользователя`);
      }
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError(err.message || 'Не удалось удалить пользователя.');
    }
  };

  const handleToggleBlockUser = async (userId, currentIsBlocked) => {
    const actionText = currentIsBlocked ? 'разблокировать' : 'заблокировать';
    if (!window.confirm(`Вы уверены, что хотите ${actionText} этого пользователя?`)) {
      return;
    }
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    if (!token) {
      setError('Ошибка: Действие требует авторизации.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}/block`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Ошибка ${response.status} при изменении статуса блокировки`);
      }
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, is_blocked: !user.is_blocked } : user
        )
      );
    } catch (err) {
      console.error('Failed to toggle block status for user:', err);
      setError(err.message || 'Не удалось изменить статус блокировки.');
    }
  };

  const handleUserCreated = () => {
    fetchUsers();
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Управление пользователями</h1>
        <nav className="breadcrumbs">
          <Link to="/admin/dashboard">Панель администратора</Link> &gt; Управление пользователями
        </nav>
      </header>

      <div className="actions-bar">
        <button className="action-button" onClick={() => setIsModalOpen(true)}>
          Создать нового пользователя
        </button>
      </div>

      <CreateUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onUserCreated={handleUserCreated} 
      />

      {isLoading && <div className="loading-indicator"><p>Загрузка пользователей...</p></div>}
      {error && <div className="error-display error-message"><p>Ошибка: {error}</p></div>}
      
      {!isLoading && !error && (
        <div className="content-card users-table-card">
          {users.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Имя пользователя</th>
                  <th>Email</th>
                  <th>Роль</th>
                  <th>Заблокирован</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.is_blocked ? 'Да' : 'Нет'}</td>
                    <td>
                      <button 
                        onClick={() => handleToggleBlockUser(user.id, user.is_blocked)}
                        className="action-button-small block"
                      >
                        {user.is_blocked ? 'Разблокировать' : 'Блокировать'}
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)} 
                        className="action-button-small delete"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Пользователи не найдены.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default UserManagement; 

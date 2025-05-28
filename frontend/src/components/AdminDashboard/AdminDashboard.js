import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDashboard.css'; 

const API_BASE_URL = 'http://localhost:8080'; 

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const [articleCount, setArticleCount] = useState('N/A');
  const [userCount, setUserCount] = useState('N/A');
  const [pendingReviewCount, setPendingReviewCount] = useState('N/A'); 
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoadingStats(true);
      setStatsError(null);
      const token = user?.token;

      if (!token) {
        setStatsError('Token не найден, не удается загрузить статистику.');
        setIsLoadingStats(false);
        return;
      }

      try {
        const articlesResponse = await fetch(`${API_BASE_URL}/api/v1/articles/`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!articlesResponse.ok) throw new Error('Ошибка при загрузке статей');
        const articlesData = await articlesResponse.json();
        const articlesArray = Array.isArray(articlesData) ? articlesData : (articlesData.articles || []);
        setArticleCount(articlesArray.length);

        const pendingCount = articlesArray.filter(article => article.is_reviewed === false).length;
        setPendingReviewCount(pendingCount);
        
        const usersResponse = await fetch(`${API_BASE_URL}/api/v1/users/`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!usersResponse.ok) throw new Error('Ошибка при загрузке пользователей');
        const usersData = await usersResponse.json();
        setUserCount(Array.isArray(usersData) ? usersData.length : (usersData.users ? usersData.users.length : 0));

      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        setStatsError(error.message);
        setArticleCount('N/A'); 
        setUserCount('N/A');
        setPendingReviewCount('N/A'); 
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchCounts();
  }, [user?.token]); 

  return (
    <div className="admin-dashboard-container">
      <header className="dashboard-header">
        <h1 className="admin-dashboard-title">Панель администратора</h1>
        <p className="welcome-message">Добро пожаловать!</p>
      </header>

      <section className="dashboard-stats">
        <div className="stat-card">
          <h3>Статьи</h3>
          <p>{isLoadingStats ? '...' : statsError ? 'X' : articleCount}</p>
        </div>
        <div className="stat-card">
          <h3>Пользователи</h3>
          <p>{isLoadingStats ? '...' : statsError ? 'X' : userCount}</p>
        </div>
        <div className="stat-card">
          <h3>Ожидают проверки</h3>
          <p>{isLoadingStats ? '...' : statsError ? 'X' : pendingReviewCount}</p>
        </div>
      </section>

      <nav className="admin-dashboard-nav">
        <ul className="admin-dashboard-ul">
          <li className="admin-dashboard-li">
            <Link to="/admin/articles" className="admin-dashboard-link">
              <span className="link-icon">&#128221;</span> {/* Icon: Memo/Document */}
              Управление статьями
            </Link>
          </li>
          <li className="admin-dashboard-li">
            <Link to="/admin/users" className="admin-dashboard-link">
              <span className="link-icon">&#128101;</span> {/* Icon: Multiple Users */}
              Управление пользователями
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminDashboard; 
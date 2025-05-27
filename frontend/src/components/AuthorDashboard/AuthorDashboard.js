import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthorDashboard.module.css';

const API_BASE_URL = 'http://localhost:8080';

function AuthorDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [myArticleCount, setMyArticleCount] = useState('N/A');
  const [reviewedArticleCount, setReviewedArticleCount] = useState('N/A');
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoadingStats(true);
      setStatsError(null);
      const token = user?.token;

      if (!token) {
        setStatsError('Токен не найден, не удается загрузить статистику.');
        setIsLoadingStats(false);
        return;
      }

      try {
        // Fetch author's articles
        const articlesResponse = await fetch(`${API_BASE_URL}/api/v1/articles/my`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!articlesResponse.ok) throw new Error('Ошибка при загрузке статей');
        const articlesData = await articlesResponse.json();
        const articlesArray = Array.isArray(articlesData) ? articlesData : (articlesData.articles || []);
        setMyArticleCount(articlesArray.length);

        // Count reviewed articles
        const reviewedCount = articlesArray.filter(article => article.is_reviewed === true).length;
        setReviewedArticleCount(reviewedCount);

      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        setStatsError(error.message);
        setMyArticleCount('N/A');
        setReviewedArticleCount('N/A');
      } finally {
        setIsLoadingStats(false);
      }
    };

    if (user && user.role === 'author') {
      fetchCounts();
    }
  }, [user?.token]);

  if (!user || user.role !== 'author') {
    // Optionally, redirect or show an access denied message
    return <p>У вас нет доступа к этой странице.</p>;
  }

  return (
    <div className={styles.authorDashboardContainer}>
      <header className={styles.dashboardHeader}>
        <h1 className={styles.authorDashboardTitle}>Панель автора</h1>
        <p className={styles.welcomeMessage}>Добро пожаловать!</p>
      </header>

      <section className={styles.dashboardStats}>
        <div className={styles.statCard}>
          <h3>Мои статьи</h3>
          <p>{isLoadingStats ? '...' : statsError ? 'X' : myArticleCount}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Проверенные статьи</h3>
          <p>{isLoadingStats ? '...' : statsError ? 'X' : reviewedArticleCount}</p>
        </div>
      </section>

      <nav className={styles.authorDashboardNav}>
        <ul className={styles.authorDashboardUl}>
          <li className={styles.authorDashboardLi}>
            <Link to="/author/articles/create" className={styles.authorDashboardLink}>
              <span className={styles.linkIcon}>&#10133;</span> {/* Icon: Plus sign */}
              Создать статью
            </Link>
          </li>
          <li className={styles.authorDashboardLi}>
            <Link to="/author/articles/my" className={styles.authorDashboardLink}>
              <span className={styles.linkIcon}>&#128220;</span> {/* Icon: Articles/Documents */}
              Мои статьи
            </Link>
          </li>
          <li className={styles.authorDashboardLi}>
            <Link to="/author/profile" className={styles.authorDashboardLink}>
              <span className={styles.linkIcon}>&#128100;</span> {/* Icon: User silhouette */}
              Личный кабинет
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AuthorDashboard; 
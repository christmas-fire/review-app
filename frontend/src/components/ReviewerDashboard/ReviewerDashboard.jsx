import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './ReviewerDashboard.module.css';

const API_BASE_URL = 'http://localhost:8080';

function ReviewerDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  const [availableReviewsCount, setAvailableReviewsCount] = useState('N/A');
  const [myTotalReviewsCount, setMyTotalReviewsCount] = useState('N/A');
  
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoadingStats(true);
      setStatsError(null);
      const token = user?.token;

      if (!token) {
        setStatsError('Токен не найден, не удается загрузить данные.');
        setIsLoadingStats(false);
        return;
      }

      let availableCount = 'N/A';
      let totalMyReviews = 'N/A';
      let fetchError = null;

      try {
        const availableResponse = await fetch(`${API_BASE_URL}/api/v1/articles/available`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!availableResponse.ok) {
            const errText = await availableResponse.text();
            throw new Error(errText || 'Ошибка загрузки доступных ревью');
        }
        const availableData = await availableResponse.json();
        availableCount = Array.isArray(availableData) ? availableData.length : (availableData.articles || availableData.reviews || []).length;
      } catch (error) {
        console.error("Failed to fetch available reviews stats:", error);
        fetchError = (fetchError ? fetchError + "; " : "") + error.message;
      }

      try {
        const myReviewsResponse = await fetch(`${API_BASE_URL}/api/v1/reviews/my`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!myReviewsResponse.ok) {
            const errText = await myReviewsResponse.text();
            throw new Error(errText || 'Ошибка загрузки истории ревью');
        }
        const myReviewsData = await myReviewsResponse.json();
        totalMyReviews = Array.isArray(myReviewsData) ? myReviewsData.length : (myReviewsData.reviews || []).length;
      } catch (error) {
        console.error("Failed to fetch my reviews stats:", error);
        fetchError = (fetchError ? fetchError + "; " : "") + error.message;
      }
      
      setAvailableReviewsCount(availableCount);
      setMyTotalReviewsCount(totalMyReviews);
      if(fetchError) setStatsError(fetchError);
      setIsLoadingStats(false);
    };

    if (user && user.role === 'reviewer') {
        fetchDashboardData();
    } else {
        setIsLoadingStats(false);
        setStatsError('Недостаточно прав для просмотра данной страницы.');
    }
  }, [user?.token, user?.role]);

  return (
    <div className={styles.reviewerDashboardContainer}>
      <header className={styles.dashboardHeader}>
        <h1 className={styles.reviewerDashboardTitle}>Панель ревьюера</h1>
        <p className={styles.welcomeMessage}>Добро пожаловать!</p>
      </header>

      <section className={styles.dashboardStats}>
        <div className={styles.statCard}>
          <h3>Доступно для ревью</h3>
          <p>{isLoadingStats ? '...' : statsError && availableReviewsCount === 'N/A' ? 'X' : availableReviewsCount}</p>
        </div>
        <div className={styles.statCard}>
            <h3>Мои ревью</h3>
            <p>{isLoadingStats ? '...' : statsError && myTotalReviewsCount === 'N/A' ? 'X' : myTotalReviewsCount}</p>
        </div>
      </section>

      <nav className={styles.reviewerDashboardNav}>
        <ul className={styles.reviewerDashboardUl}>
          <li className={styles.reviewerDashboardLi}>
            <Link to="/reviewer/available-reviews" className={styles.reviewerDashboardLink}>
              <span className={styles.linkIcon}>📄</span>
              Доступные ревью
            </Link>
          </li>
          <li className={styles.reviewerDashboardLi}>
            <Link to="/reviewer/my-reviews" className={styles.reviewerDashboardLink}>
              <span className={styles.linkIcon}>📜</span>
              История моих ревью
            </Link>
          </li>
          <li className={styles.reviewerDashboardLi}>
            <Link to="/profile" className={styles.reviewerDashboardLink}>
              <span className={styles.linkIcon}>👤</span>
              Мой профиль
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default ReviewerDashboard; 

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyReviewsList from '../MyReviewsList/MyReviewsList'; 
import styles from './MyReviewsPage.module.css';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

const API_BASE_URL = 'http://localhost:8080';

function MyReviewsPage() {
  const [myReviews, setMyReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchMyReviews = async () => {
      setIsLoading(true);
      setError(null);

      if (!user || !user.token) {
        setError('Вы не авторизованы для просмотра этой страницы.');
        setIsLoading(false);
        return;
      }
      if (user.role !== 'reviewer') {
        setError('У вас нет прав для просмотра этой страницы.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/reviews/my`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          let errorToThrow;
          try {
            const errData = await response.json();
            errorToThrow = new Error(errData.error || errData.message || `Ошибка ${response.status}`);
          } catch (e) {
            const textError = await response.text().catch(() => 'Ошибка при загрузке истории ревью');
            errorToThrow = new Error(textError || `Ошибка ${response.status}: ${response.statusText}`);
          }
          throw errorToThrow;
        }

        const data = await response.json();
        setMyReviews(Array.isArray(data) ? data : (data.reviews || []));
      } catch (err) {
        console.error("Failed to fetch my reviews for page:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyReviews();
  }, [user?.token, user?.role]);

  return (
    <div className={styles.myReviewsPageContainer}>
      <h2 className={styles.pageTitle}>История моих ревью</h2>
      <Breadcrumbs items={[
        { label: 'Панель ревьюера', to: '/reviewer/dashboard' },
        { label: 'История моих ревью' }
      ]} />
      <MyReviewsList reviews={myReviews} isLoading={isLoading} error={error} />
      <button onClick={() => navigate('/reviewer/dashboard')} className={styles.backButton}>
        Назад
      </button>
    </div>
  );
}

export default MyReviewsPage; 

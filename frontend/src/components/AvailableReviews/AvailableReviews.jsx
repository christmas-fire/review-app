import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './AvailableReviews.module.css';
import ArticleCard from '../ArticleCard/ArticleCard';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import articleCardStyles from '../ArticleCard/ArticleCard.module.css';

const API_BASE_URL = 'http://localhost:8080';

function AvailableReviews() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const fetchAvailableReviews = async () => {
      setIsLoading(true);
      setError(null);

      if (!user || !user.token) {
        setError('Вы не авторизованы для просмотра доступных ревью.');
        setIsLoading(false);
        return;
      }
      if (user.role !== 'reviewer') {
        setError('У вас нет прав для просмотра этой страницы.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/articles/available`, {
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
            let textError = 'Ошибка при загрузке доступных ревью';
            try {
                textError = await response.text();
            } catch (textEx) {
                // ignore
            }
            errorToThrow = new Error(textError || `Ошибка ${response.status}: ${response.statusText}`);
          }
          throw errorToThrow;
        }

        const data = await response.json();
        setReviews(Array.isArray(data) ? data : (data.articles || []));
      } catch (err) {
        console.error("Error fetching available reviews:", err); 
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableReviews();
  }, []);

  if (isLoading) {
    return <div className={styles.loadingMessage}>Загрузка доступных ревью...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  return (
    <div className={styles.availableReviewsContainer}>
      <h2 className={styles.title}>Статьи, доступные для ревью</h2>
      <Breadcrumbs items={[
        { label: 'Панель ревьюера', to: '/reviewer/dashboard' },
        { label: 'Доступные для ревью' }
      ]} />
      {reviews.length === 0 ? (
        <p className={styles.noReviewsMessage}>Нет статей, доступных для ревью в данный момент.</p>
      ) : (
        <div className={styles.reviewList}>
          {reviews.map((article) => (
            <ArticleCard
              key={article.id}
              article={article} 
              actionButtonText="Написать ревью"
              actionButtonLinkTo={`/reviewer/create-review/${article.id}`}
              showAuthor={true}
              statusText="Ожидает вашего ревью"
              statusClassName={articleCardStyles.statusPending}
            />
          ))}
        </div>
      )}
      <div className={styles.backButtonContainer}>
        <button onClick={() => navigate('/reviewer/dashboard')} className={styles.backButton}>
          Назад
        </button>
      </div>
    </div>
  );
}

export default AvailableReviews; 

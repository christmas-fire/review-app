import React, { useState } from 'react';
import styles from './MyReviewsList.module.css';
import ArticleDetailsModal from '../ArticleDetailsModal/ArticleDetailsModal';

const API_BASE_URL = 'http://localhost:8080';

function MyReviewsList({ reviews, isLoading: isLoadingList, error: listError }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);
  const [articleError, setArticleError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleViewArticle = async (articleId) => {
    if (!articleId) return;
    setIsModalOpen(true);
    setIsLoadingArticle(true);
    setArticleError(null);
    setSelectedArticle(null);

    try {
      const token = user?.token;
      if (!token) {
        throw new Error("Требуется авторизация");
      }
      const response = await fetch(`${API_BASE_URL}/api/v1/articles/${articleId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        let errorToThrow;
        try {
            const errData = await response.json();
            errorToThrow = new Error(errData.error || errData.message || 'Не удалось загрузить статью.');
        } catch (e) {
            const textError = await response.text().catch(() => 'Ошибка сервера при загрузке статьи');
            errorToThrow = new Error(textError || `Ошибка ${response.status}`);
        }
        throw errorToThrow;
      }
      const data = await response.json();
      setSelectedArticle(data.article || data);
    } catch (err) {
      console.error("Error fetching article for modal:", err);
      setArticleError(err.message);
    } finally {
      setIsLoadingArticle(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
    setArticleError(null);
  };

  if (isLoadingList) {
    return <p className={styles.loadingMessage}>Загрузка ваших ревью...</p>;
  }

  if (listError) {
    return <p className={styles.errorMessage}>{listError}</p>;
  }

  if (!reviews || reviews.length === 0) {
    return <p className={styles.noReviewsMessage}>Вы еще не написали ни одного ревью.</p>;
  }

  return (
    <div className={styles.myReviewsContainer}>
      <ul className={styles.reviewList}>
        {reviews.map((review) => (
          <li key={review.id} className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
                <span className={styles.articleInfo}>Статья ID: {review.article_id}</span>
                <span className={`${styles.status} ${styles[review.status.toLowerCase()]}`}>
                    {review.status === 'accepted' ? 'Принято' : review.status === 'rejected' ? 'Отклонено' : review.status}
                </span>
            </div>
            <p className={styles.reviewContent}><strong>Комментарий:</strong> {review.content}</p>
            <div className={styles.reviewFooter}>
                <span className={styles.score}>Оценка: {review.score}/10</span>
                <span className={styles.date}>Дата: {new Date(review.created_at).toLocaleDateString('ru-RU')}</span>
            </div>
            <button 
              onClick={() => handleViewArticle(review.article_id)} 
              className={styles.viewArticleButton}
            >
              Посмотреть статью
            </button>
          </li>
        ))}
      </ul>
      {isModalOpen && (
        <ArticleDetailsModal 
          article={selectedArticle} 
          onClose={handleCloseModal} 
          isLoading={isLoadingArticle}
          error={articleError}
        />
      )}
    </div>
  );
}

export default MyReviewsList; 

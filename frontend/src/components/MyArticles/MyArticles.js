import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyArticles.module.css';
import ReviewDetailsModal from '../ReviewDetailsModal/ReviewDetailsModal';
import ArticleCard from '../ArticleCard/ArticleCard';
import articleCardStyles from '../ArticleCard/ArticleCard.module.css';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

const API_BASE_URL = 'http://localhost:8080';

// Helper function to determine status text for an article
const determineStatusText = (article) => {
  if (article.is_reviewed) {
    // Assuming article.review_status might exist if review is present
    // and can be 'accepted', 'rejected', etc.
    // If not, we derive from is_reviewed only.
    if (article.review_status === 'accepted') return 'Ревью принято';
    if (article.review_status === 'rejected') return 'Ревью отклонено';
    return 'Статья рассмотрена'; // Generic if review status is not more specific
  }
  return 'На рассмотрении';
};

// Helper function to get style class for article status
const getStatusStyle = (article) => {
  if (article.is_reviewed) {
    if (article.review_status === 'accepted') return articleCardStyles.statusReviewed;
    if (article.review_status === 'rejected') return articleCardStyles.statusRejected;
    return articleCardStyles.statusReviewed; // Default to green if reviewed but status unknown
  }
  return articleCardStyles.statusPending;
};

function MyArticles() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // State for Review Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);
      if (!user || !user.token) {
        setError('Вы не авторизованы для просмотра статей.');
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/articles/my`, {
          headers: { 'Authorization': `Bearer ${user.token}` },
        });
        if (!response.ok) {
          let errorToThrow;
          try {
            const errData = await response.json();
            errorToThrow = new Error(errData.error || 'Ошибка при загрузке статей');
          } catch (e) {
            const textError = await response.text().catch(() => 'Ошибка сервера при загрузке статей');
            errorToThrow = new Error(textError || `Ошибка ${response.status}`);
          }
          throw errorToThrow;
        }
        const data = await response.json();
        setArticles(Array.isArray(data) ? data : (data.articles || []));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewReview = async (reviewId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!reviewId) {
        setReviewError("ID ревью не найден для этой статьи.");
        setIsReviewModalOpen(true);
        return;
    }
    setIsReviewModalOpen(true);
    setIsLoadingReview(true);
    setReviewError(null);
    setSelectedReview(null);
    try {
      const token = user?.token;
      if (!token) throw new Error("Требуется авторизация");
      const response = await fetch(`${API_BASE_URL}/api/v1/reviews/${reviewId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        let errorToThrow;
        try {
            const errData = await response.json();
            errorToThrow = new Error(errData.error || errData.message || 'Не удалось загрузить ревью.');
        } catch (e) {
            const textError = await response.text().catch(() => 'Ошибка сервера при загрузке ревью');
            errorToThrow = new Error(textError || `Ошибка ${response.status}`);
        }
        throw errorToThrow;
      }
      const data = await response.json();
      setSelectedReview(data.review || data);
    } catch (err) {
      console.error("Error fetching review for modal:", err);
      setReviewError(err.message);
    } finally {
      setIsLoadingReview(false);
    }
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedReview(null);
    setReviewError(null);
  };

  if (isLoading) {
    return <div className={styles.loadingMessage}>Загрузка статей...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  return (
    <div className={styles.myArticlesContainer}>
      <h2 className={styles.title}>Мои статьи</h2>
      <Breadcrumbs items={[
        { label: 'Панель автора', to: '/author/dashboard' },
        { label: 'Мои статьи' }
      ]} />
      {articles.length === 0 ? (
        <p className={styles.noArticlesMessage}>У вас пока нет статей. <a href="/author/articles/create">Создать новую?</a></p>
      ) : (
        <div className={styles.articleList}>
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              actionButtonText={article.is_reviewed && article.review_id ? "Посмотреть ревью" : undefined}
              onActionButtonClick={article.is_reviewed && article.review_id ? () => handleViewReview(article.review_id) : undefined}
              showAuthor={false}
              statusText={determineStatusText(article)}
              statusClassName={getStatusStyle(article)}
            />
          ))}
        </div>
      )}
      <div className={styles.backButtonContainer}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
            Назад
        </button>
      </div>
      
      {isReviewModalOpen && (
        <ReviewDetailsModal 
          review={selectedReview}
          onClose={handleCloseReviewModal}
          isLoading={isLoadingReview}
          error={reviewError}
        />
      )}
    </div>
  );
}

export default MyArticles; 
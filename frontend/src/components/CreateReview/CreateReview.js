import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './CreateReview.module.css';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

const API_BASE_URL = 'http://localhost:8080';

function CreateReview() {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5); // Default rating
  const [isApproved, setIsApproved] = useState(true); // Default to approved

  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoadingArticle, setIsLoadingArticle] = useState(true);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchArticleDetails = async () => {
      if (!articleId) return;
      setIsLoadingArticle(true);
      setError(null);
      try {
        const token = user?.token;
        if (!token) {
          setError("Необходима авторизация для загрузки деталей статьи.");
          setIsLoadingArticle(false);
          return;
        }
        const response = await fetch(`${API_BASE_URL}/api/v1/articles/${articleId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          let errorToThrow;
          try {
            const errData = await response.json();
            errorToThrow = new Error(errData.error || errData.message || 'Не удалось загрузить детали статьи.');
          } catch (e) {
            let textError = 'Не удалось загрузить детали статьи';
            try { 
                const rText = await response.text();
                if(rText) textError = rText; 
            } catch (textEx) {/* ignore */}
            errorToThrow = new Error(textError || `Ошибка ${response.status}: ${response.statusText}`);
          }
          throw errorToThrow;
        }

        const data = await response.json();
        if (data) {
          // If data.article exists, use it. Otherwise, assume data itself is the article.
          setArticle(data.article || data); 
        } else {
          throw new Error('Ответ от сервера не содержит данных статьи.');
        }
      } catch (err) {
        console.error("Error fetching article details for review:", err);
        setError(err.message);
      } finally {
        setIsLoadingArticle(false);
      }
    };
    fetchArticleDetails();
  }, [articleId, user?.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccess(null);

    if (!user || !user.token) {
      setSubmitError('Вы не авторизованы для создания ревью.');
      return;
    }
    if (user.role !== 'reviewer') {
      setSubmitError('Только ревьюеры могут создавать ревью.');
      return;
    }
    if (!articleId) {
        setSubmitError('ID статьи не указан.');
        return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/reviews/`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ 
            article_id: parseInt(articleId, 10),
            content: comment,
            score: parseInt(rating, 10),
            status: isApproved ? "accepted" : "rejected"
        }),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        const text = await response.text().catch(() => "Ошибка сервера");
        throw new Error(text || `Ошибка ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || 'Ошибка при создании ревью');
      }

      setSuccess('Ревью успешно создано!');
      setComment('');
      setRating(5);
      setIsApproved(true);
      setTimeout(() => navigate('/reviewer/available-reviews'), 2000);
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  if (isLoadingArticle) {
    return <p className={styles.loadingMessage}>Загрузка данных статьи...</p>;
  }

  if (error) { // Error loading article
    return <p className={styles.errorMessage}>{error}</p>;
  }
  
  if (!article) { // Article not found or error during fetch
    return <p className={styles.errorMessage}>Не удалось найти статью для ревью.</p>;
  }

  return (
    <div className={styles.createReviewContainer}>
      <h2 className={styles.pageTitle}>Создать ревью</h2>
      <Breadcrumbs items={[
        { label: 'Панель ревьюера', to: '/reviewer/dashboard' },
        { label: 'Доступные для ревью', to: '/reviewer/available-reviews' },
        { label: 'Создать ревью' }
      ]} />
      <div className={styles.articlePreview}>
          <h2 className={styles.articlePreviewTitle}>{article.title}</h2>
          <p className={styles.articleCategory}><strong>Категория:</strong> {article.category}</p>
          <p className={styles.articleContent}><strong>Содержание:</strong></p>
          <div className={styles.contentBox}>{article.content}</div>
      </div>

      {submitError && <p className={styles.errorMessage}>{submitError}</p>}
      {success && <p className={styles.successMessage}>{success}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="comment" className={styles.label}>Комментарий:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className={styles.textarea}
            rows={5}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="rating" className={styles.label}>Оценка (1-10):</label>
          <input
            type="number"
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="10"
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="isApproved" className={styles.label}>Одобрить статью?</label>
          <select
            id="isApproved"
            value={isApproved ? 'yes' : 'no'}
            onChange={e => setIsApproved(e.target.value === 'yes')}
            className={styles.select}
          >
            <option value="yes">Да</option>
            <option value="no">Нет</option>
          </select>
        </div>
        <button type="submit" className={styles.submitButton}>Отправить ревью</button>
      </form>
      <button onClick={() => navigate('/reviewer/available-reviews')} className={styles.backButton}>Назад к списку</button>
    </div>
  );
}

export default CreateReview; 
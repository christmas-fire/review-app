import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyArticles.module.css';

const API_BASE_URL = 'http://localhost:8080';

function MyArticles() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
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
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Ошибка при загрузке статей');
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
  }, [user?.token]);

  if (isLoading) {
    return <p className={styles.loadingMessage}>Загрузка статей...</p>;
  }

  if (error) {
    return <p className={styles.errorMessage}>{error}</p>;
  }

  return (
    <div className={styles.myArticlesContainer}>
      <h2 className={styles.title}>Мои статьи</h2>
      {articles.length === 0 ? (
        <p className={styles.noArticlesMessage}>У вас пока нет статей. <a href="/author/articles/create">Создать новую?</a></p>
      ) : (
        <ul className={styles.articleList}>
          {articles.map((article) => (
            <li key={article.id} className={styles.articleItem}>
              <h3 className={styles.articleTitle}>{article.title}</h3>
              <div className={styles.articleMetaTop}>
                <span className={styles.articleCategory}>Категория: {article.category}</span>
              </div>
              <p className={styles.articleContentSnippet}>
                {article.content.substring(0, 150)}{article.content.length > 150 ? '...' : ''}
              </p>
              <div className={styles.articleMetaBottom}>
                <p className={styles.articleStatus}>
                  Статус: <span className={article.is_reviewed ? styles.statusReviewed : styles.statusPending}>
                    {article.is_reviewed ? 'Рассмотрена' : 'На рассмотрении'}
                  </span>
                </p>
                <span className={styles.articleDate}>
                  {new Date(article.created_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              {/* Optionally, add a link to view the full article if a route exists */}
              {/* <Link to={`/articles/${article.id}`} className={styles.readMoreLink}>Читать полностью</Link> */}
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate(-1)} className={styles.backButton}>Назад</button>
    </div>
  );
}

export default MyArticles; 
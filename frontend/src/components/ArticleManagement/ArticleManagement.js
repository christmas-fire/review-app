import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ArticleManagement.css'; // We'll create this CSS file next
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

const API_BASE_URL = 'http://localhost:8080'; // Consistent API base URL

function ArticleManagement() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchArticles = async () => {
    setIsLoading(true);
    setError(null);
    const token = JSON.parse(localStorage.getItem('user'))?.token;

    if (!token) {
      setError('Ошибка: Пользователь не авторизован или токен отсутствует.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/articles/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Ошибка ${response.status} при загрузке статей`);
      }

      const data = await response.json();
      setArticles(data.articles || data || []);
    } catch (err) {
      console.error('Failed to fetch articles:', err);
      setError(err.message || 'Не удалось загрузить статьи.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDeleteArticle = async (articleId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту статью?')) {
      return;
    }

    const token = JSON.parse(localStorage.getItem('user'))?.token;
    if (!token) {
      setError('Ошибка: Действие требует авторизации.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/articles/${articleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Ошибка ${response.status} при удалении статьи`);
      }

      setArticles(prevArticles => prevArticles.filter(article => article.id !== articleId));

    } catch (err) {
      console.error('Failed to delete article:', err);
      setError(err.message || 'Не удалось удалить статью.');
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Управление статьями</h1>
        <Breadcrumbs items={[
          { label: 'Панель администратора', to: '/admin/dashboard' },
          { label: 'Управление статьями' }
        ]} />
        <nav className="breadcrumbs" style={{ display: 'none' }}></nav> {/* старые крошки скрыты */}
      </header>

      <div className="actions-bar">
        {/* Placeholder for future actions like search or filters if uncommented */}
        {/* <button className="action-button">Создать новую статью</button> */}
        {/* <input type="text" placeholder="Поиск статей..." className="search-input" /> */}
        <p>Список всех статей в системе.</p> 
      </div>

      {isLoading && <div className="loading-indicator"><p>Загрузка статей...</p></div>}
      {error && <div className="error-display error-message"><p>Ошибка: {error}</p></div>}
      
      {!isLoading && !error && (
        <div className="content-card articles-table-card">
          {articles.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Заголовок</th>
                  <th>ID автора</th>
                  <th>Категория</th>
                  <th>Содержимое</th>
                  <th>Проверено</th>
                  <th>Создано</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {articles.map(article => (
                  <tr key={article.id}>
                    <td>{article.id}</td>
                    <td>{article.title || 'Без заголовка'}</td>
                    <td>{article.author_id || 'N/A'}</td>
                    <td>{article.category || 'N/A'}</td>
                    <td>{article.content || 'N/A'}</td>
                    <td>{article.is_reviewed ? 'Да' : 'Нет'}</td>
                    <td>{article.created_at ? new Date(article.created_at).toLocaleString() : 'N/A'}</td>
                    <td>
                      <button 
                        onClick={() => handleDeleteArticle(article.id)} 
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
            <p>Статьи не найдены.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ArticleManagement; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreateArticle.module.css';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

const API_BASE_URL = 'http://localhost:8080';

function CreateArticle() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const token = user?.token;
        if (!token) return;
        const res = await fetch('http://localhost:8080/api/v1/users/my', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setProfile(data.user);
      } catch (e) {
        setProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!user || !user.token) {
      setError('Вы не авторизованы для создания статьи.');
      return;
    }

    if (profile?.is_blocked) {
      setError('Ваш аккаунт заблокирован. Вы не можете отправлять статьи.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/articles/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ title, content, category }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при создании статьи');
      }

      setSuccess('Статья успешно создана!');
      setTitle('');
      setContent('');
      setCategory('');
      setTimeout(() => navigate('/author/dashboard'), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.createArticleContainer}>
      <h2 className={styles.title}>Создать статью</h2>
      <Breadcrumbs items={[
        { label: 'Панель автора', to: '/author/dashboard' },
        { label: 'Создать статью' }
      ]} />
      {error && <p className={styles.errorMessage}>{error}</p>}
      {success && <p className={styles.successMessage}>{success}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>Заголовок:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="category" className={styles.label}>Категория:</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>Содержание:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className={styles.textarea}
          />
        </div>
        {profile?.is_blocked && (
          <div className={styles.errorMessage} style={{marginBottom: 10}}>
            Ваш аккаунт заблокирован. Вы не можете создавать статьи.
          </div>
        )}
        <button type="submit" className={styles.submitButton} disabled={profile?.is_blocked || profileLoading}>Создать статью</button>
      </form>
      <button onClick={() => navigate(-1)} className={styles.backButton}>Назад</button>
    </div>
  );
}

export default CreateArticle; 

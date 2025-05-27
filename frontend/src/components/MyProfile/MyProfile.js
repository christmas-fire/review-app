import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyProfile.module.css';

const API_BASE_URL = 'http://localhost:8080';

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);

      if (!user || !user.token) {
        setError('Вы не авторизованы для просмотра профиля.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/users/my`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Ошибка при загрузке профиля');
        }

        const data = await response.json();
        if (data.user) {
          setProfile(data.user);
        } else {
          console.error("User data not found in response:", data);
          setError('Данные пользователя не найдены в ответе сервера.');
          setProfile(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.token]);

  if (isLoading) {
    return <p className={styles.loadingMessage}>Загрузка профиля...</p>;
  }

  if (error) {
    return <p className={styles.errorMessage}>{error}</p>;
  }

  if (!profile) {
    return <p className={styles.noProfileMessage}>Не удалось загрузить данные профиля.</p>;
  }

  return (
    <div className={styles.myProfileContainer}>
      <h2 className={styles.title}>Личный кабинет</h2>
      <div className={styles.profileDetails}>
        <p><span className={styles.detailLabel}>ID:</span> {profile.id}</p>
        <p><span className={styles.detailLabel}>Имя пользователя:</span> {profile.username}</p>
        <p><span className={styles.detailLabel}>Email:</span> {profile.email}</p>
        <p><span className={styles.detailLabel}>Роль:</span> {profile.role}</p>
        {/* Add more profile details as needed */}
      </div>
      <button onClick={() => navigate(-1)} className={styles.backButton}>Назад</button>
    </div>
  );
}

export default MyProfile; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from './UserProfile.module.css';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

const API_BASE_URL = 'http://localhost:8080'; 

function UserProfile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            setError('');
            try {
                const userString = localStorage.getItem('user');
                const userObject = userString ? JSON.parse(userString) : null;
                const token = userObject ? userObject.token : null;

                if (!token) {
                    setError('Необходима авторизация.');
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/api/v1/users/my`, { 
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const responseText = await response.text();

                if (!response.ok) {
                    let errorText = `Ошибка: ${response.status}`;
                    try {
                        const errorData = JSON.parse(responseText); 
                        errorText = errorData.error || errorData.message || errorText;
                    } catch (e) {
                        errorText = responseText || errorText;
                    }
                    throw new Error(errorText);
                }
                
                const data = JSON.parse(responseText);
                setUserData(data.user); 

            } catch (err) {
                console.error("Ошибка при загрузке профиля:", err);
                setError(err.message || 'Не удалось загрузить данные профиля.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (loading) {
        return <div className={styles.loadingMessage}>Загрузка данных профиля...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>Ошибка: {error}</div>;
    }

    if (!userData) {
        return <div className={styles.noDataMessage}>Данные профиля не найдены.</div>;
    }

    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className={styles.userProfileContainer}>
            <h1 className={styles.title}>Мой профиль</h1>
            <Breadcrumbs
                className={styles.breadcrumbs + ' ' + styles.breadcrumbsCenter}
                items={
                    user?.role === 'author' ? [
                      { label: 'Панель автора', to: '/author/dashboard' },
                      { label: 'Мой профиль' }
                    ] : user?.role === 'reviewer' ? [
                      { label: 'Панель ревьюера', to: '/reviewer/dashboard' },
                      { label: 'Мой профиль' }
                    ] : user?.role === 'admin' ? [
                      { label: 'Панель администратора', to: '/admin/dashboard' },
                      { label: 'Мой профиль' }
                    ] : [
                      { label: 'Мой профиль' }
                    ]
                }
            />
            <div className={styles.profileCard}>
                <div className={styles.profileInfoList}> {/* Main container for profile items */}
                    <div className={styles.profileField}>
                        <span className={styles.profileLabel}>ID пользователя:</span>
                        <span className={styles.profileValue}>{userData.id}</span>
                    </div>
                    <div className={styles.profileField}>
                        <span className={styles.profileLabel}>Имя пользователя:</span>
                        <span className={styles.profileValue}>{userData.username}</span>
                    </div>
                    <div className={styles.profileField}>
                        <span className={styles.profileLabel}>Email:</span>
                        <span className={styles.profileValue}>{userData.email}</span>
                    </div>
                    <div className={styles.profileField}>
                        <span className={styles.profileLabel}>Роль:</span>
                        <span className={styles.profileValue}>{userData.role}</span>
                    </div>
                    {typeof userData.is_blocked !== 'undefined' && (
                        <div className={styles.profileField}>
                            <span className={styles.profileLabel}>Статус:</span>
                            <span className={styles.profileValue}>{userData.is_blocked ? 'Заблокирован' : 'Активен'}</span>
                        </div>
                    )}
                   
                </div>
            </div>
            <button className={styles.backButton} onClick={() => navigate(-1)}>Назад</button>
        </div>
    );
}

export default UserProfile; 

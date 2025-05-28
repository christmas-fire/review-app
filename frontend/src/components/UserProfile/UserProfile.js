import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Optional: if you add an edit profile link later
import styles from './UserProfile.module.css';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

const API_BASE_URL = 'http://localhost:8080'; // Added API_BASE_URL

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

                const response = await fetch(`${API_BASE_URL}/api/v1/users/my`, { // Used API_BASE_URL
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                // First, get the response as text to inspect it
                const responseText = await response.text();
                // console.log("Raw response from /api/v1/users/my:", responseText); // Keep for debugging if needed

                if (!response.ok) {
                    let errorText = `Ошибка: ${response.status}`;
                    // Try to parse the responseText as JSON for error, if it was an error response
                    // This part might be less relevant now if responseText is already captured, 
                    // but good for structured backend errors.
                    try {
                        const errorData = JSON.parse(responseText); // Try parsing the already fetched text
                        errorText = errorData.error || errorData.message || errorText;
                    } catch (e) {
                        // If JSON parsing fails, use the responseText itself or the status based error
                        errorText = responseText || errorText;
                    }
                    throw new Error(errorText);
                }
                
                // Now, parse the responseText for successful response
                const data = JSON.parse(responseText);
                setUserData(data.user); // Correctly access the nested user object

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
            <Breadcrumbs items={
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
            } />
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
                    {/* Example for a boolean value, if needed later */}
                    {/* 
                    {typeof userData.is_blocked !== 'undefined' && (
                        <div className={styles.profileField}>
                            <span className={styles.profileLabel}>Статус блокировки:</span>
                            <span className={styles.profileValue}>{userData.is_blocked ? 'Заблокирован' : 'Активен'}</span>
                        </div>
                    )}
                    */}
                </div>
                {/* 
                Optional: Edit Profile Button/Link
                <div className={styles.buttonContainer}>
                    <Link to="/profile/edit" className={styles.editProfileButton}>
                        Редактировать профиль
                    </Link>
                </div>
                */}
            </div>
            <button className={styles.backButton} onClick={() => navigate(-1)}>Назад</button>
        </div>
    );
}

export default UserProfile; 
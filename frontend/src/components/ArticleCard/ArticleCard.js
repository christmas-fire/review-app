import React from 'react';
import styles from './ArticleCard.module.css';
import { Link } from 'react-router-dom'; // For navigation if action is a link

// Helper to format date (can be moved to a utils file if used elsewhere)
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (e) {
        return dateString; // Fallback
    }
};

function ArticleCard({
    article,
    actionButtonText,
    onActionButtonClick, // Expects a function, e.g., () => handleAction(article.id)
    actionButtonLinkTo,  // Optional: if the button is a direct link
    showAuthor = true,   // Default to true, can be set to false
    statusText = '',      // Optional: e.g., "Reviewed", "Pending"
    statusClassName = '' // Optional: e.g. styles.statusReviewed
}) {
    if (!article) {
        return null; // Or some placeholder/error
    }

    // Prefer snippet if available, otherwise take a slice of content
    const displayContent = article.snippet || 
                         (article.content ? `${article.content.substring(0, 150)}...` : 'Нет содержимого для отображения.');

    return (
        <div className={styles.articleCardItem}>
            <h3 className={styles.cardTitle}>{article.title || 'Без названия'}</h3>

            <div className={styles.metaInfoContainerTop}>
                {article.category && (
                    <span className={styles.categoryTag}>Категория: {article.category}</span>
                )}
                {showAuthor && article.author_name && (
                    <span className={styles.authorTag}>Автор: {article.author_name}</span>
                )}
                 {!showAuthor && article.author_username && (
                    <span className={styles.authorTag}>Автор: {article.author_username}</span>
                )}
            </div>

            <p className={styles.contentSnippet}>{displayContent}</p>
            
            <div className={styles.metaInfoContainerBottom}>
                {statusText && (
                    <p className={`${styles.statusText} ${statusClassName || ''}`.trim()}>Статус: {statusText}</p>
                )}
                {article.created_at && (
                    <span className={styles.dateText}>Создана: {formatDate(article.created_at)}</span>
                )}
                {/* Display updated_at if significantly different or relevant */}
                {/* {article.updated_at && formatDate(article.created_at) !== formatDate(article.updated_at) && (
                    <span className={styles.dateText}>Обновлена: {formatDate(article.updated_at)}</span>
                )} */}
            </div>

            {(actionButtonText && (onActionButtonClick || actionButtonLinkTo)) && (
                <div className={styles.actionButtonContainer}>
                    {actionButtonLinkTo ? (
                        <Link to={actionButtonLinkTo} className={styles.actionButton}>
                            {actionButtonText}
                        </Link>
                    ) : (
                        <button onClick={() => onActionButtonClick(article.id)} className={styles.actionButton}>
                            {actionButtonText}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default ArticleCard; 
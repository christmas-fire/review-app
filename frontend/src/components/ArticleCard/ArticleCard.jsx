import React from 'react';
import styles from './ArticleCard.module.css';
import { Link } from 'react-router-dom';

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (e) {
        return dateString; 
    }
};

function ArticleCard({
    article,
    actionButtonText,
    onActionButtonClick, 
    actionButtonLinkTo,  
    showAuthor = true,   
    statusText = '',      
    statusClassName = '' 
}) {
    if (!article) {
        return null; 
    }

    const displayContent = article.snippet || 
                         (article.content ? `${article.content.substring(0, 150)}` : 'Нет содержимого для отображения.');

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
                    <p className={styles.statusText}>
                        <span style={{ color: '#6c757d', fontWeight: 500 }}>Статус:</span> <span className={statusClassName}>{statusText}</span>
                    </p>
                )}
                {article.created_at && (
                    <span className={styles.dateText}>Создана: {formatDate(article.created_at)}</span>
                )}
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

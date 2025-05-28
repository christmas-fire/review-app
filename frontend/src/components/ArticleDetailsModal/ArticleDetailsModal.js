import React from 'react';
import styles from './ArticleDetailsModal.module.css';
import cardStyles from '../ArticleCard/ArticleCard.module.css';

function ArticleDetailsModal({ article, onClose, isLoading, error }) {
  if (!article && !isLoading && !error) {
    return null; // Or some placeholder if an article is expected but not yet loaded/failed
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        {isLoading && <p className={styles.loadingMessage}>Загрузка статьи...</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
        {article && (
          <div className={cardStyles.articleCardItem}>
            <h3 className={cardStyles.cardTitle}>{article.title}</h3>
            <div className={cardStyles.metaInfoContainerTop}>
              {article.category && (
                <span className={cardStyles.categoryTag}>Категория: {article.category}</span>
              )}
              {article.author_username && (
                <span className={cardStyles.authorTag}>Автор: {article.author_username}</span>
              )}
            </div>
            <div className={cardStyles.metaInfoContainerBottom}>
              {article.created_at && (
                <span className={cardStyles.dateText}>Создана: {new Date(article.created_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              )}
            </div>
            <div className={cardStyles.contentSnippet}>
              {article.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleDetailsModal; 
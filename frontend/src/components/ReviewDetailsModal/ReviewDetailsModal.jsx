import React from 'react';
import styles from './ReviewDetailsModal.module.css';

function ReviewDetailsModal({ review, onClose, isLoading, error }) {
  if (!review && !isLoading && !error) {
    return null; 
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        {isLoading && <p className={styles.loadingMessage}>Загрузка ревью...</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
        {review && (
          <>
            <h2 className={styles.reviewTitle}>Детали ревью</h2>
            <div className={styles.reviewDetailItem}>
              <span className={styles.detailLabel}>Статус:</span>
              <span className={`${styles.status} ${styles[review.status.toLowerCase()]}`}>
                {review.status === 'accepted' ? 'Принято' : review.status === 'rejected' ? 'Отклонено' : review.status}
              </span>
            </div>
            <div className={styles.reviewDetailItem}>
              <span className={styles.detailLabel}>Оценка:</span>
              <span className={styles.score}>{review.score}/10</span>
            </div>
            <div className={styles.reviewDetailItem}>
              <span className={styles.detailLabel}>Комментарий:</span>
              <p className={styles.reviewComment}>{review.content}</p>
            </div>
            <div className={styles.reviewDetailItem}>
              <span className={styles.detailLabel}>Дата ревью:</span>
              <span>{new Date(review.created_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ReviewDetailsModal; 

package repositories

import (
	"fmt"

	"github.com/christmas-fire/review-app/backend/internal/models"
	"github.com/jmoiron/sqlx"
)

type ReviewPostgres struct {
	db *sqlx.DB
}

func NewReviewPostgres(db *sqlx.DB) *ReviewPostgres {
	return &ReviewPostgres{db: db}
}

func (r *ReviewPostgres) CreateReview(review models.Review) (int, error) {
	tx, err := r.db.Begin()
	if err != nil {
		return 0, fmt.Errorf("failed to begin transaction: %w", err)
	}

	var id int
	reviewQuery := `
			INSERT INTO reviews (reviewer_id, article_id, content, score, status) 
			VALUES ($1, $2, $3, $4, $5) 
			RETURNING id`

	err = tx.QueryRow(reviewQuery,
		review.ReviewerID, review.ArticleID, review.Content, review.Score, review.Status,
	).Scan(&id)

	if err != nil {
		tx.Rollback()
		return 0, fmt.Errorf("failed to insert review: %w", err)
	}

	articleQuery := `
			UPDATE articles 
			SET review_id = $1, is_reviewed = true 
			WHERE id = $2`

	_, err = tx.Exec(articleQuery, id, review.ArticleID)
	if err != nil {
		tx.Rollback()
		return 0, fmt.Errorf("failed to update article: %w", err)
	}

	if err = tx.Commit(); err != nil {
		return 0, fmt.Errorf("failed to commit transaction: %w", err)
	}

	return id, nil
}

func (r *ReviewPostgres) GetReviewByID(id int) (models.Review, error) {
	var review models.Review
	query := `
		SELECT id, reviewer_id, article_id, content, score, status, created_at 
		FROM reviews 
		WHERE id = $1`
	err := r.db.Get(&review, query, id)

	return review, err
}

func (r *ReviewPostgres) MyReviews(id int) ([]models.Review, error) {
	var reviews []models.Review
	query := "SELECT id, reviewer_id, article_id, content, score, status, created_at FROM reviews WHERE reviewer_id=$1"
	err := r.db.Select(&reviews, query, id)

	return reviews, err
}

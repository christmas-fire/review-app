package models

import "time"

type Article struct {
	ID         int       `json:"id" db:"id"`
	AuthorID   int       `json:"author_id" db:"author_id"`
	ReviewID   int       `json:"review_id" db:"review_id"`
	Title      string    `json:"title" db:"title"`
	Category   string    `json:"category" db:"category"`
	Content    string    `json:"content" db:"content"`
	IsReviewed bool      `json:"is_reviewed" db:"is_reviewed"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}

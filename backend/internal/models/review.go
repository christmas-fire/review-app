package models

import "time"

type Review struct {
	ID         int       `json:"id" db:"id"`
	ReviewerID int       `json:"reviewer_id" db:"reviewer"`
	ArticleID  int       `json:"article_id" db:"article_id"`
	Content    string    `json:"content" db:"content"`
	Score      int       `json:"score" db:"score"`
	Status     string    `json:"status" db:"status"` // accepted | rejected
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}

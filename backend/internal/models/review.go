package models

import "time"

type Review struct {
	ID         int       `json:"id"`
	ReviewerID int       `json:"reviewer_id"`
	ArticleID  int       `json:"article_id"`
	Content    string    `json:"content"`
	Status     string    `json:"status"`
	CreatedAt  time.Time `json:"created_at"`
}

package models

import "time"

type Article struct {
	ID        int       `json:"id"`
	AuthorID  int       `json:"author_id"`
	ReviewID  int       `json:"review_id"`
	Title     string    `json:"title"`
	Category  string    `json:"category"`
	Status    string    `json:"status"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

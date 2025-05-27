package repositories

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/christmas-fire/review-app/backend/internal/models"
	"github.com/jmoiron/sqlx"
)

type ArticlesPostgres struct {
	db *sqlx.DB
}

func NewArticlesPostgres(db *sqlx.DB) *ArticlesPostgres {
	return &ArticlesPostgres{db: db}
}

func (r *ArticlesPostgres) CreateArticle(article models.Article) (int, error) {
	var id int

	query := "INSERT INTO articles (author_id, title, category, content) VALUES ($1, $2, $3, $4) RETURNING id"
	row := r.db.QueryRow(query, article.AuthorID, article.Title, article.Category, article.Content)
	if err := row.Scan(&id); err != nil {
		return 0, err
	}

	return id, nil
}

func (r *ArticlesPostgres) GetAllArticles() ([]models.Article, error) {
	var articles []models.Article
	query := "SELECT id, author_id, review_id, title, category, content, is_reviewed, created_at FROM articles"
	err := r.db.Select(&articles, query)

	return articles, err

}

func (r *ArticlesPostgres) DeleteArticle(id int) error {
	query := "DELETE FROM articles WHERE id=$1"
	_, err := r.db.Exec(query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return fmt.Errorf("article with id %d not found", id)
		}
		return err
	}

	return nil
}

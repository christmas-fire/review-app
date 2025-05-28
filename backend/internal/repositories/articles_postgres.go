package repositories

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/christmas-fire/review-app/backend/internal/models"
	"github.com/jmoiron/sqlx"
)

type ArticlePostgres struct {
	db *sqlx.DB
}

func NewArticlePostgres(db *sqlx.DB) *ArticlePostgres {
	return &ArticlePostgres{db: db}
}

func (r *ArticlePostgres) CreateArticle(article models.Article) (int, error) {
	var id int

	query := "INSERT INTO articles (author_id, title, category, content) VALUES ($1, $2, $3, $4) RETURNING id"
	row := r.db.QueryRow(query, article.AuthorID, article.Title, article.Category, article.Content)
	if err := row.Scan(&id); err != nil {
		return 0, err
	}

	return id, nil
}

func (r *ArticlePostgres) GetAllArticles() ([]models.Article, error) {
	var articles []models.Article
	query := "SELECT id, author_id, review_id, title, category, content, is_reviewed, created_at FROM articles"
	err := r.db.Select(&articles, query)

	return articles, err
}

func (r *ArticlePostgres) DeleteArticle(id int) error {
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

func (r *ArticlePostgres) MyArticles(id int) ([]models.Article, error) {
	var articles []models.Article
	query := "SELECT id, author_id, review_id, title, category, content, is_reviewed, created_at FROM articles WHERE author_id=$1"
	err := r.db.Select(&articles, query, id)

	return articles, err
}

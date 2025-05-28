package repositories

import (
	"github.com/christmas-fire/review-app/backend/internal/models"
	"github.com/jmoiron/sqlx"
)

type Auth interface {
	Register(user models.User) (int, error)
	Login(username, password string) (models.User, error)
}

type User interface {
	CreateUser(user models.User) (int, error)
	GetAllUsers() ([]models.User, error)
	DeleteUser(id int) error
	BlockUser(id int) error
	MyProfile(id int) (models.User, error)
}

type Article interface {
	CreateArticle(article models.Article) (int, error)
	GetAllArticles() ([]models.Article, error)
	DeleteArticle(id int) error
	MyArticles(id int) ([]models.Article, error)
}

type Review interface {
	CreateReview(review models.Review) (int, error)
}

type Repository struct {
	Auth
	User
	Article
	Review
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		Auth:    NewAuthPostgres(db),
		User:    NewUserPostgres(db),
		Article: NewArticlePostgres(db),
		Review:  NewReviewPostgres(db),
	}
}

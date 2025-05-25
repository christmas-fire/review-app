package repositories

import (
	"github.com/christmas-fire/review-app/internal/models"
	"github.com/jmoiron/sqlx"
)

type Auth interface {
	Register(user models.User) (int, error)
	Login(username, password string) (models.User, error)
}

type Repository struct {
	Auth
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		Auth: NewAuthPostgres(db),
	}
}

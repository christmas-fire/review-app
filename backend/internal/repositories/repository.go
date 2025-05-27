package repositories

import (
	"github.com/christmas-fire/review-app/backend/internal/models"
	"github.com/jmoiron/sqlx"
)

type Auth interface {
	Register(user models.User) (int, error)
	Login(username, password string) (models.User, error)
}

type Users interface {
	CreateUser(user models.User) (int, error)
	GetAllUsers() ([]models.User, error)
	DeleteUser(id int) error
	BlockUser(id int) error
}

type Repository struct {
	Auth
	Users
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		Auth:  NewAuthPostgres(db),
		Users: NewUsersPostgres(db),
	}
}

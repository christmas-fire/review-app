package repositories

import (
	"github.com/christmas-fire/review-app/backend/internal/models"
	"github.com/jmoiron/sqlx"
)

type AuthPostgres struct {
	db *sqlx.DB
}

func NewAuthPostgres(db *sqlx.DB) *AuthPostgres {
	return &AuthPostgres{db: db}
}

func (r *AuthPostgres) Register(user models.User) (int, error) {
	var id int

	query := "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id"
	row := r.db.QueryRow(query, user.Username, user.Email, user.Password, user.Role)
	if err := row.Scan(&id); err != nil {
		return 0, err
	}

	return id, nil
}

func (r *AuthPostgres) Login(username, password string) (models.User, error) {
	var user models.User
	query := "SELECT id, username, email, password, role, is_blocked FROM users WHERE username=$1"

	err := r.db.Get(&user, query, username)
	if err != nil {
		return user, err
	}

	return user, nil
}

package repositories

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/christmas-fire/review-app/backend/internal/models"
	"github.com/jmoiron/sqlx"
)

type UserPostgres struct {
	db *sqlx.DB
}

func NewUserPostgres(db *sqlx.DB) *UserPostgres {
	return &UserPostgres{db: db}
}

func (r *UserPostgres) CreateUser(user models.User) (int, error) {
	var id int

	query := "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id"
	row := r.db.QueryRow(query, user.Username, user.Email, user.Password, user.Role)
	if err := row.Scan(&id); err != nil {
		return 0, err
	}

	return id, nil
}

func (r *UserPostgres) GetAllUsers() ([]models.User, error) {
	var users []models.User

	query := "SELECT id, username, email, password, role, is_blocked FROM users"
	err := r.db.Select(&users, query)
	return users, err
}

func (r *UserPostgres) DeleteUser(id int) error {
	query := "DELETE FROM users WHERE id=$1"
	_, err := r.db.Exec(query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return fmt.Errorf("user with id %d not found", id)
		}
		return err
	}

	return nil
}

func (r *UserPostgres) BlockUser(id int) error {
	var isBlocked bool

	err := r.db.QueryRow("SELECT is_blocked FROM users WHERE id = $1", id).Scan(&isBlocked)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return fmt.Errorf("user with id %d not found", id)
		}
		return err
	}

	newStatus := !isBlocked
	_, err = r.db.Exec("UPDATE users SET is_blocked = $1 WHERE id = $2", newStatus, id)
	if err != nil {
		return err
	}

	return nil
}

func (r *UserPostgres) MyProfile(id int) (models.User, error) {
	var user models.User

	query := "SELECT id, username, email, password, role, is_blocked FROM users WHERE id=$1"
	err := r.db.Get(&user, query, id)
	return user, err
}

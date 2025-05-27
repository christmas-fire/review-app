package services

import (
	"fmt"
	"strings"

	"github.com/christmas-fire/review-app/backend/internal/models"
	"github.com/christmas-fire/review-app/backend/internal/repositories"
	"golang.org/x/crypto/bcrypt"
)

type Auth interface {
	Register(user models.User) (int, error)
	Login(username, password string) (string, error)
}

type Users interface {
	CreateUser(user models.User) (int, error)
	GetAllUsers() ([]models.User, error)
	DeleteUser(id int) error
	BlockUser(id int) error
}

type Service struct {
	Auth
	Users
}

func NewService(repo *repositories.Repository) *Service {
	return &Service{
		Auth:  NewAuthService(repo.Auth),
		Users: NewUsersService(repo.Users),
	}
}

func generatePasswordHash(password string) string {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		// In a real application, you'd want to handle this error more gracefully
		// For now, we'll panic, but logging and returning an error would be better.
		panic(err)
	}
	return string(hashedPassword)
}

func ComparePasswordAndHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func validateUser(u models.User) error {
	if len(u.Username) < 3 {
		return fmt.Errorf("username must have at least 3 characters")
	}

	if len(u.Password) < 6 {
		return fmt.Errorf("password must have at least 6 characters")
	}

	if !strings.Contains(u.Email, "@") {
		return fmt.Errorf("invalid email format")
	}

	if u.Role != "admin" && u.Role != "author" && u.Role != "reviewer" {
		return fmt.Errorf("invalid role: expect 'admin', 'author', 'reviewer'")
	}

	return nil
}

func validateRole(role string) error {
	if role != "author" && role != "reviewer" {
		return fmt.Errorf("admin create only 'author' or 'reviewer'")
	}

	return nil
}

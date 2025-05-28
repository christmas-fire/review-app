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

type Service struct {
	Auth
	User
	Article
	Review
}

func NewService(repo *repositories.Repository) *Service {
	return &Service{
		Auth:    NewAuthService(repo.Auth),
		User:    NewUserService(repo.User),
		Article: NewArticleService(repo.Article),
		Review:  NewReviewService(repo.Review),
	}
}

func generatePasswordHash(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("error hash password: %s", err.Error())
	}
	return string(hashedPassword), nil
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

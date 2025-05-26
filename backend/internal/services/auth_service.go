package services

import (
	"fmt"
	"time"

	"github.com/christmas-fire/review-app/backend/internal/models"
	"github.com/christmas-fire/review-app/backend/internal/repositories"
	"github.com/golang-jwt/jwt/v5"
	// bcrypt is used in service.go for ComparePasswordAndHash and generatePasswordHash
)

const (
	// salt is no longer needed here as bcrypt handles salt internally
	signingKey     = "sonyboy" // Keep this secure and ideally from config
	accessTokenTTL = 3 * time.Hour
)

type AuthService struct {
	repo repositories.Auth // Changed to use the Auth interface from repository
}

func NewAuthService(repo repositories.Auth) *AuthService { // Changed to accept Auth interface
	return &AuthService{repo: repo}
}

func (s *AuthService) Register(user models.User) (int, error) {
	if err := validateUser(user); err != nil {
		return 0, fmt.Errorf("validation failed: %w", err)
	}
	user.Password = generatePasswordHash(user.Password) // This now uses bcrypt from service.go
	return s.repo.Register(user)
}

func (s *AuthService) Login(username, password string) (string, error) {
	// 1. Получаем пользователя из базы по имени
	user, err := s.repo.Login(username, password) // repo.Login now only needs username, but signature expects password
	if err != nil {
		// This could be due to user not found or other DB error
		return "", fmt.Errorf("failed to get user: %w", err)
	}

	// 2. Проверяем пароль
	if !ComparePasswordAndHash(password, user.Password) { // ComparePasswordAndHash is in service.go
		return "", fmt.Errorf("invalid credentials")
	}

	// 3. Создаем токен с claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &jwt.RegisteredClaims{
		Issuer:    "review-app",
		Subject:   fmt.Sprintf("%d", user.Id),
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(accessTokenTTL)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
	})

	// 4. Подписываем токен секретным ключом
	signedToken, err := token.SignedString([]byte(signingKey))
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}

	// 5. Возвращаем готовый токен
	return signedToken, nil
}

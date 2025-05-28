package services

import (
	"fmt"
	"time"

	"github.com/christmas-fire/review-app/backend/internal/app"
	"github.com/christmas-fire/review-app/backend/internal/models"
	"github.com/christmas-fire/review-app/backend/internal/repositories"
	"github.com/golang-jwt/jwt/v5"
)

const (
	accessTokenTTL = 3 * time.Hour
)

type Claims struct {
	UserID string `json:"user_id"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

type AuthService struct {
	repo repositories.Auth
}

func NewAuthService(repo repositories.Auth) *AuthService {
	return &AuthService{repo: repo}
}

func (s *AuthService) Register(user models.User) (int, error) {
	if err := validateUser(user); err != nil {
		return 0, fmt.Errorf("validation failed: %w", err)
	}
	user.Password, _ = generatePasswordHash(user.Password)
	return s.repo.Register(user)
}

func (s *AuthService) Login(username, password string) (string, error) {
	user, err := s.repo.Login(username, password)
	if err != nil {
		return "", fmt.Errorf("failed to get user: %w", err)
	}

	if !ComparePasswordAndHash(password, user.Password) {
		return "", fmt.Errorf("invalid credentials")
	}

	signingKey := app.InitConfig().JwtKey

	claims := &Claims{
		UserID: fmt.Sprintf("%d", user.ID),
		Role:   user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "review-app",
			Subject:   fmt.Sprintf("%d", user.ID),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(accessTokenTTL)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err := token.SignedString([]byte(signingKey))
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}

	return signedToken, nil
}

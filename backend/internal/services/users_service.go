package services

import (
	"fmt"

	"github.com/christmas-fire/review-app/backend/internal/models"
	"github.com/christmas-fire/review-app/backend/internal/repositories"
)

type UserService struct {
	repo repositories.User
}

func NewUserService(repo repositories.User) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) CreateUser(user models.User) (int, error) {
	if err := validateUser(user); err != nil {
		return 0, fmt.Errorf("validation failed: %w", err)
	}

	if err := validateRole(user.Role); err != nil {
		return 0, fmt.Errorf("validation failed: %w", err)
	}
	user.Password, _ = generatePasswordHash(user.Password)

	return s.repo.CreateUser(user)
}

func (s *UserService) GetAllUsers() ([]models.User, error) {
	return s.repo.GetAllUsers()
}

func (s *UserService) DeleteUser(id int) error {
	return s.repo.DeleteUser(id)
}

func (s *UserService) BlockUser(id int) error {
	return s.repo.BlockUser(id)
}

func (s *UserService) MyProfile(id int) (models.User, error) {
	return s.repo.MyProfile(id)
}

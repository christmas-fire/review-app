package services

import (
	"fmt"

	"github.com/christmas-fire/review-app/backend/internal/models"
	"github.com/christmas-fire/review-app/backend/internal/repositories"
)

type UsersService struct {
	repo repositories.Users
}

func NewUsersService(repo repositories.Users) *UsersService {
	return &UsersService{repo: repo}
}

func (s *UsersService) CreateUser(user models.User) (int, error) {
	if err := validateUser(user); err != nil {
		return 0, fmt.Errorf("validation failed: %w", err)
	}

	if err := validateRole(user.Role); err != nil {
		return 0, fmt.Errorf("validation failed: %w", err)
	}
	user.Password = generatePasswordHash(user.Password)

	return s.repo.CreateUser(user)
}

func (s *UsersService) GetAllUsers() ([]models.User, error) {
	return s.repo.GetAllUsers()
}

func (s *UsersService) DeleteUser(id int) error {
	return s.repo.DeleteUser(id)
}

func (s *UsersService) BlockUser(id int) error {
	return s.repo.BlockUser(id)
}

func (s *UsersService) MyProfile(id int) (models.User, error) {
	return s.repo.MyProfile(id)
}

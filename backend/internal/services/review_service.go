package services

import (
	"github.com/christmas-fire/review-app/backend/internal/models"
	"github.com/christmas-fire/review-app/backend/internal/repositories"
)

type ReviewService struct {
	repo repositories.Review
}

func NewReviewService(repo repositories.Review) *ReviewService {
	return &ReviewService{repo: repo}
}

func (s *ReviewService) CreateReview(review models.Review) (int, error) {
	return s.repo.CreateReview(review)
}

func (s *ReviewService) GetReviewByID(id int) (models.Review, error) {
	return s.repo.GetReviewByID(id)
}

func (s *ReviewService) MyReviews(id int) ([]models.Review, error) {
	return s.repo.MyReviews(id)
}

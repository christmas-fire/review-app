package services

import (
	"github.com/christmas-fire/review-app/backend/internal/models"
	"github.com/christmas-fire/review-app/backend/internal/repositories"
)

type ArticlesService struct {
	repo repositories.Articles
}

func NewArticlesService(repo repositories.Articles) *ArticlesService {
	return &ArticlesService{repo: repo}
}

func (s *ArticlesService) CreateArticle(article models.Article) (int, error) {
	return s.repo.CreateArticle(article)
}

func (s *ArticlesService) GetAllArticles() ([]models.Article, error) {
	return s.repo.GetAllArticles()
}

func (s *ArticlesService) DeleteArticle(id int) error {
	return s.repo.DeleteArticle(id)
}

func (s *ArticlesService) MyArticles(id int) ([]models.Article, error) {
	return s.repo.MyArticles(id)
}

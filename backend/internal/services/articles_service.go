package services

import (
	"github.com/christmas-fire/review-app/backend/internal/models"
	"github.com/christmas-fire/review-app/backend/internal/repositories"
)

type ArticleService struct {
	repo repositories.Article
}

func NewArticleService(repo repositories.Article) *ArticleService {
	return &ArticleService{repo: repo}
}

func (s *ArticleService) CreateArticle(article models.Article) (int, error) {
	return s.repo.CreateArticle(article)
}

func (s *ArticleService) GetAllArticles() ([]models.Article, error) {
	return s.repo.GetAllArticles()
}

func (s *ArticleService) GetArticleByID(id int) (models.Article, error) {
	return s.repo.GetArticleByID(id)
}

func (s *ArticleService) DeleteArticle(id int) error {
	return s.repo.DeleteArticle(id)
}

func (s *ArticleService) MyArticles(id int) ([]models.Article, error) {
	return s.repo.MyArticles(id)
}

func (s *ArticleService) GetAvailableArticles() ([]models.Article, error) {
	return s.repo.GetAvailableArticles()
}

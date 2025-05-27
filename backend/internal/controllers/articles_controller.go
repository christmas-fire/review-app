package controllers

import (
	"net/http"

	"github.com/christmas-fire/review-app/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type ArticlesController struct {
	service *services.Service
}

func NewArticlesController(service *services.Service) *ArticlesController {
	return &ArticlesController{service: service}
}

func (h *ArticlesController) CreateArticle(c *gin.Context) {
	c.Status(http.StatusOK)

}

func (h *ArticlesController) GetAllArticles(c *gin.Context) {
	c.Status(http.StatusOK)

}

func (h *ArticlesController) DeleteArticle(c *gin.Context) {
	c.Status(http.StatusOK)
}

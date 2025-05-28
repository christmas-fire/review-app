package controllers

import (
	"net/http"
	"strconv"

	"github.com/christmas-fire/review-app/backend/internal/middleware"
	"github.com/christmas-fire/review-app/backend/internal/models"
	"github.com/christmas-fire/review-app/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type ArticleController struct {
	service services.Article
}

func NewArticleController(service *services.Service) *ArticleController {
	return &ArticleController{service: service}
}

func (h *ArticleController) CreateArticle(c *gin.Context) {
	authorIdStr, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var article models.Article
	if err := c.BindJSON(&article); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
		return
	}

	authorId, err := strconv.Atoi(authorIdStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id format"})
		return
	}
	article.AuthorID = authorId

	id, err := h.service.CreateArticle(article)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": id})
}

func (h *ArticleController) GetAllArticles(c *gin.Context) {
	_, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	articles, err := h.service.GetAllArticles()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"articles": articles})
}

func (h *ArticleController) DeleteArticle(c *gin.Context) {
	_, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	idStr := c.Param("id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id format"})
		return
	}

	if err := h.service.DeleteArticle(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	c.Status(http.StatusNoContent)

}

func (h *ArticleController) MyArticles(c *gin.Context) {
	idStr, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id format"})
		return
	}

	articles, err := h.service.MyArticles(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"articles": articles})
}

func (h *ArticleController) GetAvailableArticles(c *gin.Context) {
	_, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	articles, err := h.service.GetAvailableArticles()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"articles": articles})
}

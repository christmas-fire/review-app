package controllers

import (
	"github.com/christmas-fire/review-app/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type Auth interface {
	RegisterHandler(c *gin.Context)
	LoginHandler(c *gin.Context)
}

type User interface {
	CreateUser(c *gin.Context)
	GetAllUsers(c *gin.Context)
	DeleteUser(c *gin.Context)
	BlockUser(c *gin.Context)
	MyProfile(c *gin.Context)
}

type Article interface {
	CreateArticle(c *gin.Context)
	GetAllArticles(c *gin.Context)
	DeleteArticle(c *gin.Context)
	MyArticles(c *gin.Context)
	GetAvailableArticles(c *gin.Context)
}

type Review interface {
	CreateReview(c *gin.Context)
	MyReviews(c *gin.Context)
}

type Controller struct {
	Auth
	User
	Article
	Review
}

func NewController(services *services.Service) *Controller {
	return &Controller{
		Auth:    NewAuthController(services),
		User:    NewUserController(services),
		Article: NewArticleController(services),
		Review:  NewReviewController(services),
	}
}

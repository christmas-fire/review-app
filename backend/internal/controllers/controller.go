package controllers

import (
	"github.com/christmas-fire/review-app/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type Auth interface {
	RegisterHandler(c *gin.Context)
	LoginHandler(c *gin.Context)
}

type Users interface {
	CreateUser(c *gin.Context)
	// DeleteUser(c *gin.Context)
	// BlockUser(c *gin.Context)
}

type Controller struct {
	Auth
	Users
}

func NewController(services *services.Service) *Controller {
	return &Controller{
		Auth:  NewAuthController(services),
		Users: NewUsersController(services),
	}
}

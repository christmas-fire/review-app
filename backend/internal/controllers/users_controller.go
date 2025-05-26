package controllers

import (
	"net/http"

	"github.com/christmas-fire/review-app/backend/internal/middleware"
	"github.com/christmas-fire/review-app/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type UsersController struct {
	service *services.Service
}

func NewUsersController(service *services.Service) *UsersController {
	return &UsersController{service: service}
}

func (h *UsersController) CreateUser(c *gin.Context) {
	// var user models.User
	id, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	// if err := c.BindJSON(&user); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
	// 	return
	// }

	// id, err := h.service.Register(user)
	// if err != nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": err})
	// 	return
	// }

	c.JSON(http.StatusOK, gin.H{"message": id})
}

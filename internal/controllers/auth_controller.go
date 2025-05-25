package controllers

import (
	"net/http"

	"github.com/christmas-fire/review-app/internal/models"
	"github.com/christmas-fire/review-app/internal/services"
	"github.com/gin-gonic/gin"
)

type AuthController struct {
	service *services.Service
}

func NewAuthController(service *services.Service) *AuthController {
	return &AuthController{service: service}
}

func (h *AuthController) RegisterHandler(c *gin.Context) {
	var user models.User
	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
		return
	}

	id, err := h.service.Register(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusOK, gin.H{"id": id})
}

type loginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (h *AuthController) LoginHandler(c *gin.Context) {
	var req loginRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request format"})
		return
	}

	token, err := h.service.Login(req.Username, req.Password)
	if err != nil {
		// Differentiate between invalid credentials and other errors if desired
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

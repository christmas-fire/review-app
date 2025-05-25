package routes

import (
	"github.com/christmas-fire/review-app/internal/controllers"
	"github.com/gin-gonic/gin"
)

func InitRouter(h *controllers.AuthController) *gin.Engine {
	router := gin.Default()

	apiV1 := router.Group("/api/v1")
	{
		auth := apiV1.Group("/auth")
		{
			auth.POST("/register", h.RegisterHandler)
			auth.POST("/login", h.LoginHandler)
		}
	}

	return router
}

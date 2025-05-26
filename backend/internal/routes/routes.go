package routes

import (
	"github.com/christmas-fire/review-app/backend/internal/controllers"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func InitRouter(h *controllers.AuthController) *gin.Engine {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

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

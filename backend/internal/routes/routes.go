package routes

import (
	"github.com/christmas-fire/review-app/backend/internal/controllers"
	"github.com/christmas-fire/review-app/backend/internal/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func InitRouter(h *controllers.Controller) *gin.Engine {
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
			auth.POST("/register", h.Auth.RegisterHandler)
			auth.POST("/login", h.Auth.LoginHandler)
		}

		users := apiV1.Group("/users")
		users.Use(middleware.AuthMiddleware())
		{
			users.POST("/", middleware.RoleMiddleware("admin"), h.Users.CreateUser)
			users.GET("/", middleware.RoleMiddleware("admin"), h.Users.GetAllUsers)
			users.DELETE("/:id", middleware.RoleMiddleware("admin"), h.Users.DeleteUser)
			users.PATCH("/:id/block", middleware.RoleMiddleware("admin"), h.Users.BlockUser)
		}

		articles := apiV1.Group("/articles")
		articles.Use(middleware.AuthMiddleware())
		{
			articles.POST("/", middleware.RoleMiddleware("author"), h.Articles.CreateArticle)
			articles.GET("/", middleware.RoleMiddleware("admin"), h.Articles.GetAllArticles)
			articles.DELETE("/:id", middleware.RoleMiddleware("admin"), h.Articles.DeleteArticle)

		}

		// reviews := apiV1.Group("/reviews")
		// {

		// }
	}

	return router
}

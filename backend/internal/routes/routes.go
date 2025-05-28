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
			users.POST("/", middleware.RoleMiddleware("admin"), h.User.CreateUser)
			users.GET("/", middleware.RoleMiddleware("admin"), h.User.GetAllUsers)
			users.DELETE("/:id", middleware.RoleMiddleware("admin"), h.User.DeleteUser)
			users.PATCH("/:id/block", middleware.RoleMiddleware("admin"), h.User.BlockUser)
			users.GET("/my", middleware.RoleMiddleware("author", "reviewer"), h.User.MyProfile)
		}

		articles := apiV1.Group("/articles")
		articles.Use(middleware.AuthMiddleware())
		{
			articles.POST("/", middleware.RoleMiddleware("author"), h.Article.CreateArticle)
			articles.GET("/", middleware.RoleMiddleware("admin"), h.Article.GetAllArticles)
			articles.GET("/:id", middleware.RoleMiddleware("author", "reviewer"), h.Article.GetArticleByID)
			articles.DELETE("/:id", middleware.RoleMiddleware("admin"), h.Article.DeleteArticle)
			articles.GET("/my", middleware.RoleMiddleware("author"), h.Article.MyArticles)
			articles.GET("/available", middleware.RoleMiddleware("reviewer"), h.Article.GetAvailableArticles)

		}

		reviews := apiV1.Group("/reviews")
		reviews.Use(middleware.AuthMiddleware())
		{
			reviews.POST("/", middleware.RoleMiddleware("reviewer"), h.Review.CreateReview)
			reviews.GET("/:id", middleware.RoleMiddleware("author", "reviewer"), h.Review.GetReviewByID)
			reviews.GET("/my", middleware.RoleMiddleware("reviewer"), h.Review.MyReviews)
		}
	}

	return router
}

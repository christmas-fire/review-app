package main

import (
	"github.com/christmas-fire/review-app/backend/internal/app"
	"github.com/christmas-fire/review-app/backend/internal/controllers"
	"github.com/christmas-fire/review-app/backend/internal/repositories"
	"github.com/christmas-fire/review-app/backend/internal/routes"
	"github.com/christmas-fire/review-app/backend/internal/services"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/sirupsen/logrus"
)

func main() {
	cfg := app.InitConfig()

	db, err := sqlx.Connect("postgres", cfg.DBConn)
	if err != nil {
		logrus.Fatal(err)
	}

	repository := repositories.NewRepository(db)
	service := services.NewService(repository)
	controller := controllers.NewController(service)

	r := routes.InitRouter(controller)
	if err := r.Run(":" + cfg.Port); err != nil {
		logrus.Fatal(err)
	}
}

package app

import (
	"fmt"
	"log"
	"os"

	"github.com/christmas-fire/review-app/backend/internal/config"
	"github.com/joho/godotenv"
)

func InitConfig() *config.Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment")
	}

	return &config.Config{
		Port:   getEnv("PORT", "8080"),
		JwtKey: getEnv("JWT_KEY", "jwt_key"),
		DBURL:  getEnv("DATABASE_URL", ""),
		DBConn: getEnv("DATABASE_CONN", ""),
	}
}

// getEnv — безопасное получение переменной окружения с fallback
func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}

	if fallback != "" {
		return fallback
	}

	panic(fmt.Sprintf("Environment variable %s is required", key))
}

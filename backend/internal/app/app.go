package app

import (
	"fmt"
	"os"

	"github.com/christmas-fire/review-app/backend/internal/config"
	"github.com/joho/godotenv"
)

func InitConfig() *config.Config {
	godotenv.Load()

	return &config.Config{
		Port:   getEnv("PORT", "8080"),
		JwtKey: getEnv("JWT_KEY", "jwt_key"),
		DBConn: getEnv("DATABASE_CONN", ""),
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}

	if fallback != "" {
		return fallback
	}

	panic(fmt.Sprintf("Environment variable %s is required", key))
}

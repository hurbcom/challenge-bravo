package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func Load() {
	error := godotenv.Load()

	if error != nil {
		log.Fatal("Error loading .env file")
	}

	setDefaults()
}

func setDefaults() {
	if len(os.Getenv("BASE_CURRENCY")) == 0 {
		os.Setenv("BASE_CURRENCY", "USD")
	}

	if len(os.Getenv("HTTP_HOST")) == 0 {
		os.Setenv("HTTP_HOST", "localhost")
	}

	if len(os.Getenv("HTTP_PORT")) == 0 {
		os.Setenv("HTTP_PORT", "8080")
	}
}

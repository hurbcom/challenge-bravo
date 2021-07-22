package config

import (
	"log"

	"github.com/joho/godotenv"
)

func Load() {
	error := godotenv.Load()

	if error != nil {
		log.Fatal("Error loading .env file")
	}
}
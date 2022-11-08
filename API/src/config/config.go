package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

var ApiPort = 0

func Load() {

	var erro error

	if erro = godotenv.Load(); erro != nil {
		log.Fatal(erro)
	}

	ApiPort, erro = strconv.Atoi(os.Getenv("API_PORT"))

	if erro != nil {
		ApiPort = 9000
	}
}

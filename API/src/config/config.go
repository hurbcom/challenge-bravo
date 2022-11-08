package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

var ApiPort = 0

func Load() {

	var err error

	if err = godotenv.Load(); err != nil {
		log.Fatal(err)
	}

	ApiPort, err = strconv.Atoi(os.Getenv("API_PORT"))

	if err != nil {
		ApiPort = 9000
	}
}

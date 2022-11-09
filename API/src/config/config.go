package config

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

var DBPass, ApiPort, DBPort, DBAddr, UrlToExternalAPI = "", 0, "", "", ""

func Load() {

	var err error

	if err = godotenv.Load(); err != nil {
		log.Fatal(err)
	}

	ApiPort, err = strconv.Atoi(os.Getenv("API_PORT"))

	if err != nil {
		ApiPort = 9000
	}

	DBServer := os.Getenv("DB_SERVER")
	DBPass = os.Getenv("DB_PASS")
	DBPort = os.Getenv("DB_PORT")

	DBAddr := DBServer + ":" + DBPort

	fmt.Println("DBServer: ", DBServer)
	fmt.Println("DBPort: ", DBPort)
	fmt.Println("DBAddr: ", DBAddr)

	UrlToExternalAPI = os.Getenv("EXTERNAL_API")

}

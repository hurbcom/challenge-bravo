package api

import (
	"fmt"
	"strings"

	"github.com/hurbcom/challenge-bravo/config"
	"github.com/hurbcom/challenge-bravo/controller"
	"github.com/hurbcom/challenge-bravo/db"
	"github.com/hurbcom/challenge-bravo/log"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

//InitAPI starts the API server
func InitAPI() {
	e := echo.New()

	redis := db.Redis{
		Address: config.Config["DB_ADDRESS"],
		Port:    config.Config["DB_PORT"],
	}

	redis.Connect()
	handlers := Handler{
		DBController: controller.DBController{
			Database: &redis,
		},
	}

	DefaultCORSConfig := middleware.CORSConfig{
		AllowMethods: []string{echo.GET},
		AllowOrigins: strings.Split(config.Config["ALLOW_ORIGINS"], " "),
	}

	e.Use(middleware.CORSWithConfig(DefaultCORSConfig))

	e.GET("/healthcheck", handlers.Healthcheck)
	e.GET("/convert", handlers.Converter)

	e.HideBanner = true

	log.Info(fmt.Sprintf("Initiating API server on port: %s", config.Config["API_PORT"]), "api")
	address := fmt.Sprintf(":%s", config.Config["API_PORT"])
	log.Fatal(e.Start(address).Error(), "api")
}

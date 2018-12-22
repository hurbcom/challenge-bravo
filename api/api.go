package api

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/schonmann/challenge-bravo/api/controller"
	"github.com/schonmann/challenge-bravo/config"
	"github.com/schonmann/challenge-bravo/util"
)

/**
  Routing and serving logic.
*/

func ServeApi(cfg *config.AppConfig) {
	ech := echo.New()

	ech.Use(middleware.Recover())
	//ech.Use(middleware.Logger())
	ech.Use(middleware.CORS())
	ech.Use(middleware.CSRF())
	ech.Use(middleware.Secure())

	ech.GET("/currency/convert", controller.HandleCurrencyConversion)

	if err := ech.Start(util.FormatAddress(cfg.API.Host, cfg.API.Port)); err != nil {
		panic("Unable to start API! :(")
	}
}

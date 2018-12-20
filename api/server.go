package api

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"schonmann/challenge-bravo/config"
	"schonmann/challenge-bravo/util"
)

/**
  Routing and serving logic.
*/

func setupMiddlewares(ech *echo.Echo) {
	ech.Use(middleware.Recover())
	ech.Use(middleware.Logger())
	ech.Use(middleware.CORS())

	/* Protection against CSRF, XSS, content
	   type sniffing, clickjacking, insecure
	   connection and other code injection
	   attacks.                             */

	ech.Use(middleware.CSRF())
	ech.Use(middleware.Secure())
}

func setupRoutes(ech *echo.Echo) {
	ech.GET("/currency/convert", handleCurrencyConversion)
}

func ServeRoutes() {
	ech := echo.New()

	setupMiddlewares(ech)
	setupRoutes(ech)

	cfg := config.Get().API

	if err := ech.Start(util.FormatAddress(cfg.Host, cfg.Port)); err != nil {
		panic("Unable to start API! :(")
	}
}

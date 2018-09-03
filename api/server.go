package api

import (
	"fmt"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/yagotome/challenge-bravo/api/apicontroller"
	"github.com/yagotome/challenge-bravo/config"
	"github.com/yagotome/challenge-bravo/currency"
)

// Serve sets up server and starts listening port from config
func Serve(p *currency.Price, conf config.Config) {
	e := echo.New()

	// Middleware
	e.Use(middleware.Recover())
	e.Use(middleware.Logger())

	apicontroller.SetupRoutes(e, p)

	e.Logger.Fatal(e.Start(fmt.Sprintf(":%d", conf.API.Port)))
}

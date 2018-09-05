package masterworker

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/yagotome/challenge-bravo/config"
	"github.com/yagotome/challenge-bravo/currency"
)

var price *currency.Price

// Serve sets up master worker HTTP server and starts listening port from config
func Serve(p *currency.Price, conf config.Config) {
	price = p

	e := echo.New()

	// Middleware
	e.Use(middleware.Recover())
	e.Use(middleware.Logger())
	e.Use(middleware.CORS())

	e.GET("/prices", handlePrices)

	url := fmt.Sprintf(":%d", conf.MasterWorker.Port)
	e.Logger.Fatal(e.Start(url))
}

func handlePrices(c echo.Context) error {
	return c.JSONBlob(http.StatusOK, []byte(price.String()))
}

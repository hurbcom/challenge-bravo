package apicontroller

import (
	"github.com/labstack/echo"
	"github.com/yagotome/challenge-bravo/currency"
)

var price *currency.Price

// SetupRoutes defines all API routes associating with their handlers
func SetupRoutes(e *echo.Echo, p *currency.Price) {
	price = p

	e.GET("/convert", handleConvert)
}

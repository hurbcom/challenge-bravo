package main

import (
	"github.com/labstack/echo"

	handlers "challenge-bravo/src/handlers"
)

const port = "8000"

func main() {

	server := echo.New()

	server.GET("/", handlers.HandleExchange)

	server.Start(":" + port)

}

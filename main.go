package main

import (
	"github.com/labstack/echo"

	controller "challenge-bravo/src/controller"
)

const Port = "8000"

func main() {

	server := echo.New()

	server.GET("/exchange", controller.HandleExchange)

	//server.GET("/updade", controller.UpdateCurrencies)

	server.Start(":" + Port)

}

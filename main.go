package main

import (
	"log"
	"net/http"

	"github.com/labstack/echo"
)

const port = "8000"

func main() {

	server := echo.New()

	server.GET("/", func(context echo.Context) error {
		log.Println("Requisição recebida")

		return context.JSON(http.StatusOK, "OK!")
	})

	server.Start(":" + port)

}

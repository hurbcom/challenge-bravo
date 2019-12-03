package main

import (
	controller "challenge-bravo/src/controller"
	"challenge-bravo/src/model"
	"encoding/json"
	"io/ioutil"
	"log"

	"github.com/labstack/echo"
)

var config model.Config

func init() {
	//Lendo variavel de configuração para obter o port do servidor
	file, err := ioutil.ReadFile("config/config.json")
	if err != nil {
		log.Fatal(err)
	}
	json.Unmarshal(file, &config)
}

func main() {

	server := echo.New()

	//Endpoint para conversão de moeda ex.: http://localhost:8000/exchange?from=USD&to=BRL&amount=2
	server.GET("/exchange", controller.HandleExchange)

	//Endpoint para atualização de taxas ex.: http://localhost:8000/update  obs.: necessário pois API tem limite de crédito
	server.PUT("/update", controller.UpdateCurrencies)

	//Endpoint para atualização das moedas permitidas ex.: http://localhost:8000/add
	server.PUT("/add", controller.AddCurrency)

	server.Start(":" + config.PORT)

}

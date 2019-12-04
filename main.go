package main

import (
	controller "challenge-bravo/src/controller"
	cronroutines "challenge-bravo/src/controller/cronroutines"
	miscellaneous "challenge-bravo/src/miscellaneous"

	"challenge-bravo/src/model"
	"log"

	"github.com/labstack/echo"
	"github.com/robfig/cron"
)

var config model.Config

func init() {
	//Lendo variavel de configuração para obter o port do servidor
	miscellaneous.ReadConfig(&config)
	log.Print("Configurações carregadas com sucesso!")
}

func main() {

	//Adicionando função de cron para atualização automáticas das moedas
	cronJob := cron.New()

	//Cron acionado de 1 em 1 hora das 9 as 17 de segunda a sexta
	cronJob.AddFunc("50 9-17 * * MON-FRI", cronroutines.UpdateCurrencies)
	cronJob.Start()

	server := echo.New()

	//Endpoint para conversão de moeda ex.: http://localhost:8000/exchange?from=USD&to=BRL&amount=2
	server.GET("/exchange", controller.HandleExchange)

	//Endpoint para atualização de taxas ex.: http://localhost:8000/update  obs.: necessário pois API tem limite de crédito
	server.PUT("/update", controller.UpdateCurrencies)

	//Endpoint para atualização das moedas permitidas ex.: http://localhost:8000/add obs.: os dados são passados em formato de json '{ "currencies": "USD" }'
	server.PUT("/add", controller.AddCurrency)

	//Endpoint para listagem de moedas ex.: http://localhost:8000/suported-currencies obs.: aceita os parâmetros 'filter=unblocked' e 'filter=blocked'
	server.GET("/suported-currencies", controller.ListCurrencies)

	server.Start(":" + config.PORT)

}

package handlers

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

	models "challenge-bravo/src/models"

	"github.com/labstack/echo"
)

const exchangeAPI = "https://api.coinbase.com/v2/exchange-rates?currency="

//HandleExchange ...
func HandleExchange(context echo.Context) error {

	//Parseando os parametor da query string
	From := context.QueryParam("from")
	To := context.QueryParam("to")

	//Convertendo o valor do parâmetro 'amout' para float64
	Amount, err := strconv.ParseFloat(context.QueryParam("amount"), 64)

	//Fazendo chamada na Api externa
	resp, err := http.Get(exchangeAPI + From)
	if err != nil {
		log.Println(err)
		return context.JSON(http.StatusBadRequest, err)
	}

	//Lendo o corpo da resposta
	respBinary, err := ioutil.ReadAll(resp.Body)
	defer resp.Body.Close()
	if err != nil {
		return context.JSON(http.StatusInternalServerError, err)
	}

	//Parseando o corpo da resposta com a estrutura desejada
	var response models.CurrencyResponse
	err = json.Unmarshal(respBinary, &response)

	//Utilizando a taxa para fazer a conversão do montante solicitado
	value, err := strconv.ParseFloat(response.Data.Rates[To], 64)
	log.Print(value)
	value = value * Amount

	return context.JSON(http.StatusOK, map[string]float64{"value": value})
}

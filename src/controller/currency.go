package controller

import (
	"challenge-bravo/src/model"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/labstack/echo"
)

const (
	APIKey = "3bbbaeaf31344ed295d36f8b5cee124a"
	APIUrl = "https://openexchangerates.org/api/latest.json"
)

//HandleExchange ... Função responsável por fazer a conversão do montante desejado
func HandleExchange(context echo.Context) error {

	//Variável para controlar taxas de câmbio
	var currencies model.CurrencyResponse

	//Variável de resposta da API
	var response model.ConvertionResponse

	//Variável para controlas moedas suportadas pela API
	var coins model.SuportedCoins

	//Parseando os parametor da query string
	From := context.QueryParam("from")
	To := context.QueryParam("to")

	//Convertendo o valor do parâmetro 'amout' para float64
	Amount, err := strconv.ParseFloat(context.QueryParam("amount"), 64)
	if err != nil {
		log.Println("Erro: ", err)
		return context.JSON(http.StatusInternalServerError, map[string]string{"error": "montante invalido"})
	}

	//Lendo o arquivo com as moedas suportadas
	file, err := ioutil.ReadFile("suportedCurrencies.json")
	if err != nil {
		log.Println("Erro ao ler o arquivo 'suportedCurrencies.json': ", err)
		return context.JSON(http.StatusInternalServerError, map[string]string{"error": "erro na leitura de arquivos"})
	}
	json.Unmarshal(file, &coins)

	//Verificando se as moedas informadas são suportadas
	if !coins.Suported[From] || !coins.Suported[To] {
		return context.JSON(http.StatusBadRequest, map[string]string{"error": "moeda não suportada"})
	}

	//Lendo o arquivo com as taxas de câmbio 'currencies.json'
	file, err = ioutil.ReadFile("currencies.json")
	if err != nil {
		log.Println("Erro ao ler o arquivo 'currencies.json': ", err)
		return context.JSON(http.StatusInternalServerError, map[string]string{"error": "erro na leitura de arquivos"})
	}
	json.Unmarshal(file, &currencies)

	//Populando variavel de retorno
	response.LastUpdate = time.Unix(int64(currencies.Timestamp), 0)
	response.From = From
	response.To = To
	response.Amount = Amount
	response.Value = currencies.Rates[To] * Amount / currencies.Rates[From]

	return context.JSON(http.StatusOK, response)
}

//UpdateCurrencies ... Função responsável por fazer a atualização das taxas de câmbio
func UpdateCurrencies() {

	//Fazendo chamada na Api externa
	resp, err := http.Get(APIUrl + "?app_id=" + APIKey + "&show_alternative=true")
	if err != nil {
		log.Println("Erro: ", err)
		return
	}

	//Lendo o corpo da resposta
	respBinary, err := ioutil.ReadAll(resp.Body)
	defer resp.Body.Close()
	if err != nil {
		log.Println("Erro: ", err)
		return
	}

	//Parseando o corpo da resposta com a estrutura desejada
	var response model.CurrencyResponse
	json.Unmarshal(respBinary, &response)

	//Verificando se a resposta retornou válida
	if response.Rates == nil {
		log.Println("Erro: ", string(respBinary))
		return
	}

	//Atualizando o arquivo 'currencies.json'
	responseString, _ := json.Marshal(response)
	ioutil.WriteFile("currencies.json", responseString, os.ModePerm)
}

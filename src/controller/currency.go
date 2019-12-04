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

var config model.Config

func init() {
	//Lendo variavel de configuração para obter valor da chave de acesso e do endpoint da API
	file, err := ioutil.ReadFile("config/config.json")
	if err != nil {
		log.Fatal(err)
	}
	json.Unmarshal(file, &config)
}

//HandleExchange ... Função responsável por fazer a conversão do montante desejado
func HandleExchange(context echo.Context) error {

	//Variável de resposta da API
	var response model.DefaultResponse

	//Variável para controlar taxas de câmbio
	var currencies model.CurrencyResponse

	//Variável de resposta da API
	var data model.ConvertionResponse

	//Variável para controlas moedas suportadas pela API
	var coins model.SuportedCoins

	//Parseando os parametor da query string
	From := context.QueryParam("from")
	To := context.QueryParam("to")

	//Convertendo o valor do parâmetro 'amout' para float64
	Amount, err := strconv.ParseFloat(context.QueryParam("amount"), 64)
	if err != nil {
		log.Println("Erro: ", err)
		response.Error = "montante inválido"
		return context.JSON(http.StatusBadRequest, response)
	}

	//Lendo o arquivo com as moedas suportadas
	file, err := ioutil.ReadFile("suportedCurrencies.json")
	if err != nil {
		response.Error = "falha ao carregar moedas"
		return context.JSON(http.StatusInternalServerError, response)
	}
	json.Unmarshal(file, &coins)

	//Verificando se as moedas informadas são suportadas
	if !coins.Suported[From] || !coins.Suported[To] {
		response.Error = "conversão " + From + "-" + To + " não suportada"
		return context.JSON(http.StatusBadRequest, response)
	}

	//Lendo o arquivo com as taxas de câmbio 'currencies.json'
	file, err = ioutil.ReadFile("currencies.json")
	if err != nil {
		log.Println("Erro ao ler o arquivo 'currencies.json': ", err)
		response.Error = "falha ao carregar moedas"
		return context.JSON(http.StatusInternalServerError, response)
	}
	json.Unmarshal(file, &currencies)

	//Populando variavel de retorno
	data.LastUpdate = time.Unix(int64(currencies.Timestamp), 0)
	data.From = From
	data.To = To
	data.Amount = Amount
	data.Value = currencies.Rates[To] * Amount / currencies.Rates[From]

	//Populando variável de retorno da API
	response.Success = true
	response.Data = data

	return context.JSON(http.StatusOK, response)
}

//UpdateCurrencies ... Função responsável por fazer a atualização das taxas de câmbio
func UpdateCurrencies(context echo.Context) error {

	//Fazendo chamada na Api externa
	resp, err := http.Get(config.APIUrl + "?app_id=" + config.APIKey + "&show_alternative=true")
	if err != nil {
		log.Println("Erro ao realizar requisição externa: ", err)
		return context.JSON(http.StatusBadRequest, map[string]string{"error": "erro ao realizar requisição externa"})
	}

	//Lendo o corpo da resposta
	respBinary, err := ioutil.ReadAll(resp.Body)
	defer resp.Body.Close()
	if err != nil {
		log.Println("Erro ao ler o body de resposta: ", err)
		return context.JSON(http.StatusInternalServerError, map[string]string{"error": "erro ao ler o body de resposta"})
	}

	//Parseando o corpo da resposta com a estrutura desejada
	var response model.CurrencyResponse
	json.Unmarshal(respBinary, &response)

	//Verificando se a resposta retornou válida
	if response.Rates == nil {
		log.Println("Erro: ", string(respBinary))
		return context.JSON(http.StatusBadRequest, map[string]string{"error": "resposta inválida"})
	}

	//Atualizando o arquivo 'currencies.json'
	responseString, _ := json.MarshalIndent(response, "", "  ")
	err = ioutil.WriteFile("currencies.json", responseString, os.ModePerm)
	if err != nil {
		log.Println("Erro ao salvar o arquivo 'currencies.json': ", err)
		return context.JSON(http.StatusInternalServerError, map[string]string{"error": "erro ao salvar o arquivo no servidor"})
	}

	return context.JSON(http.StatusOK, map[string]bool{"sucesso": true})
}

//AddCurrency ... função responsável por adicionar uma nova moeda a lista de moedas permitidas
func AddCurrency(context echo.Context) error {

	var response model.DefaultResponse
	var data struct {
		Currency string `json:"currency"`
	}

	//Variável para controlas moedas suportadas pela API
	var coins model.SuportedCoins

	//Fazendo o parsing do json de requisição com a variável de data
	err := context.Bind(&data)
	if err != nil {
		log.Println("Erro ao fazer o parsing dos dados: ", err)
		response.Error = "erro ao fazer o parsing dos dados"
		return context.JSON(http.StatusInternalServerError, response)
	}

	//Lendo o arquivo com as moedas suportadas
	file, err := ioutil.ReadFile("suportedCurrencies.json")
	if err != nil {
		log.Println("Erro ao ler o arquivo 'suportedCurrencies.json': ", err)
		response.Error = "falha ao carregar moedas"
		return context.JSON(http.StatusInternalServerError, response)
	}
	json.Unmarshal(file, &coins)

	//Verificando se moeda adicionada é suportada pela API
	if _, exist := coins.Suported[data.Currency]; !exist {
		response.Error = "moeda não suportada pela api"
		return context.JSON(http.StatusBadRequest, response)
	}

	//Adicionando moeda a lista de suportadas
	coins.Suported[data.Currency] = true

	//Salvando no arquivo json
	suportedString, _ := json.MarshalIndent(coins, "", "  ")
	err = ioutil.WriteFile("suportedCurrencies.json", suportedString, os.ModePerm)
	if err != nil {
		log.Println("Erro ao salvar o arquivo 'suportedCurrencies.json': ", err)
		response.Error = "erro ao adicionar moeda"
		return context.JSON(http.StatusInternalServerError, response)
	}

	//Populando variável de resposta
	response.Success = true
	response.Data = "Moeda adicionada com sucesso!"

	return context.JSON(http.StatusOK, response)
}

//ListCurrencies ... função resposável por listar as moedas suportadas pela API
func ListCurrencies(c echo.Context) error {

	//Parâmetro de filtro da lista de moedas
	filter := c.QueryParam("filter")

	var coins model.SuportedCoins
	var response model.DefaultResponse
	var data struct {
		Total      int      `json:"total"`
		Currencies []string `json:"currencies"`
	}

	//Lendo o arquivo de moedas suportadas
	file, err := ioutil.ReadFile("suportedCurrencies.json")
	if err != nil {
		log.Println("Erro ao ler o arquivo 'suportedCurrencies.json': ", err)
		response.Error = "falha ao carregar moedas"
		return c.JSON(http.StatusInternalServerError, response)
	}
	json.Unmarshal(file, &coins)

	switch filter {
	//Obtendo moedas que estão desbloquadas para conversão
	case "unblocked":
		for key, value := range coins.Suported {
			if value {
				data.Currencies = append(data.Currencies, key)
			}
		}
		break

	//Obtendo moedas que estão bloquadas para conversão
	case "blocked":
		for key, value := range coins.Suported {
			if !value {
				data.Currencies = append(data.Currencies, key)
			}
		}
		break

	//Listagem completa das moedas suportadas pela API
	default:
		for key := range coins.Suported {
			data.Currencies = append(data.Currencies, key)
		}
		break
	}

	data.Total = len(data.Currencies)

	//Populando variável de resposta
	response.Success = true
	response.Data = data

	return c.JSON(http.StatusOK, response)
}

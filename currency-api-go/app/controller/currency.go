// Controlador responsável pelas regras da aplicação
package controller

import (
	"encoding/json"

	"net/url"
	"net/http"
	"strconv"
	"strings"
	"fmt"
	"math"

	"github.com/EltonARodrigues/currency-api-go/app/config/redis"
	"github.com/EltonARodrigues/currency-api-go/app/helpper"
	"github.com/EltonARodrigues/currency-api-go/app/model"

	"github.com/gorilla/mux"
)

type CurrencyConvertion struct {
	From             string  `json:"from"`
	To               string  `json:"to"`
	Amount           float64 `json:"amount"`
	Amount_converted float64 `json:"amount_converted"`
}

var database = model.InitializeDB()

/*
	Função responsável por pegar a query, buscar os códigos das
	moedas, buscar no banco e realizar a conversão. O Redis é utilizado
	para gerar o cache das pesquisas já realizadas em um periodo x de tempo.

	Método: GET
	Resource = /convert/?from=BRL&to=USD&amount=120.55

	Response:
	{
		"from":"BRL",
		"to":"USD","
		amount":120.55,"
		amount_converted":28.997794197781115
	}

*/
 func GetConvertion(w http.ResponseWriter, r *http.Request) {
	var convertionJson CurrencyConvertion
	var keys = [2]string{"from", "to"}
	var valueByUSD [2]float64

	urlParams := r.URL.Query()

	if verifyParameters(urlParams) {
		convertionJson.From = urlParams["from"][0]
		convertionJson.To = urlParams["to"][0]
		convertionJson.Amount = convertStringtoFloat(urlParams["amount"][0])

		// Define o nome da chave no redis com base nos valores pesquisados.
		redis_name := fmt.Sprintf("%s_to_%s_%s",
			convertionJson.From,
			convertionJson.To,
			convertionJson.Amount)

		// Retorna os valores do redis caso existam.
		reply, err := redis.Get(redis_name)

		// Usa o banco de dados para coletar informação, calcula
		// e retorna para o usuario e salva no redis.
		if err != nil {
			for i, e := range keys {
				var currency model.Currency
				search := urlParams[e][0]

				database.Where("Code = ?", search).First(&currency)

				if currency.Code == "" {
					RespondError(w, http.StatusBadRequest, "Currency not found!")
					return
				}
				valueByUSD[i] = currency.Usd_value
			}

			if convertionJson.Amount == 0 {
				RespondError(w, http.StatusBadRequest, "Invalid amount!")
				return
			}
			convertionJson.Amount_converted = convertAmount(valueByUSD[0], valueByUSD[1], convertionJson.Amount)
			m, _ := json.Marshal(convertionJson)
			redis.Set(redis_name, []byte(m))

			RespondJSON(w, http.StatusOK, convertionJson)
			return
		}

		// Importa direto do redis sem passar pelo banco.
		json.Unmarshal(reply, &convertionJson)
		RespondJSON(w, http.StatusOK, convertionJson)
		return
	}
	RespondError(w, http.StatusBadRequest, "Invalid search format!")
}

/* 	Formata e valida os dados enviados.
	Caso o valor da moeda seja 0 ele tenta pegar com base na API externa.

	Método: POST
	Resource: /currencys

	Body:
	{
  		"Code": "BRL",
  		"usd_value": 5.256
	}
	Response:
	{
		"Code": "BRL",
		"Usd_value": 5.235
	}
 */
func CreateCurrency(w http.ResponseWriter, r *http.Request) {
	var currency model.Currency
	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&currency); err != nil {
		RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	defer r.Body.Close()

	value , err :=validateCurrencyCode(currency.Code);
	if !err {
		RespondError(w, http.StatusInternalServerError, value)
		return
	}

	// Quando o valor é zero ele tenta buscar pela api
	// externa, caso não ache retorna erro.
	if currency.Usd_value == 0 {
		response := helpper.ExternalAPIGetOne(currency.Code)

		if response != nil {
			ratesList := response.Rates.(map[string]interface{})
			for _, value := range ratesList {
				currency.Usd_value = convertStringtoFloat(fmt.Sprint(value))
			}
		} else {
			RespondError(w, http.StatusForbidden, "Zero is an invalid value!")
			return
		}
	}

	currency.Code = strings.ToUpper(currency.Code)

	// Salva no banco
	if err := database.Save(&currency).Error; err != nil {
		RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	RespondJSON(w, http.StatusCreated, currency)
}

/* 	Importa moedas e valores de um API externa e caso todos os
	valores já estejam importados retorna 304 Not Modified, caso
	contrario os valores faltando são importados mas nada é duplicado.

	Método: GET
	Resource: /import_all/
*/
func ImportAll(w http.ResponseWriter, r *http.Request) {
	flag := false
	response := helpper.ExternalAPIGetAll()
	ratesList := response.Rates.(map[string]interface{})

	for key, value := range ratesList {
		var currency model.Currency
		currency.Code = key
		currency.Usd_value = convertStringtoFloat(fmt.Sprint(value))
		if err := database.Save(&currency).Error; err == nil {
			flag = true
		}
	}
	if flag {
		RespondJSON(w, http.StatusCreated, nil)
		return
	}
	RespondError(w, http.StatusNotModified, "V")
}

/*
	Busca todas as moedas cadastradas.
	Método: GET
	Resource: /currencys

	Body:
	[{
  		"Code": "BRL",
  		"usd_value": 5.256
	},
	{
		"Code": "EUR",
		"usd_value": 0.25
	}]
*/
func GetAllCurrencys(w http.ResponseWriter, r *http.Request) {
	var currencys []model.Currency
	database.Find(&currencys)
	RespondJSON(w, http.StatusOK, currencys)
}

// Busca uma moeda com base no seu código ex: */currencys/BRL
func GetOneCurrency(w http.ResponseWriter, r *http.Request) {
	currency := getCurrencyByCode(w, r)
	if currency == nil {
		return
	}
	RespondJSON(w, http.StatusOK, currency)
}

// Atualiza uma moeda com base no código ex: */currencys/BRL
func UpdateCurrency(w http.ResponseWriter, r *http.Request) {
	currency := getCurrencyByCode(w, r)
	if currency == nil {
		return
	}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&currency); err != nil {
		RespondError(w, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()

	if err := database.Save(&currency).Error; err != nil {
		RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	RespondJSON(w, http.StatusOK, currency)
}

// Usa o metódo delete ex: */currencys/BRL
func DeleteCurrency(w http.ResponseWriter, r *http.Request) {
	currency := getCurrencyByCode(w, r)

	if currency != nil {
		if err := database.Unscoped().Delete(&currency).Error; err != nil {
			RespondError(w, http.StatusInternalServerError, err.Error())
		}
		return
	}
	RespondJSON(w, http.StatusNoContent, nil)
}

// Inicio dos metodos privados

// Pega a instancia com base no Código da moeda ou retorna um erro
func getCurrencyOr404(code string, w http.ResponseWriter, r *http.Request) *model.Currency {
	var currency model.Currency
	if err := database.First(&currency, model.Currency{Code: code}).Error; err != nil {
		RespondError(w, http.StatusNotFound, err.Error())
		return nil
	}
	return &currency
}

func validateCurrencyCode(code string) (value string, err bool) {
	if len(code) == 3 {
		return code, true
	}
	return "Currency must be 3 characters!", false
}
func getCurrencyByCode(w http.ResponseWriter, r *http.Request) *model.Currency {
	vars := mux.Vars(r)
	currency_code := vars["currency_code"]
	return getCurrencyOr404(currency_code, w, r)
}

func verifyParameters(params url.Values) bool {
	if len(params) == 0 {
		return false
	}

	for key := range params {
		if !(key == "from" || key == "to" || key == "amount") {
			return false
		}
	}
	return true
}

func convertStringtoFloat(amount string) float64 {
	floatAmount, err := strconv.ParseFloat(amount, 64)
	if err != nil {
		return 0
	}
	if floatAmount == 0 {
		return 0
	}
	return floatAmount

}

//	Calculo da conversão de moeda
func convertAmount(from_value float64, to_value float64, amount float64) float64 {
	result := (from_value / to_value) * amount
	result = math.Round(result*100)/100
	return result
}
